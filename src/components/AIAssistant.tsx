import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Sparkles, 
  MessageSquare, 
  Loader2,
  TrendingUp,
  Lightbulb,
  Target,
  Star
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";

interface AIAssistantProps {
  type: 'job_recommendations' | 'portfolio_improvement';
  onAdviceReceived?: (advice: string) => void;
}

const AIAssistant = ({ type, onAdviceReceived }: AIAssistantProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState('');

  const getAIAdvice = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await fetch('https://jgpvykbrrrboghwvulhy.supabase.co/functions/v1/spu-smart-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpncHZ5a2JycnJib2dod3Z1bGh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1Mjk4MDksImV4cCI6MjA2MTEwNTgwOX0.BpPIk6X2ZUn1hBEvFBOtrH0VgG6QfEkehu6K7HXkUtE`
        },
        body: JSON.stringify({
          type,
          user_id: user.id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI advice');
      }

      const data = await response.json();
      
      if (data.success && data.advice) {
        setAdvice(data.advice);
        onAdviceReceived?.(data.advice);
        toast({
          title: "ได้รับคำแนะนำจาก AI แล้ว!",
          description: "AI ได้วิเคราะห์ข้อมูลของคุณและให้คำแนะนำแล้ว"
        });
      } else {
        throw new Error('No advice received');
      }
    } catch (error) {
      console.error('AI Assistant Error:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถขอคำแนะนำจาก AI ได้ ลองใหม่อีกครั้ง",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    return type === 'job_recommendations' 
      ? 'แนะนำงานที่เหมาะสม' 
      : 'ปรับปรุง Portfolio';
  };

  const getDescription = () => {
    return type === 'job_recommendations'
      ? 'AI จะวิเคราะห์ Portfolio ของคุณและแนะนำงานที่เหมาะสม'
      : 'AI จะวิเคราะห์ Portfolio ของคุณและให้คำแนะนำในการปรับปรุง';
  };

  const getIcon = () => {
    return type === 'job_recommendations' ? <Target className="h-5 w-5" /> : <TrendingUp className="h-5 w-5" />;
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-hero rounded-lg text-white">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                {getIcon()}
                SPU Smart AI
              </CardTitle>
              <CardDescription>{getTitle()}</CardDescription>
            </div>
          </div>
          <Badge className="bg-gradient-hero text-white">
            <Sparkles className="h-3 w-3 mr-1" />
            AI
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {getDescription()}
        </p>

        {advice && (
          <div className="bg-gradient-to-r from-spu-pink/10 to-spu-success/10 border border-spu-pink/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-spu-pink/20 rounded-full">
                <Lightbulb className="h-4 w-4 text-spu-pink" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-spu-pink mb-2">คำแนะนำจาก AI</h4>
                <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                  {advice}
                </div>
              </div>
            </div>
          </div>
        )}

        <Button 
          onClick={getAIAdvice}
          disabled={loading}
          className="w-full bg-gradient-hero text-white hover:opacity-90"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              AI กำลังวิเคราะห์...
            </>
          ) : (
            <>
              <MessageSquare className="h-4 w-4 mr-2" />
              ขอคำแนะนำจาก AI
            </>
          )}
        </Button>

        {type === 'job_recommendations' && (
          <div className="text-xs text-muted-foreground space-y-1">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              <span>AI จะพิจารณาทักษะ ความสนใจ และประสบการณ์ของคุณ</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              <span>ผลลัพธ์อิงจากงานที่เปิดรับในปัจจุบัน</span>
            </div>
          </div>
        )}

        {type === 'portfolio_improvement' && (
          <div className="text-xs text-muted-foreground space-y-1">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              <span>AI จะวิเคราะห์ความสมบูรณ์ของ Portfolio</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              <span>แนะนำการปรับปรุงเพื่อเพิ่มโอกาสได้งาน</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIAssistant;