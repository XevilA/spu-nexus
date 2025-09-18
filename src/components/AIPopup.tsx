import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Brain, 
  X, 
  MessageSquare,
  Loader2,
  Sparkles
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";

interface AIPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIPopup = ({ isOpen, onClose }: AIPopupProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');

  const handleAskAI = async () => {
    if (!user || !question.trim()) return;

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
          question: question
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      if (data.success && data.advice) {
        setResponse(data.advice);
        toast({
          title: "ได้รับคำตอบจาก SPU Smart AI!",
          description: "AI ได้ตอบคำถามของคุณแล้ว"
        });
      } else {
        throw new Error('No response received');
      }
    } catch (error) {
      console.error('AI Popup Error:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถติดต่อ AI ได้ ลองใหม่อีกครั้ง",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setQuestion('');
    setResponse('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl">
        <CardHeader className="bg-gradient-hero text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Brain className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  SPU Smart AI Assistant
                </CardTitle>
                <p className="text-white/80 text-sm">ถามอะไรก็ได้เกี่ยวกับการหางาน หรือพัฒนา Portfolio</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-4">
          {/* Question Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">คำถามของคุณ:</label>
            <Textarea
              placeholder="ตอนนี้ฉันกำลังหางาน แต่ไม่รู้ว่าจะเตรียมตัวยังไง ช่วยแนะนำหน่อย..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          {/* AI Response */}
          {response && (
            <div className="bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-primary/20 rounded-full">
                  <Brain className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-primary mb-2">คำตอบจาก SPU Smart AI</h4>
                  <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                    {response}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={handleAskAI}
              disabled={loading || !question.trim()}
              className="flex-1 bg-gradient-hero text-white hover:opacity-90"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  AI กำลังตอบ...
                </>
              ) : (
                <>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  ถาม AI
                </>
              )}
            </Button>
            
            {response && (
              <Button 
                variant="outline" 
                onClick={handleReset}
                className="flex-1"
              >
                ถามคำถามใหม่
              </Button>
            )}
          </div>

          {/* Sample Questions */}
          {!response && (
            <div className="border-t pt-4">
              <p className="text-sm font-medium mb-3">คำถามตัวอย่าง:</p>
              <div className="space-y-2">
                {[
                  "Portfolio ของฉันควรมีอะไรบ้าง?",
                  "จะเตรียมตัวสัมภาษณ์งานยังไง?",
                  "ทักษะอะไรที่ตลาดแรงงานต้องการ?",
                  "จะหางาน Part-time ตอนเรียนได้ไหม?"
                ].map((sample, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="h-auto p-2 text-left justify-start text-sm text-muted-foreground hover:text-foreground"
                    onClick={() => setQuestion(sample)}
                  >
                    "{sample}"
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AIPopup;