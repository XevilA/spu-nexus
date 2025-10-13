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
  Briefcase,
  TrendingUp,
  Sparkles,
  ChevronRight,
  CheckCircle2,
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
        title: "Error",
        description: "Failed to load jobs",
        variant: "destructive",
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
        title: "Application Submitted",
        description: "Your application has been submitted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Application Failed",
        description: error.message || "Failed to submit application",
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

  const getJobTypeStyles = (type: string) => {
    const styles = {
      INTERNSHIP: "bg-gradient-to-r from-blue-500 to-blue-600 text-white",
      FREELANCE: "bg-gradient-to-r from-purple-500 to-purple-600 text-white",
      PARTTIME: "bg-gradient-to-r from-pink-500 to-pink-600 text-white",
      FULLTIME: "bg-gradient-to-r from-green-500 to-green-600 text-white",
      COOP: "bg-gradient-to-r from-orange-500 to-orange-600 text-white",
    };
    return styles[type as keyof typeof styles] || "bg-gradient-to-r from-gray-500 to-gray-600 text-white";
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Navbar />

      {/* Hero Header with Gradient */}
      <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-700" />
        </div>

        <div className="relative container mx-auto px-6 py-16 md:py-24">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-white font-medium">Find Your Dream Job</span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-6xl font-semibold text-white mb-6 tracking-tight">
              Discover Your
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Next Opportunity
              </span>
            </h1>
            <p className="text-xl text-gray-300 font-light mb-8">
              Connect with leading companies and explore career opportunities that match your skills and passion
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-semibold text-white">{jobs.length}+</div>
                  <div className="text-sm text-gray-400">Active Jobs</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-500/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Building className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-semibold text-white">50+</div>
                  <div className="text-sm text-gray-400">Companies</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-pink-500/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-pink-400" />
                </div>
                <div>
                  <div className="text-2xl font-semibold text-white">1000+</div>
                  <div className="text-sm text-gray-400">Applications</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        {/* Search and Filters Card */}
        <Card className="border-0 shadow-2xl shadow-gray-200/50 bg-white rounded-3xl mb-12 overflow-hidden -mt-20 relative z-10">
          <CardContent className="p-8">
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search by job title, company, or skills..."
                className="pl-14 h-14 bg-gray-50 border-0 rounded-2xl text-base focus:bg-white focus:ring-2 focus:ring-gray-200 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="h-12 bg-gray-50 border-0 rounded-xl hover:bg-gray-100 transition-colors">
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                  <SelectItem value="parttime">Part-time</SelectItem>
                  <SelectItem value="fulltime">Full-time</SelectItem>
                  <SelectItem value="coop">Co-op</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="h-12 bg-gray-50 border-0 rounded-xl hover:bg-gray-100 transition-colors">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="bangkok">Bangkok</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Results Count */}
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-gray-600 font-medium">
                {loading ? "Loading..." : `Found ${filteredJobs.length} opportunities`}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Jobs List */}
        <div className="space-y-6">
          {loading ? (
            <div className="grid gap-6">
              {[1, 2, 3].map((i) => (
                <Card
                  key={i}
                  className="border-0 shadow-xl shadow-gray-200/50 bg-white rounded-3xl overflow-hidden animate-pulse"
                >
                  <CardHeader className="p-8">
                    <div className="h-6 bg-gray-100 rounded-xl w-1/2 mb-4"></div>
                    <div className="h-4 bg-gray-100 rounded-lg w-1/3"></div>
                  </CardHeader>
                  <CardContent className="px-8 pb-8">
                    <div className="h-20 bg-gray-100 rounded-xl mb-6"></div>
                    <div className="flex gap-3">
                      <div className="h-8 bg-gray-100 rounded-lg w-20"></div>
                      <div className="h-8 bg-gray-100 rounded-lg w-20"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredJobs.length === 0 ? (
            <Card className="border-0 shadow-xl shadow-gray-200/50 bg-white rounded-3xl text-center py-20">
              <CardContent>
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">No jobs found</h3>
                <p className="text-gray-500 font-light max-w-md mx-auto">
                  Try adjusting your search criteria or filters to discover more opportunities
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {filteredJobs.map((job, index) => (
                <Card
                  key={job.id}
                  className="border-0 shadow-xl shadow-gray-200/50 bg-white hover:shadow-2xl hover:shadow-gray-300/50 rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-1 group"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  <CardHeader className="p-8 pb-6">
                    <div className="flex justify-between items-start gap-6">
                      {/* Left Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-4 mb-4">
                          {/* Company Logo Placeholder */}
                          <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                            <Building className="w-7 h-7 text-gray-600" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-2xl font-semibold text-gray-900 mb-2 truncate group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all">
                              {job.title}
                            </CardTitle>
                            <div className="flex items-center gap-3 text-gray-600">
                              <span className="font-medium">{job.companies?.name || "Unknown Company"}</span>
                              {job.companies?.verified && (
                                <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-lg">
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span className="text-xs font-medium">Verified</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Job Info */}
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" />
                            <span>{job.location || "Not specified"}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            <span>
                              {new Date(job.created_at).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                          {job.budget_or_salary && (
                            <div className="flex items-center gap-1.5 text-green-600 font-semibold">
                              <DollarSign className="w-4 h-4" />
                              <span>{job.budget_or_salary}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right Badge */}
                      <Badge
                        className={`${getJobTypeStyles(job.job_type)} px-4 py-1.5 rounded-xl font-medium shadow-lg shrink-0`}
                      >
                        {job.job_type}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="px-8 pb-8">
                    {/* Description */}
                    <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">{job.description}</p>

                    {/* Requirements Tags */}
                    {job.requirements && Array.isArray(job.requirements) && job.requirements.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {job.requirements?.slice(0, 5).map((req: string, idx: number) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors rounded-lg px-3 py-1"
                          >
                            {req}
                          </Badge>
                        ))}
                        {job.requirements?.length > 5 && (
                          <Badge
                            variant="outline"
                            className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 text-blue-700 rounded-lg px-3 py-1"
                          >
                            +{job.requirements.length - 5} more
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="text-sm text-gray-500">
                        {job.deadline_at ? (
                          <span>
                            Deadline:{" "}
                            <span className="font-medium text-gray-700">
                              {new Date(job.deadline_at).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          </span>
                        ) : (
                          <span className="text-gray-400">No deadline</span>
                        )}
                      </div>

                      <Button
                        className={`
                          h-11 px-6 rounded-xl font-medium shadow-lg transition-all duration-300
                          ${
                            user
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                          }
                        `}
                        onClick={() => handleApply(job.id)}
                        disabled={!user}
                      >
                        {user ? (
                          <span className="flex items-center gap-2">
                            Apply Now
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </span>
                        ) : (
                          "Sign in to Apply"
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobListings;
