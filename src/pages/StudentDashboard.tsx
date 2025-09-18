import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  FileText, 
  Briefcase, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle,
  Plus
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/ui/navbar";
import AIAssistant from "@/components/AIAssistant";

const StudentDashboard = () => {
  const { user, loading, profile } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    applications: 0,
    portfolio: null,
    recentJobs: []
  });
  const [dataLoading, setDataLoading] = useState(true);

  // Redirect non-authenticated users
  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  // Fetch dashboard data
  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch applications count
      const { count: applicationsCount } = await supabase
        .from('applications')
        .select('*', { count: 'exact' })
        .eq('student_uid', user?.id);

      // Fetch portfolio status
      const { data: portfolio } = await supabase
        .from('portfolios')
        .select('*')
        .eq('student_uid', user?.id)
        .single();

      // Fetch recent jobs
      const { data: recentJobs } = await supabase
        .from('jobs')
        .select(`
          *,
          companies (
            name
          )
        `)
        .eq('status', 'OPEN')
        .order('created_at', { ascending: false })
        .limit(3);

      setDashboardData({
        applications: applicationsCount || 0,
        portfolio,
        recentJobs: recentJobs || []
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setDataLoading(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="bg-muted rounded-lg p-8">Loading...</div>
        </div>
      </div>
    );
  }

  const portfolioStatus = dashboardData.portfolio?.status || 'none';
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <Badge className="bg-spu-success text-white">อนุมัติแล้ว</Badge>;
      case 'SUBMITTED':
        return <Badge className="bg-spu-warning text-white">รอการอนุมัติ</Badge>;
      case 'CHANGES_REQUESTED':
        return <Badge className="bg-spu-warning text-white">ต้องแก้ไข</Badge>;
      case 'REJECTED':
        return <Badge className="bg-spu-error text-white">ถูกปฏิเสธ</Badge>;
      case 'DRAFT':
        return <Badge variant="outline">แก้ไขอยู่</Badge>;
      default:
        return <Badge variant="outline">ยังไม่มี Portfolio</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navbar />
      
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Student Dashboard</h1>
              <p className="text-muted-foreground mt-1">ยินดีต้อนรับ {profile?.display_name || user.email}</p>
            </div>
            <div className="flex gap-3">
              <Link to="/portfolio">
                <Button variant="outline" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  จัดการ Portfolio
                </Button>
              </Link>
              <Link to="/jobs">
                <Button className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  หางาน
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Stats & Quick Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-card shadow-card hover:shadow-hover transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">ใบสมัครทั้งหมด</p>
                      <p className="text-3xl font-bold text-spu-pink">{dashboardData.applications}</p>
                    </div>
                    <Briefcase className="w-8 h-8 text-spu-pink" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card shadow-card hover:shadow-hover transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">งานที่เปิด</p>
                      <p className="text-3xl font-bold text-spu-success">{dashboardData.recentJobs.length}</p>
                    </div>
                    <Clock className="w-8 h-8 text-spu-success" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card shadow-card hover:shadow-hover transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Portfolio</p>
                      <div className="mt-2">
                        {getStatusBadge(portfolioStatus)}
                      </div>
                    </div>
                    <FileText className="w-8 h-8 text-spu-neutral" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card shadow-card hover:shadow-hover transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">การยืนยัน</p>
                      <div className="mt-2">
                        {profile?.verified_student ? (
                          <Badge className="bg-spu-success text-white">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            ยืนยันแล้ว
                          </Badge>
                        ) : (
                          <Badge className="bg-spu-warning text-white">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            รอการยืนยัน
                          </Badge>
                        )}
                      </div>
                    </div>
                    <User className="w-8 h-8 text-spu-neutral" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="bg-white shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  การดำเนินการด่วน
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {!dashboardData.portfolio && (
                    <Link to="/portfolio">
                      <Card className="border border-dashed border-muted-foreground/25 hover:border-spu-pink/50 transition-colors cursor-pointer">
                        <CardContent className="p-6 text-center">
                          <FileText className="w-8 h-8 text-spu-pink mx-auto mb-2" />
                          <h3 className="font-semibold text-foreground">สร้าง Portfolio</h3>
                          <p className="text-sm text-muted-foreground">เริ่มสร้าง e-Portfolio ของคุณ</p>
                        </CardContent>
                      </Card>
                    </Link>
                  )}
                  
                  <Link to="/jobs">
                    <Card className="border border-dashed border-muted-foreground/25 hover:border-spu-pink/50 transition-colors cursor-pointer">
                      <CardContent className="p-6 text-center">
                        <Briefcase className="w-8 h-8 text-spu-pink mx-auto mb-2" />
                        <h3 className="font-semibold text-foreground">เรียกดูงาน</h3>
                        <p className="text-sm text-muted-foreground">ค้นหาโอกาสงานใหม่ๆ</p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Recent Jobs & Profile Summary */}
          <div className="space-y-6">
            {/* Profile Summary */}
            <Card className="bg-white shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  ข้อมูลส่วนตัว
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-spu-pink/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="w-8 h-8 text-spu-pink" />
                  </div>
                  <h3 className="font-semibold text-foreground">{profile?.display_name || user.email}</h3>
                  <p className="text-sm text-muted-foreground">
                    {profile?.faculty && profile?.program ? 
                      `${profile.faculty} - ${profile.program}` : 
                      'กรุณาอัปเดตข้อมูลส่วนตัว'
                    }
                  </p>
                </div>
                <Link to="/portfolio">
                  <Button variant="outline" size="sm" className="w-full">
                    แก้ไขข้อมูล
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* AI Assistant */}
            <AIAssistant type="job_recommendations" />

            {/* Recent Jobs */}
            <Card className="bg-white shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    งานล่าสุด
                  </CardTitle>
                  <Link to="/jobs">
                    <Button variant="ghost" size="sm">ดูทั้งหมด</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {dataLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : dashboardData.recentJobs.length > 0 ? (
                  <div className="space-y-4">
                    {dashboardData.recentJobs.map((job: any) => (
                      <div key={job.id} className="border-l-2 border-spu-pink/20 pl-4">
                        <h4 className="font-medium text-foreground text-sm">{job.title}</h4>
                        <p className="text-xs text-muted-foreground">{job.companies?.name}</p>
                        <p className="text-xs text-muted-foreground">{job.location}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    ไม่มีงานใหม่ในขณะนี้
                  </p>
                )}
                
                <Link to="/jobs" className="block mt-4">
                  <Button size="sm" className="w-full bg-spu-pink hover:bg-spu-pink/80">
                    ดูงานทั้งหมด
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;