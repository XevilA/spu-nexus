import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { userId, type = 'job_recommendations' } = await req.json();

    if (!userId) {
      throw new Error('User ID is required');
    }

    // Get user profile and portfolio
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    const { data: portfolio } = await supabase
      .from('portfolios')
      .select('*')
      .eq('student_uid', userId)
      .eq('status', 'APPROVED')
      .single();

    // Get available jobs
    const { data: jobs } = await supabase
      .from('jobs')
      .select(`
        *,
        companies:company_id (*)
      `)
      .eq('status', 'OPEN')
      .limit(20);

    let prompt = '';
    let systemPrompt = 'คุณคือ SPU Smart AI ระบบปัญญาประดิษฐ์ของมหาวิทยาลัยศรีปทุม ที่ช่วยแนะนำงานที่เหมาะสมให้กับนักศึกษา';

    if (type === 'job_recommendations') {
      prompt = `
ข้อมูลนักศึกษา:
- ชื่อ: ${profile?.first_name || ''} ${profile?.last_name || ''}
- คณะ: ${profile?.faculty || 'ไม่ระบุ'}
- สาขา: ${profile?.program || 'ไม่ระบุ'}
- ชั้นปี: ${profile?.year || 'ไม่ระบุ'}

ข้อมูล Portfolio:
${portfolio ? `
- ทักษะ: ${JSON.stringify(portfolio.skills || [])}
- โปรเจค: ${JSON.stringify(portfolio.projects || [])}
- ภาษาที่ใช้ได้: ${JSON.stringify(portfolio.languages || [])}
- ความพร้อมในการทำงาน: ${portfolio.availability || 'ไม่ระบุ'}
- อัตราค่าจ้างที่คาดหวัง: ${portfolio.expected_rate || 'ไม่ระบุ'}
` : 'ยังไม่มี Portfolio ที่อนุมัติ'}

งานที่มีอยู่:
${jobs?.map(job => `
- ${job.title} (${job.companies?.name})
  ประเภท: ${job.job_type}
  สถานที่: ${job.location}
  เงินเดือน/ค่าจ้าง: ${job.budget_or_salary}
  รายละเอียด: ${job.description.substring(0, 200)}...
`).join('\n') || 'ไม่มีงานที่เปิดรับในขณะนี้'}

กรุณาวิเคราะห์และแนะนำงานที่เหมาะสมที่สุด 3-5 อันดับแรก พร้อมเหตุผลที่แนะนำ และคำแนะนำในการเตรียมตัวสมัครงาน ตอบเป็นภาษาไทยในลักษณะเป็นกันเองและเข้าใจง่าย
`;
    } else if (type === 'portfolio_improvement') {
      prompt = `
ข้อมูล Portfolio ปัจจุบัน:
${portfolio ? `
- ทักษะ: ${JSON.stringify(portfolio.skills || [])}
- โปรเจค: ${JSON.stringify(portfolio.projects || [])}
- การศึกษา: ${JSON.stringify(portfolio.education || [])}
- ใบรับรอง: ${JSON.stringify(portfolio.certificates || [])}
- ตัวอย่างผลงาน: ${JSON.stringify(portfolio.work_samples || [])}
` : 'ยังไม่มี Portfolio'}

กรุณาให้คำแนะนำในการปรับปรุง Portfolio เพื่อให้มีโอกาสได้งานมากขึ้น รวมถึงทักษะที่ควรเพิ่มเติม โปรเจคที่ควรทำ และการนำเสนอตัวเองที่ดีขึ้น ตอบเป็นภาษาไทย
`;
    }

    // Call Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${systemPrompt}\n\n${prompt}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', errorData);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'ขออภัย ไม่สามารถสร้างคำแนะนำได้ในขณะนี้';

    // Log AI usage (optional)
    await supabase
      .from('ai_usage_logs')
      .insert([
        {
          user_id: userId,
          request_type: type,
          response_length: aiResponse.length,
          created_at: new Date().toISOString()
        }
      ])
      .catch(() => {}); // Ignore logging errors

    return new Response(JSON.stringify({ 
      success: true,
      response: aiResponse,
      type: type,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in SPU Smart AI:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message,
      response: 'ขออภัย เกิดข้อผิดพลาดในระบบ กรุณาลองใหม่อีกครั้ง'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});