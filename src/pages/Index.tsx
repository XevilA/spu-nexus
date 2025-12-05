import { Button } from "@/components/ui/button";
import { Briefcase, Users, LogIn, UserPlus, ChevronDown, Sparkles, Star, Zap, Target, Award, Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Index = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      <div className="flex min-h-screen items-center justify-center bg-primary">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white shadow-xl py-3' 
          : 'bg-transparent py-5'
      }`}>
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <span className={`text-2xl font-black ${scrolled ? 'text-foreground' : 'text-white'}`}>SPU</span>
                <span className="text-2xl font-black text-primary ml-1">Freelance</span>
              </div>
              <div className={`hidden lg:block h-8 w-px ${scrolled ? 'bg-border' : 'bg-white/40'}`}></div>
              <span className={`hidden lg:block text-xs font-bold tracking-[0.2em] ${scrolled ? 'text-muted-foreground' : 'text-white/80'}`}>
                PORTFOLIO HUB
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
              <button 
                onClick={() => navigate('/jobs')}
                className={`flex items-center gap-2 font-medium transition-colors ${
                  scrolled ? 'text-foreground hover:text-primary' : 'text-white/90 hover:text-white'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>ผลงาน/หางาน</span>
              </button>
              <button 
                onClick={() => navigate('/auth')}
                className={`flex items-center gap-2 font-medium transition-colors ${
                  scrolled ? 'text-foreground hover:text-primary' : 'text-white/90 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>นักศึกษา</span>
              </button>
              <button 
                onClick={() => navigate('/auth')}
                className={`flex items-center gap-2 font-medium transition-colors ${
                  scrolled ? 'text-foreground hover:text-primary' : 'text-white/90 hover:text-white'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>เข้าสู่ระบบ</span>
              </button>
              <Button 
                onClick={() => navigate('/auth')}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                สมัครสมาชิก
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="icon"
              className={`md:hidden ${scrolled ? 'text-foreground' : 'text-white'}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-xl border-t animate-fade-in">
            <div className="container mx-auto px-6 py-4 space-y-3">
              <button 
                onClick={() => { navigate('/jobs'); setMobileMenuOpen(false); }}
                className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-secondary transition-colors"
              >
                <Briefcase className="w-5 h-5 text-primary" />
                <span className="font-medium">ผลงาน/หางาน</span>
              </button>
              <button 
                onClick={() => { navigate('/auth'); setMobileMenuOpen(false); }}
                className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-secondary transition-colors"
              >
                <Users className="w-5 h-5 text-primary" />
                <span className="font-medium">นักศึกษา</span>
              </button>
              <button 
                onClick={() => { navigate('/auth'); setMobileMenuOpen(false); }}
                className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-secondary transition-colors"
              >
                <LogIn className="w-5 h-5 text-primary" />
                <span className="font-medium">เข้าสู่ระบบ</span>
              </button>
              <Button 
                onClick={() => { navigate('/auth'); setMobileMenuOpen(false); }}
                className="w-full bg-primary hover:bg-primary/90 text-white rounded-full font-bold"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                สมัครสมาชิก
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-primary">
        {/* Animated Portfolio Grid Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 p-2 opacity-30">
            {[...portfolioImages, ...portfolioImages, ...portfolioImages, ...portfolioImages].map((img, index) => (
              <div 
                key={index} 
                className="aspect-[3/4] rounded-lg bg-cover bg-center transform hover:scale-105 transition-transform duration-500"
                style={{ 
                  backgroundImage: `url(${img})`,
                  animationDelay: `${index * 0.1}s`,
                  transform: `translateY(${(index % 4) * 15}px)`,
                }}
              />
            ))}
          </div>
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary/95 to-primary"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-transparent to-primary/80"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse delay-300"></div>
        <div className="absolute top-1/3 right-10 w-16 h-16 bg-white/10 rounded-full blur-lg animate-pulse delay-500"></div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
          <div className="animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-5 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-white font-medium text-sm">แพลตฟอร์มหางานสำหรับนักศึกษา SPU</span>
            </div>

            {/* Main Title */}
            <h1 className="text-5xl md:text-7xl lg:text-9xl font-black text-white mb-6 tracking-tight leading-[0.9]">
              SPU FREELANCE
            </h1>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white/90 mb-10">
              PORTFOLIO HUB
            </h2>
            
            {/* Subtitle */}
            <div className="bg-foreground/40 backdrop-blur-md rounded-2xl px-8 py-5 inline-block mb-10 shadow-2xl">
              <p className="text-white text-lg md:text-2xl font-medium">
                ศูนย์รวม Portfolio ของเด็กผู้ประกอบการ SPU แบบ Real-time
              </p>
            </div>

            {/* School Name */}
            <p className="text-white/70 text-sm md:text-base uppercase tracking-[0.3em] font-medium mb-12">
              By SPU School of Entrepreneurship
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button 
                size="lg"
                onClick={() => navigate('/auth')}
                className="bg-white text-primary hover:bg-white/90 rounded-full px-10 py-6 text-lg font-bold shadow-2xl hover:shadow-white/20 hover:scale-105 transition-all"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                เริ่มต้นใช้งาน
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate('/jobs')}
                className="border-2 border-white text-white hover:bg-white hover:text-primary rounded-full px-10 py-6 text-lg font-bold transition-all hover:scale-105"
              >
                <Briefcase className="w-5 h-5 mr-2" />
                ดูตำแหน่งงาน
              </Button>
            </div>

            {/* Explore Button */}
            <button 
              onClick={scrollToContent}
              className="group flex flex-col items-center text-white hover:scale-110 transition-transform"
            >
              <span className="text-sm font-bold uppercase tracking-widest mb-2 group-hover:text-white/80">EXPLORE</span>
              <ChevronDown className="w-10 h-10 animate-bounce" />
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-b-4 border-primary">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "500+", label: "บริษัทพาร์ทเนอร์", icon: Target },
              { value: "1,200+", label: "ตำแหน่งงาน", icon: Briefcase },
              { value: "5,000+", label: "นักศึกษาสมาชิก", icon: Users },
              { value: "3,500+", label: "จับคู่สำเร็จ", icon: Award }
            ].map((stat, index) => (
              <div key={index} className="text-center group hover:scale-105 transition-transform">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-2xl mb-4 group-hover:bg-primary/20 transition-colors">
                  <stat.icon className="w-7 h-7 text-primary" />
                </div>
                <p className="text-4xl md:text-5xl font-black text-primary mb-2">{stat.value}</p>
                <p className="text-muted-foreground font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-primary font-bold text-sm">คุณสมบัติเด่น</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-foreground mb-4">
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
                description: "สร้างและจัดการ Portfolio ออนไลน์ของคุณ แสดงผลงานให้โลกได้เห็น พร้อมเทมเพลตสวยๆ",
                color: "from-pink-500 to-rose-500"
              },
              {
                icon: "💼",
                title: "หางาน Freelance",
                description: "ค้นหางาน Freelance, Part-time, Full-time ที่เหมาะกับทักษะและความสนใจของคุณ",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: "🤖",
                title: "AI แนะนำงาน",
                description: "ระบบ AI อัจฉริยะช่วยจับคู่งานที่เหมาะสมกับคุณ วิเคราะห์จากทักษะและประสบการณ์",
                color: "from-blue-500 to-purple-500"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-border"
              >
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 text-4xl shadow-lg group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4">
              เริ่มต้นใช้งาน <span className="text-primary">ง่ายๆ</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "สมัครสมาชิก", desc: "ลงทะเบียนด้วยอีเมล @spu.ac.th" },
              { step: "02", title: "สร้าง Portfolio", desc: "อัพโหลดผลงานและทักษะของคุณ" },
              { step: "03", title: "ค้นหางาน", desc: "เลือกงานที่ตรงกับความต้องการ" },
              { step: "04", title: "สมัครงาน", desc: "ส่งใบสมัครและรอติดต่อกลับ" }
            ].map((item, index) => (
              <div key={index} className="relative text-center group">
                <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
                {index < 3 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-primary/20"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-1/4 translate-y-1/4"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <Star className="w-12 h-12 text-white mx-auto mb-6" />
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
            พร้อมเริ่มต้นสร้างอนาคตแล้วหรือยัง?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            เข้าร่วมกับนักศึกษาผู้ประกอบการกว่า 5,000+ คน ที่ใช้ SPU Freelance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 text-lg px-10 py-6 rounded-full font-bold shadow-2xl hover:scale-105 transition-all"
              onClick={() => navigate('/auth')}
            >
              <UserPlus className="w-5 h-5 mr-2" />
              สมัครสมาชิก - นักศึกษา
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-10 py-6 border-2 border-white text-white hover:bg-white hover:text-primary rounded-full font-bold transition-all hover:scale-105"
              onClick={() => navigate('/business-auth')}
            >
              สำหรับธุรกิจ/บริษัท
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl font-black text-white">SPU</span>
                <span className="text-3xl font-black text-primary">Freelance</span>
              </div>
              <p className="text-white/60 max-w-md leading-relaxed">
                ศูนย์รวม Portfolio และแพลตฟอร์มหางานสำหรับนักศึกษาผู้ประกอบการ มหาวิทยาลัยศรีปทุม
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">เมนูหลัก</h4>
              <div className="space-y-3">
                <button onClick={() => navigate('/jobs')} className="block text-white/60 hover:text-white transition-colors">
                  หางาน
                </button>
                <button onClick={() => navigate('/news')} className="block text-white/60 hover:text-white transition-colors">
                  ข่าวสาร
                </button>
                <button onClick={() => navigate('/activities')} className="block text-white/60 hover:text-white transition-colors">
                  กิจกรรม
                </button>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">เข้าสู่ระบบ</h4>
              <div className="space-y-3">
                <button onClick={() => navigate('/auth')} className="block text-white/60 hover:text-white transition-colors">
                  นักศึกษา
                </button>
                <button onClick={() => navigate('/business-auth')} className="block text-white/60 hover:text-white transition-colors">
                  ธุรกิจ/บริษัท
                </button>
                <button onClick={() => navigate('/admin-auth')} className="block text-white/60 hover:text-white transition-colors">
                  ผู้ดูแลระบบ
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-white/40 text-sm">
              © 2025 SPU Freelance Portfolio Hub. By SPU School of Entrepreneurship. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
