import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Building, 
  FileText, 
  Check, 
  X, 
  Search,
  Eye,
  AlertCircle,
  Settings,
  UserCheck,
  Briefcase
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Navbar } from "@/components/ui/navbar";

const AdminDashboard = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [pendingPortfolios, setPendingPortfolios] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.role !== 'ADMIN') return;
    fetchDashboardData();
  }, [profile]);

  const fetchDashboardData = async () => {
    try {
      // Fetch pending portfolios
      const { data: portfolios } = await supabase
        .from('portfolios')
        .select(`
          *,
          profiles:student_uid (
            first_name,
            last_name,
            email
          )
        `)
        .eq('status', 'SUBMITTED');

      // Fetch companies
      const { data: companiesData } = await supabase
        .from('companies')
        .select('*');

      // Fetch users
      const { data: usersData } = await supabase
        .from('profiles')
        .select('*');

      setPendingPortfolios(portfolios || []);
      setCompanies(companiesData || []);
      setUsers(usersData || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลได้",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePortfolioApproval = async (portfolioId: string, approved: boolean) => {
    try {
      const { error } = await supabase
        .from('portfolios')
        .update({
          status: approved ? 'APPROVED' : 'CHANGES_REQUESTED',
          approved_by: user?.id,
          approved_at: approved ? new Date().toISOString() : null
        })
        .eq('id', portfolioId);

      if (error) throw error;

      toast({
        title: approved ? "อนุมัติแล้ว" : "ส่งกลับแก้ไข",
        description: approved ? "Portfolio ได้รับการอนุมัติแล้ว" : "Portfolio ถูกส่งกลับเพื่อแก้ไข"
      });

      fetchDashboardData();
    } catch (error) {
      console.error('Error updating portfolio:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัปเดตสถานะได้",
        variant: "destructive"
      });
    }
  };

  const handleCompanyVerification = async (companyId: string, verified: boolean) => {
    try {
      const { error } = await supabase
        .from('companies')
        .update({ verified })
        .eq('id', companyId);

      if (error) throw error;

      toast({
        title: verified ? "ยืนยันแล้ว" : "ยกเลิกการยืนยัน",
        description: verified ? "บริษัทได้รับการยืนยันแล้ว" : "ยกเลิกการยืนยันบริษัท"
      });

      fetchDashboardData();
    } catch (error) {
      console.error('Error updating company:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัปเดตสถานะได้",
        variant: "destructive"
      });
    }
  };

  if (profile?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
            <h2 className="text-xl font-semibold mb-2">ไม่มีสิทธิ์เข้าถึง</h2>
            <p className="text-muted-foreground">คุณไม่มีสิทธิ์เข้าถึงหน้านี้</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>กำลังโหลด...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">แดชบอร์ดผู้ดูแลระบบ</h1>
          <p className="text-muted-foreground">จัดการระบบ SPU U2B</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Portfolio รอการอนุมัติ</p>
                  <p className="text-2xl font-bold">{pendingPortfolios.length}</p>
                </div>
                <FileText className="h-8 w-8 text-spu-warning" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">บริษัทที่ลงทะเบียน</p>
                  <p className="text-2xl font-bold">{companies.length}</p>
                </div>
                <Building className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ผู้ใช้ทั้งหมด</p>
                  <p className="text-2xl font-bold">{users.length}</p>
                </div>
                <Users className="h-8 w-8 text-spu-success" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">บริษัทที่ยืนยันแล้ว</p>
                  <p className="text-2xl font-bold">{companies.filter(c => c.verified).length}</p>
                </div>
                <UserCheck className="h-8 w-8 text-spu-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="portfolios" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="portfolios">Portfolio รอการอนุมัติ</TabsTrigger>
            <TabsTrigger value="companies">จัดการบริษัท</TabsTrigger>
            <TabsTrigger value="users">จัดการผู้ใช้</TabsTrigger>
          </TabsList>

          <TabsContent value="portfolios" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Portfolio รอการอนุมัติ</CardTitle>
                <CardDescription>
                  ตรวจสอบและอนุมัติ Portfolio ของนักศึกษา
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingPortfolios.map((portfolio: any) => (
                  <div key={portfolio.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">
                          {portfolio.profiles?.first_name} {portfolio.profiles?.last_name}
                        </h4>
                        <p className="text-sm text-muted-foreground">{portfolio.profiles?.email}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          ส่งเมื่อ: {new Date(portfolio.submitted_at).toLocaleDateString('th-TH')}
                        </p>
                      </div>
                      <Badge className="bg-spu-warning text-white">รอการอนุมัติ</Badge>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        ดู Portfolio
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-spu-success text-white hover:bg-spu-success/90"
                        onClick={() => handlePortfolioApproval(portfolio.id, true)}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        อนุมัติ
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handlePortfolioApproval(portfolio.id, false)}
                      >
                        <X className="w-4 h-4 mr-2" />
                        ส่งกลับแก้ไข
                      </Button>
                    </div>
                  </div>
                ))}

                {pendingPortfolios.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    ไม่มี Portfolio รอการอนุมัติ
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="companies" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>จัดการบริษัท</CardTitle>
                <CardDescription>
                  ตรวจสอบและยืนยันบริษัทที่ลงทะเบียน
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="ค้นหาบริษัท..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>

                {companies
                  .filter(company => 
                    company.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((company: any) => (
                    <div key={company.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{company.name}</h4>
                          <p className="text-sm text-muted-foreground">{company.domain}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            ลงทะเบียนเมื่อ: {new Date(company.created_at).toLocaleDateString('th-TH')}
                          </p>
                        </div>
                        <Badge className={company.verified ? "bg-spu-success text-white" : "bg-spu-warning text-white"}>
                          {company.verified ? "ยืนยันแล้ว" : "รอการยืนยัน"}
                        </Badge>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleCompanyVerification(company.id, !company.verified)}
                        >
                          {company.verified ? (
                            <>
                              <X className="w-4 h-4 mr-2" />
                              ยกเลิกการยืนยัน
                            </>
                          ) : (
                            <>
                              <Check className="w-4 h-4 mr-2" />
                              ยืนยัน
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}

                {companies.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    ไม่มีบริษัทที่ลงทะเบียน
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>จัดการผู้ใช้</CardTitle>
                <CardDescription>
                  ดูและจัดการผู้ใช้ในระบบ
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="ค้นหาผู้ใช้..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                  />
                </div>

                {users
                  .filter(user => 
                    `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((user: any) => (
                    <div key={user.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{user.first_name} {user.last_name}</h4>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            สมัครเมื่อ: {new Date(user.created_at).toLocaleDateString('th-TH')}
                          </p>
                        </div>
                        <Badge variant="secondary">{user.role}</Badge>
                      </div>
                    </div>
                  ))}

                {users.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    ไม่มีผู้ใช้ในระบบ
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;