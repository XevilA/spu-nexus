import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Briefcase, Users, LogIn, UserPlus, ChevronDown, Building, 
  MapPin, Clock, DollarSign, Search, Menu, X, Image, FileText, GraduationCap,
  ArrowRight, CheckCircle2
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [stats, setStats] = useState({ jobs: 0, companies: 0, students: 0 });

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

  useEffect(() => {
    fetchJobs();
    fetchStats();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .select(`*, companies (name, verified)`)
        .eq("status", "OPEN")
        .order("created_at", { ascending: false })
        .limit(6);

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setJobsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const [jobsCount, companiesCount, studentsCount] = await Promise.all([
        supabase.from("jobs").select("id", { count: "exact", head: true }),
        supabase.from("companies").select("id", { count: "exact", head: true }),
        supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "STUDENT")
      ]);
      
      setStats({
        jobs: jobsCount.count || 0,
        companies: companiesCount.count || 0,
        students: studentsCount.count || 0
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const portfolioImages = [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=400&fit=crop",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=400&fit=crop",
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&h=400&fit=crop",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=400&fit=crop",
    "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&h=400&fit=crop",
    "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=300&h=400&fit=crop",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=400&fit=crop",
  ];

  const scrollToContent = () => {
    const element = document.getElementById('jobs-section');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const getJobTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      INTERNSHIP: "ฝึกงาน",
      FREELANCE: "ฟรีแลนซ์",
      PARTTIME: "งานชั่วคราว",
      FULLTIME: "งานเต็มเวลา",
      COOP: "สหกิจ",
    };
    return labels[type] || type;
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.companies?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || job.job_type?.toLowerCase().includes(selectedType.toLowerCase());
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1a1a1a]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-white text-lg font-medium">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-[#1a1a1a]/95 backdrop-blur-md shadow-lg border-b border-white/10' 
          : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <span className="text-2xl font-black text-white">SPU</span>
                <span className="text-2xl font-black text-primary ml-1">Freelance</span>
              </div>
              <div className="hidden lg:block h-8 w-px bg-white/30"></div>
              <span className="hidden lg:block text-xs font-bold tracking-[0.2em] text-white/60">
                PORTFOLIO HUB
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
              <button 
                onClick={() => navigate('/jobs')}
                className="flex items-center gap-2 text-white/80 hover:text-white transition-colors font-medium"
              >
                <Briefcase className="w-4 h-4" />
                <span>ผลงาน</span>
              </button>
              <button 
                onClick={() => navigate('/auth')}
                className="flex items-center gap-2 text-white/80 hover:text-white transition-colors font-medium"
              >
                <Users className="w-4 h-4" />
                <span>นักศึกษา</span>
              </button>
              <button 
                onClick={() => navigate('/auth')}
                className="flex items-center gap-2 text-white/80 hover:text-white transition-colors font-medium"
              >
                <LogIn className="w-4 h-4" />
                <span>เข้าสู่ระบบ</span>
              </button>
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 font-bold"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                สมัครสมาชิก
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="icon"
              className="md:hidden text-white hover:bg-white/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-[#1a1a1a] border-t border-white/10 animate-fade-in">
            <div className="container mx-auto px-6 py-4 space-y-3">
              <button 
                onClick={() => { navigate('/jobs'); setMobileMenuOpen(false); }}
                className="flex items-center gap-3 w-full p-3 rounded-xl text-white/80 hover:text-white hover:bg-white/5 transition-colors"
              >
                <Briefcase className="w-5 h-5 text-primary" />
                <span className="font-medium">ผลงาน/หางาน</span>
              </button>
              <button 
                onClick={() => { navigate('/auth'); setMobileMenuOpen(false); }}
                className="flex items-center gap-3 w-full p-3 rounded-xl text-white/80 hover:text-white hover:bg-white/5 transition-colors"
              >
                <Users className="w-5 h-5 text-primary" />
                <span className="font-medium">นักศึกษา</span>
              </button>
              <button 
                onClick={() => { navigate('/auth'); setMobileMenuOpen(false); }}
                className="flex items-center gap-3 w-full p-3 rounded-xl text-white/80 hover:text-white hover:bg-white/5 transition-colors"
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
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Portfolio Grid Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 p-2 opacity-40">
            {[...portfolioImages, ...portfolioImages, ...portfolioImages, ...portfolioImages, ...portfolioImages, ...portfolioImages].map((img, index) => (
              <div 
                key={index} 
                className="aspect-[3/4] rounded-lg bg-cover bg-center"
                style={{ 
                  backgroundImage: `url(${img})`,
                  transform: `translateY(${(index % 4) * 15}px)`,
                }}
              />
            ))}
          </div>
          {/* Dark Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a] via-[#1a1a1a]/80 to-[#1a1a1a]"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-transparent to-primary/30"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-6xl mx-auto pt-20">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-4 tracking-tight leading-[0.95]">
            SPU<span className="text-primary">CA</span> PORTFOLIO HUB
          </h1>
          
          <div className="bg-[#2a2a2a]/80 backdrop-blur-md rounded-full px-8 py-4 inline-block mb-8 border border-white/10">
            <p className="text-white/90 text-lg md:text-xl">
              ศูนย์รวม Portfolio ของเด็กนิเทศ SPU แบบ Real-time
            </p>
          </div>

          {/* Explore Button */}
          <button 
            onClick={scrollToContent}
            className="group flex flex-col items-center text-primary hover:scale-110 transition-transform mx-auto"
          >
            <span className="text-sm font-bold uppercase tracking-widest mb-2">EXPLORE</span>
            <ChevronDown className="w-8 h-8 animate-bounce" />
          </button>
        </div>

        {/* Orange Bottom Line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
      </section>

      {/* Stats & Search Section */}
      <section id="jobs-section" className="py-16 bg-[#1a1a1a]">
        <div className="container mx-auto px-6">
          {/* Title */}
          <h2 className="text-4xl md:text-5xl font-black text-primary text-center mb-12">
            ผลงานทั้งหมด
          </h2>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-[#2a2a2a]/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                <Image className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-4xl font-black text-white">{stats.jobs || "0"}</p>
                <p className="text-white/60">ผลงาน</p>
              </div>
            </div>
            <div className="bg-[#2a2a2a]/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-4xl font-black text-white">{stats.companies || "0"}</p>
                <p className="text-white/60">วิชา</p>
              </div>
            </div>
            <div className="bg-[#2a2a2a]/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-orange-600 rounded-2xl flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-4xl font-black text-white">{stats.students || "0"}</p>
                <p className="text-white/60">นักศึกษา</p>
              </div>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="bg-[#2a2a2a]/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 h-5 w-5" />
                <Input
                  placeholder="ค้นหาจากชื่อ, รหัสนักศึกษา..."
                  className="h-14 pl-12 bg-[#1a1a1a] border-white/10 rounded-xl text-white placeholder:text-white/40 focus:border-primary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="h-14 bg-[#1a1a1a] border-white/10 rounded-xl text-white">
                  <SelectValue placeholder="-- ทุกรายวิชา --" />
                </SelectTrigger>
                <SelectContent className="bg-[#2a2a2a] border-white/10 text-white">
                  <SelectItem value="all">ทุกประเภท</SelectItem>
                  <SelectItem value="internship">ฝึกงาน</SelectItem>
                  <SelectItem value="freelance">ฟรีแลนซ์</SelectItem>
                  <SelectItem value="parttime">Part-time</SelectItem>
                  <SelectItem value="fulltime">Full-time</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="h-14 bg-[#1a1a1a] border-white/10 rounded-xl text-white">
                  <SelectValue placeholder="-- ทุกสาขา --" />
                </SelectTrigger>
                <SelectContent className="bg-[#2a2a2a] border-white/10 text-white">
                  <SelectItem value="all">ทุกสาขา</SelectItem>
                  <SelectItem value="design">ออกแบบ</SelectItem>
                  <SelectItem value="dev">พัฒนา</SelectItem>
                  <SelectItem value="marketing">การตลาด</SelectItem>
                </SelectContent>
              </Select>
              <Button className="h-14 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold">
                <Search className="w-5 h-5 mr-2" />
                ค้นหา
              </Button>
            </div>
          </div>

          {/* Jobs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobsLoading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="bg-[#2a2a2a]/50 rounded-2xl overflow-hidden border border-white/10 animate-pulse">
                  <div className="aspect-[4/3] bg-white/10"></div>
                  <div className="p-5">
                    <div className="h-6 bg-white/10 rounded mb-3"></div>
                    <div className="h-4 bg-white/10 rounded w-2/3"></div>
                  </div>
                </div>
              ))
            ) : filteredJobs.length > 0 ? (
              filteredJobs.map((job, index) => (
                <div 
                  key={job.id} 
                  className="bg-[#2a2a2a]/50 rounded-2xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all duration-300 group cursor-pointer"
                  onClick={() => navigate('/jobs')}
                >
                  {/* Card Header/Image */}
                  <div className="aspect-[4/3] bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] relative overflow-hidden">
                    <div className="absolute inset-0 flex flex-col justify-between p-4">
                      <div className="flex justify-between items-start">
                        <span className="text-xs text-white/60">School of Entrepreneurship</span>
                        <span className="text-xs text-white/60">ID: {job.id?.slice(0, 8)}</span>
                      </div>
                      <div>
                        <p className="text-6xl font-black text-primary/20">FD67</p>
                        <p className="text-2xl font-bold text-white">SPU CA</p>
                        <p className="text-white/60 text-sm">A PROCESS PORTFOLIO</p>
                      </div>
                    </div>
                    {/* Profile Image */}
                    <div className="absolute top-4 right-4 w-20 h-24 bg-cover bg-center rounded-lg" 
                      style={{ backgroundImage: `url(${portfolioImages[index % portfolioImages.length]})` }}
                    />
                  </div>
                  
                  {/* Card Content */}
                  <div className="p-5">
                    <h3 className="text-primary font-bold text-lg mb-2 group-hover:text-primary/80 transition-colors line-clamp-2">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-2 text-white/60 text-sm mb-3">
                      <Building className="w-4 h-4" />
                      <span>{job.companies?.name || "SPU Freelance"}</span>
                      {job.companies?.verified && <CheckCircle2 className="w-4 h-4 text-primary" />}
                    </div>
                    <div className="flex items-center gap-4 text-white/50 text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{job.location || "กรุงเทพฯ"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(job.created_at).toLocaleDateString("th-TH")}</span>
                      </div>
                    </div>
                    
                    {/* Student Info */}
                    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/10">
                      <div className="w-10 h-10 rounded-full bg-cover bg-center border-2 border-primary"
                        style={{ backgroundImage: `url(${portfolioImages[(index + 1) % portfolioImages.length]})` }}
                      />
                      <div>
                        <p className="text-white font-medium text-sm">นักศึกษา SPU</p>
                        <p className="text-primary text-xs">67XXXXXX</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Briefcase className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <p className="text-white/60 text-lg">ยังไม่มีงานในระบบ</p>
                <p className="text-white/40 text-sm mt-2">บริษัทสามารถลงทะเบียนและโพสต์งานได้ที่นี่</p>
                <Button 
                  onClick={() => navigate('/business-auth')}
                  className="mt-6 bg-primary hover:bg-primary/90 text-white rounded-full"
                >
                  <Building className="w-4 h-4 mr-2" />
                  ลงทะเบียนธุรกิจ
                </Button>
              </div>
            )}
          </div>

          {/* View More Button */}
          {filteredJobs.length > 0 && (
            <div className="text-center mt-12">
              <Button 
                onClick={() => navigate('/jobs')}
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white rounded-full px-8"
              >
                ดูทั้งหมด
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section for Businesses */}
      <section className="py-20 bg-gradient-to-r from-primary/20 via-[#1a1a1a] to-primary/20 border-y border-white/10">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            สำหรับธุรกิจ/บริษัท
          </h2>
          <p className="text-white/60 text-lg mb-8 max-w-2xl mx-auto">
            ลงทะเบียนธุรกิจของคุณและโพสต์ตำแหน่งงาน เพื่อเข้าถึงนักศึกษาที่มีความสามารถจาก SPU
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => navigate('/business-auth')}
              className="bg-primary hover:bg-primary/90 text-white rounded-full px-10 font-bold"
            >
              <Building className="w-5 h-5 mr-2" />
              ลงทะเบียนธุรกิจ
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate('/auth')}
              className="border-white/30 text-white hover:bg-white/10 rounded-full px-10"
            >
              สำหรับนักศึกษา
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0f0f0f] py-12 border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-white">SPU</span>
              <span className="text-2xl font-black text-primary">CA</span>
              <span className="text-white/40 ml-2">| PORTFOLIO HUB</span>
            </div>
            <div className="flex items-center gap-6 text-white/50">
              <button onClick={() => navigate('/jobs')} className="hover:text-white transition-colors">
                ผลงาน
              </button>
              <button onClick={() => navigate('/auth')} className="hover:text-white transition-colors">
                นักศึกษา
              </button>
              <button onClick={() => navigate('/auth')} className="hover:text-white transition-colors">
                เข้าสู่ระบบ
              </button>
              <button onClick={() => navigate('/business-auth')} className="hover:text-white transition-colors">
                สำหรับธุรกิจ
              </button>
            </div>
          </div>
          <div className="text-center text-white/30 text-sm">
            © 2025 SPUCA Portfolio Hub. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
