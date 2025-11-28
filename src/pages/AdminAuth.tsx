import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Eye, EyeOff, ArrowLeft, Lock, Mail, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AdminAuth = () => {
  const { signInWithEmail, signUpWithEmail, user, profile } = useAuth();
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
        case "ADMIN":
          navigate("/admin");
          break;
        case "FACULTY_APPROVER":
          navigate("/admin");
          break;
        case "STUDENT":
          navigate("/student");
          break;
        case "COMPANY_HR":
          navigate("/business");
          break;
        default:
          navigate("/");
      }
    }
  }, [user, profile, navigate]);

  const checkAdminWhitelist = async (email: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from("admin_whitelist")
      .select("*")
      .eq("email", email)
      .eq("active", true)
      .single();

    if (error || !data) {
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent, mode: "login" | "register") => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if email is in admin whitelist
      const isWhitelisted = await checkAdminWhitelist(formData.email);

      if (!isWhitelisted) {
        toast({
          title: "ไม่มีสิทธิ์เข้าถึง",
          description: "อีเมลนี้ไม่ได้รับอนุญาตให้เข้าถึงระบบผู้ดูแล กรุณาติดต่อผู้ดูแลระบบ",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

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

        // Create profile for admin user
        if (!result.error && result.data?.user) {
          const { error: profileError } = await supabase
            .from("profiles")
            .insert({
              id: result.data.user.id,
              email: formData.email,
              role: "ADMIN",
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
        }
      }

      if (!result.error) {
        toast({
          title: "สำเร็จ",
          description:
            mode === "login"
              ? "เข้าสู่ระบบสำเร็จ"
              : "สร้างบัญชีสำเร็จ กรุณาตรวจสอบอีเมลเพื่อยืนยันบัญชีของคุณ",
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
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 text-white hover:text-white hover:bg-white/10 rounded-2xl px-5 py-2.5 transition-all duration-300 shadow-sm hover:shadow-md border border-white/20 hover:border-white/40"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span className="text-sm font-semibold">กลับหน้าหลัก</span>
        </Button>

        {/* Main Card */}
        <Card className="border-2 border-white/20 shadow-2xl bg-white rounded-[32px] overflow-hidden">
          <CardHeader className="text-center space-y-6 pt-10 pb-8 px-8 bg-white">
            {/* Logo */}
            <div className="mx-auto relative">
              <div className="w-20 h-20 bg-secondary rounded-[20px] flex items-center justify-center shadow-lg shadow-secondary/30 hover:scale-105 transition-transform duration-300">
                <Shield className="w-9 h-9 text-white" strokeWidth={2} />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-3">
              <CardTitle className="text-[2.75rem] font-bold tracking-tight text-foreground">
                ระบบผู้ดูแล
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground font-medium">
                เข้าสู่ระบบจัดการสำหรับผู้ดูแล
              </CardDescription>

              {/* Feature badges */}
              <div className="flex items-center justify-center gap-4 pt-2">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
                  <span>ปลอดภัย</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-border" />
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Lock className="w-3.5 h-3.5 text-secondary" />
                  <span>เข้ารหัส</span>
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
                  className="rounded-[16px] data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-secondary text-muted-foreground font-semibold transition-all duration-300 py-3"
                >
                  เข้าสู่ระบบ
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="rounded-[16px] data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-secondary text-muted-foreground font-semibold transition-all duration-300 py-3"
                >
                  สร้างบัญชี
                </TabsTrigger>
              </TabsList>

              {/* Login Form */}
              <TabsContent value="login" className="mt-0">
                <form onSubmit={(e) => handleSubmit(e, "login")} className="space-y-6">
                  <div className="space-y-2.5">
                    <Label htmlFor="email" className="text-sm font-semibold text-foreground">
                      อีเมลผู้ดูแล
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="admin@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="h-14 pl-12 bg-muted border-2 border-border rounded-2xl focus:bg-white focus:border-secondary focus:ring-4 focus:ring-secondary/20 transition-all duration-300 text-base font-medium placeholder:text-muted-foreground"
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
                        className="h-14 bg-muted border-2 border-border rounded-2xl focus:bg-white focus:border-secondary focus:ring-4 focus:ring-secondary/20 transition-all duration-300 pr-14 text-base font-medium"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl hover:bg-secondary/10 transition-colors"
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
                    className="w-full h-14 bg-secondary hover:bg-secondary/90 text-white font-bold rounded-2xl shadow-lg shadow-secondary/30 hover:shadow-xl hover:shadow-secondary/40 transition-all duration-300 mt-8 text-base hover:scale-[1.02] active:scale-[0.98]"
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
                </form>
              </TabsContent>

              {/* Register Form */}
              <TabsContent value="register" className="mt-0">
                <form onSubmit={(e) => handleSubmit(e, "register")} className="space-y-6">
                  <div className="bg-secondary/10 border-2 border-secondary/20 rounded-2xl p-4 mb-6">
                    <p className="text-sm text-foreground flex items-start gap-2">
                      <ShieldCheck className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                      <span>
                        การสร้างบัญชีผู้ดูแลจำเป็นต้องมีอีเมลที่ได้รับอนุญาต
                        กรุณาติดต่อผู้ดูแลระบบหากคุณต้องการเพิ่มอีเมลของคุณในรายการ
                      </span>
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <Label htmlFor="register-email" className="text-sm font-semibold text-foreground">
                      อีเมลผู้ดูแล *
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="register-email"
                        name="email"
                        type="email"
                        placeholder="admin@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="h-14 pl-12 bg-muted border-2 border-border rounded-2xl focus:bg-white focus:border-secondary focus:ring-4 focus:ring-secondary/20 transition-all duration-300 text-base font-medium placeholder:text-muted-foreground"
                      />
                    </div>
                  </div>

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
                        className="h-14 bg-muted border-2 border-border rounded-2xl focus:bg-white focus:border-secondary focus:ring-4 focus:ring-secondary/20 transition-all duration-300 pr-14 text-base font-medium"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl hover:bg-secondary/10 transition-colors"
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
                        className="h-14 bg-muted border-2 border-border rounded-2xl focus:bg-white focus:border-secondary focus:ring-4 focus:ring-secondary/20 transition-all duration-300 pr-14 text-base font-medium"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl hover:bg-secondary/10 transition-colors"
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
                    className="w-full h-14 bg-secondary hover:bg-secondary/90 text-white font-bold rounded-2xl shadow-lg shadow-secondary/30 hover:shadow-xl hover:shadow-secondary/40 transition-all duration-300 mt-8 text-base hover:scale-[1.02] active:scale-[0.98]"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                        กำลังสร้างบัญชี...
                      </div>
                    ) : (
                      "สร้างบัญชีผู้ดูแล"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer Text */}
        <div className="text-center mt-8 space-y-2">
          <p className="text-sm text-white font-medium">🔒 ระบบรักษาความปลอดภัยระดับสูง</p>
          <p className="text-xs text-white/80">
            Powered by <span className="font-bold text-white">SPU Freelance Platform</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;
