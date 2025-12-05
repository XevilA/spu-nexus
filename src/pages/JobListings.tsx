import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  MapPin,
  Clock,
  Building,
  DollarSign,
  Search,
  Briefcase,
  CheckCircle2,
  ArrowRight,
  Menu,
  X,
  LogIn,
  UserPlus,
  Users,
  GraduationCap,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const JobListings = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [stats, setStats] = useState({ jobs: 0, companies: 0, students: 0 });
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        .order("created_at", { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast({
        title: "ข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลงานได้",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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

  const handleApply = async (jobId: string) => {
    if (!user) {
      toast({
        title: "ต้องเข้าสู่ระบบ",
        description: "กรุณาเข้าสู่ระบบเพื่อสมัครงาน",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    try {
      const { error } = await supabase.from("applications").insert({
        job_id: jobId,
        student_uid: user.id,
        status: "APPLIED",
      });

      if (error) throw error;

      toast({
        title: "สมัครงานสำเร็จ",
        description: "ใบสมัครของคุณถูกส่งเรียบร้อยแล้ว",
      });
    } catch (error: any) {
      toast({
        title: "สมัครงานไม่สำเร็จ",
        description: error.message || "ไม่สามารถส่งใบสมัครได้",
        variant: "destructive",
      });
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.companies?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || job.job_type.toLowerCase().includes(selectedType.toLowerCase());
    const matchesLocation = selectedLocation === "all" || job.location?.toLowerCase().includes(selectedLocation.toLowerCase());
    return matchesSearch && matchesType && matchesLocation;
  });

  const getJobTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      INTERNSHIP: "ฝึกงาน",
      FREELANCE: "ฟรีแลนซ์",
      PARTTIME: "Part-time",
      FULLTIME: "Full-time",
      COOP: "สหกิจ",
    };
    return labels[type] || type;
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#1a1a1a]/95 backdrop-blur-md shadow-lg border-b border-white/10' : 'bg-[#1a1a1a]/80 backdrop-blur-sm'
      }`}>
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate("/")}>
              <span className="text-2xl font-black text-white">SPU</span>
              <span className="text-2xl font-black text-primary">Freelance</span>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <button onClick={() => navigate('/jobs')} className="text-primary font-medium">หางาน</button>
              <button onClick={() => navigate('/auth')} className="text-white/80 hover:text-white font-medium">นักศึกษา</button>
              {user ? (
                <>
                  <span className="text-white/60">{user.email?.split("@")[0]}</span>
                  <Button variant="ghost" onClick={handleSignOut} className="text-white/80 hover:text-white">
                    ออกจากระบบ
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => navigate("/auth")} className="text-white/80 hover:text-white">
                    <LogIn className="w-4 h-4 mr-2" />
                    เข้าสู่ระบบ
                  </Button>
                  <Button onClick={() => navigate("/auth")} className="bg-primary hover:bg-primary/90 text-white rounded-full px-6">
                    <UserPlus className="w-4 h-4 mr-2" />
                    สมัครสมาชิก
                  </Button>
                </>
              )}
            </div>

            <Button variant="ghost" size="icon" className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-[#1a1a1a] border-t border-white/10 p-4 space-y-3">
            <button onClick={() => { navigate('/jobs'); setMobileMenuOpen(false); }} className="flex items-center gap-3 w-full p-3 rounded-xl text-primary">
              <Briefcase className="w-5 h-5" />
              <span>หางาน</span>
            </button>
            <button onClick={() => { navigate('/auth'); setMobileMenuOpen(false); }} className="flex items-center gap-3 w-full p-3 rounded-xl text-white/80">
              <Users className="w-5 h-5" />
              <span>นักศึกษา</span>
            </button>
            {!user && (
              <Button onClick={() => { navigate('/auth'); setMobileMenuOpen(false); }} className="w-full bg-primary text-white rounded-full">
                สมัครสมาชิก
              </Button>
            )}
          </div>
        )}
      </nav>

      {/* Hero Header */}
      <section className="pt-32 pb-12 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="bg-primary/20 text-primary border-0 px-4 py-2 mb-6">
              <Briefcase className="w-4 h-4 mr-2" />
              {jobs.length}+ ตำแหน่งงานใหม่
            </Badge>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
              ค้นหางานที่<span className="text-primary">ใช่</span>สำหรับคุณ
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              ค้นพบโอกาสทางอาชีพที่เหมาะสมกับคุณ จากบริษัทชั้นนำที่ลงประกาศใน SPU Freelance
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="bg-[#2a2a2a]/50 rounded-2xl p-4 text-center border border-white/10">
              <Briefcase className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-black text-white">{stats.jobs}</p>
              <p className="text-white/50 text-sm">งาน</p>
            </div>
            <div className="bg-[#2a2a2a]/50 rounded-2xl p-4 text-center border border-white/10">
              <Building className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-black text-white">{stats.companies}</p>
              <p className="text-white/50 text-sm">บริษัท</p>
            </div>
            <div className="bg-[#2a2a2a]/50 rounded-2xl p-4 text-center border border-white/10">
              <GraduationCap className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-black text-white">{stats.students}</p>
              <p className="text-white/50 text-sm">นักศึกษา</p>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="py-8">
        <div className="container mx-auto px-6">
          <div className="bg-[#2a2a2a]/50 rounded-2xl p-6 border border-white/10 max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 h-5 w-5" />
                <Input
                  placeholder="ค้นหาตำแหน่งงาน, บริษัท..."
                  className="h-14 pl-12 bg-[#1a1a1a] border-white/10 rounded-xl text-white placeholder:text-white/40 focus:border-primary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="h-14 bg-[#1a1a1a] border-white/10 rounded-xl text-white">
                  <SelectValue placeholder="ประเภทงาน" />
                </SelectTrigger>
                <SelectContent className="bg-[#2a2a2a] border-white/10 text-white">
                  <SelectItem value="all">ทุกประเภท</SelectItem>
                  <SelectItem value="internship">ฝึกงาน</SelectItem>
                  <SelectItem value="freelance">ฟรีแลนซ์</SelectItem>
                  <SelectItem value="parttime">Part-time</SelectItem>
                  <SelectItem value="fulltime">Full-time</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="h-14 bg-[#1a1a1a] border-white/10 rounded-xl text-white">
                  <SelectValue placeholder="สถานที่" />
                </SelectTrigger>
                <SelectContent className="bg-[#2a2a2a] border-white/10 text-white">
                  <SelectItem value="all">ทุกสถานที่</SelectItem>
                  <SelectItem value="bangkok">กรุงเทพฯ</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
              <p className="text-white/50 text-sm">
                พบ <span className="text-primary font-bold">{filteredJobs.length}</span> ตำแหน่งงาน
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Jobs List */}
      <section className="py-8 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto space-y-6">
            {loading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="bg-[#2a2a2a]/50 rounded-2xl p-6 border border-white/10 animate-pulse">
                  <div className="h-6 bg-white/10 rounded w-2/3 mb-4"></div>
                  <div className="h-4 bg-white/10 rounded w-1/2 mb-4"></div>
                  <div className="h-20 bg-white/10 rounded"></div>
                </div>
              ))
            ) : filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-[#2a2a2a]/50 rounded-2xl p-6 border border-white/10 hover:border-primary/50 transition-all duration-300 group"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-primary to-orange-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shrink-0">
                        {job.companies?.name?.charAt(0) || "C"}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors mb-2">
                          {job.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-white/60 text-sm">
                          <div className="flex items-center gap-1">
                            <Building className="w-4 h-4" />
                            <span>{job.companies?.name || "ไม่ระบุ"}</span>
                            {job.companies?.verified && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{job.location || "ไม่ระบุ"}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(job.created_at).toLocaleDateString("th-TH")}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="bg-primary/20 text-primary border-0">
                        {getJobTypeLabel(job.job_type)}
                      </Badge>
                      {job.budget_or_salary && (
                        <Badge className="bg-green-500/20 text-green-400 border-0">
                          <DollarSign className="w-3 h-3 mr-1" />
                          {job.budget_or_salary}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <p className="text-white/50 mb-4 line-clamp-2">{job.description}</p>

                  {job.requirements && Array.isArray(job.requirements) && job.requirements.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.requirements.slice(0, 5).map((req: string, index: number) => (
                        <Badge key={index} variant="outline" className="border-white/20 text-white/60 text-xs">
                          {req}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleApply(job.id)}
                      className="bg-primary hover:bg-primary/90 text-white rounded-xl"
                    >
                      สมัครงาน
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-xl">
                      ดูรายละเอียด
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <Briefcase className="w-20 h-20 text-white/20 mx-auto mb-6" />
                <p className="text-white/60 text-xl mb-2">ไม่พบงานที่ตรงกับการค้นหา</p>
                <p className="text-white/40 text-sm mb-6">ลองปรับเงื่อนไขการค้นหาใหม่</p>
                <Button onClick={() => { setSearchTerm(""); setSelectedType("all"); setSelectedLocation("all"); }} variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white rounded-full">
                  ล้างตัวกรอง
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary/20 via-[#1a1a1a] to-primary/20 border-y border-white/10">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-black text-white mb-4">สำหรับธุรกิจ/บริษัท</h2>
          <p className="text-white/60 mb-8 max-w-xl mx-auto">
            ลงทะเบียนธุรกิจของคุณและโพสต์ตำแหน่งงาน เพื่อเข้าถึงนักศึกษาที่มีความสามารถจาก SPU
          </p>
          <Button size="lg" onClick={() => navigate('/business-auth')} className="bg-primary hover:bg-primary/90 text-white rounded-full px-10">
            <Building className="w-5 h-5 mr-2" />
            ลงทะเบียนธุรกิจ
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0f0f0f] py-12 border-t border-white/10">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl font-black text-white">SPU</span>
            <span className="text-2xl font-black text-primary">Freelance</span>
          </div>
          <p className="text-white/30 text-sm">
            © 2025 SPU Freelance By SPU School of Entrepreneurship. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default JobListings;
