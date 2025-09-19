import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Users, 
  Building2, 
  TrendingUp, 
  Award, 
  Search,
  Heart,
  MapPin,
  Calendar,
  Camera,
  Star,
  ChevronRight,
  Brain,
  Sparkles,
  GraduationCap,
  Briefcase,
  MessageSquare,
  Trophy,
  BookOpen,
  Newspaper
} from "lucide-react";
import { Link } from "react-router-dom";
import AIPopup from "@/components/AIPopup";

const Landing = () => {
  const [showAIPopup, setShowAIPopup] = useState(false);
  
  const featuredJobs = [
    {
      title: "Full Stack Developer",
      company: "Tech Solutions Co.",
      location: "Bangkok",
      salary: "35,000 - 45,000 บาท",
      type: "Full-time",
      skills: ["React", "Node.js", "TypeScript"],
      isHot: true
    },
    {
      title: "Digital Marketing Intern",
      company: "Creative Agency",
      location: "Remote",
      salary: "15,000 - 20,000 บาท",
      type: "Internship",
      skills: ["Social Media", "Analytics", "Content"],
      isHot: false
    },
    {
      title: "UX/UI Designer",
      company: "Design Studio",
      location: "Chiang Mai",
      salary: "25,000 - 35,000 บาท",
      type: "Part-time",
      skills: ["Figma", "Prototyping", "User Research"],
      isHot: true
    }
  ];

  const newsItems = [
    {
      title: "SPU จัดงาน Career Fair 2024",
      excerpt: "มหาวิทยาลัยเซนต์ปีเตอร์เบิร์กจัดงาน Career Fair ครั้งยิ่งใหญ่",
      date: "15 ม.ค. 2567",
      category: "งาน"
    },
    {
      title: "Workshop: Digital Marketing Trends",
      excerpt: "เรียนรู้เทรนด์การตลาดดิจิทัลล่าสุดสำหรับยุคใหม่",
      date: "20 ม.ค. 2567",
      category: "Workshop"
    },
    {
      title: "Tips สำหรับการสัมภาษณ์งาน",
      excerpt: "แนวทางและเคล็ดลับสำหรับการเตรียมตัวสัมภาษณ์งานให้ประสบความสำเร็จ",
      date: "25 ม.ค. 2567", 
      category: "ข่าว"
    }
  ];

  const testimonials = [
    {
      name: "นพ. สมศักดิ์ ใจดี",
      role: "Software Engineer",
      company: "Google Thailand",
      content: "SPU Smart ช่วยให้ผมหางานได้ตรงสาขาที่เรียน และ AI แนะนำงานได้แม่นยำมาก",
      rating: 5
    },
    {
      name: "น.ส. วันนิสา สวยงาม", 
      role: "Digital Marketing Manager",
      company: "Central Group",
      content: "ระบบจับคู่งานตรงใจมาก และมี workshop เสริมทักษะดีๆ ให้เข้าร่วมอีกด้วย",
      rating: 5
    },
    {
      name: "นาย ธีรเดช กล้าหาญ",
      role: "UX Designer", 
      company: "Line Thailand",
      content: "Platform ใช้งานง่าย และบริษัทต่างๆ ตอบกลับรวดเร็ว ได้งานภายใน 2 สัปดาห์",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl bg-gradient-primary bg-clip-text text-transparent">
                SPU Smart
              </h1>
              <p className="text-xs text-muted-foreground">Job Platform</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/jobs" className="text-sm font-medium hover:text-primary transition-colors">
              หางาน
            </Link>
            <Link to="/news" className="text-sm font-medium hover:text-primary transition-colors">
              ข่าวสาร
            </Link>
            <Link to="/activities" className="text-sm font-medium hover:text-primary transition-colors">
              กิจกรรม
            </Link>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowAIPopup(true)}
              className="border-primary/20 hover:bg-primary/5"
            >
              <Brain className="h-4 w-4 mr-2" />
              SPU AI
            </Button>
          </nav>

          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" size="sm">เข้าสู่ระบบ</Button>
            </Link>
            <Link to="/register">
              <Button className="bg-gradient-primary text-white hover:opacity-90" size="sm">
                สมัครสมาชิก
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-enterprise-pink-ultra-light to-background" />
        <div className="container relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-gradient-primary text-white">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Powered by AI
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  หางานใฝ่ฟัน
                  <span className="bg-gradient-primary bg-clip-text text-transparent block">
                    ด้วย AI
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-md">
                  แพลตฟอร์มหางานอัจฉริยะสำหรับนักศึกษา มหาวิทยาลัยเซนต์ปีเตอร์เบิร์ก พร้อมระบบ AI ที่แนะนำงานตรงใจ
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button size="lg" className="bg-gradient-primary text-white hover:opacity-90 w-full sm:w-auto">
                    <Users className="h-5 w-5 mr-2" />
                    ฉันเป็นผู้หางาน
                  </Button>
                </Link>
                <Link to="/biz/register">
                  <Button size="lg" variant="outline" className="border-primary/20 hover:bg-primary/5 w-full sm:w-auto">
                    <Building2 className="h-5 w-5 mr-2" />
                    ฉันเป็นผู้จ้างงาน
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="text-center">
                  <div className="font-bold text-2xl text-primary">2,500+</div>
                  <div className="text-sm text-muted-foreground">นักศึกษา</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-2xl text-primary">500+</div>
                  <div className="text-sm text-muted-foreground">บริษัท</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-2xl text-primary">1,200+</div>
                  <div className="text-sm text-muted-foreground">ตำแหน่งงาน</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-3xl rounded-full" />
              <div className="relative bg-white rounded-2xl shadow-enterprise p-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Brain className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-semibold">SPU Smart AI</h3>
                      <p className="text-sm text-muted-foreground">ระบบแนะนำงานอัจฉริยะ</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {["วิเคราะห์ทักษะและความสนใจ", "แนะนำงานที่เหมาะสม", "ปรับปรุง Portfolio อัตโนมัติ"].map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    className="w-full bg-gradient-primary text-white hover:opacity-90"
                    onClick={() => setShowAIPopup(true)}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    ทดลองใช้ AI ฟรี
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">งานแนะนำ</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              ตำแหน่งงานที่น่าสนใจและเหมาะสมกับนักศึกษา SPU
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredJobs.map((job, i) => (
              <Card key={i} className="hover:shadow-card-hover transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <Building2 className="h-4 w-4" />
                        {job.company}
                      </CardDescription>
                    </div>
                    {job.isHot && (
                      <Badge className="bg-destructive text-white">HOT</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </div>
                    <Badge variant="outline">{job.type}</Badge>
                  </div>
                  
                  <div className="text-lg font-semibold text-primary">
                    {job.salary}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, j) => (
                      <Badge key={j} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Link to="/jobs">
              <Button variant="outline" size="lg">
                <Search className="h-4 w-4 mr-2" />
                ดูงานทั้งหมด
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Workshop Section */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Post Workshop</h2>
            <p className="text-muted-foreground">
              อบรมเชิงปฏิบัติการเสริมทักษะสำหรับนักศึกษา
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-card-hover transition-shadow">
              <CardHeader>
                <BookOpen className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Workshop เขียน CV</CardTitle>
                <CardDescription>
                  เรียนรู้เทคนิคการเขียน CV ที่ดึงดูดใจนายจ้าง
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gradient-primary text-white hover:opacity-90">
                  สมัครเข้าร่วม
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-card-hover transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Mock Interview</CardTitle>
                <CardDescription>
                  ฝึกสัมภาษณ์งานจริงกับผู้เชี่ยวชาญ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gradient-primary text-white hover:opacity-90">
                  จองคิว
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-card-hover transition-shadow">
              <CardHeader>
                <Trophy className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Career Fair</CardTitle>
                <CardDescription>
                  งานแสดงสินค้าการงานรายใหญ่ประจำปี
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gradient-primary text-white hover:opacity-90">
                  ดูรายละเอียด
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* News & Activities */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">ข่าวสารและกิจกรรม</h2>
            <p className="text-muted-foreground">
              อัปเดตข่าวสารและกิจกรรมล่าสุดจาก SPU
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsItems.map((item, i) => (
              <Card key={i} className="overflow-hidden hover:shadow-card-hover transition-shadow cursor-pointer">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <Camera className="h-8 w-8 text-muted-foreground" />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="text-xs">
                      {item.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {item.date}
                    </span>
                  </div>
                  <CardTitle className="text-lg leading-tight">{item.title}</CardTitle>
                  <CardDescription>{item.excerpt}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Showcase */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">รูปภาพกิจกรรม</h2>
            <p className="text-muted-foreground">
              บรรยากาศงานและกิจกรรมต่างๆ ของ SPU
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1,2,3,4].map((i) => (
              <div key={i} className="aspect-square bg-muted rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                <div className="w-full h-full flex items-center justify-center">
                  <Camera className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Showcase</h2>
            <p className="text-muted-foreground">
              ผลงานเด่นและความสำเร็จของนักศึกษา SPU
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Award className="h-12 w-12 text-primary" />
                <div>
                  <h3 className="font-bold text-lg">นักศึกษาได้รับรางวัล</h3>
                  <p className="text-muted-foreground">Outstanding Student Award 2024</p>
                </div>
              </div>
              <p className="text-sm">
                นักศึกษา SPU คว้ารางวัลเด่นระดับประเทศจากโครงการ Innovation Challenge
              </p>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <TrendingUp className="h-12 w-12 text-primary" />
                <div>
                  <h3 className="font-bold text-lg">อัตราได้งาน</h3>
                  <p className="text-muted-foreground">85% ภายใน 3 เดือน</p>
                </div>
              </div>
              <p className="text-sm">
                บัณฑิต SPU มีอัตราการได้งานที่สูงกว่าค่าเฉลี่ยระดับประเทศ
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* User Reviews */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">รีวิวจากผู้ใช้งาน</h2>
            <p className="text-muted-foreground">
              เสียงสะท้อนจากนักศึกษาและบัณฑิตที่ประสบความสำเร็จ
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <Card key={i} className="p-6">
                <CardContent className="space-y-4 p-0">
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  
                  <p className="text-sm leading-relaxed">{testimonial.content}</p>
                  
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <Users className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{testimonial.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {testimonial.role} • {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-footer text-white py-12 mt-16">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-xl">SPU Smart</h3>
                  <p className="text-sm opacity-80">Job Platform</p>
                </div>
              </div>
              <p className="text-sm opacity-80 max-w-sm">
                แพลตฟอร์มหางานอัจฉริยะสำหรับนักศึกษามหาวิทยาลัยเซนต์ปีเตอร์เบิร์ก 
                พัฒนาโดยเทคโนโลยี AI ที่ทันสมัย
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">เมนูหลัก</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><Link to="/jobs" className="hover:opacity-100 transition-opacity">หางาน</Link></li>
                <li><Link to="/news" className="hover:opacity-100 transition-opacity">ข่าวสาร</Link></li>
                <li><Link to="/activities" className="hover:opacity-100 transition-opacity">กิจกรรม</Link></li>
                <li><Link to="/contact" className="hover:opacity-100 transition-opacity">ติดต่อเรา</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">สำหรับผู้ใช้งาน</h4>
              <ul className="space-y-2 text-sm opacity-80">
                <li><Link to="/register" className="hover:opacity-100 transition-opacity">สมัครสมาชิก</Link></li>
                <li><Link to="/login" className="hover:opacity-100 transition-opacity">เข้าสู่ระบบ</Link></li>
                <li><Link to="/biz/register" className="hover:opacity-100 transition-opacity">สำหรับผู้จ้างงาน</Link></li>
                <li><Link to="/help" className="hover:opacity-100 transition-opacity">ช่วยเหลือ</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm opacity-60">
            <p>&copy; 2024 Saint Peter University. สงวนลิขสิทธิ์.</p>
          </div>
        </div>
      </footer>

      {/* AI Popup */}
      <AIPopup isOpen={showAIPopup} onClose={() => setShowAIPopup(false)} />
    </div>
  );
};

export default Landing;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-primary text-white px-6 py-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">SPU U2B</div>
          <div className="flex gap-4">
            {user ? (
              <Link to="/dashboard">
                <Button variant="secondary" size="sm" className="bg-white text-primary">
                  แดชบอร์ด
                </Button>
              </Link>
            ) : (
              <Button 
                variant="secondary" 
                size="sm"
                onClick={signInWithGoogle}
                disabled={loading}
                className="bg-white text-spu-pink hover:bg-white/90 flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                เข้าสู่ระบบ
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-hero text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">
            แพลตฟอร์ม U2B: มหาวิทยาลัยสู่ธุรกิจ
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            เชื่อมโยงนักศึกษา SPU (ป.ตรี/โท/เอก) กับบริษัท ผ่าน e-Portfolio ที่ได้รับอนุมัติจากคณะ 
            และระบบติดตามผลการทำงานแบบโปร่งใสตั้งแต่สมัครจนผ่านโปรฯ
          </p>
          
          {/* User Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
            <Link to="/job-seeker">
              <Card className="bg-white/10 border-white/20 hover:bg-white/20 transition-all cursor-pointer">
                <CardContent className="pt-6 text-center">
                  <Users className="h-12 w-12 text-white mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">ผู้หางาน</h3>
                  <p className="text-white/80">นักศึกษา SPU ที่ต้องการหางานหรือฝึกงาน</p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/employer">
              <Card className="bg-white/10 border-white/20 hover:bg-white/20 transition-all cursor-pointer">
                <CardContent className="pt-6 text-center">
                  <Building2 className="h-12 w-12 text-white mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">ผู้จ้างงาน</h3>
                  <p className="text-white/80">บริษัทที่ต้องการหาคนเก่งจาก SPU</p>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* AI Assistant Button */}
          <div className="mb-8">
            <Button 
              onClick={() => setShowAIPopup(true)}
              size="lg"
              className="bg-white/20 text-white border border-white/30 hover:bg-white/30 flex items-center gap-2"
            >
              <Brain className="w-5 h-5" />
              <MessageSquare className="w-4 h-4" />
              ถาม SPU Smart AI
            </Button>
          </div>

          <div className="flex gap-4 justify-center">
            {user ? (
              <Link to="/dashboard">
                <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-white/90">
                  เข้าสู่แดชบอร์ด
                  <ArrowRight className="ml-2" />
                </Button>
              </Link>
            ) : (
              <Button 
                variant="secondary" 
                size="lg" 
                onClick={signInWithGoogle}
                disabled={loading}
                className="bg-white text-primary hover:bg-white/90 flex items-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                เข้าสู่ระบบด้วย Google
              </Button>
            )}
            <Link to="/jobs">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                ดูงานทั้งหมด
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="text-center shadow-card">
              <CardContent className="pt-6">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <div className="text-3xl font-bold text-primary">2,500+</div>
                <p className="text-muted-foreground">นักศึกษาที่ได้รับการยืนยัน</p>
              </CardContent>
            </Card>
            <Card className="text-center shadow-card">
              <CardContent className="pt-6">
                <Building2 className="h-12 w-12 text-primary mx-auto mb-4" />
                <div className="text-3xl font-bold text-primary">150+</div>
                <p className="text-muted-foreground">บริษัทพาร์ทเนอร์</p>
              </CardContent>
            </Card>
            <Card className="text-center shadow-card">
              <CardContent className="pt-6">
                <GraduationCap className="h-12 w-12 text-primary mx-auto mb-4" />
                <div className="text-3xl font-bold text-primary">85%</div>
                <p className="text-muted-foreground">อัตราผ่าน Probation</p>
              </CardContent>
            </Card>
            <Card className="text-center shadow-card">
              <CardContent className="pt-6">
                <Star className="h-12 w-12 text-primary mx-auto mb-4" />
                <div className="text-3xl font-bold text-primary">4.8/5</div>
                <p className="text-muted-foreground">คะแนนความพึงพอใจ</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">ทำไมต้องเลือก SPU U2B?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="shadow-card hover:shadow-hover transition-all duration-300">
              <CardHeader>
                <CheckCircle className="h-12 w-12 text-spu-success mb-4" />
                <CardTitle>การยืนยันจากคณะ</CardTitle>
                <CardDescription>
                  e-Portfolio ที่ผ่านการตรวจสอบและอนุมัติจากคณะ เพิ่มความน่าเชื่อถือให้นักศึกษา
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="shadow-card hover:shadow-hover transition-all duration-300">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-primary mb-4" />
                <CardTitle>ติดตามผลงานโปร่งใส</CardTitle>
                <CardDescription>
                  ระบบติดตาม Probation แบบ Real-time พร้อมระบบประเมินผลที่โปร่งใสและเป็นธรรม
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="shadow-card hover:shadow-hover transition-all duration-300">
              <CardHeader>
                <Users className="h-12 w-12 text-accent mb-4" />
                <CardTitle>เชื่อมต่อตรงกับองค์กร</CardTitle>
                <CardDescription>
                  เข้าถึงโอกาสงานและฝึกงานจากบริษัทชั้นนำที่เป็นพาร์ทเนอร์กับ SPU
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">วิธีการใช้งาน</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">สร้าง e-Portfolio</h3>
              <p className="text-muted-foreground">
                กรอกข้อมูลการศึกษา ทักษะ และผลงานของคุณ
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">ขออนุมัติจากคณะ</h3>
              <p className="text-muted-foreground">
                ส่ง Portfolio เพื่อให้คณะตรวจสอบและอนุมัติ
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">สมัครงาน</h3>
              <p className="text-muted-foreground">
                เลือกงานที่ใช่ และสมัครด้วย Portfolio ที่ผ่านการยืนยัน
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-xl font-semibold mb-2">ติดตามผลงาน</h3>
              <p className="text-muted-foreground">
                ผ่านระยะ Probation ด้วยการติดตามที่โปร่งใส
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            พร้อมเริ่มต้นการเรียนรู้และทำงานแล้วหรือยัง?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            เข้าร่วมกับนักศึกษา SPU หลายพันคนที่ได้รับโอกาสทำงานที่ดี
          </p>
          {user ? (
            <Link to="/dashboard">
              <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-white/90">
                เข้าสู่แดชบอร์ด
                <ArrowRight className="ml-2" />
              </Button>
            </Link>
          ) : (
            <Button 
              variant="secondary" 
              size="lg" 
              onClick={signInWithGoogle}
              disabled={loading}
                  className="bg-white text-primary hover:bg-white/90 flex items-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              เริ่มต้นเลย - ฟรี!
            </Button>
          )}
        </div>
      </section>

      {/* New Sections */}
      
      {/* Workshop Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">Workshop & กิจกรรม</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="shadow-card hover:shadow-hover transition-all">
              <CardHeader>
                <BookOpen className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Workshop เขียน CV</CardTitle>
                <CardDescription>
                  เรียนรู้เทคนิคการเขียน CV ที่ดึงดูดใจนายจ้าง
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-primary text-white">สมัครเข้าร่วม</Button>
              </CardContent>
            </Card>
            <Card className="shadow-card hover:shadow-hover transition-all">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Mock Interview</CardTitle>
                <CardDescription>
                  ฝึกสัมภาษณ์งานจริงกับผู้เชี่ยวชาญ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-primary text-white">จองคิว</Button>
              </CardContent>
            </Card>
            <Card className="shadow-card hover:shadow-hover transition-all">
              <CardHeader>
                <Trophy className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Career Fair</CardTitle>
                <CardDescription>
                  งานแสดงสินค้าการงานรายใหญ่ประจำปี
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-primary text-white">ดูรายละเอียด</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">ข่าวสารและประกาศ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="shadow-card">
              <CardContent className="p-0">
                <div className="h-48 bg-gradient-hero rounded-t-lg flex items-center justify-center">
                  <Newspaper className="h-16 w-16 text-white" />
                </div>
                <div className="p-6">
                  <h3 className="font-bold mb-2">เปิดรับสมัครงาน Google Summer of Code</h3>
                  <p className="text-sm text-muted-foreground mb-4">โอกาสดีสำหรับนักศึกษาสาย IT ที่ต้องการประสบการณ์ระดับโลก...</p>
                  <Button size="sm" variant="outline">อ่านต่อ</Button>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardContent className="p-0">
                <div className="h-48 bg-gradient-hero rounded-t-lg flex items-center justify-center">
                  <Trophy className="h-16 w-16 text-white" />
                </div>
                <div className="p-6">
                  <h3 className="font-bold mb-2">รางวัล Outstanding Graduate 2024</h3>
                  <p className="text-sm text-muted-foreground mb-4">ขอแสดงความยินดีกับบัณฑิตที่ได้รับรางวัลยอดเยี่ยม...</p>
                  <Button size="sm" variant="outline">อ่านต่อ</Button>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardContent className="p-0">
                <div className="h-48 bg-gradient-hero rounded-t-lg flex items-center justify-center">
                  <Building2 className="h-16 w-16 text-white" />
                </div>
                <div className="p-6">
                  <h3 className="font-bold mb-2">พาร์ทเนอร์ใหม่: บริษัท TechCorp</h3>
                  <p className="text-sm text-muted-foreground mb-4">ยินดีต้อนรับพาร์ทเนอร์ใหม่ที่เปิดโอกาสการทำงาน...</p>
                  <Button size="sm" variant="outline">อ่านต่อ</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">รูปภาพกิจกรรม</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div key={item} className="aspect-square bg-gradient-hero rounded-lg flex items-center justify-center">
                <Camera className="h-8 w-8 text-white" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">Showcase ผลงานนักศึกษา</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-center mb-2">แอพ E-Commerce</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">พัฒนาโดยนักศึกษาสาย IT</p>
                <Button size="sm" className="w-full bg-primary text-white">ดูผลงาน</Button>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-center mb-2">แคมเปญการตลาด</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">สร้างสรรค์โดยนักศึกษาสาย Marketing</p>
                <Button size="sm" className="w-full bg-primary text-white">ดูผลงาน</Button>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-center mb-2">ระบบ IoT</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">นวัตกรรมจากนักศึกษาวิศวกรรม</p>
                <Button size="sm" className="w-full bg-primary text-white">ดูผลงาน</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">รีวิวจากผู้ใช้งาน</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm mb-4">"ระบบ U2B ช่วยให้ฉันหางานได้ง่ายมาก Portfolio ที่ผ่านการอนุมัติทำให้บริษัทเชื่อถือมากขึ้น"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-hero rounded-full"></div>
                  <div>
                    <p className="font-semibold">สมชาย ใจดี</p>
                    <p className="text-xs text-muted-foreground">นักศึกษาสาย IT</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm mb-4">"เป็นแพลตฟอร์มที่ดีมากสำหรับการหาคนเก่ง นักศึกษาที่ผ่านมาคุณภาพสูงมาก"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-hero rounded-full"></div>
                  <div>
                    <p className="font-semibold">คุณสุดา</p>
                    <p className="text-xs text-muted-foreground">HR Manager</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm mb-4">"ระบบติดตาม Probation ช่วยให้เข้าใจความก้าวหน้าของตัวเองได้ดี"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-hero rounded-full"></div>
                  <div>
                    <p className="font-semibold">สมหญิง ขยัน</p>
                    <p className="text-xs text-muted-foreground">นักศึกษาสาย Marketing</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">SPU U2B</h3>
              <p className="text-white/80">
                แพลตฟอร์มเชื่อมโยงนักศึกษากับโลกธุรกิจ
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">สำหรับนักศึกษา</h4>
              <ul className="space-y-2 text-white/80">
                <li>สร้าง Portfolio</li>
                <li>ค้นหางาน</li>
                <li>ติดตามสถานะ</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">สำหรับองค์กร</h4>
              <ul className="space-y-2 text-white/80">
                <li>โพสต์งาน</li>
                <li>ค้นหาคนเก่ง</li>
                <li>จัดการ Probation</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">ติดต่อเรา</h4>
              <ul className="space-y-2 text-white/80">
                <li>support@spu.ac.th</li>
                <li>02-123-4567</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60">
            <p>&copy; 2024 SPU U2B. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* AI Popup */}
      <AIPopup isOpen={showAIPopup} onClose={() => setShowAIPopup(false)} />
      
      {/* Test AI - Remove this after testing */}
      {user && (
        <div className="fixed bottom-4 right-4 z-50">
          <TestAI />
        </div>
      )}
    </div>
  );
};

export default Landing;