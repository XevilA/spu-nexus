import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Calendar,
  MapPin,
  Users,
  Clock,
  Bell,
  Star,
  Share2,
  Heart,
  ArrowLeft,
  CalendarDays,
  Trophy,
  GraduationCap,
  Briefcase
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const ImprovedActivities = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('is_published', true)
        .order('start_at', { ascending: true });

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดกิจกรรมได้",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleJoinActivity = async (activityId: string) => {
    if (!user) {
      toast({
        title: "กรุณาเข้าสู่ระบบ",
        description: "คุณต้องเข้าสู่ระบบเพื่อลงทะเบียนกิจกรรม",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    // Here you would implement the activity registration logic
    toast({
      title: "ลงทะเบียนสำเร็จ",
      description: "คุณได้ลงทะเบียนกิจกรรมเรียบร้อยแล้ว"
    });
  };

  const handleNotifyMe = (activityId: string) => {
    if (!user) {
      toast({
        title: "กรุณาเข้าสู่ระบบ",
        description: "คุณต้องเข้าสู่ระบบเพื่อตั้งการแจ้งเตือน",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    toast({
      title: "ตั้งการแจ้งเตือนแล้ว",
      description: "เราจะแจ้งเตือนคุณก่อนกิจกรรมเริ่ม"
    });
  };

  const getActivityStatus = (activity: any) => {
    const now = new Date();
    const startDate = new Date(activity.start_at);
    const endDate = new Date(activity.end_at);
    const registrationDeadline = new Date(activity.registration_deadline);

    if (now > endDate) return 'finished';
    if (now > registrationDeadline) return 'registration_closed';
    if (now < startDate) return 'upcoming';
    return 'ongoing';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Badge className="bg-blue-500 text-white">เปิดรับสมัคร</Badge>;
      case 'ongoing':
        return <Badge className="bg-green-500 text-white">กำลังดำเนินการ</Badge>;
      case 'registration_closed':
        return <Badge className="bg-orange-500 text-white">ปิดรับสมัคร</Badge>;
      case 'finished':
        return <Badge variant="secondary">สิ้นสุดแล้ว</Badge>;
      default:
        return <Badge variant="outline">ไม่ทราบสถานะ</Badge>;
    }
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || 
                           (activity.tags && activity.tags.includes(selectedCategory));
    const activityStatus = getActivityStatus(activity);
    const matchesStatus = selectedStatus === "all" || activityStatus === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = ['all', 'workshop', 'career', 'seminar', 'networking', 'competition'];
  const statusOptions = ['all', 'upcoming', 'ongoing', 'registration_closed', 'finished'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>กำลังโหลดกิจกรรม...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      {/* Header */}
      <div className="bg-gradient-primary text-white">
        <div className="container mx-auto px-6 py-12">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-6 text-white/80 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            กลับสู่หน้าหลัก
          </Button>
          
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
              <CalendarDays className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold">กิจกรรมและอบรม</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              ร่วมกิจกรรมพัฒนาทักษะและเสริมประสบการณ์จากมหาวิทยาลัยเซนต์ปีเตอร์เบิร์ก
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Search and Filter Bar */}
        <div className="glass-card p-6 rounded-xl mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">ค้นหากิจกรรม</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="ค้นหากิจกรรม..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">หมวดหมู่</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48 bg-white">
                  <SelectValue placeholder="เลือกหมวดหมู่" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="career">Career</SelectItem>
                  <SelectItem value="seminar">Seminar</SelectItem>
                  <SelectItem value="networking">Networking</SelectItem>
                  <SelectItem value="competition">Competition</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">สถานะ</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-48 bg-white">
                  <SelectValue placeholder="เลือกสถานะ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  <SelectItem value="upcoming">เปิดรับสมัคร</SelectItem>
                  <SelectItem value="ongoing">กำลังดำเนินการ</SelectItem>
                  <SelectItem value="registration_closed">ปิดรับสมัคร</SelectItem>
                  <SelectItem value="finished">สิ้นสุดแล้ว</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="card-modern text-center">
            <CardContent className="pt-6">
              <CalendarDays className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">{activities.length}</p>
              <p className="text-sm text-muted-foreground">กิจกรรมทั้งหมด</p>
            </CardContent>
          </Card>
          
          <Card className="card-modern text-center">
            <CardContent className="pt-6">
              <Trophy className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">
                {activities.filter(a => getActivityStatus(a) === 'upcoming').length}
              </p>
              <p className="text-sm text-muted-foreground">เปิดรับสมัคร</p>
            </CardContent>
          </Card>
          
          <Card className="card-modern text-center">
            <CardContent className="pt-6">
              <GraduationCap className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">
                {activities.filter(a => a.tags?.includes('workshop')).length}
              </p>
              <p className="text-sm text-muted-foreground">Workshop</p>
            </CardContent>
          </Card>
          
          <Card className="card-modern text-center">
            <CardContent className="pt-6">
              <Briefcase className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">
                {activities.filter(a => a.tags?.includes('career')).length}
              </p>
              <p className="text-sm text-muted-foreground">Career</p>
            </CardContent>
          </Card>
        </div>

        {/* Activities Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((activity) => {
            const status = getActivityStatus(activity);
            return (
              <Card key={activity.id} className="card-modern hover-lift overflow-hidden">
                <div className="aspect-video bg-muted flex items-center justify-center relative">
                  {activity.images && activity.images.length > 0 ? (
                    <img 
                      src={activity.images[0]} 
                      alt={activity.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <CalendarDays className="h-16 w-16 text-muted-foreground" />
                  )}
                  <div className="absolute top-3 right-3">
                    {getStatusBadge(status)}
                  </div>
                </div>
                
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex flex-wrap gap-1">
                      {activity.tags?.slice(0, 2).map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleNotifyMe(activity.id)}>
                      <Bell className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <CardTitle className="text-lg leading-tight line-clamp-2">
                    {activity.title}
                  </CardTitle>
                  
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(activity.start_at).toLocaleDateString('th-TH', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>
                        {new Date(activity.start_at).toLocaleTimeString('th-TH', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })} - {new Date(activity.end_at).toLocaleTimeString('th-TH', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    
                    {activity.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span className="line-clamp-1">{activity.location}</span>
                      </div>
                    )}
                    
                    {activity.max_participants && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>
                          {activity.current_participants || 0}/{activity.max_participants} คน
                        </span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {activity.content}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    {status === 'upcoming' ? (
                      <Button 
                        className="apple-button flex-1 mr-2"
                        onClick={() => handleJoinActivity(activity.id)}
                        disabled={activity.current_participants >= activity.max_participants}
                      >
                        {activity.current_participants >= activity.max_participants ? 'เต็มแล้ว' : 'ลงทะเบียน'}
                      </Button>
                    ) : (
                      <Button variant="outline" className="flex-1 mr-2" disabled>
                        {status === 'ongoing' ? 'กำลังดำเนินการ' : 
                         status === 'registration_closed' ? 'ปิดรับสมัคร' : 'สิ้นสุดแล้ว'}
                      </Button>
                    )}
                    
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Share2 className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Heart className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredActivities.length === 0 && (
          <div className="text-center py-16">
            <CalendarDays className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">ไม่พบกิจกรรมที่ค้นหา</h3>
            <p className="text-muted-foreground">ลองเปลี่ยนคำค้นหาหรือเลือกหมวดหมู่อื่น</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImprovedActivities;