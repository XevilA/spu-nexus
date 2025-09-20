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

    const { userId, user_id, type = 'job_recommendations', question } = await req.json();
    const actualUserId = userId || user_id;

    if (!actualUserId) {
      throw new Error('User ID is required');
    }

    // Handle general questions
    if (type === 'general_question') {
      if (!question) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'question is required for general questions' 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const prompt = `คุณคือ SPU Smart AI Assistant ที่เชี่ยวชาญด้านการแนะนำเรื่องการหางาน การสร้าง portfolio และการพัฒนาทักษะสำหรับนักศึกษา Saint Peter University

คำถาม: ${question}

โปรดตอบคำถามอย่างเป็นมิตรและให้ข้อมูลที่เป็นประโยชน์ เฉพาะเจาะจงและสามารถนำไปปฏิบัติได้จริง ในรูปแบบที่เข้าใจง่าย:`;

      console.log('Generated prompt for general question:', prompt);

      // Call Gemini API for general questions
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
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });

      if (!response.ok) {
        console.error('Gemini API error:', await response.text());
        throw new Error('Failed to get response from Gemini API');
      }

      const geminiData = await response.json();
      console.log('Gemini response:', geminiData);

      if (!geminiData.candidates || !geminiData.candidates[0] || !geminiData.candidates[0].content) {
        throw new Error('Invalid response format from Gemini API');
      }

      const aiAdvice = geminiData.candidates[0].content.parts[0].text;

      // Log the usage
      try {
        await supabase
          .from('ai_usage_logs')
          .insert({
            user_id: actualUserId,
            request_type: 'general_question',
            response_length: aiAdvice.length
          });
      } catch (logError) {
        console.error('Failed to log AI usage:', logError);
      }

      return new Response(JSON.stringify({ 
        success: true, 
        advice: aiAdvice 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get user profile and portfolio for job recommendations and portfolio improvement
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', actualUserId)
      .single();

    const { data: portfolio } = await supabase
      .from('portfolios')
      .select('*')
      .eq('student_uid', actualUserId)
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
    try {
      await supabase
        .from('ai_usage_logs')
        .insert({
          user_id: actualUserId,
          request_type: type,
          response_length: aiResponse.length,
          created_at: new Date().toISOString()
        });
    } catch (logError) {
      console.error('Failed to log AI usage:', logError);
    }

    return new Response(JSON.stringify({ 
      success: true,
      advice: aiResponse,
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