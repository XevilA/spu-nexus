import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  Mail,
  Eye,
  EyeOff,
  ArrowLeft,
  FileText,
  Phone,
  Globe,
  MapPin,
  CheckCircle2,
  Shield,
  Zap,
  Award,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const BusinessAuth = () => {
  const { signInWithEmail, signUpWithEmail, user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    businessType: "",
    registrationNumber: "",
    contactPerson: "",
    contactPhone: "",
    website: "",
    address: "",
    description: "",
  });

  useEffect(() => {
    if (user && profile) {
      // Redirect based on user role
      switch (profile.role) {
        case "STUDENT":
          navigate("/student");
          break;
        case "COMPANY_HR":
          navigate("/business");
          break;
        case "ADMIN":
          navigate("/admin");
          break;
        case "FACULTY_APPROVER":
          navigate("/admin");
          break;
        default:
          navigate("/");
      }
    }
  }, [user, profile, navigate]);

  const handleSubmit = async (e: React.FormEvent, mode: "login" | "register") => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "register" && formData.password !== formData.confirmPassword) {
        toast({
          title: "ข้อผิดพลาด",
          description: "รหัสผ่านไม่ตรงกัน",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      let result;
      if (mode === "login") {
        result = await signInWithEmail(formData.email, formData.password);
      } else {
        result = await signUpWithEmail(formData.email, formData.password);

        if (!result.error && result.data?.user) {
          // Create profile for business user
          const { error: profileError } = await supabase
            .from("profiles")
            .insert({
              id: result.data.user.id,
              email: formData.email,
              role: "COMPANY_HR",
              display_name: formData.contactPerson,
            });

          if (profileError) {
            console.error("Profile creation error:", profileError);
            toast({
              title: "ข้อผิดพลาด",
              description: "ไม่สามารถสร้างโปรไฟล์ได้",
              variant: "destructive",
            });
            setLoading(false);
            return;
          }

          // Create company
          const { error: companyError } = await supabase.from("companies").insert({
            name: formData.companyName,
            hr_owner_uid: result.data.user.id,
            domain: formData.website,
            verified: false,
          });

          if (companyError) {
            console.error("Company creation error:", companyError);
            toast({
              title: "ข้อผิดพลาด",
              description: "ไม่สามารถสร้างข้อมูลบริษัทได้",
              variant: "destructive",
            });
          }
        }
      }

      if (!result.error) {
        toast({
          title: "สำเร็จ",
          description: mode === "login" ? "เข้าสู่ระบบสำเร็จ" : "ลงทะเบียนสำเร็จ กรุณาตรวจสอบอีเมลเพื่อยืนยันบัญชี",
        });
      }
    } catch (error) {
      console.error("Auth error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 text-foreground hover:text-primary hover:bg-white rounded-2xl px-5 py-2.5 transition-all duration-300 shadow-sm hover:shadow-md border border-border hover:border-primary"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span className="text-sm font-semibold">กลับหน้าหลัก</span>
        </Button>

        {/* Main Card */}
        <Card className="border-2 border-border shadow-xl bg-white rounded-[32px] overflow-hidden">
          <CardHeader className="text-center space-y-6 pt-10 pb-8 px-8 bg-white">
            {/* Logo */}
            <div className="mx-auto relative">
              <div className="w-20 h-20 bg-primary rounded-[20px] flex items-center justify-center shadow-lg shadow-primary/30 hover:scale-105 transition-transform duration-300">
                <Building2 className="w-9 h-9 text-white" strokeWidth={2} />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-3">
              <CardTitle className="text-[2.75rem] font-bold tracking-tight text-foreground">
                SPU Business
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground font-medium">
                ระบบจัดการงานสำหรับธุรกิจและบริษัทมืออาชีพ
              </CardDescription>

              {/* Feature badges */}
              <div className="flex items-center justify-center gap-4 pt-2">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Shield className="w-3.5 h-3.5 text-primary" />
                  <span>ตรวจสอบแล้ว</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-border" />
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Zap className="w-3.5 h-3.5 text-primary" />
                  <span>รวดเร็ว</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-border" />
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Award className="w-3.5 h-3.5 text-primary" />
                  <span>เชื่อถือได้</span>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="px-8 pb-10">
            <Tabs defaultValue="login" className="w-full">
              {/* Tab Selector */}
              <TabsList className="grid w-full grid-cols-2 bg-muted p-1.5 rounded-[20px] mb-8 border border-border">
                <TabsTrigger
                  value="login"
                  className="rounded-[16px] data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-primary text-muted-foreground font-semibold transition-all duration-300 py-3"
                >
                  เข้าสู่ระบบ
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="rounded-[16px] data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-primary text-muted-foreground font-semibold transition-all duration-300 py-3"
                >
                  ลงทะเบียนธุรกิจ
                </TabsTrigger>
              </TabsList>

              {/* Login Form */}
              <TabsContent value="login" className="mt-0">
                <form onSubmit={(e) => handleSubmit(e, "login")} className="space-y-6">
                  <div className="space-y-2.5">
                    <Label htmlFor="email" className="text-sm font-semibold text-foreground">
                      อีเมลบริษัท
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="business@company.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="h-14 pl-12 bg-muted border-2 border-border rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-300 text-base font-medium placeholder:text-muted-foreground"
                      />
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <Label htmlFor="password" className="text-sm font-semibold text-foreground">
                      รหัสผ่าน
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="h-14 bg-muted border-2 border-border rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-300 pr-14 text-base font-medium"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl hover:bg-primary/10 transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <Eye className="h-5 w-5 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-14 bg-primary hover:bg-primary-hover text-white font-bold rounded-2xl shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 mt-8 text-base hover:scale-[1.02] active:scale-[0.98]"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                        กำลังเข้าสู่ระบบ...
                      </div>
                    ) : (
                      "เข้าสู่ระบบ"
                    )}
                  </Button>

                  <div className="text-center">
                    <button
                      type="button"
                      className="text-sm text-primary hover:text-primary-hover font-semibold hover:underline transition-colors"
                    >
                      ลืมรหัสผ่าน?
                    </button>
                  </div>
                </form>
              </TabsContent>

              {/* Register Form */}
              <TabsContent value="register" className="mt-0">
                <form onSubmit={(e) => handleSubmit(e, "register")} className="space-y-8">
                  {/* Account Information Section */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-3 border-b-2 border-border">
                      <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/30">
                        <Mail className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground">ข้อมูลการเข้าสู่ระบบ</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                      <div className="space-y-2.5">
                        <Label htmlFor="register-email" className="text-sm font-semibold text-foreground">
                          อีเมลบริษัท *
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                          <Input
                            id="register-email"
                            name="email"
                            type="email"
                            placeholder="business@company.com"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="h-14 pl-12 bg-muted border-2 border-border rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-300 text-base font-medium"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2.5">
                          <Label htmlFor="register-password" className="text-sm font-semibold text-foreground">
                            รหัสผ่าน *
                          </Label>
                          <div className="relative">
                            <Input
                              id="register-password"
                              name="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="สร้างรหัสผ่านที่แข็งแรง"
                              value={formData.password}
                              onChange={handleInputChange}
                              required
                              className="h-14 bg-muted border-2 border-border rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-300 pr-14 text-base font-medium"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl hover:bg-primary/10"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-5 w-5 text-muted-foreground" />
                              ) : (
                                <Eye className="h-5 w-5 text-muted-foreground" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2.5">
                          <Label htmlFor="confirm-password" className="text-sm font-semibold text-foreground">
                            ยืนยันรหัสผ่าน *
                          </Label>
                          <div className="relative">
                            <Input
                              id="confirm-password"
                              name="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="ยืนยันรหัสผ่านอีกครั้ง"
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                              required
                              className="h-14 bg-muted border-2 border-border rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-300 pr-14 text-base font-medium"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl hover:bg-primary/10"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-5 w-5 text-muted-foreground" />
                              ) : (
                                <Eye className="h-5 w-5 text-muted-foreground" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Business Information Section */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-3 border-b-2 border-border">
                      <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/30">
                        <Building2 className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground">ข้อมูลบริษัท</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2.5">
                        <Label htmlFor="companyName" className="text-sm font-semibold text-foreground">
                          ชื่อบริษัท *
                        </Label>
                        <Input
                          id="companyName"
                          name="companyName"
                          placeholder="บริษัท ABC จำกัด"
                          value={formData.companyName}
                          onChange={handleInputChange}
                          required
                          className="h-14 bg-muted border-2 border-border rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-300 text-base font-medium"
                        />
                      </div>

                      <div className="space-y-2.5">
                        <Label htmlFor="businessType" className="text-sm font-semibold text-foreground">
                          ประเภทธุรกิจ *
                        </Label>
                        <Input
                          id="businessType"
                          name="businessType"
                          placeholder="เทคโนโลยี, การผลิต, การศึกษา..."
                          value={formData.businessType}
                          onChange={handleInputChange}
                          required
                          className="h-14 bg-muted border-2 border-border rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-300 text-base font-medium"
                        />
                      </div>

                      <div className="space-y-2.5">
                        <Label htmlFor="registrationNumber" className="text-sm font-semibold text-foreground">
                          เลขทะเบียนบริษัท
                        </Label>
                        <Input
                          id="registrationNumber"
                          name="registrationNumber"
                          placeholder="0123456789012"
                          value={formData.registrationNumber}
                          onChange={handleInputChange}
                          className="h-14 bg-muted border-2 border-border rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-300 text-base font-medium"
                        />
                      </div>

                      <div className="space-y-2.5">
                        <Label htmlFor="contactPerson" className="text-sm font-semibold text-foreground">
                          ผู้รับผิดชอบ *
                        </Label>
                        <Input
                          id="contactPerson"
                          name="contactPerson"
                          placeholder="คุณสมชาย ใจดี"
                          value={formData.contactPerson}
                          onChange={handleInputChange}
                          required
                          className="h-14 bg-muted border-2 border-border rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-300 text-base font-medium"
                        />
                      </div>

                      <div className="space-y-2.5">
                        <Label htmlFor="contactPhone" className="text-sm font-semibold text-foreground">
                          <Phone className="inline w-4 h-4 mr-1" />
                          เบอร์ติดต่อ *
                        </Label>
                        <Input
                          id="contactPhone"
                          name="contactPhone"
                          placeholder="02-XXX-XXXX"
                          value={formData.contactPhone}
                          onChange={handleInputChange}
                          required
                          className="h-14 bg-muted border-2 border-border rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-300 text-base font-medium"
                        />
                      </div>

                      <div className="space-y-2.5">
                        <Label htmlFor="website" className="text-sm font-semibold text-foreground">
                          <Globe className="inline w-4 h-4 mr-1" />
                          เว็บไซต์
                        </Label>
                        <Input
                          id="website"
                          name="website"
                          placeholder="https://company.com"
                          value={formData.website}
                          onChange={handleInputChange}
                          className="h-14 bg-muted border-2 border-border rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-300 text-base font-medium"
                        />
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      <Label htmlFor="address" className="text-sm font-semibold text-foreground">
                        <MapPin className="inline w-4 h-4 mr-1" />
                        ที่อยู่บริษัท
                      </Label>
                      <Textarea
                        id="address"
                        name="address"
                        placeholder="123/45 ถนน... แขวง... เขต... กรุงเทพฯ 10110"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="bg-muted border-2 border-border rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-300 min-h-20 text-base font-medium"
                      />
                    </div>

                    <div className="space-y-2.5">
                      <Label htmlFor="description" className="text-sm font-semibold text-foreground">
                        <FileText className="inline w-4 h-4 mr-1" />
                        รายละเอียดบริษัท
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="บอกเล่าเกี่ยวกับบริษัทของคุณ วิสัยทัศน์ และสิ่งที่ทำให้บริษัทคุณโดดเด่น..."
                        value={formData.description}
                        onChange={handleInputChange}
                        className="bg-muted border-2 border-border rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-300 min-h-28 text-base font-medium"
                      />
                    </div>
                  </div>

                  {/* Info Box */}
                  <div className="bg-gradient-to-br from-muted to-muted p-6 rounded-[20px] border-2 border-border">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center shrink-0 shadow-md shadow-pink-500/30">
                        <CheckCircle2 className="h-5 w-5 text-white" />
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-bold text-foreground text-lg">ขั้นตอนหลังจากลงทะเบียน</h4>
                        <ul className="space-y-2 text-foreground">
                          <li className="flex items-start gap-2">
                            <span className="text-primary font-bold">1.</span>
                            <span>ผู้ดูแลระบบจะตรวจสอบข้อมูลบริษัทภายใน 24-48 ชั่วโมง</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-primary font-bold">2.</span>
                            <span>รับการยืนยันทางอีเมลเมื่อบัญชีได้รับการอนุมัติ</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-primary font-bold">3.</span>
                            <span>เริ่มโพสต์งาน ค้นหาฟรีแลนซ์ และจัดการโปรเจกต์ได้ทันที</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-14 bg-primary hover:bg-primary-hover text-white font-bold rounded-2xl shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 text-base hover:scale-[1.02] active:scale-[0.98]"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                        กำลังลงทะเบียน...
                      </div>
                    ) : (
                      "ลงทะเบียนบริษัท"
                    )}
                  </Button>

                  {/* Terms */}
                  <p className="text-center text-xs text-muted-foreground leading-relaxed">
                    การลงทะเบียน คุณยอมรับ{" "}
                    <button className="text-primary hover:text-primary-hover font-semibold hover:underline">
                      เงื่อนไขการใช้งาน
                    </button>{" "}
                    และ{" "}
                    <button className="text-primary hover:text-primary-hover font-semibold hover:underline">
                      นโยบายความเป็นส่วนตัว
                    </button>
                  </p>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 space-y-2">
          <p className="text-sm text-foreground font-medium">🔒 ข้อมูลได้รับการเข้ารหัสและปกป้องอย่างปลอดภัย</p>
          <p className="text-xs text-muted-foreground">
            Powered by <span className="font-bold text-primary">SPU Freelance Platform</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BusinessAuth;
