import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Building2, GraduationCap, Star, ArrowRight, CheckCircle, TrendingUp, LogIn, Brain, MessageSquare, Camera, Newspaper, Trophy, BookOpen } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import AIPopup from "@/components/AIPopup";
import TestAI from "@/components/TestAI";

const Landing = () => {
  const { user, signInWithGoogle, loading } = useAuth();
  const navigate = useNavigate();
  const [showAIPopup, setShowAIPopup] = useState(false);

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

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