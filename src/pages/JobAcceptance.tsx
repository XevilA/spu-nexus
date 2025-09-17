import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Briefcase, 
  Building, 
  MapPin, 
  Calendar, 
  DollarSign,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  User
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Navbar } from "@/components/ui/navbar";

const JobAcceptance = () => {
  const { applicationId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [application, setApplication] = useState<any>(null);
  const [job, setJob] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [proposal, setProposal] = useState({
    message: '',
    start_date: '',
    salary_offer: ''
  });

  useEffect(() => {
    if (applicationId) {
      fetchApplicationData();
    }
  }, [applicationId]);

  const fetchApplicationData = async () => {
    try {
      // Fetch application with job and company details
      const { data: appData, error: appError } = await supabase
        .from('applications')
        .select(`
          *,
          jobs:job_id (
            *,
            companies:company_id (*)
          )
        `)
        .eq('id', applicationId)
        .single();

      if (appError) throw appError;

      setApplication(appData);
      setJob(appData.jobs);
      setCompany(appData.jobs?.companies);
    } catch (error) {
      console.error('Error fetching application:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลได้",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptJob = async () => {
    if (!application || !user) return;

    setAccepting(true);
    try {
      const { error } = await supabase
        .from('applications')
        .update({
          status: 'ACCEPTED',
          accepted_at: new Date().toISOString(),
          proposal: {
            message: proposal.message,
            start_date: proposal.start_date,
            salary_offer: proposal.salary_offer,
            accepted_at: new Date().toISOString()
          }
        })
        .eq('id', applicationId);

      if (error) throw error;

      toast({
        title: "ยืนยันการรับงานสำเร็จ!",
        description: "คุณได้ยืนยันการรับงานแล้ว บริษัทจะติดต่อกลับเร็วๆ นี้"
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Accept job error:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถยืนยันการรับงานได้",
        variant: "destructive"
      });
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>กำลังโหลด...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!application || application.student_uid !== user?.id) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <Card className="w-96">
              <CardContent className="pt-6 text-center">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
                <h2 className="text-xl font-semibold mb-2">ไม่พบข้อมูล</h2>
                <p className="text-muted-foreground">ไม่พบใบสมัครงานนี้หรือคุณไม่มีสิทธิ์เข้าถึง</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2">ยืนยันการรับงาน</h1>
            <p className="text-muted-foreground">
              คุณได้รับข้อเสนองานแล้ว กรุณาตรวจสอบรายละเอียดและยืนยันการรับงาน
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Job Details */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    รายละเอียดงาน
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{job?.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Building className="h-4 w-4" />
                        {company?.name}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job?.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {job?.budget_or_salary}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">รายละเอียด</h4>
                    <p className="text-muted-foreground whitespace-pre-wrap">{job?.description}</p>
                  </div>

                  {job?.requirements && job.requirements.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">คุณสมบัติที่ต้องการ</h4>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {job.requirements.map((req: string, index: number) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Job Offer Response */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    ข้อความตอบกลับ
                  </CardTitle>
                  <CardDescription>
                    เขียนข้อความตอบกลับไปยังบริษัท
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="message">ข้อความ</Label>
                    <Textarea
                      id="message"
                      placeholder="ขอบคุณสำหรับโอกาสนี้ ผมยินดีที่จะร่วมงานกับบริษัท..."
                      value={proposal.message}
                      onChange={(e) => setProposal(prev => ({ ...prev, message: e.target.value }))}
                      className="min-h-24"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start_date">วันที่สามารถเริ่มงาน</Label>
                      <Input
                        id="start_date"
                        type="date"
                        value={proposal.start_date}
                        onChange={(e) => setProposal(prev => ({ ...prev, start_date: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="salary_offer">อัตราค่าจ้างที่คาดหวัง</Label>
                      <Input
                        id="salary_offer"
                        placeholder="15,000 บาท/เดือน"
                        value={proposal.salary_offer}
                        onChange={(e) => setProposal(prev => ({ ...prev, salary_offer: e.target.value }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Application Status */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg">สถานะใบสมัคร</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">สถานะปัจจุบัน</span>
                    <Badge className="bg-spu-success text-white">
                      ได้รับข้อเสนองาน
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-spu-success" />
                      ส่งใบสมัคร
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-spu-success" />
                      ได้รับข้อเสนองาน
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full border-2 border-primary"></div>
                      ยืนยันการรับงาน
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Company Info */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg">ข้อมูลบริษัท</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-semibold">{company?.name}</h4>
                    <p className="text-sm text-muted-foreground">{company?.domain}</p>
                  </div>
                  
                  {company?.verified && (
                    <Badge className="bg-spu-success text-white text-xs">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      บริษัทยืนยันแล้ว
                    </Badge>
                  )}
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  className="w-full bg-spu-success text-white hover:bg-spu-success/90"
                  onClick={handleAcceptJob}
                  disabled={accepting}
                >
                  {accepting ? "กำลังยืนยัน..." : "ยืนยันการรับงาน"}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/dashboard')}
                >
                  กลับไปแดชบอร์ด
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobAcceptance;