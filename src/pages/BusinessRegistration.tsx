import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building, Mail, Globe, FileText, Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/ui/navbar";

const BusinessRegistration = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    description: '',
    address: '',
    phone: '',
    website: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Create company
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .insert({
          name: formData.name,
          domain: formData.domain,
          hr_owner_uid: user.id,
          verified: false
        })
        .select()
        .single();

      if (companyError) throw companyError;

      // Update user role to COMPANY_HR
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: 'COMPANY_HR' })
        .eq('id', user.id);

      if (profileError) throw profileError;

      toast({
        title: "ลงทะเบียนสำเร็จ",
        description: "บริษัทของคุณได้รับการลงทะเบียนแล้ว รอการยืนยันจากผู้ดูแลระบบ"
      });

      navigate('/business-dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถลงทะเบียนได้ กรุณาลองใหม่",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">ลงทะเบียนบริษัท</h1>
            <p className="text-muted-foreground">
              สมัครสมาชิกเพื่อโพสต์งานและค้นหาผู้สมัครที่เหมาะสม
            </p>
          </div>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                ข้อมูลบริษัท
              </CardTitle>
              <CardDescription>
                กรุณากรอกข้อมูลบริษัทให้ครบถ้วน
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">ชื่อบริษัท *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="บริษัท ABC จำกัด"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="domain">โดเมนบริษัท *</Label>
                    <Input
                      id="domain"
                      name="domain"
                      value={formData.domain}
                      onChange={handleInputChange}
                      placeholder="company.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">รายละเอียดบริษัท</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="บอกเล่าเกี่ยวกับบริษัทของคุณ..."
                    className="min-h-24"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">ที่อยู่บริษัท</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123/45 ถนน... แขวง... เขต... กรุงเทพฯ 10110"
                    className="min-h-16"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="02-XXX-XXXX"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">เว็บไซต์</Label>
                    <Input
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="https://company.com"
                    />
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-spu-warning mt-0.5" />
                    <div className="text-sm">
                      <h4 className="font-semibold mb-2">ขั้นตอนหลังจากลงทะเบียน</h4>
                      <ul className="space-y-1 text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <Check className="h-3 w-3" />
                          ผู้ดูแลระบบจะตรวจสอบข้อมูลบริษัท
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-3 w-3" />
                          รับการยืนยันทางอีเมล
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-3 w-3" />
                          เริ่มโพสต์งานและค้นหาผู้สมัคร
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                >
                  {loading ? "กำลังลงทะเบียน..." : "ลงทะเบียนบริษัท"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BusinessRegistration;