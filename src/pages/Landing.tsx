import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Building2,
  TrendingUp,
  Award,
  Search,
  MapPin,
  Calendar,
  Camera,
  Star,
  ChevronRight,
  Brain,
  Sparkles,
  GraduationCap,
  MessageSquare,
  Trophy,
  BookOpen
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
      excerpt: "มหาวิทยาลัยศรีปทุมจัดงาน Career Fair ครั้งยิ่งใหญ่",
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
    <div className="min-h-screen bg-white">
      {/* Header - Solid White */}
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center shadow-md">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl bg-gradient-primary bg-clip-text text-transparent">
                SPU Smart
              </h1>
              <p className="text-xs text-secondary">Job Platform</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/jobs" className="text-sm font-medium text-secondary hover:text-primary transition-colors">
              หางาน
            </Link>
            <Link to="/news" className="text-sm font-medium text-secondary hover:text-primary transition-colors">
              ข่าวสาร
            </Link>
            <Link to="/activities" className="text-sm font-medium text-secondary hover:text-primary transition-colors">
              กิจกรรม
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAIPopup(true)}
              className="border-primary hover:bg-primary hover:text-white"
            >
              <Brain className="h-4 w-4 mr-2" />
              SPU AI
            </Button>
          </nav>

          <div className="flex items-center gap-2">
            <Link to="/auth">
              <Button variant="outline" size="sm" className="border-secondary text-secondary hover:bg-secondary hover:text-white">
                เข้าสู่ระบบ
              </Button>
            </Link>
            <Link to="/auth">
              <Button className="bg-gradient-primary text-white hover:shadow-pink shadow-md" size="sm">
                สมัครสมาชิก
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section - Solid Colors */}
      <section className="relative py-24 bg-gradient-hero text-white overflow-hidden">
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-primary text-white shadow-md">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Powered by AI
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  หางานใฝ่ฝัน
                  <span className="block text-primary-light">
                    ด้วย AI
                  </span>
                </h1>
                <p className="text-xl text-white max-w-md">
                  แพลตฟอร์มหางานอัจฉริยะสำหรับนักศึกษามหาวิทยาลัยศรีปทุม พร้อมระบบ AI ที่แนะนำงานตรงใจ
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth">
                  <Button size="lg" className="bg-primary hover:bg-primary-hover text-white w-full sm:w-auto shadow-lg">
                    <Users className="h-5 w-5 mr-2" />
                    ฉันเป็นผู้หางาน
                  </Button>
                </Link>
                <Link to="/business-auth">
                  <Button size="lg" variant="outline" className="bg-white text-secondary hover:bg-muted border-white w-full sm:w-auto">
                    <Building2 className="h-5 w-5 mr-2" />
                    ฉันเป็นผู้จ้างงาน
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="text-center">
                  <div className="font-bold text-2xl text-white">2,500+</div>
                  <div className="text-sm text-white">นักศึกษา</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-2xl text-white">500+</div>
                  <div className="text-sm text-white">บริษัท</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-2xl text-white">1,200+</div>
                  <div className="text-sm text-white">ตำแหน่งงาน</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative bg-white rounded-2xl shadow-xl p-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Brain className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-semibold text-secondary">SPU Smart AI</h3>
                      <p className="text-sm text-muted-foreground">ระบบแนะนำงานอัจฉริยะ</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {["วิเคราะห์ทักษะและความสนใจ", "แนะนำงานที่เหมาะสม", "ปรับปรุง Portfolio อัตโนมัติ"].map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <span className="text-sm text-secondary">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    className="w-full bg-gradient-primary text-white hover:shadow-pink shadow-md"
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

      {/* Featured Jobs - Solid Muted Background */}
      <section className="py-16 bg-muted">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary mb-4">งานแนะนำ</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              ตำแหน่งงานที่น่าสนใจและเหมาะสมกับนักศึกษา SPU
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredJobs.map((job, i) => (
              <Card key={i} className="hover:shadow-xl transition-shadow cursor-pointer bg-white border-border">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg text-secondary">{job.title}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1 text-muted-foreground">
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
                    <Badge variant="outline" className="border-border">{job.type}</Badge>
                  </div>

                  <div className="text-lg font-semibold text-primary">
                    {job.salary}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, j) => (
                      <Badge key={j} variant="secondary" className="text-xs bg-muted text-secondary">
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
              <Button variant="outline" size="lg" className="border-secondary text-secondary hover:bg-secondary hover:text-white">
                <Search className="h-4 w-4 mr-2" />
                ดูงานทั้งหมด
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Workshop Section - Solid White Background */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary mb-4">Workshop</h2>
            <p className="text-muted-foreground">
              อบรมเชิงปฏิบัติการเสริมทักษะสำหรับนักศึกษา
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-xl transition-shadow bg-white border-border">
              <CardHeader>
                <BookOpen className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-secondary">Workshop เขียน CV</CardTitle>
                <CardDescription className="text-muted-foreground">
                  เรียนรู้เทคนิคการเขียน CV ที่ดึงดูดใจนายจ้าง
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gradient-primary text-white hover:shadow-pink shadow-md">
                  สมัครเข้าร่วม
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow bg-white border-border">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-secondary">Mock Interview</CardTitle>
                <CardDescription className="text-muted-foreground">
                  ฝึกสัมภาษณ์งานจริงกับผู้เชี่ยวชาญ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gradient-primary text-white hover:shadow-pink shadow-md">
                  จองคิว
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow bg-white border-border">
              <CardHeader>
                <Trophy className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-secondary">Career Fair</CardTitle>
                <CardDescription className="text-muted-foreground">
                  งานแสดงสินค้าการงานรายใหญ่ประจำปี
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-gradient-primary text-white hover:shadow-pink shadow-md">
                  ดูรายละเอียด
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* News & Activities - Solid Muted */}
      <section className="py-16 bg-muted">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary mb-4">ข่าวสารและกิจกรรม</h2>
            <p className="text-muted-foreground">
              อัปเดตข่าวสารและกิจกรรมล่าสุดจาก SPU
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsItems.map((item, i) => (
              <Card key={i} className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer bg-white border-border">
                <div className="aspect-video bg-muted flex items-center justify-center border-b">
                  <Camera className="h-8 w-8 text-muted-foreground" />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="text-xs border-border">
                      {item.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {item.date}
                    </span>
                  </div>
                  <CardTitle className="text-lg leading-tight text-secondary">{item.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">{item.excerpt}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Showcase - Solid White */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary mb-4">รูปภาพกิจกรรม</h2>
            <p className="text-muted-foreground">
              บรรยากาศงานและกิจกรรมต่างๆ ของ SPU
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1,2,3,4].map((i) => (
              <div key={i} className="aspect-square bg-muted rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow border border-border">
                <div className="w-full h-full flex items-center justify-center">
                  <Camera className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase Section - Solid Muted */}
      <section className="py-16 bg-muted">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary mb-4">Showcase</h2>
            <p className="text-muted-foreground">
              ผลงานเด่นและความสำเร็จของนักศึกษา SPU
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6 bg-white border-border shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <Award className="h-12 w-12 text-primary" />
                <div>
                  <h3 className="font-bold text-lg text-secondary">นักศึกษาได้รับรางวัล</h3>
                  <p className="text-muted-foreground">Outstanding Student Award 2024</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                นักศึกษา SPU คว้ารางวัลเด่นระดับประเทศจากโครงการ Innovation Challenge
              </p>
            </Card>

            <Card className="p-6 bg-white border-border shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <TrendingUp className="h-12 w-12 text-primary" />
                <div>
                  <h3 className="font-bold text-lg text-secondary">อัตราได้งาน</h3>
                  <p className="text-muted-foreground">85% ภายใน 3 เดือน</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                บัณฑิต SPU มีอัตราการได้งานที่สูงกว่าค่าเฉลี่ยระดับประเทศ
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* User Reviews - Solid White */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary mb-4">รีวิวจากผู้ใช้งาน</h2>
            <p className="text-muted-foreground">
              เสียงสะท้อนจากนักศึกษาและบัณฑิตที่ประสบความสำเร็จ
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <Card key={i} className="p-6 bg-white border-border shadow-md">
                <CardContent className="space-y-4 p-0">
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>

                  <p className="text-sm leading-relaxed text-muted-foreground">{testimonial.content}</p>

                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center border border-border">
                      <Users className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <div className="font-medium text-sm text-secondary">{testimonial.name}</div>
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

      {/* Footer - Solid Dark Blue */}
      <footer className="bg-gradient-footer text-white py-12 mt-16">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center shadow-md">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-xl">SPU Smart</h3>
                  <p className="text-sm">Job Platform</p>
                </div>
              </div>
              <p className="text-sm max-w-sm">
                แพลตฟอร์มหางานอัจฉริยะสำหรับนักศึกษามหาวิทยาลัยศรีปทุม
                พัฒนาโดยเทคโนโลยี AI ที่ทันสมัย
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">เมนูหลัก</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/jobs" className="hover:text-primary transition-colors">หางาน</Link></li>
                <li><Link to="/news" className="hover:text-primary transition-colors">ข่าวสาร</Link></li>
                <li><Link to="/activities" className="hover:text-primary transition-colors">กิจกรรม</Link></li>
                <li><Link to="/contact" className="hover:text-primary transition-colors">ติดต่อเรา</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">สำหรับผู้ใช้งาน</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/auth" className="hover:text-primary transition-colors">สมัครสมาชิก</Link></li>
                <li><Link to="/auth" className="hover:text-primary transition-colors">เข้าสู่ระบบ</Link></li>
                <li><Link to="/business-auth" className="hover:text-primary transition-colors">สำหรับผู้จ้างงาน</Link></li>
                <li><Link to="/help" className="hover:text-primary transition-colors">ช่วยเหลือ</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white mt-8 pt-8 text-center text-sm">
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
