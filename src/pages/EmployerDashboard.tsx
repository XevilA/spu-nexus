import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Users, 
  FileText, 
  MessageSquare, 
  TrendingUp,
  Plus,
  Eye,
  UserCheck,
  Clock
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import JobPostForm from "@/components/JobPostForm";
import PortfolioViewer from "@/components/PortfolioViewer";

const EmployerDashboard = () => {
  const { user, profile } = useAuth();
  const [selectedView, setSelectedView] = useState('overview');

  const quickStats = [
    { icon: FileText, label: "งานที่เปิดรับ", value: "5", color: "text-primary" },
    { icon: Users, label: "ใบสมัครรวม", value: "28", color: "text-spu-success" },
    { icon: UserCheck, label: "รอการตัดสิน", value: "12", color: "text-spu-warning" },
    { icon: TrendingUp, label: "อัตราการตอบรับ", value: "75%", color: "text-spu-pink" }
  ];

  const recentApplications = [
    {
      id: 1,
      candidate: "สมชาย ใจดี",
      position: "Front-end Developer",
      status: "รอการตัดสิน",
      date: "2024-01-15",
      score: "85%",
      statusColor: "bg-spu-warning"
    },
    {
      id: 2,
      candidate: "สมหญิง ขยัน",
      position: "UX Designer",
      status: "ผ่านรอบแรก",
      date: "2024-01-14",
      score: "92%",
      statusColor: "bg-spu-success"
    }
  ];

  const activeJobs = [
    {
      id: 1,
      title: "Front-end Developer",
      applications: 8,
      views: 45,
      status: "เปิดรับ",
      deadline: "2024-02-15"
    },
    {
      id: 2,
      title: "UX Designer",
      applications: 12,
      views: 67,
      status: "เปิดรับ",
      deadline: "2024-02-20"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-primary text-white px-6 py-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">SPU U2B - ผู้จ้างงาน</div>
          <div className="flex items-center gap-4">
            <span className="text-sm">สวัสดี, {profile?.first_name || user?.email}</span>
            <Button variant="secondary" size="sm">
              ออกจากระบบ
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-hero rounded-full flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">บริษัท ABC</CardTitle>
                    <CardDescription>ผู้จ้างงาน</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant={selectedView === 'overview' ? 'default' : 'ghost'} 
                  className="w-full justify-start"
                  onClick={() => setSelectedView('overview')}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  ภาพรวม
                </Button>
                <Button 
                  variant={selectedView === 'post-job' ? 'default' : 'ghost'} 
                  className="w-full justify-start"
                  onClick={() => setSelectedView('post-job')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  โพสต์งาน
                </Button>
                <Button 
                  variant={selectedView === 'portfolios' ? 'default' : 'ghost'} 
                  className="w-full justify-start"
                  onClick={() => setSelectedView('portfolios')}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  ดู Portfolio
                </Button>
                <Button 
                  variant={selectedView === 'applications' ? 'default' : 'ghost'} 
                  className="w-full justify-start"
                  onClick={() => setSelectedView('applications')}
                >
                  <Users className="h-4 w-4 mr-2" />
                  จัดการใบสมัคร
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => setSelectedView('messages')}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  ข้อความ
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {selectedView === 'overview' && (
              <>
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {quickStats.map((stat, index) => (
                    <Card key={index} className="shadow-card hover:shadow-hover transition-all">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          <stat.icon className={`h-8 w-8 ${stat.color}`} />
                          <div>
                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Active Jobs */}
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      งานที่เปิดรับอยู่
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {activeJobs.map((job) => (
                        <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-semibold">{job.title}</h4>
                            <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                              <span>ใบสมัคร: {job.applications}</span>
                              <span>การดู: {job.views}</span>
                              <span>ปิดรับ: {job.deadline}</span>
                            </div>
                          </div>
                          <Badge className="bg-spu-success text-white">
                            {job.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Applications */}
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      ใบสมัครล่าสุด
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentApplications.map((app) => (
                        <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-semibold">{app.candidate}</h4>
                            <p className="text-sm text-muted-foreground">{app.position}</p>
                            <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                              <span>สมัครเมื่อ {app.date}</span>
                              <span className="text-spu-success">คะแนน: {app.score}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={`${app.statusColor} text-white`}>
                              {app.status}
                            </Badge>
                            <Button size="sm" variant="outline">
                              ดูรายละเอียด
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {selectedView === 'post-job' && (
              <JobPostForm />
            )}

            {selectedView === 'portfolios' && (
              <PortfolioViewer />
            )}

            {selectedView === 'applications' && (
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>จัดการใบสมัครงาน</CardTitle>
                  <CardDescription>ดูและจัดการใบสมัครที่เข้ามา</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentApplications.map((app) => (
                      <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-semibold">{app.candidate}</h4>
                          <p className="text-sm text-muted-foreground">{app.position}</p>
                          <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                            <span>สมัครเมื่อ {app.date}</span>
                            <span className="text-spu-success">คะแนน: {app.score}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            ดู Portfolio
                          </Button>
                          <Button size="sm" className="bg-spu-success text-white">
                            อนุมัติ
                          </Button>
                          <Button size="sm" variant="outline">
                            ปฏิเสธ
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedView === 'messages' && (
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>ข้อความและการแจ้งเตือน</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                      <Users className="h-5 w-5 text-spu-success mt-1" />
                      <div>
                        <p className="font-medium">มีใบสมัครใหม่</p>
                        <p className="text-sm text-muted-foreground">สมชาย ใจดี สมัครตำแหน่ง Front-end Developer</p>
                        <p className="text-xs text-muted-foreground mt-1">30 นาทีที่แล้ว</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                      <Clock className="h-5 w-5 text-spu-warning mt-1" />
                      <div>
                        <p className="font-medium">งานใกล้ปิดรับสมัคร</p>
                        <p className="text-sm text-muted-foreground">ตำแหน่ง UX Designer จะปิดรับสมัครในอีก 3 วัน</p>
                        <p className="text-xs text-muted-foreground mt-1">1 วันที่แล้ว</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;