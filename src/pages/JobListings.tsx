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
  Briefcase,
  TrendingUp,
  Star,
  CheckCircle2,
  ArrowRight,
  Sparkles,
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
        .from("jobs")
        .select(
          `
          *,
          companies (
            name,
            verified
          )
        `,
        )
        .eq("status", "OPEN")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast({
        title: "ข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลงานได้",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId: string) => {
    if (!user) {
      toast({
        title: "ต้องเข้าสู่ระบบ",
        description: "กรุณาเข้าสู่ระบบเพื่อสมัครงาน",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("applications").insert({
        job_id: jobId,
        student_uid: user.id,
        status: "APPLIED",
      });

      if (error) throw error;

      toast({
        title: "สมัครงานสำเร็จ",
        description: "ใบสมัครของคุณถูกส่งเรียบร้อยแล้ว",
      });
    } catch (error: any) {
      toast({
        title: "สมัครงานไม่สำเร็จ",
        description: error.message || "ไม่สามารถส่งใบสมัครได้",
        variant: "destructive",
      });
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.companies?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || job.job_type.toLowerCase().includes(selectedType.toLowerCase());
    const matchesLocation =
      selectedLocation === "all" || job.location?.toLowerCase().includes(selectedLocation.toLowerCase());

    return matchesSearch && matchesType && matchesLocation;
  });

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case "INTERNSHIP":
        return "bg-gradient-to-r from-pink-500 to-rose-500";
      case "FREELANCE":
        return "bg-gradient-to-r from-purple-500 to-pink-500";
      case "PARTTIME":
        return "bg-gradient-to-r from-rose-500 to-pink-600";
      case "FULLTIME":
        return "bg-gradient-to-r from-pink-600 to-rose-600";
      case "COOP":
        return "bg-gradient-to-r from-pink-400 to-rose-400";
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600";
    }
  };

  const getJobTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      INTERNSHIP: "ฝึกงาน",
      FREELANCE: "ฟรีแลนซ์",
      PARTTIME: "งานชั่วคราว",
      FULLTIME: "งานเต็มเวลา",
      COOP: "สหกิจ",
    };
    return labels[type] || type;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-pink-50/30 to-rose-50/40">
      <Navbar />

      {/* Hero Header */}
      <div className="relative bg-white border-b-2 border-gray-100 overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-pink-300/20 to-rose-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-gradient-to-tr from-rose-300/15 to-pink-300/15 rounded-full blur-3xl" />

        <div className="container mx-auto px-6 py-16 relative z-10">
          <div className="text-center max-w-4xl mx-auto animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2 rounded-full mb-6 shadow-lg shadow-pink-500/30">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-bold">{jobs.length}+ งานใหม่</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 bg-clip-text text-transparent">
                ค้นหางานที่ใช่
              </span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              ค้นพบโอกาสทางอาชีพที่เหมาะสมกับคุณ จากบริษัทชั้นนำทั่วประเทศ
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        {/* Search and Filters Card */}
        <Card className="bg-white/95 backdrop-blur-xl shadow-2xl shadow-pink-100/50 border-0 rounded-[28px] mb-12 animate-fade-in-scale">
          <CardContent className="pt-8 pb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="ค้นหาตำแหน่งงาน, บริษัท, หรือทักษะ..."
                    className="h-14 pl-12 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:bg-white focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all duration-300 text-base font-medium"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="h-14 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all duration-300 text-base font-medium">
                  <SelectValue placeholder="ประเภทงาน" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value="all">ทุกประเภท</SelectItem>
                  <SelectItem value="internship">ฝึกงาน</SelectItem>
                  <SelectItem value="freelance">ฟรีแลนซ์</SelectItem>
                  <SelectItem value="parttime">งานชั่วคราว</SelectItem>
                  <SelectItem value="fulltime">งานเต็มเวลา</SelectItem>
                  <SelectItem value="coop">สหกิจ</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="h-14 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all duration-300 text-base font-medium">
                  <SelectValue placeholder="สถานที่" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value="all">ทุกสถานที่</SelectItem>
                  <SelectItem value="bangkok">กรุงเทพฯ</SelectItem>
                  <SelectItem value="remote">ทำงานจากที่บ้าน</SelectItem>
                  <SelectItem value="hybrid">แบบผสม</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="border-2 border-gray-200 hover:border-pink-300 hover:bg-pink-50 rounded-xl font-semibold transition-all duration-300"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  ตัวกรองเพิ่มเติม
                </Button>
              </div>

              <div className="text-sm text-gray-600 font-medium">
                พบ <span className="text-pink-600 font-bold text-base">{filteredJobs.length}</span> ตำแหน่งงาน
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Jobs List */}
        <div className="space-y-6">
          {loading ? (
            <div className="grid gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="bg-white/80 backdrop-blur-xl rounded-[28px] animate-pulse">
                  <CardHeader className="pb-4">
                    <div className="h-8 bg-gray-200 rounded-xl w-2/3 mb-3"></div>
                    <div className="h-5 bg-gray-200 rounded-lg w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-20 bg-gray-200 rounded-xl mb-4"></div>
                    <div className="flex gap-2">
                      <div className="h-8 bg-gray-200 rounded-full w-20"></div>
                      <div className="h-8 bg-gray-200 rounded-full w-24"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredJobs.map((job, index) => (
                <Card
                  key={job.id}
                  className="bg-white/95 backdrop-blur-xl shadow-lg shadow-gray-100/50 hover:shadow-2xl hover:shadow-pink-100/50 transition-all duration-300 border-0 rounded-[28px] group hover:-translate-y-1 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-pink-500/30 shrink-0">
                            {job.companies?.name?.charAt(0) || "C"}
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors">
                              {job.title}
                            </CardTitle>
                            <div className="flex flex-wrap items-center gap-4 text-gray-600">
                              <div className="flex items-center gap-1.5">
                                <Building className="w-4 h-4" />
                                <span className="font-medium">{job.companies?.name || "Unknown Company"}</span>
                                {job.companies?.verified && (
                                  <CheckCircle2 className="w-4 h-4 text-pink-500 fill-pink-50" />
                                )}
                              </div>
                              <div className="flex items-center gap-1.5">
                                <MapPin className="w-4 h-4" />
                                <span>{job.location || "ไม่ระบุ"}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4" />
                                <span>{new Date(job.created_at).toLocaleDateString("th-TH")}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-3 shrink-0">
                        <Badge
                          className={`${getJobTypeColor(job.job_type)} text-white px-4 py-2 text-sm font-bold shadow-md hover:shadow-lg transition-all duration-300`}
                        >
                          {getJobTypeLabel(job.job_type)}
                        </Badge>
                        {job.budget_or_salary && (
                          <div className="flex items-center gap-1.5 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 px-4 py-2 rounded-xl font-bold shadow-sm">
                            <DollarSign className="w-4 h-4" />
                            <span className="text-sm">{job.budget_or_salary}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0 space-y-6">
                    <p className="text-gray-600 leading-relaxed line-clamp-3">{job.description}</p>

                    {job.requirements && Array.isArray(job.requirements) && job.requirements.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {job.requirements?.slice(0, 5).map((req: string, index: number) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-sm px-3 py-1.5 border-2 border-pink-200 text-pink-700 bg-pink-50 hover:bg-pink-100 transition-colors font-medium"
                          >
                            {req}
                          </Badge>
                        ))}
                        {job.requirements?.length > 5 && (
                          <Badge
                            variant="outline"
                            className="text-sm px-3 py-1.5 border-2 border-gray-200 text-gray-700 bg-gray-50 font-medium"
                          >
                            +{job.requirements.length - 5} อื่นๆ
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-4 border-t-2 border-gray-100">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {job.deadline_at
                            ? `หมดเขต: ${new Date(job.deadline_at).toLocaleDateString("th-TH")}`
                            : "ไม่กำหนดเวลา"}
                        </span>
                      </div>

                      <Button
                        className="bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 hover:from-pink-700 hover:via-rose-700 hover:to-pink-800 text-white font-bold px-8 py-6 rounded-2xl shadow-lg shadow-pink-500/40 hover:shadow-xl hover:shadow-pink-500/50 transition-all duration-300 hover:scale-105 active:scale-95 group"
                        onClick={() => handleApply(job.id)}
                        disabled={!user}
                      >
                        {user ? (
                          <>
                            <span>สมัครงาน</span>
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                          </>
                        ) : (
                          "เข้าสู่ระบบเพื่อสมัคร"
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {!loading && filteredJobs.length === 0 && (
                <Card className="bg-white/95 backdrop-blur-xl rounded-[28px] text-center py-20 shadow-lg animate-fade-in">
                  <CardContent>
                    <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Briefcase className="w-10 h-10 text-pink-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">ไม่พบตำแหน่งงานที่ตรงกับเงื่อนไข</h3>
                    <p className="text-gray-600 text-lg mb-8">ลองเปลี่ยนคำค้นหาหรือตัวกรองเพื่อดูตำแหน่งงานเพิ่มเติม</p>
                    <Button
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedType("all");
                        setSelectedLocation("all");
                      }}
                      className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold px-8 py-6 rounded-2xl shadow-lg shadow-pink-500/40"
                    >
                      รีเซ็ตตัวกรอง
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>

        {/* CTA Section */}
        {!loading && filteredJobs.length > 0 && (
          <Card className="bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 text-white rounded-[28px] mt-12 shadow-2xl shadow-pink-500/40 border-0 animate-fade-in">
            <CardContent className="py-12 text-center">
              <Sparkles className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-3xl font-bold mb-4">ไม่พบงานที่ใช่?</h3>
              <p className="text-xl text-pink-100 mb-8 max-w-2xl mx-auto">
                สมัครสมาชิกเพื่อรับการแจ้งเตือนงานใหม่ที่เหมาะกับคุณ
              </p>
              <Button className="bg-white text-pink-600 hover:bg-pink-50 font-bold px-8 py-6 rounded-2xl shadow-xl hover:scale-105 transition-all duration-300">
                สมัครสมาชิกฟรี
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default JobListings;
