import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building, 
  Users, 
  FileText, 
  Plus, 
  Search,
  Eye,
  Send,
  CheckCircle,
  AlertCircle,
  UserCheck,
  Briefcase,
  Calendar,
  MapPin
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Navbar } from "@/components/ui/navbar";
import { useNavigate } from "react-router-dom";

const BusinessDashboard = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [company, setCompany] = useState<any>(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.role !== 'COMPANY_HR') {
      navigate('/business-registration');
      return;
    }
    fetchDashboardData();
  }, [profile, navigate]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      // Fetch company data
      const { data: companyData } = await supabase
        .from('companies')
        .select('*')
        .eq('hr_owner_uid', user.id)
        .single();

      // Fetch jobs posted by this company
      const { data: jobsData } = await supabase
        .from('jobs')
        .select('*')
        .eq('company_id', companyData?.id || '');

      // Fetch applications for company jobs
      const { data: applicationsData } = await supabase
        .from('applications')
        .select(`
          *,
          jobs!inner(company_id),
          profiles:student_uid(first_name, last_name, email)
        `)
        .eq('jobs.company_id', companyData?.id || '');

      // Fetch approved portfolios for recruitment
      const { data: portfoliosData } = await supabase
        .from('portfolios')
        .select(`
          *,
          profiles:student_uid(first_name, last_name, email, faculty, program, year)
        `)
        .eq('status', 'APPROVED')
        .eq('visibility', 'PUBLIC');

      setCompany(companyData);
      setJobs(jobsData || []);
      setApplications(applicationsData || []);
      setPortfolios(portfoliosData || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลได้",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationStatusUpdate = async (applicationId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', applicationId);

      if (error) throw error;

      toast({
        title: "อัปเดตสถานะสำเร็จ",
        description: `สถานะใบสมัครได้รับการอัปเดตเป็น ${status}`
      });

      fetchDashboardData();
    } catch (error) {
      console.error('Error updating application:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัปเดตสถานะได้",
        variant: "destructive"
      });
    }
  };

  if (profile?.role !== 'COMPANY_HR') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
            <h2 className="text-xl font-semibold mb-2">ไม่มีสิทธิ์เข้าถึง</h2>
            <p className="text-muted-foreground mb-4">กรุณาลงทะเบียนบริษัทก่อน</p>
            <Button onClick={() => navigate('/business-registration')}>
              ลงทะเบียนบริษัท
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">แดชบอร์ดบริษัท</h1>
          <p className="text-muted-foreground">
            {company?.name} - จัดการงานและผู้สมัคร
          </p>
          {!company?.verified && (
            <Badge className="bg-spu-warning text-white mt-2">
              <AlertCircle className="w-4 h-4 mr-1" />
              รอการยืนยันจากผู้ดูแล
            </Badge>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">งานที่โพสต์</p>
                  <p className="text-2xl font-bold">{jobs.length}</p>
                </div>
                <Briefcase className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ใบสมัครที่ได้รับ</p>
                  <p className="text-2xl font-bold">{applications.length}</p>
                </div>
                <FileText className="h-8 w-8 text-spu-success" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ใบสมัครใหม่</p>
                  <p className="text-2xl font-bold">
                    {applications.filter(app => app.status === 'APPLIED').length}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-spu-warning" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Portfolio ที่มี</p>
                  <p className="text-2xl font-bold">{portfolios.length}</p>
                </div>
                <Users className="h-8 w-8 text-spu-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="jobs" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="jobs">งานของเรา</TabsTrigger>
            <TabsTrigger value="applications">ใบสมัคร</TabsTrigger>
            <TabsTrigger value="portfolios">หาผู้สมัคร</TabsTrigger>
            <TabsTrigger value="company">ข้อมูลบริษัท</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">งานที่โพสต์</h3>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                โพสต์งานใหม่
              </Button>
            </div>

            <div className="space-y-4">
              {jobs.map((job: any) => (
                <Card key={job.id} className="shadow-card">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-semibold text-lg">{job.title}</h4>
                        <p className="text-muted-foreground mb-2">{job.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(job.posted_at).toLocaleDateString('th-TH')}
                          </div>
                        </div>
                      </div>
                      <Badge className={job.status === 'OPEN' ? "bg-spu-success text-white" : "bg-muted"}>
                        {job.status === 'OPEN' ? 'เปิดรับ' : 'ปิดรับ'}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        ดูรายละเอียด
                      </Button>
                      <Button variant="outline" size="sm">
                        แก้ไข
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {jobs.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  ยังไม่มีงานที่โพสต์
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหาใบสมัคร..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <div className="space-y-4">
              {applications
                .filter(app => 
                  app.profiles?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  app.profiles?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  app.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((application: any) => (
                  <Card key={application.id} className="shadow-card">
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-semibold">
                            {application.profiles?.first_name} {application.profiles?.last_name}
                          </h4>
                          <p className="text-sm text-muted-foreground">{application.profiles?.email}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            สมัครเมื่อ: {new Date(application.submitted_at).toLocaleDateString('th-TH')}
                          </p>
                        </div>
                        <Badge 
                          className={
                            application.status === 'APPLIED' ? "bg-spu-warning text-white" :
                            application.status === 'ACCEPTED' ? "bg-spu-success text-white" :
                            "bg-muted"
                          }
                        >
                          {
                            application.status === 'APPLIED' ? 'รอพิจารณา' :
                            application.status === 'ACCEPTED' ? 'ตอบรับแล้ว' :
                            application.status === 'REJECTED' ? 'ปฏิเสธ' : 'อื่นๆ'
                          }
                        </Badge>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          ดู Portfolio
                        </Button>
                        {application.status === 'APPLIED' && (
                          <>
                            <Button 
                              size="sm" 
                              className="bg-spu-success text-white hover:bg-spu-success/90"
                              onClick={() => handleApplicationStatusUpdate(application.id, 'ACCEPTED')}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              ตอบรับ
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleApplicationStatusUpdate(application.id, 'REJECTED')}
                            >
                              ปฏิเสธ
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

              {applications.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  ยังไม่มีใบสมัครเข้ามา
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="portfolios" className="space-y-6">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหา Portfolio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolios
                .filter(portfolio => 
                  portfolio.profiles?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  portfolio.profiles?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  portfolio.profiles?.faculty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  portfolio.profiles?.program?.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((portfolio: any) => (
                  <Card key={portfolio.id} className="shadow-card">
                    <CardContent className="pt-6">
                      <div className="text-center mb-4">
                        <h4 className="font-semibold">
                          {portfolio.profiles?.first_name} {portfolio.profiles?.last_name}
                        </h4>
                        <p className="text-sm text-muted-foreground">{portfolio.profiles?.email}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {portfolio.profiles?.faculty} - {portfolio.profiles?.program}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ปี {portfolio.profiles?.year}
                        </p>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        {portfolio.skills?.slice(0, 3).map((skill: any, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill.name || skill}
                          </Badge>
                        ))}
                        {portfolio.skills?.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{portfolio.skills.length - 3} เพิ่มเติม
                          </Badge>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="w-4 h-4 mr-2" />
                          ดู Portfolio
                        </Button>
                        <Button size="sm" className="flex-1">
                          <Send className="w-4 h-4 mr-2" />
                          ติดต่อ
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

              {portfolios.length === 0 && (
                <div className="col-span-full text-center py-8 text-muted-foreground">
                  ยังไม่มี Portfolio ที่เปิดเผยสาธารณะ
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="company" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>ข้อมูลบริษัท</CardTitle>
                <CardDescription>
                  ข้อมูลพื้นฐานของบริษัท
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>ชื่อบริษัท</Label>
                    <Input value={company?.name || ''} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>โดเมน</Label>
                    <Input value={company?.domain || ''} disabled />
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Label>สถานะการยืนยัน:</Label>
                  <Badge className={company?.verified ? "bg-spu-success text-white" : "bg-spu-warning text-white"}>
                    {company?.verified ? "ยืนยันแล้ว" : "รอการยืนยัน"}
                  </Badge>
                </div>

                <Button variant="outline">
                  แก้ไขข้อมูลบริษัท
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BusinessDashboard;