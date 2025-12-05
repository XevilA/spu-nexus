import { Button } from "@/components/ui/button";
import { Briefcase, Users, LogIn, UserPlus, ChevronDown, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Index = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!loading && user && profile) {
      if (profile.role === 'ADMIN') {
        navigate('/admin');
      } else if (profile.role === 'COMPANY_HR') {
        navigate('/business-dashboard');
      } else if (profile.role === 'STUDENT' || profile.role === 'user') {
        navigate('/student-dashboard');
      }
    }
  }, [user, profile, loading, navigate]);

  const portfolioImages = [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=400&fit=crop",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=400&fit=crop",
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&h=400&fit=crop",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=400&fit=crop",
    "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&h=400&fit=crop",
    "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=300&h=400&fit=crop",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=400&fit=crop",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=400&fit=crop",
    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&h=400&fit=crop",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=400&fit=crop",
    "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=300&h=400&fit=crop",
  ];

  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

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
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-white">SPU</span>
                <span className="text-2xl font-bold text-primary ml-1">Freelance</span>
              </div>
              <div className="hidden md:block h-8 w-px bg-white/30"></div>
              <span className="hidden md:block text-sm text-white/80 font-medium">PORTFOLIO HUB</span>
            </div>

            {/* Menu */}
            <div className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => navigate('/jobs')}
                className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
              >
                <Briefcase className="w-4 h-4" />
                <span>ผลงาน/หางาน</span>
              </button>
              <button 
                onClick={() => navigate('/auth')}
                className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
              >
                <Users className="w-4 h-4" />
                <span>นักศึกษา</span>
              </button>
              <button 
                onClick={() => navigate('/auth')}
                className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>เข้าสู่ระบบ</span>
              </button>
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-primary hover:bg-primary/90 text-white rounded-full px-6"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                สมัครสมาชิก
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              className="md:hidden text-white"
              onClick={() => navigate('/auth')}
            >
              <LogIn className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Portfolio Grid Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Portfolio Grid Background */}
        <div className="absolute inset-0">
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1 opacity-40">
            {[...portfolioImages, ...portfolioImages, ...portfolioImages, ...portfolioImages].map((img, index) => (
              <div 
                key={index} 
                className="aspect-[3/4] bg-cover bg-center"
                style={{ 
                  backgroundImage: `url(${img})`,
                  transform: `translateY(${(index % 3) * 20}px)`
                }}
              />
            ))}
          </div>
          {/* Pink Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/70 to-primary/90"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/50 via-transparent to-primary/50"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 tracking-tight leading-tight">
            SPU FREELANCE
            <br />
            <span className="text-white/90">PORTFOLIO HUB</span>
          </h1>
          
          <div className="bg-black/30 backdrop-blur-sm rounded-full px-8 py-4 inline-block mb-12">
            <p className="text-white/90 text-lg md:text-xl">
              ศูนย์รวม Portfolio ของเด็กผู้ประกอบการ SPU แบบ Real-time
            </p>
          </div>

          <div className="mb-8">
            <p className="text-white/70 text-sm uppercase tracking-widest mb-2">
              By SPU School of Entrepreneurship
            </p>
          </div>

          {/* Explore Button */}
          <button 
            onClick={scrollToContent}
            className="text-primary font-bold uppercase tracking-wider hover:scale-110 transition-transform"
          >
            <span className="block mb-2">EXPLORE</span>
            <ChevronDown className="w-8 h-8 mx-auto animate-bounce" />
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              ทำไมต้อง <span className="text-primary">SPU Freelance</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              แพลตฟอร์มครบครันสำหรับนักศึกษาผู้ประกอบการยุคใหม่
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎨",
                title: "E-Portfolio",
                description: "สร้างและจัดการ Portfolio ออนไลน์ของคุณ แสดงผลงานให้โลกได้เห็น"
              },
              {
                icon: "💼",
                title: "หางาน Freelance",
                description: "ค้นหางาน Freelance ที่เหมาะกับทักษะและความสนใจของคุณ"
              },
              {
                icon: "🤖",
                title: "AI แนะนำงาน",
                description: "ระบบ AI อัจฉริยะช่วยจับคู่งานที่เหมาะสมกับคุณ"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-secondary rounded-2xl p-8 text-center hover:shadow-pink transition-shadow"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "500+", label: "บริษัทพาร์ทเนอร์" },
              { value: "1,200+", label: "ตำแหน่งงาน" },
              { value: "5,000+", label: "นักศึกษาสมาชิก" },
              { value: "3,500+", label: "จับคู่สำเร็จ" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</p>
                <p className="text-white/80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="text-primary font-semibold uppercase tracking-wider">เริ่มต้นเลย</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            พร้อมเริ่มต้นสร้างอนาคตแล้วหรือยัง?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            เข้าร่วมกับนักศึกษาผู้ประกอบการกว่า 5,000+ คน ที่ใช้ SPU Freelance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-white text-lg px-8 rounded-full"
              onClick={() => navigate('/auth')}
            >
              <UserPlus className="w-5 h-5 mr-2" />
              สมัครสมาชิก - นักศึกษา
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-full"
              onClick={() => navigate('/business-auth')}
            >
              สำหรับธุรกิจ
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-white">SPU</span>
              <span className="text-2xl font-bold text-primary">Freelance</span>
            </div>
            <div className="flex items-center gap-6 text-white/70">
              <button onClick={() => navigate('/jobs')} className="hover:text-white transition-colors">
                หางาน
              </button>
              <button onClick={() => navigate('/news')} className="hover:text-white transition-colors">
                ข่าวสาร
              </button>
              <button onClick={() => navigate('/activities')} className="hover:text-white transition-colors">
                กิจกรรม
              </button>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center">
            <p className="text-white/60 text-sm">
              © 2025 SPU Freelance Portfolio Hub. By SPU School of Entrepreneurship
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
