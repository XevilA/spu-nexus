import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, GraduationCap, Building2, TrendingUp, ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Index = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && profile) {
      // Redirect based on user role
      if (profile.role === 'ADMIN') {
        navigate('/admin');
      } else if (profile.role === 'COMPANY_HR') {
        navigate('/business-dashboard');
      } else if (profile.role === 'STUDENT' || profile.role === 'user') {
        navigate('/student-dashboard');
      }
    }
  }, [user, profile, loading, navigate]);

  const features = [
    {
      icon: GraduationCap,
      title: "สำหรับนักศึกษา",
      description: "สร้าง E-Portfolio แสดงผลงาน ค้นหางานที่เหมาะกับคุณ",
      color: "bg-primary",
      link: "/auth"
    },
    {
      icon: Building2,
      title: "สำหรับธุรกิจ",
      description: "ค้นหาบุคลากรที่มีคุณภาพ โพสต์งาน และจัดการใบสมัคร",
      color: "bg-primary",
      link: "/business-auth"
    },
    {
      icon: Briefcase,
      title: "ตำแหน่งงาน",
      description: "งานหลากหลายประเภท ทั้ง Full-time, Part-time, และ Freelance",
      color: "bg-success",
      link: "/jobs"
    },
    {
      icon: TrendingUp,
      title: "AI แนะนำงาน",
      description: "ระบบ AI ช่วยแนะนำงานที่เหมาะกับคุณ",
      color: "bg-info",
      link: "/auth"
    }
  ];

  const stats = [
    { label: "บริษัท", value: "500+", color: "text-primary" },
    { label: "ตำแหน่งงาน", value: "1,200+", color: "text-success" },
    { label: "นักศึกษา", value: "5,000+", color: "text-info" },
    { label: "จับคู่สำเร็จ", value: "3,500+", color: "text-warning" }
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-10"></div>
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4 bg-primary text-white px-4 py-2 text-sm">
              <Sparkles className="w-4 h-4 mr-2 inline" />
              SPU Smart Job Platform
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="gradient-text">เชื่อมต่อนักศึกษา</span>
              <br />
              กับโอกาสในฝัน
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              แพลตฟอร์มหางานออนไลน์สำหรับนักศึกษา มหาวิทยาลัยเซนต์ปีเตอร์สเบิร์ก 
              พร้อม E-Portfolio และระบบ AI แนะนำงาน
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="btn-gradient text-lg px-8"
                onClick={() => navigate('/auth')}
              >
                เริ่มต้นใช้งาน - นักศึกษา
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-lg px-8 border-2 border-primary text-primary hover:bg-primary hover:text-white"
                onClick={() => navigate('/business-auth')}
              >
                สำหรับธุรกิจ
                <Building2 className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-secondary">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className={`text-4xl font-bold ${stat.color} mb-2`}>{stat.value}</p>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              ทำไมต้อง <span className="gradient-text">SPU U2B</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              แพลตฟอร์มครบครันสำหรับการหางานและสรรหาบุคลากร
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="card-gradient hover:shadow-pink cursor-pointer"
                onClick={() => navigate(feature.link)}
              >
                <CardHeader>
                  <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full group">
                    เรียนรู้เพิ่มเติม
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-95"></div>
        <div className="container mx-auto px-6 relative z-10 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">พร้อมเริ่มต้นแล้วหรือยัง?</h2>
          <p className="text-xl mb-8 opacity-90">
            เข้าร่วมกับเราวันนี้ และค้นพบโอกาสใหม่ๆ ในการทำงาน
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              className="text-lg px-8 bg-white text-primary hover:bg-white/90"
              onClick={() => navigate('/auth')}
            >
              ลงทะเบียนเลย
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 border-2 border-white text-white hover:bg-white hover:text-primary"
              onClick={() => navigate('/jobs')}
            >
              ดูตำแหน่งงาน
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="container mx-auto px-6">
          <div className="text-center text-muted-foreground">
            <p className="mb-2">© 2025 SPU Smart Job Platform. All rights reserved.</p>
            <p className="text-sm">Saint Peter University - University to Business</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
