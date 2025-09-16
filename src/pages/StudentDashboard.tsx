import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  FileText, 
  Briefcase, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Eye,
  Edit,
  Send,
  Building2,
  Calendar,
  Target
} from "lucide-react";

const StudentDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground px-6 py-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">SPU U2B</div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-white text-primary">
              <CheckCircle className="w-4 h-4 mr-1" />
              Verified Student
            </Badge>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <span className="font-medium">สมชาย ใจดี</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">ยินดีต้อนรับ, สมชาย!</h1>
          <p className="text-muted-foreground">
            วิศวกรรมศาสตร์ ปี 3 • Computer Engineering • คะแนนเฉลี่ย 3.45
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">งานที่สมัคร</p>
                  <p className="text-2xl font-bold text-primary">12</p>
                </div>
                <Briefcase className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Offer ที่ได้รับ</p>
                  <p className="text-2xl font-bold text-spu-success">3</p>
                </div>
                <Target className="h-8 w-8 text-spu-success" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Portfolio Views</p>
                  <p className="text-2xl font-bold">89</p>
                </div>
                <Eye className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">คะแนนเฉลี่ย</p>
                  <p className="text-2xl font-bold">4.2/5</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">ภาพรวม</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="applications">การสมัครงาน</TabsTrigger>
            <TabsTrigger value="progress">ความคืบหน้า</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Portfolio Status */}
              <Card className="shadow-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Portfolio Status
                    </CardTitle>
                    <Badge className="bg-spu-success text-white">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approved
                    </Badge>
                  </div>
                  <CardDescription>
                    Portfolio ของคุณได้รับการอนุมัติแล้ว เมื่อ 15 ธ.ค. 2567
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>ความสมบูรณ์</span>
                      <span className="font-medium">95%</span>
                    </div>
                    <Progress value={95} className="h-2" />
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit className="w-4 h-4 mr-2" />
                      แก้ไข Portfolio
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    กิจกรรมล่าสุด
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-spu-success rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">ได้รับ Offer จาก ABC Company</p>
                        <p className="text-xs text-muted-foreground">2 ชั่วโมงที่แล้ว</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">สมัครงาน Frontend Developer</p>
                        <p className="text-xs text-muted-foreground">1 วันที่แล้ว</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Portfolio ได้รับการดู 5 ครั้ง</p>
                        <p className="text-xs text-muted-foreground">2 วันที่แล้ว</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recommended Jobs */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  งานที่แนะนำสำหรับคุณ
                </CardTitle>
                <CardDescription>
                  งานที่เหมาะกับทักษะและความสนใจของคุณ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border shadow-sm hover:shadow-card transition-shadow">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold">Frontend Developer Intern</h4>
                            <p className="text-sm text-muted-foreground">Tech Startup Co.</p>
                          </div>
                        </div>
                        <Badge variant="secondary">Internship</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        React, TypeScript, Tailwind CSS
                      </p>
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          <Send className="w-4 h-4 mr-2" />
                          สมัครเลย
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border shadow-sm hover:shadow-card transition-shadow">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-accent" />
                          </div>
                          <div>
                            <h4 className="font-semibold">Mobile App Developer</h4>
                            <p className="text-sm text-muted-foreground">Digital Agency</p>
                          </div>
                        </div>
                        <Badge className="bg-spu-warning text-white">Freelance</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Flutter, React Native, UI/UX
                      </p>
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          <Send className="w-4 h-4 mr-2" />
                          ส่ง Proposal
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Portfolio Management</CardTitle>
                <CardDescription>
                  จัดการข้อมูลส่วนตัว ทักษะ และผลงานของคุณ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Portfolio builder จะอยู่ในหน้านี้...
                </p>
                <Button>
                  <Edit className="w-4 h-4 mr-2" />
                  แก้ไข Portfolio
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>การสมัครงานของฉัน</CardTitle>
                <CardDescription>
                  ติดตามสถานะการสมัครงานทั้งหมด
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  รายการการสมัครงานจะอยู่ในหน้านี้...
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>ความคืบหน้าในการทำงาน</CardTitle>
                <CardDescription>
                  ติดตาม Probation และผลการประเมิน
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  การติดตาม Probation จะอยู่ในหน้านี้...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentDashboard;