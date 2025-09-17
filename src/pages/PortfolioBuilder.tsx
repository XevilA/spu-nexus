import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  Sparkles,
  Calendar,
  Globe,
  Link,
  Star,
  Clock
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
    expected_rate: '',
    work_types: [],
    locations: [],
    freelance_rate: ''
  });

  // Dialog states for adding/editing items
  const [skillDialog, setSkillDialog] = useState({ open: false, editing: null });
  const [projectDialog, setProjectDialog] = useState({ open: false, editing: null });
  const [certificateDialog, setCertificateDialog] = useState({ open: false, editing: null });
  const [languageDialog, setLanguageDialog] = useState({ open: false, editing: null });

  // Form states for dialogs
  const [skillForm, setSkillForm] = useState({ name: '', level: '', category: '' });
  const [projectForm, setProjectForm] = useState({ title: '', description: '', technologies: '', url: '', status: '', startDate: '', endDate: '' });
  const [certificateForm, setCertificateForm] = useState({ title: '', issuer: '', date: '', url: '', verified: false });
  const [languageForm, setLanguageForm] = useState({ language: '', level: '' });

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
          expected_rate: data.expected_rate?.toString() || '',
          work_types: Array.isArray(data.work_types) ? data.work_types : [],
          locations: Array.isArray(data.locations) ? data.locations : [],
          freelance_rate: data.freelance_rate?.toString() || ''
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
        work_types: formData.work_types,
        locations: formData.locations,
        freelance_rate: formData.freelance_rate ? parseFloat(formData.freelance_rate) : null,
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
        work_types: formData.work_types,
        locations: formData.locations,
        freelance_rate: formData.freelance_rate ? parseFloat(formData.freelance_rate) : null,
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

  // Handler functions for skills
  const handleAddSkill = () => {
    if (!skillForm.name.trim()) return;
    
    const newSkill = {
      id: Date.now(),
      name: skillForm.name,
      level: skillForm.level,
      category: skillForm.category
    };

    if (skillDialog.editing !== null) {
      setFormData(prev => ({
        ...prev,
        skills: prev.skills.map(skill => 
          skill.id === skillDialog.editing ? newSkill : skill
        )
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill]
      }));
    }

    setSkillForm({ name: '', level: '', category: '' });
    setSkillDialog({ open: false, editing: null });
  };

  const handleEditSkill = (skill) => {
    setSkillForm(skill);
    setSkillDialog({ open: true, editing: skill.id });
  };

  const handleDeleteSkill = (skillId) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.id !== skillId)
    }));
  };

  // Handler functions for projects
  const handleAddProject = () => {
    if (!projectForm.title.trim()) return;
    
    const newProject = {
      id: Date.now(),
      title: projectForm.title,
      description: projectForm.description,
      technologies: projectForm.technologies.split(',').map(t => t.trim()).filter(t => t),
      url: projectForm.url,
      status: projectForm.status,
      startDate: projectForm.startDate,
      endDate: projectForm.endDate
    };

    if (projectDialog.editing !== null) {
      setFormData(prev => ({
        ...prev,
        projects: prev.projects.map(project => 
          project.id === projectDialog.editing ? newProject : project
        )
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        projects: [...prev.projects, newProject]
      }));
    }

    setProjectForm({ title: '', description: '', technologies: '', url: '', status: '', startDate: '', endDate: '' });
    setProjectDialog({ open: false, editing: null });
  };

  const handleEditProject = (project) => {
    setProjectForm({
      ...project,
      technologies: Array.isArray(project.technologies) ? project.technologies.join(', ') : ''
    });
    setProjectDialog({ open: true, editing: project.id });
  };

  const handleDeleteProject = (projectId) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter(project => project.id !== projectId)
    }));
  };

  // Handler functions for certificates
  const handleAddCertificate = () => {
    if (!certificateForm.title.trim()) return;
    
    const newCertificate = {
      id: Date.now(),
      title: certificateForm.title,
      issuer: certificateForm.issuer,
      date: certificateForm.date,
      url: certificateForm.url,
      verified: certificateForm.verified
    };

    if (certificateDialog.editing !== null) {
      setFormData(prev => ({
        ...prev,
        certificates: prev.certificates.map(cert => 
          cert.id === certificateDialog.editing ? newCertificate : cert
        )
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        certificates: [...prev.certificates, newCertificate]
      }));
    }

    setCertificateForm({ title: '', issuer: '', date: '', url: '', verified: false });
    setCertificateDialog({ open: false, editing: null });
  };

  const handleEditCertificate = (certificate) => {
    setCertificateForm(certificate);
    setCertificateDialog({ open: true, editing: certificate.id });
  };

  const handleDeleteCertificate = (certificateId) => {
    setFormData(prev => ({
      ...prev,
      certificates: prev.certificates.filter(cert => cert.id !== certificateId)
    }));
  };

  // Handler functions for languages
  const handleAddLanguage = () => {
    if (!languageForm.language.trim()) return;
    
    const newLanguage = {
      id: Date.now(),
      language: languageForm.language,
      level: languageForm.level
    };

    if (languageDialog.editing !== null) {
      setFormData(prev => ({
        ...prev,
        languages: prev.languages.map(lang => 
          lang.id === languageDialog.editing ? newLanguage : lang
        )
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, newLanguage]
      }));
    }

    setLanguageForm({ language: '', level: '' });
    setLanguageDialog({ open: false, editing: null });
  };

  const handleEditLanguage = (language) => {
    setLanguageForm(language);
    setLanguageDialog({ open: true, editing: language.id });
  };

  const handleDeleteLanguage = (languageId) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter(lang => lang.id !== languageId)
    }));
  };

  const handleWorkTypeChange = (workType, checked) => {
    setFormData(prev => ({
      ...prev,
      work_types: checked 
        ? [...prev.work_types, workType]
        : prev.work_types.filter(type => type !== workType)
    }));
  };

  const handleLocationChange = (location, checked) => {
    setFormData(prev => ({
      ...prev,
      locations: checked 
        ? [...prev.locations, location]
        : prev.locations.filter(loc => loc !== location)
    }));
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
                {/* Skills List */}
                <div className="space-y-4">
                  {formData.skills.map((skill) => (
                    <div key={skill.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">{skill.name}</Badge>
                        <span className="text-sm text-muted-foreground">{skill.level}</span>
                        {skill.category && (
                          <Badge variant="outline" className="text-xs">{skill.category}</Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditSkill(skill)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteSkill(skill.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {formData.skills.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>ยังไม่มีทักษะในรายการ</p>
                      <p className="text-sm">เริ่มเพิ่มทักษะแรกของคุณ</p>
                    </div>
                  )}
                </div>

                {/* Languages List */}
                <div>
                  <h4 className="font-semibold mb-4">ทักษะภาษา</h4>
                  <div className="space-y-4">
                    {formData.languages.map((lang) => (
                      <div key={lang.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary">{lang.language}</Badge>
                          <span className="text-sm text-muted-foreground">{lang.level}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEditLanguage(lang)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteLanguage(lang.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    {formData.languages.length === 0 && (
                      <div className="text-center py-4 text-muted-foreground">
                        <Globe className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">ยังไม่มีทักษะภาษา</p>
                      </div>
                    )}
                  </div>

                  <Dialog open={languageDialog.open} onOpenChange={(open) => setLanguageDialog({ open, editing: null })}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="mt-2">
                        <Plus className="w-4 h-4 mr-2" />
                        เพิ่มภาษา
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {languageDialog.editing ? 'แก้ไขทักษะภาษา' : 'เพิ่มทักษะภาษา'}
                        </DialogTitle>
                        <DialogDescription>
                          ระบุภาษาและระดับความสามารถของคุณ
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="language">ภาษา *</Label>
                          <Input
                            id="language"
                            value={languageForm.language}
                            onChange={(e) => setLanguageForm(prev => ({ ...prev, language: e.target.value }))}
                            placeholder="เช่น ไทย, อังกฤษ, จีน"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="languageLevel">ระดับความสามารถ *</Label>
                          <Select value={languageForm.level} onValueChange={(value) => setLanguageForm(prev => ({ ...prev, level: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="เลือกระดับ" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="เจ้าของภาษา">เจ้าของภาษา</SelectItem>
                              <SelectItem value="ระดับดีมาก">ระดับดีมาก</SelectItem>
                              <SelectItem value="ระดับดี">ระดับดี</SelectItem>
                              <SelectItem value="ระดับกลาง">ระดับกลาง</SelectItem>
                              <SelectItem value="ระดับเริ่มต้น">ระดับเริ่มต้น</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleAddLanguage} className="flex-1">
                            {languageDialog.editing ? 'บันทึกการแก้ไข' : 'เพิ่มภาษา'}
                          </Button>
                          <Button variant="outline" onClick={() => setLanguageDialog({ open: false, editing: null })}>
                            ยกเลิก
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <Dialog open={skillDialog.open} onOpenChange={(open) => setSkillDialog({ open, editing: null })}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      เพิ่มทักษะ
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {skillDialog.editing ? 'แก้ไขทักษะ' : 'เพิ่มทักษะใหม่'}
                      </DialogTitle>
                      <DialogDescription>
                        ระบุชื่อทักษะ ระดับความเชี่ยวชาญ และหมวดหมู่
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="skillName">ชื่อทักษะ *</Label>
                        <Input
                          id="skillName"
                          value={skillForm.name}
                          onChange={(e) => setSkillForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="เช่น JavaScript, Photoshop, การนำเสนอ"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="skillLevel">ระดับความเชี่ยวชาญ *</Label>
                        <Select value={skillForm.level} onValueChange={(value) => setSkillForm(prev => ({ ...prev, level: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="เลือกระดับ" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="เริ่มต้น">เริ่มต้น</SelectItem>
                            <SelectItem value="ระดับกลาง">ระดับกลาง</SelectItem>
                            <SelectItem value="ระดับดี">ระดับดี</SelectItem>
                            <SelectItem value="ระดับเชี่ยวชาญ">ระดับเชี่ยวชาญ</SelectItem>
                            <SelectItem value="ระดับผู้เชี่ยวชาญ">ระดับผู้เชี่ยวชาญ</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="skillCategory">หมวดหมู่</Label>
                        <Select value={skillForm.category} onValueChange={(value) => setSkillForm(prev => ({ ...prev, category: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="เลือกหมวดหมู่ (ไม่บังคับ)" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="การเขียนโปรแกรม">การเขียนโปรแกรม</SelectItem>
                            <SelectItem value="การออกแบบ">การออกแบบ</SelectItem>
                            <SelectItem value="การตลาด">การตลาด</SelectItem>
                            <SelectItem value="การจัดการ">การจัดการ</SelectItem>
                            <SelectItem value="การสื่อสار">การสื่อสาร</SelectItem>
                            <SelectItem value="อื่นๆ">อื่นๆ</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleAddSkill} className="flex-1">
                          {skillDialog.editing ? 'บันทึกการแก้ไข' : 'เพิ่มทักษะ'}
                        </Button>
                        <Button variant="outline" onClick={() => setSkillDialog({ open: false, editing: null })}>
                          ยกเลิก
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
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
                {formData.projects.map((project) => (
                  <div key={project.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold">{project.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                        {project.url && (
                          <a 
                            href={project.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline flex items-center gap-1 mt-1"
                          >
                            <Link className="w-3 h-3" />
                            ดูโปรเจค
                          </a>
                        )}
                        {(project.startDate || project.endDate) && (
                          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {project.startDate} {project.endDate && `- ${project.endDate}`}
                          </p>
                        )}
                      </div>
                      <Badge className={project.status === "สมบูรณ์" ? "bg-green-100 text-green-800" : project.status === "กำลังพัฒนา" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}>
                        {project.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(project.technologies) && project.technologies.map((tech, techIndex) => (
                        <Badge key={techIndex} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditProject(project)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteProject(project.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                {formData.projects.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>ยังไม่มีโปรเจคในรายการ</p>
                    <p className="text-sm">เริ่มเพิ่มผลงานแรกของคุณ</p>
                  </div>
                )}

                <Dialog open={projectDialog.open} onOpenChange={(open) => setProjectDialog({ open, editing: null })}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      เพิ่มโปรเจค
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {projectDialog.editing ? 'แก้ไขโปรเจค' : 'เพิ่มโปรเจคใหม่'}
                      </DialogTitle>
                      <DialogDescription>
                        กรอกรายละเอียดของโปรเจคหรือผลงานของคุณ
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      <div className="space-y-2">
                        <Label htmlFor="projectTitle">ชื่อโปรเจค *</Label>
                        <Input
                          id="projectTitle"
                          value={projectForm.title}
                          onChange={(e) => setProjectForm(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="เช่น E-commerce Website, Mobile App"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="projectDescription">รายละเอียดโปรเจค *</Label>
                        <Textarea
                          id="projectDescription"
                          value={projectForm.description}
                          onChange={(e) => setProjectForm(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="อธิบายว่าโปรเจคนี้ทำอะไร ใช้เทคโนโลยีอะไร และคุณมีบทบาทอย่างไร"
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="projectTech">เทคโนโลยีที่ใช้</Label>
                        <Input
                          id="projectTech"
                          value={projectForm.technologies}
                          onChange={(e) => setProjectForm(prev => ({ ...prev, technologies: e.target.value }))}
                          placeholder="เช่น React, Node.js, MongoDB (คั่นด้วยจุลภาค)"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="projectStart">วันที่เริ่ม</Label>
                          <Input
                            id="projectStart"
                            type="date"
                            value={projectForm.startDate}
                            onChange={(e) => setProjectForm(prev => ({ ...prev, startDate: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="projectEnd">วันที่สิ้นสุด</Label>
                          <Input
                            id="projectEnd"
                            type="date"
                            value={projectForm.endDate}
                            onChange={(e) => setProjectForm(prev => ({ ...prev, endDate: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="projectStatus">สถานะ</Label>
                        <Select value={projectForm.status} onValueChange={(value) => setProjectForm(prev => ({ ...prev, status: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="เลือกสถานะ" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="สมบูรณ์">สมบูรณ์</SelectItem>
                            <SelectItem value="กำลังพัฒนา">กำลังพัฒนา</SelectItem>
                            <SelectItem value="หยุดชั่วคราว">หยุดชั่วคราว</SelectItem>
                            <SelectItem value="ยกเลิก">ยกเลิก</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="projectUrl">ลิงก์โปรเจค</Label>
                        <Input
                          id="projectUrl"
                          value={projectForm.url}
                          onChange={(e) => setProjectForm(prev => ({ ...prev, url: e.target.value }))}
                          placeholder="https://github.com/username/project หรือ https://demo.website.com"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleAddProject} className="flex-1">
                          {projectDialog.editing ? 'บันทึกการแก้ไข' : 'เพิ่มโปรเจค'}
                        </Button>
                        <Button variant="outline" onClick={() => setProjectDialog({ open: false, editing: null })}>
                          ยกเลิก
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
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
                {formData.certificates.map((cert) => (
                  <div key={cert.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold flex items-center gap-2">
                          {cert.title}
                          {cert.verified && (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          )}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {cert.issuer} • {cert.date}
                        </p>
                        {cert.url && (
                          <a 
                            href={cert.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline flex items-center gap-1 mt-1"
                          >
                            <Link className="w-3 h-3" />
                            ดูใบรับรอง
                          </a>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditCertificate(cert)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteCertificate(cert.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {formData.certificates.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>ยังไม่มีใบรับรองในรายการ</p>
                    <p className="text-sm">เริ่มเพิ่มใบรับรองหรือรางวัลของคุณ</p>
                  </div>
                )}

                <Dialog open={certificateDialog.open} onOpenChange={(open) => setCertificateDialog({ open, editing: null })}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      เพิ่มใบรับรอง
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {certificateDialog.editing ? 'แก้ไขใบรับรอง' : 'เพิ่มใบรับรองหรือรางวัล'}
                      </DialogTitle>
                      <DialogDescription>
                        กรอกรายละเอียดใบรับรองหรือรางวัลที่คุณได้รับ
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="certTitle">ชื่อใบรับรอง/รางวัล *</Label>
                        <Input
                          id="certTitle"
                          value={certificateForm.title}
                          onChange={(e) => setCertificateForm(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="เช่น Google Analytics Certified, รางวัลที่ 1 การแข่งขัน"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="certIssuer">หน่วยงานที่ออกให้ *</Label>
                        <Input
                          id="certIssuer"
                          value={certificateForm.issuer}
                          onChange={(e) => setCertificateForm(prev => ({ ...prev, issuer: e.target.value }))}
                          placeholder="เช่น Google, มหาวิทยาลัยศรีปทุม"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="certDate">วันที่ได้รับ *</Label>
                        <Input
                          id="certDate"
                          type="date"
                          value={certificateForm.date}
                          onChange={(e) => setCertificateForm(prev => ({ ...prev, date: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="certUrl">ลิงก์ใบรับรอง</Label>
                        <Input
                          id="certUrl"
                          value={certificateForm.url}
                          onChange={(e) => setCertificateForm(prev => ({ ...prev, url: e.target.value }))}
                          placeholder="https://credentials.google.com/..."
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="verified"
                          checked={certificateForm.verified}
                          onChange={(e) => setCertificateForm(prev => ({ ...prev, verified: e.target.checked }))}
                          className="rounded"
                        />
                        <Label htmlFor="verified" className="text-sm">
                          ใบรับรองนี้ได้รับการยืนยันแล้ว
                        </Label>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleAddCertificate} className="flex-1">
                          {certificateDialog.editing ? 'บันทึกการแก้ไข' : 'เพิ่มใบรับรอง'}
                        </Button>
                        <Button variant="outline" onClick={() => setCertificateDialog({ open: false, editing: null })}>
                          ยกเลิก
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="availability" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  ความพร้อมและเงื่อนไขการทำงาน
                </CardTitle>
                <CardDescription>
                  ระบุความพร้อมและอัตราค่าตอบแทนที่คาดหวัง
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">ประเภทงานที่สนใจ</Label>
                    <div className="space-y-3">
                      {["ฝึกงาน", "สหกิจศึกษา", "ฟรีแลนซ์", "พาร์ทไทม์"].map((type) => (
                        <label key={type} className="flex items-center space-x-3 p-2 rounded-lg border hover:bg-gray-50 cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="rounded" 
                            checked={formData.work_types.includes(type)}
                            onChange={(e) => handleWorkTypeChange(type, e.target.checked)}
                          />
                          <span className="text-sm font-medium">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">สถานที่ทำงานที่ต้องการ</Label>
                    <div className="space-y-3">
                      {["กรุงเทพฯ", "ปริมณฑล", "Remote", "ต่างจังหวัด"].map((location) => (
                        <label key={location} className="flex items-center space-x-3 p-2 rounded-lg border hover:bg-gray-50 cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="rounded" 
                            checked={formData.locations.includes(location)}
                            onChange={(e) => handleLocationChange(location, e.target.checked)}
                          />
                          <span className="text-sm font-medium">{location}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="expectedRate">อัตราค่าตอบแทนที่คาดหวัง (บาท/เดือน)</Label>
                    <Input 
                      id="expectedRate"
                      value={formData.expected_rate}
                      onChange={(e) => setFormData(prev => ({ ...prev, expected_rate: e.target.value }))}
                      placeholder="เช่น 15000, 20000-25000"
                    />
                    <p className="text-xs text-muted-foreground">
                      สามารถระบุเป็นช่วงหรือจำนวนเฉพาะ
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="freelanceRate">อัตราค่าตอบแทนฟรีแลนซ์ (บาท/ชั่วโมง)</Label>
                    <Input 
                      id="freelanceRate"
                      value={formData.freelance_rate}
                      onChange={(e) => setFormData(prev => ({ ...prev, freelance_rate: e.target.value }))}
                      placeholder="เช่น 300, 500-800"
                    />
                    <p className="text-xs text-muted-foreground">
                      สำหรับงานฟรีแลนซ์โดยเฉพาะ
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="availibilityDetails">ข้อมูลเพิ่มเติมเกี่ยวกับความพร้อม</Label>
                  <Textarea 
                    id="availibilityDetails"
                    value={formData.availability}
                    onChange={(e) => setFormData(prev => ({ ...prev, availability: e.target.value }))}
                    placeholder="เช่น ช่วงเวลาที่สามารถทำงานได้, ข้อจำกัดพิเศษ, หรือข้อมูลอื่นๆ ที่ผู้ว่าจ้างควรทราบ..."
                    className="min-h-24"
                  />
                  <p className="text-xs text-muted-foreground">
                    ระบุข้อมูลที่สำคัญเช่น วันเวลาที่ว่าง ระยะเวลาที่สามารถทำงานได้ หรือข้อจำกัดต่างๆ
                  </p>
                </div>

                {/* Summary Section */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    สรุปความพร้อม
                  </h4>
                  <div className="space-y-2 text-sm">
                    {formData.work_types.length > 0 && (
                      <p>
                        <span className="font-medium">สนใจงาน:</span> {formData.work_types.join(", ")}
                      </p>
                    )}
                    {formData.locations.length > 0 && (
                      <p>
                        <span className="font-medium">สถานที่:</span> {formData.locations.join(", ")}
                      </p>
                    )}
                    {formData.expected_rate && (
                      <p>
                        <span className="font-medium">ค่าตอบแทน:</span> {formData.expected_rate} บาท/เดือน
                      </p>
                    )}
                    {formData.freelance_rate && (
                      <p>
                        <span className="font-medium">ฟรีแลนซ์:</span> {formData.freelance_rate} บาท/ชั่วโมง
                      </p>
                    )}
                    {!formData.work_types.length && !formData.locations.length && (
                      <p className="text-muted-foreground italic">กรุณาเลือกประเภทงานและสถานที่ที่สนใจ</p>
                    )}
                  </div>
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