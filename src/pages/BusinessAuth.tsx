import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Mail, Eye, EyeOff, ArrowLeft, FileText, Phone, Globe, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const BusinessAuth = () => {
  const { signInWithEmail, signUpWithEmail, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    // Business information
    companyName: '',
    businessType: '',
    registrationNumber: '',
    contactPerson: '',
    contactPhone: '',
    website: '',
    address: '',
    description: ''
  });

  useEffect(() => {
    if (user) {
      navigate('/business-dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent, mode: 'login' | 'register') => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'register' && formData.password !== formData.confirmPassword) {
        toast({
          title: "ข้อผิดพลาด",
          description: "รหัสผ่านไม่ตรงกัน",
          variant: "destructive"
        });
        return;
      }

      let result;
      if (mode === 'login') {
        result = await signInWithEmail(formData.email, formData.password);
      } else {
        // Register business user
        result = await signUpWithEmail(formData.email, formData.password);
        
        if (!result.error) {
          // Create business profile
          const { error: businessError } = await supabase
            .from('companies')
            .insert({
              name: formData.companyName,
              domain: formData.website,
              description: formData.description,
              address: formData.address,
              phone: formData.contactPhone,
              verified: false
            });

          if (businessError) {
            console.error('Business creation error:', businessError);
          }
        }
      }

      if (!result.error) {
        toast({
          title: "สำเร็จ",
          description: mode === 'login' 
            ? "เข้าสู่ระบบสำเร็จ" 
            : "ลงทะเบียนสำเร็จ กรุณาตรวจสอบอีเมลเพื่อยืนยันบัญชี"
        });
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6 text-muted-foreground hover:text-foreground glass-card"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          กลับสู่หน้าหลัก
        </Button>

        <Card className="card-modern shadow-enterprise">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center shadow-enterprise">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold gradient-text">
                SPU Business
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                ระบบจัดการงานสำหรับธุรกิจและบริษัท
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-muted">
                <TabsTrigger value="login" className="data-[state=active]:bg-white data-[state=active]:text-primary">เข้าสู่ระบบ</TabsTrigger>
                <TabsTrigger value="register" className="data-[state=active]:bg-white data-[state=active]:text-primary">ลงทะเบียนธุรกิจ</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={(e) => handleSubmit(e, 'login')} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">อีเมลบริษัท</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="business@company.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="bg-white border border-input focus:border-primary"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">รหัสผ่าน</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="ใส่รหัสผ่าน"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="bg-white border border-input focus:border-primary pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full apple-button" 
                    disabled={loading}
                  >
                    {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={(e) => handleSubmit(e, 'register')} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      ข้อมูลการเข้าสู่ระบบ
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="register-email">อีเมลบริษัท</Label>
                        <Input
                          id="register-email"
                          name="email"
                          type="email"
                          placeholder="business@company.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="bg-white border border-input focus:border-primary"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="register-password">รหัสผ่าน</Label>
                        <div className="relative">
                          <Input
                            id="register-password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="สร้างรหัสผ่าน"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            className="bg-white border border-input focus:border-primary pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="confirm-password">ยืนยันรหัสผ่าน</Label>
                        <div className="relative">
                          <Input
                            id="confirm-password"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="ยืนยันรหัสผ่าน"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            required
                            className="bg-white border border-input focus:border-primary pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      ข้อมูลบริษัท
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="companyName">ชื่อบริษัท *</Label>
                        <Input
                          id="companyName"
                          name="companyName"
                          placeholder="บริษัท ABC จำกัด"
                          value={formData.companyName}
                          onChange={handleInputChange}
                          required
                          className="bg-white border border-input focus:border-primary"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="businessType">ประเภทธุรกิจ *</Label>
                        <Input
                          id="businessType"
                          name="businessType"
                          placeholder="เทคโนโลยี, การผลิต, การศึกษา..."
                          value={formData.businessType}
                          onChange={handleInputChange}
                          required
                          className="bg-white border border-input focus:border-primary"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="registrationNumber">เลขทะเบียนบริษัท</Label>
                        <Input
                          id="registrationNumber"
                          name="registrationNumber"
                          placeholder="0123456789012"
                          value={formData.registrationNumber}
                          onChange={handleInputChange}
                          className="bg-white border border-input focus:border-primary"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="contactPerson">ผู้รับผิดชอบ *</Label>
                        <Input
                          id="contactPerson"
                          name="contactPerson"
                          placeholder="คุณสมชาย ใจดี"
                          value={formData.contactPerson}
                          onChange={handleInputChange}
                          required
                          className="bg-white border border-input focus:border-primary"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="contactPhone">เบอร์ติดต่อ *</Label>
                        <Input
                          id="contactPhone"
                          name="contactPhone"
                          placeholder="02-XXX-XXXX"
                          value={formData.contactPhone}
                          onChange={handleInputChange}
                          required
                          className="bg-white border border-input focus:border-primary"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="website">เว็บไซต์</Label>
                        <Input
                          id="website"
                          name="website"
                          placeholder="https://company.com"
                          value={formData.website}
                          onChange={handleInputChange}
                          className="bg-white border border-input focus:border-primary"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">ที่อยู่บริษัท</Label>
                      <Textarea
                        id="address"
                        name="address"
                        placeholder="123/45 ถนน... แขวง... เขต... กรุงเทพฯ 10110"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="bg-white border border-input focus:border-primary min-h-16"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">รายละเอียดบริษัท</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="บอกเล่าเกี่ยวกับบริษัทของคุณ..."
                        value={formData.description}
                        onChange={handleInputChange}
                        className="bg-white border border-input focus:border-primary min-h-24"
                      />
                    </div>
                  </div>

                  <div className="glass-card p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-primary mt-0.5" />
                      <div className="text-sm">
                        <h4 className="font-semibold mb-2">ขั้นตอนหลังจากลงทะเบียน</h4>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• ผู้ดูแลระบบจะตรวจสอบข้อมูลบริษัท</li>
                          <li>• รับการยืนยันทางอีเมล</li>
                          <li>• เริ่มโพสต์งานและค้นหาผู้สมัคร</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full apple-button" 
                    disabled={loading}
                  >
                    {loading ? 'กำลังลงทะเบียน...' : 'ลงทะเบียนบริษัท'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusinessAuth;