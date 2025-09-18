import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Bell, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Briefcase,
  FileText,
  User,
  Building,
  MessageSquare,
  X
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Notification {
  id: string;
  type: 'application_status' | 'portfolio_status' | 'job_posted' | 'message';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  data?: any;
}

const NotificationCenter = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      setupRealtimeSubscription();
    }
  }, [user]);

  const fetchNotifications = async () => {
    // Since we don't have a notifications table yet, let's simulate based on existing data
    try {
      const mockNotifications: Notification[] = [];

      // Fetch recent application updates
      if (profile?.role === 'user') {
        const { data: applications } = await supabase
          .from('applications')
          .select(`
            *,
            jobs (title, companies (name))
          `)
          .eq('student_uid', user?.id)
          .order('updated_at', { ascending: false })
          .limit(5);

        applications?.forEach(app => {
          if (app.status === 'ACCEPTED') {
            mockNotifications.push({
              id: `app_${app.id}`,
              type: 'application_status',
              title: 'ใบสมัครได้รับการตอบรับ!',
              message: `${app.jobs?.companies?.name} ได้ตอบรับใบสมัครงานตำแหน่ง ${app.jobs?.title}`,
              read: false,
              created_at: app.updated_at,
              data: app
            });
          }
        });
      }

      // Fetch portfolio status updates
      const { data: portfolios } = await supabase
        .from('portfolios')
        .select('*')
        .eq('student_uid', user?.id)
        .eq('status', 'APPROVED')
        .order('approved_at', { ascending: false })
        .limit(3);

      portfolios?.forEach(portfolio => {
        if (portfolio.approved_at) {
          mockNotifications.push({
            id: `portfolio_${portfolio.id}`,
            type: 'portfolio_status',
            title: 'Portfolio ได้รับการอนุมัติ!',
            message: 'Portfolio ของคุณผ่านการตรวจสอบและได้รับการอนุมัติแล้ว',
            read: false,
            created_at: portfolio.approved_at,
            data: portfolio
          });
        }
      });

      // For HR users, fetch new applications
      if (profile?.role === 'COMPANY_HR') {
        const { data: company } = await supabase
          .from('companies')
          .select('id')
          .eq('hr_owner_uid', user?.id)
          .single();

        if (company) {
          const { data: newApplications } = await supabase
            .from('applications')
            .select(`
              *,
              jobs!inner (title, company_id)
            `)
            .eq('jobs.company_id', company.id)
            .eq('status', 'APPLIED')
            .order('submitted_at', { ascending: false })
            .limit(5);

          newApplications?.forEach(app => {
            mockNotifications.push({
              id: `new_app_${app.id}`,
              type: 'application_status',
              title: 'ใบสมัครใหม่!',
              message: `มีผู้สมัครใหม่สำหรับตำแหน่ง ${app.jobs?.title}`,
              read: false,
              created_at: app.submitted_at,
              data: app
            });
          });
        }
      }

      // Sort by date and take latest 10
      const sortedNotifications = mockNotifications
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 10);

      setNotifications(sortedNotifications);
      setUnreadCount(sortedNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const setupRealtimeSubscription = () => {
    // Setup real-time subscriptions for relevant tables
    const applicationsChannel = supabase
      .channel('notifications_applications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'applications'
        },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    const portfoliosChannel = supabase
      .channel('notifications_portfolios')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'portfolios'
        },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(applicationsChannel);
      supabase.removeChannel(portfoliosChannel);
    };
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'application_status':
        return <Briefcase className="h-4 w-4" />;
      case 'portfolio_status':
        return <FileText className="h-4 w-4" />;
      case 'job_posted':
        return <Building className="h-4 w-4" />;
      case 'message':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'application_status':
        return 'text-spu-success';
      case 'portfolio_status':
        return 'text-spu-pink';
      case 'job_posted':
        return 'text-spu-warning';
      case 'message':
        return 'text-spu-neutral';
      default:
        return 'text-muted-foreground';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - past.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'เมื่อสักครู่';
    if (diffInMinutes < 60) return `${diffInMinutes} นาทีที่แล้ว`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} ชั่วโมงที่แล้ว`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} วันที่แล้ว`;
    
    return past.toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-destructive text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">การแจ้งเตือน</CardTitle>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs text-spu-pink hover:text-spu-pink/80"
                >
                  อ่านทั้งหมด
                </Button>
              )}
            </div>
            {unreadCount > 0 && (
              <CardDescription>
                คุณมีการแจ้งเตือนใหม่ {unreadCount} รายการ
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>ไม่มีการแจ้งเตือน</p>
                </div>
              ) : (
                <div className="space-y-0">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b transition-colors hover:bg-muted/50 cursor-pointer ${
                        !notification.read ? 'bg-spu-pink/5 border-l-2 border-l-spu-pink' : ''
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-1.5 rounded-full bg-muted ${getNotificationColor(notification.type)}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <h4 className={`text-sm font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div className="h-2 w-2 bg-spu-pink rounded-full flex-shrink-0 mt-1"></div>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {formatTimeAgo(notification.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;