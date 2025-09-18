import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  User, 
  GraduationCap, 
  Code, 
  Award, 
  Globe,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Star,
  Link as LinkIcon,
  Download,
  Eye,
  MessageSquare
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface PortfolioViewerProps {
  portfolioId?: string;
  studentId?: string;
  trigger?: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const PortfolioViewer = ({ 
  portfolioId, 
  studentId, 
  trigger,
  isOpen,
  onOpenChange 
}: PortfolioViewerProps) => {
  const { toast } = useToast();
  const [portfolio, setPortfolio] = useState<any>(null);
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // Use controlled or internal state
  const isDialogOpen = isOpen !== undefined ? isOpen : open;
  const setDialogOpen = onOpenChange || setOpen;

  useEffect(() => {
    if (isDialogOpen && (portfolioId || studentId)) {
      fetchPortfolioData();
    }
  }, [isDialogOpen, portfolioId, studentId]);

  const fetchPortfolioData = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('portfolios')
        .select(`
          *,
          profiles:student_uid (
            first_name,
            last_name,
            email,
            faculty,
            program,
            year,
            avatar_url
          )
        `);

      if (portfolioId) {
        query = query.eq('id', portfolioId);
      } else if (studentId) {
        query = query.eq('student_uid', studentId).eq('status', 'APPROVED');
      }

      const { data, error } = await query.single();

      if (error) throw error;

      setPortfolio(data);
      setStudent(data.profiles);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลด Portfolio ได้",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getSkillLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'expert': return 'bg-spu-success text-white';
      case 'advanced': return 'bg-spu-pink text-white';
      case 'intermediate': return 'bg-spu-warning text-white';
      case 'beginner': return 'bg-spu-neutral text-white';
      default: return 'bg-muted text-foreground';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const DefaultTrigger = (
    <Button variant="outline" size="sm">
      <Eye className="h-4 w-4 mr-2" />
      ดู Portfolio
    </Button>
  );

  return (
    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        {trigger || DefaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            e-Portfolio
          </DialogTitle>
          <DialogDescription>
            ประวัติและผลงานของนักศึกษา
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>กำลังโหลด...</p>
            </div>
          </div>
        ) : portfolio && student ? (
          <div className="space-y-6">
            {/* Student Header */}
            <Card className="bg-gradient-card">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-spu-pink/10 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-spu-pink" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">
                      {student.first_name} {student.last_name}
                    </h3>
                    <p className="text-muted-foreground">{student.email}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <GraduationCap className="h-4 w-4" />
                        {student.faculty} - {student.program}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        ปี {student.year}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge className="bg-spu-success text-white">
                      {portfolio.status === 'APPROVED' ? 'ได้รับการอนุมัติ' : portfolio.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills Section */}
            {portfolio.skills && portfolio.skills.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    ทักษะ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {portfolio.skills.map((skill: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <h4 className="font-medium">{skill.name}</h4>
                          {skill.category && (
                            <p className="text-sm text-muted-foreground">{skill.category}</p>
                          )}
                        </div>
                        <Badge className={getSkillLevelColor(skill.level)}>
                          {skill.level}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Projects Section */}
            {portfolio.projects && portfolio.projects.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    โปรเจกต์
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {portfolio.projects.map((project: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold">{project.title}</h4>
                        {project.status && (
                          <Badge variant="outline">{project.status}</Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-3">{project.description}</p>
                      
                      {project.technologies && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {(Array.isArray(project.technologies) ? project.technologies : []).map((tech: string, techIndex: number) => (
                            <Badge key={techIndex} variant="secondary" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div>
                          {project.startDate && (
                            <span>{formatDate(project.startDate)}</span>
                          )}
                          {project.endDate && (
                            <span> - {formatDate(project.endDate)}</span>
                          )}
                        </div>
                        {project.url && (
                          <a 
                            href={project.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-spu-pink hover:underline"
                          >
                            <LinkIcon className="h-3 w-3" />
                            ดูโปรเจกต์
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Education Section */}
            {portfolio.education && portfolio.education.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    การศึกษา
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {portfolio.education.map((edu: any, index: number) => (
                    <div key={index} className="border-l-2 border-spu-pink pl-4">
                      <h4 className="font-semibold">{edu.degree}</h4>
                      <p className="text-muted-foreground">{edu.institution}</p>
                      <p className="text-sm text-muted-foreground">
                        {edu.startYear} - {edu.endYear} | GPA: {edu.gpa}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Certificates Section */}
            {portfolio.certificates && portfolio.certificates.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    ใบรับรอง
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {portfolio.certificates.map((cert: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <h4 className="font-medium">{cert.title}</h4>
                        <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(cert.date)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {cert.verified && (
                          <Badge className="bg-spu-success text-white">
                            <Star className="h-3 w-3 mr-1" />
                            ยืนยันแล้ว
                          </Badge>
                        )}
                        {cert.url && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={cert.url} target="_blank" rel="noopener noreferrer">
                              <LinkIcon className="h-3 w-3" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Languages Section */}
            {portfolio.languages && portfolio.languages.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    ภาษา
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {portfolio.languages.map((lang: any, index: number) => (
                      <div key={index} className="text-center p-3 bg-muted rounded-lg">
                        <h4 className="font-medium">{lang.language}</h4>
                        <Badge variant="outline" className="mt-1">
                          {lang.level}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Work Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>ความต้องการในการทำงาน</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {portfolio.availability && (
                  <div>
                    <h4 className="font-medium mb-2">ความพร้อมในการทำงาน</h4>
                    <p className="text-muted-foreground">{portfolio.availability}</p>
                  </div>
                )}

                {portfolio.expected_rate && (
                  <div>
                    <h4 className="font-medium mb-2">อัตราค่าจ้างที่คาดหวัง</h4>
                    <p className="text-muted-foreground">{portfolio.expected_rate} บาท</p>
                  </div>
                )}

                {portfolio.work_types && portfolio.work_types.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">ประเภทงานที่สนใจ</h4>
                    <div className="flex flex-wrap gap-2">
                      {portfolio.work_types.map((type: string, index: number) => (
                        <Badge key={index} variant="outline">{type}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {portfolio.locations && portfolio.locations.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">สถานที่ทำงานที่ต้องการ</h4>
                    <div className="flex flex-wrap gap-2">
                      {portfolio.locations.map((location: string, index: number) => (
                        <Badge key={index} variant="outline" className="gap-1">
                          <MapPin className="h-3 w-3" />
                          {location}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                ดาวน์โหลด PDF
              </Button>
              <Button className="flex-1 bg-spu-pink text-white hover:bg-spu-pink/80">
                <MessageSquare className="h-4 w-4 mr-2" />
                ติดต่อนักศึกษา
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">ไม่พบข้อมูล Portfolio</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PortfolioViewer;