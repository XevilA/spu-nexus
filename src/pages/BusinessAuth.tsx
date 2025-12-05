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
  Phone,
  Globe,
  MapPin,
  Shield,
  Zap,
  Award,
  User,
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
      switch (profile.role) {
        case "STUDENT":
          navigate("/student-dashboard");
          break;
        case "COMPANY_HR":
          navigate("/business-dashboard");
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
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full"></div>
      </div>

      <div className="w-full max-w-3xl relative z-10 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 text-white/70 hover:text-white hover:bg-white/10 rounded-xl"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">กลับหน้าหลัก</span>
        </Button>

        {/* Main Card */}
        <Card className="border-0 bg-[#2a2a2a]/80 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10">
          <CardHeader className="text-center space-y-4 pt-8 pb-6 px-8">
            {/* Logo */}
            <div className="mx-auto">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
                <Building2 className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <CardTitle className="text-3xl font-black">
                <span className="text-white">SPU </span>
                <span className="text-primary">Business</span>
              </CardTitle>
              <CardDescription className="text-white/60">
                ระบบจัดการงานสำหรับธุรกิจและบริษัท
              </CardDescription>

              {/* Feature badges */}
              <div className="flex items-center justify-center gap-4 pt-2">
                <div className="flex items-center gap-1.5 text-xs text-white/50">
                  <Shield className="w-3.5 h-3.5 text-primary" />
                  <span>ตรวจสอบแล้ว</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-white/30" />
                <div className="flex items-center gap-1.5 text-xs text-white/50">
                  <Zap className="w-3.5 h-3.5 text-primary" />
                  <span>รวดเร็ว</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-white/30" />
                <div className="flex items-center gap-1.5 text-xs text-white/50">
                  <Award className="w-3.5 h-3.5 text-primary" />
                  <span>เชื่อถือได้</span>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            <Tabs defaultValue="login" className="w-full">
              {/* Tab Selector */}
              <TabsList className="grid w-full grid-cols-2 bg-[#1a1a1a] p-1.5 rounded-xl mb-6">
                <TabsTrigger
                  value="login"
                  className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white text-white/60 font-medium transition-all"
                >
                  เข้าสู่ระบบ
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white text-white/60 font-medium transition-all"
                >
                  ลงทะเบียนธุรกิจ
                </TabsTrigger>
              </TabsList>

              {/* Login Form */}
              <TabsContent value="login" className="mt-0">
                <form onSubmit={(e) => handleSubmit(e, "login")} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-white/80">
                      อีเมลบริษัท
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="business@company.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="h-12 pl-12 bg-[#1a1a1a] border-white/10 rounded-xl text-white placeholder:text-white/40 focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-white/80">
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
                        className="h-12 bg-[#1a1a1a] border-white/10 rounded-xl text-white pr-12 focus:border-primary"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-white/40 hover:text-white hover:bg-white/10"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        กำลังเข้าสู่ระบบ...
                      </div>
                    ) : (
                      "เข้าสู่ระบบ"
                    )}
                  </Button>

                  <div className="text-center">
                    <button type="button" className="text-sm text-primary hover:underline">
                      ลืมรหัสผ่าน?
                    </button>
                  </div>
                </form>
              </TabsContent>

              {/* Register Form */}
              <TabsContent value="register" className="mt-0">
                <form onSubmit={(e) => handleSubmit(e, "register")} className="space-y-6">
                  {/* Account Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 pb-2 border-b border-white/10">
                      <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                        <Mail className="h-4 w-4 text-primary" />
                      </div>
                      <h3 className="text-lg font-bold text-white">ข้อมูลการเข้าสู่ระบบ</h3>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-white/80">อีเมลบริษัท *</Label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        <Input
                          name="email"
                          type="email"
                          placeholder="business@company.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="h-12 pl-12 bg-[#1a1a1a] border-white/10 rounded-xl text-white placeholder:text-white/40 focus:border-primary"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-white/80">รหัสผ่าน *</Label>
                        <div className="relative">
                          <Input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="สร้างรหัสผ่าน"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            className="h-12 bg-[#1a1a1a] border-white/10 rounded-xl text-white pr-12 focus:border-primary"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-white/40 hover:text-white hover:bg-white/10"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-white/80">ยืนยันรหัสผ่าน *</Label>
                        <div className="relative">
                          <Input
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="ยืนยันรหัสผ่าน"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            required
                            className="h-12 bg-[#1a1a1a] border-white/10 rounded-xl text-white pr-12 focus:border-primary"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-white/40 hover:text-white hover:bg-white/10"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Company Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 pb-2 border-b border-white/10">
                      <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                        <Building2 className="h-4 w-4 text-primary" />
                      </div>
                      <h3 className="text-lg font-bold text-white">ข้อมูลบริษัท</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-white/80">ชื่อบริษัท *</Label>
                        <div className="relative">
                          <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                          <Input
                            name="companyName"
                            placeholder="ชื่อบริษัท"
                            value={formData.companyName}
                            onChange={handleInputChange}
                            required
                            className="h-12 pl-12 bg-[#1a1a1a] border-white/10 rounded-xl text-white placeholder:text-white/40 focus:border-primary"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-white/80">ผู้ติดต่อ *</Label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                          <Input
                            name="contactPerson"
                            placeholder="ชื่อผู้ติดต่อ"
                            value={formData.contactPerson}
                            onChange={handleInputChange}
                            required
                            className="h-12 pl-12 bg-[#1a1a1a] border-white/10 rounded-xl text-white placeholder:text-white/40 focus:border-primary"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-white/80">เบอร์โทรศัพท์</Label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                          <Input
                            name="contactPhone"
                            placeholder="0XX-XXX-XXXX"
                            value={formData.contactPhone}
                            onChange={handleInputChange}
                            className="h-12 pl-12 bg-[#1a1a1a] border-white/10 rounded-xl text-white placeholder:text-white/40 focus:border-primary"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-white/80">เว็บไซต์</Label>
                        <div className="relative">
                          <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                          <Input
                            name="website"
                            placeholder="https://company.com"
                            value={formData.website}
                            onChange={handleInputChange}
                            className="h-12 pl-12 bg-[#1a1a1a] border-white/10 rounded-xl text-white placeholder:text-white/40 focus:border-primary"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-white/80">ที่อยู่บริษัท</Label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-4 w-5 h-5 text-white/40" />
                        <Textarea
                          name="address"
                          placeholder="ที่อยู่บริษัท"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="min-h-[80px] pl-12 bg-[#1a1a1a] border-white/10 rounded-xl text-white placeholder:text-white/40 focus:border-primary resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        กำลังลงทะเบียน...
                      </div>
                    ) : (
                      "ลงทะเบียนธุรกิจ"
                    )}
                  </Button>

                  <p className="text-center text-white/40 text-sm">
                    หลังจากลงทะเบียน ทีมงานจะตรวจสอบและยืนยันบัญชีภายใน 24-48 ชั่วโมง
                  </p>
                </form>
              </TabsContent>
            </Tabs>

            {/* Student Link */}
            <div className="mt-6 pt-6 border-t border-white/10 text-center">
              <p className="text-white/50 text-sm mb-3">สำหรับนักศึกษา</p>
              <Button
                variant="outline"
                onClick={() => navigate("/auth")}
                className="border-white/20 text-white hover:bg-white/10 rounded-xl"
              >
                เข้าสู่ระบบนักศึกษา
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusinessAuth;
