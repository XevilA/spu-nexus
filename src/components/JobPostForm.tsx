import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  X, 
  Briefcase, 
  MapPin, 
  DollarSign,
  Calendar,
  FileText,
  Save
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface JobPostFormProps {
  onJobPosted?: () => void;
  onCancel?: () => void;
}

const JobPostForm = ({ onJobPosted, onCancel }: JobPostFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [requirements, setRequirements] = useState<string[]>([]);
  const [newRequirement, setNewRequirement] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    job_type: '',
    location: '',
    budget_or_salary: '',
    deadline_at: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addRequirement = () => {
    if (newRequirement.trim() && !requirements.includes(newRequirement.trim())) {
      setRequirements(prev => [...prev, newRequirement.trim()]);
      setNewRequirement('');
    }
  };

  const removeRequirement = (requirement: string) => {
    setRequirements(prev => prev.filter(req => req !== requirement));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // First get the company associated with this user
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .select('id')
        .eq('hr_owner_uid', user.id)
        .single();

      if (companyError || !company) {
        throw new Error('ไม่พบข้อมูลบริษัท กรุณาลงทะเบียนบริษัทก่อน');
      }

      const jobData = {
        title: formData.title,
        description: formData.description,
        job_type: formData.job_type,
        location: formData.location,
        budget_or_salary: formData.budget_or_salary,
        requirements: requirements,
        deadline_at: formData.deadline_at ? new Date(formData.deadline_at).toISOString() : null,
        company_id: company.id,
        status: 'OPEN',
        source: 'DIRECT'
      };

      const { error } = await supabase
        .from('jobs')
        .insert([jobData]);

      if (error) throw error;

      toast({
        title: "โพสต์งานสำเร็จ!",
        description: "งานของคุณได้รับการโพสต์แล้วและนักศึกษาสามารถสมัครได้"
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        job_type: '',
        location: '',
        budget_or_salary: '',
        deadline_at: ''
      });
      setRequirements([]);

      onJobPosted?.();
    } catch (error: any) {
      console.error('Job post error:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message || "ไม่สามารถโพสต์งานได้",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          โพสต์งานใหม่
        </CardTitle>
        <CardDescription>
          สร้างประกาศรับสมัครงานใหม่เพื่อค้นหาผู้สมัครที่เหมาะสม
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              ชื่อตำแหน่งงาน *
            </Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="เช่น นักพัฒนาเว็บไซต์ จูเนียร์"
              required
            />
          </div>

          {/* Job Type and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>ประเภทงาน *</Label>
              <Select onValueChange={(value) => handleSelectChange('job_type', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกประเภทงาน" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INTERNSHIP">ฝึกงาน</SelectItem>
                  <SelectItem value="PARTTIME">งานชั่วคราว</SelectItem>
                  <SelectItem value="FULLTIME">งานเต็มเวลา</SelectItem>
                  <SelectItem value="FREELANCE">ฟรีแลนซ์</SelectItem>
                  <SelectItem value="COOP">สหกิจศึกษา</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                สถานที่ทำงาน
              </Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="เช่น กรุงเทพฯ, ทำงานจากที่บ้าน"
              />
            </div>
          </div>

          {/* Budget and Deadline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget_or_salary" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                ค่าตอบแทน
              </Label>
              <Input
                id="budget_or_salary"
                name="budget_or_salary"
                value={formData.budget_or_salary}
                onChange={handleInputChange}
                placeholder="เช่น 15,000-20,000 บาท/เดือน"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline_at" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                วันสุดท้ายการสมัคร
              </Label>
              <Input
                id="deadline_at"
                name="deadline_at"
                type="date"
                value={formData.deadline_at}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Job Description */}
          <div className="space-y-2">
            <Label htmlFor="description">รายละเอียดงาน *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="บอกเล่าเกี่ยวกับงานนี้ หน้าที่ความรับผิดชอบ และสิ่งที่คาดหวังจากผู้สมัคร..."
              className="min-h-32"
              required
            />
          </div>

          {/* Requirements */}
          <div className="space-y-2">
            <Label>คุณสมบัติที่ต้องการ</Label>
            <div className="flex gap-2">
              <Input
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                placeholder="เพิ่มคุณสมบัติที่ต้องการ"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
              />
              <Button type="button" onClick={addRequirement} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {requirements.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {requirements.map((req, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    {req}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-destructive hover:text-white"
                      onClick={() => removeRequirement(req)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={loading}
              className="flex-1 bg-spu-success text-white hover:bg-spu-success/90"
            >
              {loading ? (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  กำลังโพสต์...
                </>
              ) : (
                <>
                  <Briefcase className="h-4 w-4 mr-2" />
                  โพสต์งาน
                </>
              )}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                ยกเลิก
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default JobPostForm;