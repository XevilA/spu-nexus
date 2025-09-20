import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Calendar, 
  MapPin, 
  Users,
  Clock,
  Filter,
  Activity,
  ArrowRight,
  Star,
  User
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface ActivityItem {
  id: string;
  title: string;
  content: string;
  location?: string;
  start_at: string;
  end_at: string;
  registration_deadline?: string;
  max_participants?: number;
  current_participants: number;
  author_id: string;
  is_published: boolean;
  images: any[];
  tags: any[];
  created_at: string;
  updated_at: string;
  slug: string;
}

const Activities = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [filteredActivities, setFilteredActivities] = useState<ActivityItem[]>([]);

  const filters = [
    { value: 'all', label: 'ทั้งหมด', icon: Activity },
    { value: 'upcoming', label: 'กำลังจะมาถึง', icon: Clock },
    { value: 'registration_open', label: 'เปิดรับสมัคร', icon: Users },
    { value: 'popular', label: 'ยอดนิยม', icon: Star }
  ];

  useEffect(() => {
    fetchActivities();
  }, []);

  useEffect(() => {
    filterActivities();
  }, [activities, searchTerm, selectedFilter]);

  const fetchActivities = async () => {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('is_published', true)
        .order('start_at', { ascending: true });

      if (error) throw error;
      setActivities((data || []).map(item => ({
        ...item,
        images: Array.isArray(item.images) ? item.images : [],
        tags: Array.isArray(item.tags) ? item.tags : []
      })));
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

  const filterActivities = () => {
    let filtered = activities;
    const now = new Date();

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    switch (selectedFilter) {
      case 'upcoming':
        filtered = filtered.filter(item => new Date(item.start_at) > now);
        break;
      case 'registration_open':
        filtered = filtered.filter(item => 
          item.registration_deadline && 
          new Date(item.registration_deadline) > now &&
          (item.max_participants ? item.current_participants < item.max_participants : true)
        );
        break;
      case 'popular':
        filtered = filtered.filter(item => 
          item.max_participants && 
          (item.current_participants / item.max_participants) > 0.7
        );
        break;
    }

    setFilteredActivities(filtered);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateOnly = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getActivityStatus = (activity: ActivityItem) => {
    const now = new Date();
    const startDate = new Date(activity.start_at);
    const endDate = new Date(activity.end_at);
    const registrationDeadline = activity.registration_deadline ? new Date(activity.registration_deadline) : null;

    if (endDate < now) {
      return { label: 'สิ้นสุดแล้ว', variant: 'secondary' as const };
    }
    
    if (startDate <= now && endDate >= now) {
      return { label: 'กำลังดำเนินการ', variant: 'default' as const };
    }
    
    if (registrationDeadline && registrationDeadline < now) {
      return { label: 'ปิดรับสมัครแล้ว', variant: 'destructive' as const };
    }
    
    if (activity.max_participants && activity.current_participants >= activity.max_participants) {
      return { label: 'เต็มแล้ว', variant: 'destructive' as const };
    }
    
    return { label: 'เปิดรับสมัคร', variant: 'outline' as const };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="bg-card">
                <div className="h-48 bg-muted animate-pulse rounded-t-lg" />
                <CardHeader>
                  <div className="h-4 bg-muted animate-pulse rounded mb-2" />
                  <div className="h-3 bg-muted animate-pulse rounded w-3/4" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted animate-pulse rounded" />
                    <div className="h-3 bg-muted animate-pulse rounded w-5/6" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-gradient-hero text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Activity className="h-8 w-8" />
            <h1 className="text-4xl font-bold">กิจกรรม</h1>
          </div>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            เข้าร่วมกิจกรรมและอีเวนต์ต่างๆ ของมหาวิทยาลัยศรีปทุม
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter Section */}
        <div className="mb-8 space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหากิจกรรม..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">ตัวกรอง:</span>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => {
              const IconComponent = filter.icon;
              return (
                <Button
                  key={filter.value}
                  variant={selectedFilter === filter.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter(filter.value)}
                  className="flex items-center gap-2"
                >
                  <IconComponent className="h-4 w-4" />
                  {filter.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Activities Grid */}
        {filteredActivities.length === 0 ? (
          <div className="text-center py-16">
            <Activity className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">
              ไม่พบกิจกรรม
            </h3>
            <p className="text-muted-foreground">
              {searchTerm || selectedFilter !== 'all' 
                ? 'ลองเปลี่ยนคำค้นหาหรือตัวกรอง'
                : 'ยังไม่มีกิจกรรมในขณะนี้'
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredActivities.map((activity) => {
              const status = getActivityStatus(activity);
              
              return (
                <Card key={activity.id} className="bg-card hover:shadow-lg transition-all duration-300 group">
                  {activity.images.length > 0 && (
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={activity.images[0]}
                        alt={activity.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge 
                        variant={status.variant}
                        className="absolute top-3 left-3"
                      >
                        {status.label}
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader>
                    <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                      {activity.title}
                    </CardTitle>
                    
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDateOnly(activity.start_at)}</span>
                        {activity.end_at !== activity.start_at && (
                          <>
                            <span>-</span>
                            <span>{formatDateOnly(activity.end_at)}</span>
                          </>
                        )}
                      </div>
                      
                      {activity.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3" />
                          <span className="line-clamp-1">{activity.location}</span>
                        </div>
                      )}
                      
                      {activity.max_participants && (
                        <div className="flex items-center gap-2">
                          <Users className="h-3 w-3" />
                          <span>
                            {activity.current_participants}/{activity.max_participants} คน
                          </span>
                          <div className="flex-1 bg-muted rounded-full h-1">
                            <div 
                              className="bg-primary h-1 rounded-full transition-all duration-300"
                              style={{
                                width: `${Math.min((activity.current_participants / activity.max_participants) * 100, 100)}%`
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-3 mb-4">
                      {activity.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                    </p>
                    
                    {activity.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {activity.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {activity.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{activity.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    <Button 
                      variant="outline" 
                      className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
                    >
                      ดูรายละเอียด
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Load More Button */}
        {filteredActivities.length > 0 && filteredActivities.length >= 9 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              โหลดกิจกรรมเพิ่มเติม
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Activities;