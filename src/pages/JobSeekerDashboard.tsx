import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  FileText, 
  Briefcase, 
  MessageSquare, 
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  Star
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import AIAssistant from "@/components/AIAssistant";
import { Link } from "react-router-dom";

const JobSeekerDashboard = () => {
  const { user, profile } = useAuth();
  const [selectedView, setSelectedView] = useState('overview');

  const quickStats = [
    { icon: FileText, label: "สถานะ Portfolio", value: "อนุมัติแล้ว", color: "text-spu-success" },
    { icon: Briefcase, label: "ใบสมัครงาน", value: "3", color: "text-primary" },
    { icon: MessageSquare, label: "ข้อความใหม่", value: "2", color: "text-spu-warning" },
    { icon: TrendingUp, label: "โปรไฟล์วิว", value: "45", color: "text-spu-pink" }
  ];

  const recentApplications = [
    {
      id: 1,
      company: "บริษัท เทคโนโลยี ABC",
      position: "Front-end Developer",
      status: "กำลังพิจารณา",
      date: "2024-01-15",
      statusColor: "bg-spu-warning"
    },
    {
      id: 2,
      company: "บริษัท ดิจิทัล XYZ",
      position: "UX Designer",
      status: "ผ่านรอบแรก",
      date: "2024-01-10",
      statusColor: "bg-spu-success"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-primary text-white px-6 py-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">SPU U2B - ผู้หางาน</div>
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
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{profile?.first_name} {profile?.last_name}</CardTitle>
                    <CardDescription>นักศึกษา</CardDescription>
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
                <Link to="/portfolio" className="block">
                  <Button variant="ghost" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    จัดการ Portfolio
                  </Button>
                </Link>
                <Link to="/jobs" className="block">
                  <Button variant="ghost" className="w-full justify-start">
                    <Briefcase className="h-4 w-4 mr-2" />
                    ค้นหางาน
                  </Button>
                </Link>
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

                {/* AI Assistant */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AIAssistant type="job_recommendations" />
                  <AIAssistant type="portfolio_improvement" />
                </div>

                {/* Recent Applications */}
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      ใบสมัครงานล่าสุด
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentApplications.map((app) => (
                        <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-semibold">{app.position}</h4>
                            <p className="text-sm text-muted-foreground">{app.company}</p>
                            <p className="text-xs text-muted-foreground">สมัครเมื่อ {app.date}</p>
                          </div>
                          <Badge className={`${app.statusColor} text-white`}>
                            {app.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {selectedView === 'messages' && (
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>ข้อความและการแจ้งเตือน</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                      <CheckCircle className="h-5 w-5 text-spu-success mt-1" />
                      <div>
                        <p className="font-medium">Portfolio ได้รับการอนุมัติแล้ว</p>
                        <p className="text-sm text-muted-foreground">คณะได้อนุมัติ Portfolio ของคุณเรียบร้อยแล้ว สามารถเริ่มสมัครงานได้</p>
                        <p className="text-xs text-muted-foreground mt-1">2 ชั่วโมงที่แล้ว</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                      <Clock className="h-5 w-5 text-spu-warning mt-1" />
                      <div>
                        <p className="font-medium">มีงานใหม่ที่เหมาะกับคุณ</p>
                        <p className="text-sm text-muted-foreground">พบงาน "React Developer" ที่ตรงกับทักษะของคุณ</p>
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

export default JobSeekerDashboard;