import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";

const TestAI = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');

  const testAI = async () => {
    if (!user) {
      toast({
        title: "กรุณาเข้าสู่ระบบ",
        description: "คุณต้องเข้าสู่ระบบก่อนใช้งาน AI",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://jgpvykbrrrboghwvulhy.supabase.co/functions/v1/spu-smart-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpncHZ5a2JycnJib2dod3Z1bGh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1Mjk4MDksImV4cCI6MjA2MTEwNTgwOX0.BpPIk6X2ZUn1hBEvFBOtrH0VgG6QfEkehu6K7HXkUtE`
        },
        body: JSON.stringify({
          type: 'general_question',
          user_id: user.id,
          question: 'สวัสดีครับ ทดสอบระบบ AI'
        })
      });

      const data = await response.json();
      console.log('AI Response:', data);
      
      if (data.success && data.advice) {
        setResponse(data.advice);
        toast({
          title: "AI ตอบสำเร็จ!",
          description: "ระบบ AI ทำงานได้ปกติ"
        });
      } else {
        console.error('AI Error:', data);
        toast({
          title: "AI ไม่ตอบ",
          description: data.error || "ไม่มีการตอบกลับ",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Network Error:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเชื่อมต่อกับ AI ได้",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-bold mb-2">ทดสอบ AI</h3>
      <Button onClick={testAI} disabled={loading}>
        {loading ? 'กำลังทดสอบ...' : 'ทดสอบ SPU Smart AI'}
      </Button>
      {response && (
        <div className="mt-4 p-3 bg-secondary rounded">
          <p className="text-sm">{response}</p>
        </div>
      )}
    </div>
  );
};

export default TestAI;