import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  GraduationCap, 
  Code, 
  FolderOpen, 
  Award, 
  FileText,
  Plus,
  Save,
  Send,
  Eye,
  Edit,
  Trash2,
  Upload,
  CheckCircle,
  AlertCircle,
  Brain,
  Sparkles
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Navbar } from "@/components/ui/navbar";

const PortfolioBuilder = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [portfolio, setPortfolio] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [aiAdvice, setAiAdvice] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  
  const [formData, setFormData] = useState({
    skills: [],
    projects: [],
    education: [],
    certificates: [],
    work_samples: [],
    languages: [],
    availability: '',
    expected_rate: ''
  });

  useEffect(() => {
    if (user) {
      fetchPortfolio();
    }
  }, [user]);

  const fetchPortfolio = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('student_uid', user?.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setPortfolio(data);
        setFormData({
          skills: Array.isArray(data.skills) ? data.skills : [],
          projects: Array.isArray(data.projects) ? data.projects : [],
          education: Array.isArray(data.education) ? data.education : [],
          certificates: Array.isArray(data.certificates) ? data.certificates : [],
          work_samples: Array.isArray(data.work_samples) ? data.work_samples : [],
          languages: Array.isArray(data.languages) ? data.languages : [],
          availability: data.availability || '',
          expected_rate: data.expected_rate?.toString() || ''
        });
      }
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateCompletionPercentage = () => {
    const sections = [
      formData.skills.length > 0,
      formData.projects.length > 0,
      formData.education.length > 0,
      formData.languages.length > 0,
      formData.availability,
      formData.expected_rate
    ];
    
    const completed = sections.filter(Boolean).length;
    return Math.round((completed / sections.length) * 100);
  };

  const completionPercentage = calculateCompletionPercentage();

  const handleSaveDraft = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const portfolioData = {
        student_uid: user.id,
        skills: formData.skills,
        projects: formData.projects,
        education: formData.education,
        certificates: formData.certificates,
        work_samples: formData.work_samples,
        languages: formData.languages,
        availability: formData.availability,
        expected_rate: formData.expected_rate ? parseFloat(formData.expected_rate) : null,
        status: 'DRAFT',
        updated_at: new Date().toISOString()
      };

      if (portfolio) {
        const { error } = await supabase
          .from('portfolios')
          .update(portfolioData)
          .eq('id', portfolio.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('portfolios')
          .insert(portfolioData);
        if (error) throw error;
      }

      toast({
        title: "บันทึกสำเร็จ",
        description: "Portfolio ของคุณได้รับการบันทึกแล้ว"
      });

      fetchPortfolio();
    } catch (error) {
      console.error('Error saving portfolio:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถบันทึกได้ กรุณาลองใหม่",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitForApproval = async () => {
    if (!user || completionPercentage < 80) {
      toast({
        title: "ข้อมูลไม่ครบถ้วน",
        description: "กรุณากรอกข้อมูลให้ครบอย่างน้อย 80% ก่อนส่งขออนุมัติ",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      const portfolioData = {
        student_uid: user.id,
        skills: formData.skills,
        projects: formData.projects,
        education: formData.education,
        certificates: formData.certificates,
        work_samples: formData.work_samples,
        languages: formData.languages,
        availability: formData.availability,
        expected_rate: formData.expected_rate ? parseFloat(formData.expected_rate) : null,
        status: 'SUBMITTED',
        submitted_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (portfolio) {
        const { error } = await supabase
          .from('portfolios')
          .update(portfolioData)
          .eq('id', portfolio.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('portfolios')
          .insert(portfolioData);
        if (error) throw error;
      }

      toast({
        title: "ส่งขออนุมัติสำเร็จ",
        description: "Portfolio ของคุณได้รับการส่งไปยังผู้ดูแลเพื่อพิจารณาแล้ว"
      });

      fetchPortfolio();
    } catch (error) {
      console.error('Error submitting portfolio:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถส่งขออนุมัติได้ กรุณาลองใหม่",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground px-6 py-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">SPU U2B</div>
          <div className="flex items-center gap-4">
            <Badge className="bg-spu-warning text-white">
              <AlertCircle className="w-4 h-4 mr-1" />
              รอการอนุมัติ
            </Badge>
            <div className="text-sm">
              ความสมบูรณ์: {completionPercentage}%
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">สร้าง e-Portfolio</h1>
          <p className="text-muted-foreground">
            สร้างและจัดการประวัติส่วนตัว ทักษะ และผลงานของคุณ
          </p>
        </div>

        {/* Progress Card */}
        <Card className="shadow-card mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold">ความคืบหน้า Portfolio</h3>
                <p className="text-sm text-muted-foreground">
                  กรุณากรอกข้อมูลให้ครบถ้วนก่อนส่งขออนุมัติ
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">{completionPercentage}%</div>
                <div className="text-sm text-muted-foreground">สมบูรณ์</div>
              </div>
            </div>
            <Progress value={completionPercentage} className="h-3 mb-4" />
            <div className="flex gap-2">
              <Button variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                ดูตัวอย่าง
              </Button>
              <Button 
                variant="secondary" 
                onClick={handleSaveDraft}
                disabled={saving}
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? "กำลังบันทึก..." : "บันทึกแบบร่าง"}
              </Button>
              <Button 
                onClick={handleSubmitForApproval}
                disabled={saving || completionPercentage < 80}
              >
                <Send className="w-4 h-4 mr-2" />
                ส่งขออนุมัติ
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="personal" className="text-xs">ข้อมูลส่วนตัว</TabsTrigger>
            <TabsTrigger value="education" className="text-xs">การศึกษา</TabsTrigger>
            <TabsTrigger value="skills" className="text-xs">ทักษะ</TabsTrigger>
            <TabsTrigger value="projects" className="text-xs">ผลงาน</TabsTrigger>
            <TabsTrigger value="certificates" className="text-xs">ใบรับรอง</TabsTrigger>
            <TabsTrigger value="availability" className="text-xs">ความพร้อม</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  ข้อมูลส่วนตัว
                </CardTitle>
                <CardDescription>
                  ข้อมูลพื้นฐานที่จะแสดงในประวัติของคุณ
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">ชื่อ *</Label>
                    <Input id="firstName" placeholder="สมชาย" defaultValue="สมชาย" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">นามสกุล *</Label>
                    <Input id="lastName" placeholder="ใจดี" defaultValue="ใจดี" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">อีเมล *</Label>
                    <Input id="email" type="email" defaultValue="somchai.j@student.spu.ac.th" disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                    <Input id="phone" placeholder="08X-XXX-XXXX" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">แนะนำตัว</Label>
                  <Textarea 
                    id="bio" 
                    placeholder="เล่าเกี่ยวกับตัวคุณ, ความสนใจ, และเป้าหมายในการทำงาน..."
                    className="min-h-24"
                    defaultValue="นักศึกษาวิศวกรรมคอมพิวเตอร์ ปี 3 ที่มีความสนใจในการพัฒนาเว็บแอปพลิเคชัน และมีประสบการณ์ในการทำโปรเจคต่างๆ มากมาย"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="education" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  ประวัติการศึกษา
                </CardTitle>
                <CardDescription>
                  เพิ่มข้อมูลการศึกษาของคุณ
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Education */}
                <div className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-primary text-white">การศึกษาปัจจุบัน</Badge>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>คณะ/วิทยาลัย</Label>
                      <Input defaultValue="วิศวกรรมศาสตร์" />
                    </div>
                    <div className="space-y-2">
                      <Label>สาขาวิชา</Label>
                      <Input defaultValue="วิศวกรรมคอมพิวเตอร์" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>ระดับการศึกษา</Label>
                      <Input defaultValue="ปริญญาตรี" />
                    </div>
                    <div className="space-y-2">
                      <Label>ชั้นปี</Label>
                      <Input defaultValue="3" />
                    </div>
                    <div className="space-y-2">
                      <Label>GPA</Label>
                      <Input defaultValue="3.45" />
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  เพิ่มประวัติการศึกษา
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  ทักษะและความสามารถ
                </CardTitle>
                <CardDescription>
                  เพิ่มทักษะที่คุณมี พร้อมระบุระดับความเชี่ยวชาญ
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Programming Skills */}
                <div>
                  <h4 className="font-semibold mb-4">ทักษะการเขียนโปรแกรม</h4>
                  <div className="space-y-4">
                    {["JavaScript", "Python", "React", "Node.js"].map((skill, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary">{skill}</Badge>
                          <span className="text-sm text-muted-foreground">ระดับกลาง</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Language Skills */}
                <div>
                  <h4 className="font-semibold mb-4">ทักษะภาษา</h4>
                  <div className="space-y-4">
                    {[{lang: "ไทย", level: "เจ้าของภาษา"}, {lang: "อังกฤษ", level: "ระดับดี"}].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary">{item.lang}</Badge>
                          <span className="text-sm text-muted-foreground">{item.level}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  เพิ่มทักษะ
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5" />
                  ผลงานและโปรเจค
                </CardTitle>
                <CardDescription>
                  แสดงผลงานที่คุณภาคภูมิใจ
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  {
                    title: "E-commerce Website",
                    description: "เว็บไซต์ขายของออนไลน์พัฒนาด้วย React และ Node.js",
                    technologies: ["React", "Node.js", "MongoDB"],
                    status: "สมบูรณ์"
                  },
                  {
                    title: "Mobile Task Manager",
                    description: "แอปพลิเคชันจัดการงานบนมือถือด้วย Flutter",
                    technologies: ["Flutter", "Firebase"],
                    status: "กำลังพัฒนา"
                  }
                ].map((project, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">{project.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                      </div>
                      <Badge className={project.status === "สมบูรณ์" ? "bg-spu-success text-white" : "bg-spu-warning text-white"}>
                        {project.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, techIndex) => (
                        <Badge key={techIndex} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        ดูโปรเจค
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                <Button variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  เพิ่มโปรเจค
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certificates" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  ใบรับรองและรางวัล
                </CardTitle>
                <CardDescription>
                  เพิ่มใบรับรองและรางวัลที่คุณได้รับ
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  {
                    title: "Google Analytics Certified",
                    issuer: "Google",
                    date: "มิ.ย. 2567",
                    verified: true
                  },
                  {
                    title: "รางวัลที่ 2 การแข่งขัน Hackathon",
                    issuer: "SPU Computer Engineering",
                    date: "มี.ค. 2567",
                    verified: false
                  }
                ].map((cert, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold flex items-center gap-2">
                          {cert.title}
                          {cert.verified && (
                            <CheckCircle className="w-4 h-4 text-spu-success" />
                          )}
                        </h4>
                        <p className="text-sm text-muted-foreground">{cert.issuer} • {cert.date}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                <Button variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  เพิ่มใบรับรอง
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="availability" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  ความพร้อมและเงื่อนไขการทำงาน
                </CardTitle>
                <CardDescription>
                  ระบุความพร้อมและอัตราค่าตอบแทนที่คาดหวัง
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>ประเภทงานที่สนใจ</Label>
                    <div className="space-y-2">
                      {["ฝึกงาน", "สหกิจศึกษา", "ฟรีแลนซ์", "พาร์ทไทม์"].map((type, index) => (
                        <label key={index} className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" defaultChecked={index < 2} />
                          <span className="text-sm">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>สถานที่ทำงานที่ต้องการ</Label>
                    <div className="space-y-2">
                      {["กรุงเทพฯ", "ปริมณฑล", "Remote", "ต่างจังหวัด"].map((location, index) => (
                        <label key={index} className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" defaultChecked={index < 3} />
                          <span className="text-sm">{location}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>อัตราค่าตอบแทนที่คาดหวัง (บาท/เดือน)</Label>
                    <Input placeholder="เช่น 15,000 - 20,000" />
                  </div>
                  <div className="space-y-2">
                    <Label>อัตราค่าตอบแทนฟรีแลนซ์ (บาท/ชั่วโมง)</Label>
                    <Input placeholder="เช่น 300 - 500" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>ข้อมูลเพิ่มเติมเกี่ยวกับความพร้อม</Label>
                  <Textarea 
                    placeholder="เช่น ช่วงเวลาที่สามารถทำงานได้, ข้อจำกัดพิเศษ, หรือข้อมูลอื่นๆ ที่ผู้ว่าจ้างควรทราบ..."
                    className="min-h-24"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PortfolioBuilder;