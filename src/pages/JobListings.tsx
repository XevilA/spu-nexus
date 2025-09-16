import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MapPin, 
  Clock, 
  Building, 
  DollarSign,
  Search,
  Filter,
  Briefcase
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/ui/navbar";
import { toast } from "@/components/ui/use-toast";

const JobListings = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          companies (
            name,
            verified
          )
        `)
        .eq('status', 'OPEN')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast({
        title: "Error",
        description: "Failed to load jobs",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to apply for jobs",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('applications')
        .insert({
          job_id: jobId,
          student_uid: user.id,
          status: 'APPLIED'
        });

      if (error) throw error;

      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Application Failed",
        description: error.message || "Failed to submit application",
        variant: "destructive"
      });
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.companies?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || job.job_type.toLowerCase().includes(selectedType.toLowerCase());
    const matchesLocation = selectedLocation === "all" || job.location?.toLowerCase().includes(selectedLocation.toLowerCase());
    
    return matchesSearch && matchesType && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navbar />
      
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">ค้นหางาน</h1>
            <p className="text-muted-foreground text-lg">ค้นพบโอกาสทางอาชีพที่เหมาะสมกับคุณ</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Search and Filters */}
        <Card className="bg-white shadow-card mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    placeholder="ค้นหาตำแหน่งงาน, บริษัท, หรือทักษะ..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="ประเภทงาน" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทุกประเภท</SelectItem>
                  <SelectItem value="internship">ฝึกงาน</SelectItem>
                  <SelectItem value="freelance">ฟรีแลนซ์</SelectItem>
                  <SelectItem value="parttime">งานชั่วคราว</SelectItem>
                  <SelectItem value="fulltime">งานเต็มเวลา</SelectItem>
                  <SelectItem value="coop">สหกิจ</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="สถานที่" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทุกสถานที่</SelectItem>
                  <SelectItem value="bangkok">กรุงเทพฯ</SelectItem>
                  <SelectItem value="remote">ทำงานจากที่บ้าน</SelectItem>
                  <SelectItem value="hybrid">แบบผสม</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  ตัวกรองเพิ่มเติม
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Jobs List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-foreground">
              {loading ? "กำลังโหลด..." : `พบ ${filteredJobs.length} ตำแหน่งงาน`}
            </h2>
          </div>

          {loading ? (
            <div className="grid gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="bg-white animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-1/3"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-16 bg-muted rounded mb-4"></div>
                    <div className="flex gap-2">
                      <div className="h-6 bg-muted rounded w-16"></div>
                      <div className="h-6 bg-muted rounded w-16"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="bg-white shadow-card hover:shadow-hover transition-all duration-300 border border-border">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-xl text-foreground mb-2">{job.title}</CardTitle>
                        <div className="flex items-center gap-4 text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Building className="w-4 h-4" />
                            <span>{job.companies?.name || 'Unknown Company'}</span>
                            {job.companies?.verified && (
                              <Badge variant="outline" className="text-xs bg-spu-success text-white">Verified</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{job.location || 'Not specified'}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(job.created_at).toLocaleDateString('th-TH')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge 
                          className={
                            job.job_type === "INTERNSHIP" ? "bg-spu-success text-white" :
                            job.job_type === "FREELANCE" ? "bg-spu-warning text-white" :
                            job.job_type === "PARTTIME" ? "bg-spu-pink text-white" :
                            job.job_type === "COOP" ? "bg-spu-neutral text-white" :
                            "bg-spu-neutral text-white"
                          }
                        >
                          {job.job_type}
                        </Badge>
                        {job.budget_or_salary && (
                          <div className="flex items-center gap-1 text-spu-success font-semibold">
                            <DollarSign className="w-4 h-4" />
                            <span className="text-sm">{job.budget_or_salary}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground mb-4 line-clamp-3">{job.description}</p>
                    
                    {job.requirements && Array.isArray(job.requirements) && job.requirements.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.requirements?.slice(0, 4).map((req: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {req}
                          </Badge>
                        ))}
                        {job.requirements?.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{job.requirements.length - 4} more
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        {job.deadline_at ? `Deadline: ${new Date(job.deadline_at).toLocaleDateString('th-TH')}` : 'No deadline specified'}
                      </span>
                      <Button 
                        className="bg-spu-pink hover:bg-spu-pink/80 text-white"
                        onClick={() => handleApply(job.id)}
                        disabled={!user}
                      >
                        {user ? 'สมัครงาน' : 'เข้าสู่ระบบเพื่อสมัคร'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {!loading && filteredJobs.length === 0 && (
                <Card className="bg-white text-center py-12">
                  <CardContent>
                    <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">ไม่พบตำแหน่งงานที่ตรงกับเงื่อนไข</h3>
                    <p className="text-muted-foreground">ลองเปลี่ยนคำค้นหาหรือตัวกรองเพื่อดูตำแหน่งงานเพิ่มเติม</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobListings;