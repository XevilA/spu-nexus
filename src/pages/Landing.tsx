import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Building2, GraduationCap, Star, ArrowRight, CheckCircle, TrendingUp, LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

const Landing = () => {
  const { user, signInWithGoogle, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-spu-pink text-white px-6 py-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">SPU U2B</div>
          <div className="flex gap-4">
            {user ? (
              <Link to="/dashboard">
                <Button variant="secondary" size="sm" className="bg-white text-spu-pink">
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
          <div className="flex gap-4 justify-center">
            {user ? (
              <Link to="/dashboard">
                <Button variant="secondary" size="lg" className="bg-white text-spu-pink hover:bg-white/90">
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
                className="bg-white text-spu-pink hover:bg-white/90 flex items-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                เข้าสู่ระบบด้วย Google
              </Button>
            )}
            <Link to="/jobs">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-spu-pink">
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
                <Users className="h-12 w-12 text-spu-pink mx-auto mb-4" />
                <div className="text-3xl font-bold text-spu-pink">2,500+</div>
                <p className="text-muted-foreground">นักศึกษาที่ได้รับการยืนยัน</p>
              </CardContent>
            </Card>
            <Card className="text-center shadow-card">
              <CardContent className="pt-6">
                <Building2 className="h-12 w-12 text-spu-pink mx-auto mb-4" />
                <div className="text-3xl font-bold text-spu-pink">150+</div>
                <p className="text-muted-foreground">บริษัทพาร์ทเนอร์</p>
              </CardContent>
            </Card>
            <Card className="text-center shadow-card">
              <CardContent className="pt-6">
                <GraduationCap className="h-12 w-12 text-spu-pink mx-auto mb-4" />
                <div className="text-3xl font-bold text-spu-pink">85%</div>
                <p className="text-muted-foreground">อัตราผ่าน Probation</p>
              </CardContent>
            </Card>
            <Card className="text-center shadow-card">
              <CardContent className="pt-6">
                <Star className="h-12 w-12 text-spu-pink mx-auto mb-4" />
                <div className="text-3xl font-bold text-spu-pink">4.8/5</div>
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
                <TrendingUp className="h-12 w-12 text-spu-pink mb-4" />
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
              <div className="w-16 h-16 bg-spu-pink text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">สร้าง e-Portfolio</h3>
              <p className="text-muted-foreground">
                กรอกข้อมูลการศึกษา ทักษะ และผลงานของคุณ
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-spu-pink text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">ขออนุมัติจากคณะ</h3>
              <p className="text-muted-foreground">
                ส่ง Portfolio เพื่อให้คณะตรวจสอบและอนุมัติ
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-spu-pink text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">สมัครงาน</h3>
              <p className="text-muted-foreground">
                เลือกงานที่ใช่ และสมัครด้วย Portfolio ที่ผ่านการยืนยัน
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-spu-pink text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
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
              <Button variant="secondary" size="lg" className="bg-white text-spu-pink hover:bg-white/90">
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
              className="bg-white text-spu-pink hover:bg-white/90 flex items-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              เริ่มต้นเลย - ฟรี!
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-spu-pink text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">SPU U2B</h3>
              <p className="opacity-80">
                แพลตฟอร์มเชื่อมโยงนักศึกษากับโลกธุรกิจ
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">สำหรับนักศึกษา</h4>
              <ul className="space-y-2 opacity-80">
                <li>สร้าง Portfolio</li>
                <li>ค้นหางาน</li>
                <li>ติดตามสถานะ</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">สำหรับองค์กร</h4>
              <ul className="space-y-2 opacity-80">
                <li>โพสต์งาน</li>
                <li>ค้นหาคนเก่ง</li>
                <li>จัดการ Probation</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">ติดต่อเรา</h4>
              <ul className="space-y-2 opacity-80">
                <li>support@spu.ac.th</li>
                <li>02-123-4567</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center opacity-80">
            <p>&copy; 2024 SPU U2B. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;