import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Calendar, 
  User, 
  ArrowRight,
  Clock,
  Eye,
  Filter,
  Tag,
  Newspaper
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image_url?: string;
  category?: string;
  tags: any[];
  author_id: string;
  is_published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
  slug: string;
}

const News = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);

  const categories = [
    { value: 'all', label: 'ทั้งหมด', icon: Newspaper },
    { value: 'academic', label: 'วิชาการ', icon: User },
    { value: 'activity', label: 'กิจกรรม', icon: Calendar },
    { value: 'announcement', label: 'ประกาศ', icon: Eye },
    { value: 'career', label: 'อาชีพ', icon: ArrowRight }
  ];

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    filterNews();
  }, [news, searchTerm, selectedCategory]);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (error) throw error;
      setNews((data || []).map(item => ({
        ...item,
        tags: Array.isArray(item.tags) ? item.tags : []
      })));
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

  const filterNews = () => {
    let filtered = news;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    setFilteredNews(filtered);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
            <Newspaper className="h-8 w-8" />
            <h1 className="text-4xl font-bold">ข่าวสาร</h1>
          </div>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            ติดตามข่าวสารและประกาศสำคัญจากมหาวิทยาลัยศรีปทุม
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
                placeholder="ค้นหาข่าวสาร..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">หมวดหมู่:</span>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.value)}
                  className="flex items-center gap-2"
                >
                  <IconComponent className="h-4 w-4" />
                  {category.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* News Grid */}
        {filteredNews.length === 0 ? (
          <div className="text-center py-16">
            <Newspaper className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">
              ไม่พบข่าวสาร
            </h3>
            <p className="text-muted-foreground">
              {searchTerm || selectedCategory !== 'all' 
                ? 'ลองเปลี่ยนคำค้นหาหรือหมวดหมู่'
                : 'ยังไม่มีข่าวสารในขณะนี้'
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredNews.map((newsItem) => (
              <Card key={newsItem.id} className="bg-card hover:shadow-lg transition-all duration-300 group">
                {newsItem.cover_image_url && (
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={newsItem.cover_image_url}
                      alt={newsItem.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {newsItem.category && (
                      <Badge className="absolute top-3 left-3 bg-primary text-white">
                        {categories.find(c => c.value === newsItem.category)?.label || newsItem.category}
                      </Badge>
                    )}
                  </div>
                )}
                
                <CardHeader>
                  <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                    {newsItem.title}
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(newsItem.published_at)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {Math.ceil(newsItem.content.length / 200)} นาที
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-muted-foreground line-clamp-3 mb-4">
                    {newsItem.excerpt}
                  </p>
                  
                  {newsItem.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {newsItem.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          <Tag className="h-2 w-2 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                      {newsItem.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{newsItem.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
                  >
                    อ่านต่อ
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {filteredNews.length > 0 && filteredNews.length >= 9 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              โหลดข่าวสารเพิ่มเติม
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default News;