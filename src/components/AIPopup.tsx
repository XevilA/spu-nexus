import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
                    <div className={`p-2 rounded-full ${message.role === 'user' ? 'bg-primary' : 'bg-enterprise-pink-ultra-light'}`}>
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