import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Eye, EyeOff, ArrowLeft, Briefcase, Shield, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

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

        // Create profile for new student user
        if (!result.error && result.data?.user) {
          const { error: profileError } = await supabase
            .from("profiles")
            .insert({
              id: result.data.user.id,
              email: formData.email,
              role: "STUDENT",
              verified_student: false,
            });

          if (profileError) {
            console.error("Profile creation error:", profileError);
          }
        }
      }

      if (!result.error) {
        toast({
          title: "สำเร็จ",
          description:
            mode === "login" ? "เข้าสู่ระบบสำเร็จ" : "สร้างบัญชีสำเร็จ กรุณาตรวจสอบอีเมลเพื่อยืนยันบัญชีของคุณ",
        });
      }
    } catch (error) {
      console.error("Auth error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button - Clean Style */}
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 text-foreground hover:text-primary hover:bg-white rounded-2xl px-5 py-2.5 transition-all duration-300 shadow-sm hover:shadow-md border border-border hover:border-primary"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span className="text-sm font-semibold">กลับหน้าหลัก</span>
        </Button>

        {/* Main Card - Clean Design */}
        <Card className="border-2 border-border shadow-xl bg-white rounded-[32px] overflow-hidden">
          <CardHeader className="text-center space-y-6 pt-10 pb-8 px-8 bg-white">
            {/* Logo - Professional & Clean */}
            <div className="mx-auto relative">
              <div className="w-20 h-20 bg-primary rounded-[20px] flex items-center justify-center shadow-lg shadow-primary/30 hover:scale-105 transition-transform duration-300">
                <Briefcase className="w-9 h-9 text-white" strokeWidth={2} />
              </div>
            </div>

            {/* Title - Premium Typography */}
            <div className="space-y-3">
              <CardTitle className="text-[2.75rem] font-bold tracking-tight text-foreground">
                SPU Freelance
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground font-medium">
                แพลตฟอร์มฟรีแลนซ์มืออาชีพ
              </CardDescription>

              {/* Feature badges */}
              <div className="flex items-center justify-center gap-4 pt-2">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Shield className="w-3.5 h-3.5 text-primary" />
                  <span>ปลอดภัย</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-border" />
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Zap className="w-3.5 h-3.5 text-primary" />
                  <span>รวดเร็ว</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-border" />
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Briefcase className="w-3.5 h-3.5 text-primary" />
                  <span>มืออาชีพ</span>
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
                  สมัครสมาชิก
                </TabsTrigger>
              </TabsList>

              {/* Login Form */}
              <TabsContent value="login" className="mt-0">
                <form onSubmit={(e) => handleSubmit(e, "login")} className="space-y-6">
                  <div className="space-y-2.5">
                    <Label htmlFor="email" className="text-sm font-semibold text-foreground">
                      อีเมล
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your.email@spu.ac.th"
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
                <form onSubmit={(e) => handleSubmit(e, "register")} className="space-y-6">
                  <div className="space-y-2.5">
                    <Label htmlFor="register-email" className="text-sm font-semibold text-foreground">
                      อีเมล
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="register-email"
                        name="email"
                        type="email"
                        placeholder="your.email@spu.ac.th"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="h-14 pl-12 bg-muted border-2 border-border rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-300 text-base font-medium placeholder:text-muted-foreground"
                      />
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <Label htmlFor="register-password" className="text-sm font-semibold text-foreground">
                      รหัสผ่าน
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
                    <p className="text-xs text-muted-foreground mt-1">ใช้อย่างน้อย 8 ตัวอักษร มีตัวพิมพ์ใหญ่และตัวเลข</p>
                  </div>

                  <div className="space-y-2.5">
                    <Label htmlFor="confirm-password" className="text-sm font-semibold text-foreground">
                      ยืนยันรหัสผ่าน
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
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl hover:bg-primary/10 transition-colors"
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

                  <Button
                    type="submit"
                    className="w-full h-14 bg-primary hover:bg-primary-hover text-white font-bold rounded-2xl shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300 mt-8 text-base hover:scale-[1.02] active:scale-[0.98]"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                        กำลังสร้างบัญชี...
                      </div>
                    ) : (
                      "สร้างบัญชี"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Divider */}
            <div className="my-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t-2 border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-5 text-muted-foreground font-semibold tracking-wide">หรือดำเนินการด้วย</span>
                </div>
              </div>
            </div>

            {/* Google Sign In */}
            <Button
              variant="outline"
              onClick={signInWithGoogle}
              className="w-full h-14 bg-white hover:bg-muted border-2 border-border hover:border-primary rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg group font-semibold hover:scale-[1.02] active:scale-[0.98]"
              disabled={loading}
            >
              <svg className="h-6 w-6 mr-3" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-foreground">เข้าสู่ระบบด้วย Google</span>
            </Button>

            {/* Terms */}
            <p className="text-center text-xs text-muted-foreground mt-6 leading-relaxed">
              การสมัครใช้งาน คุณยอมรับ{" "}
              <button className="text-primary hover:text-primary-hover font-semibold hover:underline">
                เงื่อนไขการใช้งาน
              </button>{" "}
              และ{" "}
              <button className="text-primary hover:text-primary-hover font-semibold hover:underline">
                นโยบายความเป็นส่วนตัว
              </button>
            </p>
          </CardContent>
        </Card>

        {/* Footer Text */}
        <div className="text-center mt-8 space-y-2">
          <p className="text-sm text-foreground font-medium">🔒 ระบบรักษาความปลอดภัยระดับสูง</p>
          <p className="text-xs text-muted-foreground">
            Powered by <span className="font-bold text-primary">SPU Freelance Platform</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
