import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  Building2, 
  MapPin, 
  Clock, 
  DollarSign,
  Heart,
  Send,
  Eye,
  Calendar,
  Users
} from "lucide-react";

const JobListings = () => {
  const jobs = [
    {
      id: 1,
      title: "Frontend Developer Intern",
      company: "Tech Startup Co.",
      type: "INTERNSHIP",
      location: "Bangkok",
      salary: "15,000 - 20,000 บาท/เดือน",
      postedDays: 2,
      skills: ["React", "TypeScript", "Tailwind CSS"],
      description: "ร่วมพัฒนา Web Application ที่ทันสมัย ใช้เทคโนโลยีล่าสุด",
      applicants: 23,
      saved: false
    },
    {
      id: 2,
      title: "Mobile App Developer",
      company: "Digital Agency",
      type: "FREELANCE",
      location: "Remote",
      salary: "โปรเจคละ 50,000 - 80,000 บาท",
      postedDays: 1,
      skills: ["Flutter", "React Native", "UI/UX"],
      description: "พัฒนาแอพมือถือสำหรับลูกค้าของเรา ทำงานแบบ Remote",
      applicants: 12,
      saved: true
    },
    {
      id: 3,
      title: "Data Analyst Intern",
      company: "E-commerce Giant",
      type: "COOP",
      location: "Bangkok",
      salary: "18,000 - 25,000 บาท/เดือน",
      postedDays: 5,
      skills: ["Python", "SQL", "Power BI"],
      description: "วิเคราะห์ข้อมูลลูกค้าและยอดขาย สร้างรายงานเชิงธุรกิจ",
      applicants: 45,
      saved: false
    },
    {
      id: 4,
      title: "UX/UI Designer",
      company: "Creative Studio",
      type: "PARTTIME",
      location: "Bangkok",
      salary: "300 - 500 บาท/ชั่วโมง",
      postedDays: 3,
      skills: ["Figma", "Adobe XD", "Prototyping"],
      description: "ออกแบบ User Experience และ Interface สำหรับเว็บและแอพ",
      applicants: 18,
      saved: false
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "INTERNSHIP": return "bg-primary text-white";
      case "COOP": return "bg-spu-success text-white";
      case "FREELANCE": return "bg-spu-warning text-white";
      case "PARTTIME": return "bg-accent text-white";
      default: return "bg-muted";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "INTERNSHIP": return "ฝึกงาน";
      case "COOP": return "สหกิจ";
      case "FREELANCE": return "ฟรีแลนซ์";
      case "PARTTIME": return "พาร์ทไทม์";
      default: return type;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground px-6 py-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">SPU U2B</div>
          <nav className="flex gap-6">
            <Button variant="ghost" className="text-primary-foreground hover:bg-white/10">
              Dashboard
            </Button>
            <Button variant="ghost" className="text-primary-foreground hover:bg-white/10">
              Portfolio
            </Button>
            <Button variant="ghost" className="text-primary-foreground hover:bg-white/10 bg-white/10">
              หางาน
            </Button>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">ค้นหางานและโอกาส</h1>
          <p className="text-muted-foreground">
            งานและโอกาสฝึกงานที่เหมาะกับนักศึกษา SPU
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="shadow-card mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    placeholder="ค้นหาตำแหน่งงาน, บริษัท, หรือทักษะ..." 
                    className="pl-10"
                  />
                </div>
              </div>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="ประเภทงาน" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  <SelectItem value="internship">ฝึกงาน</SelectItem>
                  <SelectItem value="coop">สหกิจ</SelectItem>
                  <SelectItem value="freelance">ฟรีแลนซ์</SelectItem>
                  <SelectItem value="parttime">พาร์ทไทม์</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="สถานที่" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  <SelectItem value="bangkok">กรุงเทพฯ</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="other">จังหวัดอื่นๆ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                ตัวกรองเพิ่มเติม
              </Button>
              <Badge variant="secondary" className="px-3">
                พบ {jobs.length} งาน
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Job Cards */}
        <div className="space-y-6">
          {jobs.map((job) => (
            <Card key={job.id} className="shadow-card hover:shadow-hover transition-all duration-300">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  {/* Company Logo */}
                  <div className="w-16 h-16 bg-gradient-card border rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-8 h-8 text-primary" />
                  </div>

                  {/* Job Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                      <div>
                        <h3 className="text-xl font-semibold mb-1">{job.title}</h3>
                        <p className="text-muted-foreground flex items-center gap-2">
                          <Building2 className="w-4 h-4" />
                          {job.company}
                        </p>
                      </div>
                      <Badge className={getTypeColor(job.type)}>
                        {getTypeLabel(job.type)}
                      </Badge>
                    </div>

                    <p className="text-muted-foreground">{job.description}</p>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    {/* Job Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        {job.salary}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {job.postedDays} วันที่แล้ว
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-3 border-t">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {job.applicants} คนสมัคร
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          ปิดรับใน 7 วัน
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className={job.saved ? "text-red-500 border-red-200" : ""}
                        >
                          <Heart className={`w-4 h-4 ${job.saved ? "fill-current" : ""}`} />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          ดูรายละเอียด
                        </Button>
                        <Button size="sm">
                          <Send className="w-4 h-4 mr-2" />
                          {job.type === "FREELANCE" ? "ส่ง Proposal" : "สมัครเลย"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline" size="lg">
            โหลดงานเพิ่มเติม
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobListings;