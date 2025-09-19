import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  Brain, 
  Sparkles, 
  MessageSquare, 
  Loader2,
  Lightbulb,
  RefreshCw,
  Send,
  User,
  Bot,
  ArrowRight
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

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
  const [conversationHistory, setConversationHistory] = useState<{role: 'user' | 'ai', content: string}[]>([]);

  const sampleQuestions = [
    "ช่วยแนะนำงานที่เหมาะกับฉันหน่อย",
    "วิเคราะห์ Portfolio ของฉันให้หน่อย", 
    "มีงาน Internship อะไรบ้าง",
    "ทักษะอะไรที่ตลาดแรงงานต้องการ",
    "เตรียมตัวสัมภาษณ์งานอย่างไร"
  ];

  const handleAskAI = async () => {
    if (!question.trim()) return;
    
    setLoading(true);
    
    // Add user question to conversation
    const newUserMessage = { role: 'user' as const, content: question };
    setConversationHistory(prev => [...prev, newUserMessage]);
    
    try {
      const response = await fetch('https://jgpvykbrrrboghwvulhy.supabase.co/functions/v1/spu-smart-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpncHZ5a2JycnJib2dod3Z1bGh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1Mjk4MDksImV4cCI6MjA2MTEwNTgwOX0.BpPIk6X2ZUn1hBEvFBOtrH0VgG6QfEkehu6K7HXkUtE`
        },
        body: JSON.stringify({
          type: 'general_question',
          user_id: user?.id || null,
          question: question
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      if (data.success && data.advice) {
        const aiResponse = { role: 'ai' as const, content: data.advice };
        setConversationHistory(prev => [...prev, aiResponse]);
        setResponse(data.advice);
        
        toast({
          title: "ได้รับคำตอบจาก SPU Smart AI แล้ว!",
          description: "AI ได้วิเคราะห์และตอบคำถามของคุณแล้ว"
        });
      } else {
        throw new Error('No response received');
      }
    } catch (error) {
      console.error('AI Assistant Error:', error);
      
      // Add error response to conversation
      const errorResponse = { 
        role: 'ai' as const, 
        content: "ขออภัย เกิดข้อผิดพลาดในการติดต่อกับ AI กรุณาลองใหม่อีกครั้ง หรือติดต่อฝ่ายสนับสนุน" 
      };
      setConversationHistory(prev => [...prev, errorResponse]);
      
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถติดต่อกับ SPU Smart AI ได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setQuestion('');
    }
  };

  const handleReset = () => {
    setConversationHistory([]);
    setQuestion('');
    setResponse('');
  };

  const handleSampleQuestion = (sampleQ: string) => {
    setQuestion(sampleQ);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                SPU Smart AI Assistant
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                ผู้ช่วยอัจฉริยะสำหรับการหางานและพัฒนาอาชีพ
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Conversation History */}
          {conversationHistory.length > 0 && (
            <div className="flex-1 overflow-y-auto mb-4 space-y-4 max-h-64 p-4 bg-muted/30 rounded-lg">
              {conversationHistory.map((message, index) => (
                <div key={index} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`p-2 rounded-full ${message.role === 'user' ? 'bg-primary' : 'bg-primary/10'}`}>
                      {message.role === 'user' ? (
                        <User className="h-4 w-4 text-white" />
                      ) : (
                        <Bot className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div className={`p-3 rounded-lg ${
                      message.role === 'user' 
                        ? 'bg-primary text-white' 
                        : 'bg-white border shadow-sm'
                    }`}>
                      <div className="text-sm whitespace-pre-wrap leading-relaxed">
                        {message.content}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Sample Questions */}
          {conversationHistory.length === 0 && (
            <div className="mb-6">
              <h4 className="font-semibold mb-3 text-sm text-muted-foreground">คำถามตัวอย่าง:</h4>
              <div className="grid gap-2">
                {sampleQuestions.map((sampleQ, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="justify-start text-left h-auto p-3 hover:bg-primary/5 hover:border-primary/20"
                    onClick={() => handleSampleQuestion(sampleQ)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-sm">{sampleQ}</span>
                    <ArrowRight className="h-4 w-4 ml-auto opacity-50" />
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Textarea
                placeholder="พิมพ์คำถามของคุณที่นี่... เช่น 'ช่วยหางานที่เหมาะกับฉันหน่อย' หรือ 'วิเคราะห์ Portfolio ของฉัน'"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="min-h-[100px] resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAskAI();
                  }
                }}
              />
              <div className="text-xs text-muted-foreground">
                กด Enter เพื่อส่ง หรือ Shift+Enter เพื่อขึ้นบรรทัดใหม่
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleAskAI}
                disabled={loading || !question.trim()}
                className="flex-1 bg-gradient-primary text-white hover:opacity-90"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    AI กำลังคิด...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    ถาม SPU Smart AI
                  </>
                )}
              </Button>
              
              {conversationHistory.length > 0 && (
                <Button
                  variant="outline"
                  onClick={handleReset}
                  disabled={loading}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Status Messages */}
          {!user && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center gap-2 text-amber-800">
                <Lightbulb className="h-4 w-4" />
                <span className="text-sm">
                  เข้าสู่ระบบเพื่อรับคำแนะนำที่เฉพาะเจาะจงกับโปรไฟล์ของคุณ
                </span>
              </div>
            </div>
          )}
          
          <div className="mt-4 text-center">
            <Badge variant="outline" className="text-xs">
              <Brain className="h-3 w-3 mr-1" />
              Powered by Advanced AI • ข้อมูลอัปเดตล่าสุด 2024
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIPopup;