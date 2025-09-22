import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Calendar,
  Share2,
  Eye,
  Filter,
  Clock,
  User,
  Heart,
  MessageCircle,
  BookOpen,
  Newspaper,
  ArrowLeft,
  Mail
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ImprovedNews = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (error) throw error;
      setNews(data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข่าวสารได้",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShare = (newsItem: any) => {
    if (navigator.share) {
      navigator.share({
        title: newsItem.title,
        text: newsItem.excerpt,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "คัดลอกลิงก์แล้ว",
        description: "ลิงก์ข่าวถูกคัดลอกไปยังคลิปบอร์ดแล้ว"
      });
    }
  };

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedNews = [...filteredNews].sort((a, b) => {
    switch (sortBy) {
      case 'latest':
        return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
      case 'oldest':
        return new Date(a.published_at).getTime() - new Date(b.published_at).getTime();
      case 'popular':
        return (b.views || 0) - (a.views || 0);
      default:
        return 0;
    }
  });

  const categories = ['all', 'ข่าวประชาสัมพันธ์', 'ข่าวรับสมัครงาน', 'ข่าวสถานศึกษา', 'ข่าวทั่วไป'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>กำลังโหลดข่าวสาร...</p>
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
              <Newspaper className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold">ข่าวสารและประชาสัมพันธ์</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              ติดตามข่าวสารล่าสุดจากมหาวิทยาลัยเซนต์ปีเตอร์เบิร์ก
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Search and Filter Bar */}
        <div className="glass-card p-6 rounded-xl mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">ค้นหาข่าวสาร</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="ค้นหาข่าวสาร..."
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
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat === 'all' ? 'ทั้งหมด' : cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">เรียงลำดับ</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 bg-white">
                  <SelectValue placeholder="เรียงลำดับ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">ใหม่สุด</SelectItem>
                  <SelectItem value="oldest">เก่าสุด</SelectItem>
                  <SelectItem value="popular">ยอดนิยม</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Featured News */}
        {sortedNews.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              ข่าวเด่น
            </h2>
            <Card className="card-modern hover-lift overflow-hidden">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="aspect-video lg:aspect-auto bg-muted flex items-center justify-center">
                  {sortedNews[0].cover_image_url ? (
                    <img 
                      src={sortedNews[0].cover_image_url} 
                      alt={sortedNews[0].title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Newspaper className="h-16 w-16 text-muted-foreground" />
                  )}
                </div>
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <Badge className="bg-primary text-white">{sortedNews[0].category}</Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {new Date(sortedNews[0].published_at).toLocaleDateString('th-TH')}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 leading-tight">{sortedNews[0].title}</h3>
                  <p className="text-muted-foreground mb-6 line-clamp-3">{sortedNews[0].excerpt}</p>
                  <div className="flex items-center justify-between">
                    <Button className="apple-button">
                      <Eye className="h-4 w-4 mr-2" />
                      อ่านต่อ
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleShare(sortedNews[0])}
                      className="glass-card"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      แชร์
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* News Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedNews.slice(1).map((item, index) => (
            <Card key={item.id} className="card-modern hover-lift overflow-hidden">
              <div className="aspect-video bg-muted flex items-center justify-center">
                {item.cover_image_url ? (
                  <img 
                    src={item.cover_image_url} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Newspaper className="h-8 w-8 text-muted-foreground" />
                )}
              </div>
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="text-xs">
                    {item.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {new Date(item.published_at).toLocaleDateString('th-TH')}
                  </div>
                </div>
                <CardTitle className="text-lg leading-tight line-clamp-2">{item.title}</CardTitle>
                <CardDescription className="line-clamp-2">{item.excerpt}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Button variant="outline" size="sm" className="apple-button text-sm">
                    <Eye className="h-3 w-3 mr-2" />
                    อ่านต่อ
                  </Button>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleShare(item)}
                    >
                      <Share2 className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Heart className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {sortedNews.length === 0 && (
          <div className="text-center py-16">
            <Newspaper className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">ไม่พบข่าวสารที่ค้นหา</h3>
            <p className="text-muted-foreground">ลองเปลี่ยนคำค้นหาหรือเลือกหมวดหมู่อื่น</p>
          </div>
        )}

        {/* Newsletter Subscription */}
        <div className="mt-16">
          <Card className="card-modern text-center p-8">
            <CardHeader>
              <CardTitle className="text-2xl gradient-text">ติดตามข่าวสารจากเรา</CardTitle>
              <CardDescription>
                รับข่าวสารล่าสุดและอัปเดตกิจกรรมจากมหาวิทยาลัยเซนต์ปีเตอร์เบิร์ก
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input 
                  placeholder="ใส่อีเมลของคุณ"
                  className="bg-white"
                />
                <Button className="apple-button">
                  <Mail className="h-4 w-4 mr-2" />
                  สมัครรับข่าวสาร
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ImprovedNews;