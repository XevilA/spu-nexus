import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Briefcase, User, LogOut, Settings, FileText, Menu, X, Home, Search, Bell, MessageSquare } from "lucide-react";

export const Navbar = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const navLinks = [
    { name: "หน้าแรก", path: "/", icon: Home },
    { name: "หางาน", path: "/jobs", icon: Search },
    { name: "เกี่ยวกับเรา", path: "/about", icon: FileText },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-2xl border-b-2 border-pink-100 shadow-lg shadow-pink-100/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate("/")}>
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 rounded-[16px] flex items-center justify-center shadow-lg shadow-pink-500/30 group-hover:scale-110 transition-transform duration-300">
              <Briefcase className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <div className="hidden sm:block">
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 bg-clip-text text-transparent">
                SPU Freelance
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Button
                  key={link.path}
                  variant="ghost"
                  onClick={() => navigate(link.path)}
                  className="text-gray-700 hover:text-pink-600 hover:bg-pink-50 font-semibold px-5 py-2.5 rounded-xl transition-all duration-300"
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {link.name}
                </Button>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {/* Notifications */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-xl transition-all duration-300"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-pink-500 rounded-full animate-pulse" />
                </Button>

                {/* Messages */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-xl transition-all duration-300"
                >
                  <MessageSquare className="w-5 h-5" />
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-3 text-gray-700 hover:text-pink-600 hover:bg-pink-50 px-4 py-2.5 rounded-xl transition-all duration-300 font-semibold"
                    >
                      <div className="w-9 h-9 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-pink-500/30">
                        {user.email?.charAt(0).toUpperCase()}
                      </div>
                      <span className="hidden lg:inline">{user.email?.split("@")[0]}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-56 bg-white border-2 border-pink-100 rounded-2xl shadow-xl shadow-pink-100/50 p-2"
                    align="end"
                  >
                    <DropdownMenuLabel className="text-gray-700 font-bold">บัญชีของฉัน</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-pink-100" />

                    <DropdownMenuItem
                      onClick={() => navigate("/profile")}
                      className="cursor-pointer rounded-xl hover:bg-pink-50 text-gray-700 hover:text-pink-600 font-medium py-2.5"
                    >
                      <User className="w-4 h-4 mr-3" />
                      โปรไฟล์
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => navigate("/portfolio")}
                      className="cursor-pointer rounded-xl hover:bg-pink-50 text-gray-700 hover:text-pink-600 font-medium py-2.5"
                    >
                      <FileText className="w-4 h-4 mr-3" />
                      พอร์ตโฟลิโอ
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => navigate("/settings")}
                      className="cursor-pointer rounded-xl hover:bg-pink-50 text-gray-700 hover:text-pink-600 font-medium py-2.5"
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      ตั้งค่า
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="bg-pink-100" />

                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="cursor-pointer rounded-xl hover:bg-pink-50 text-pink-600 hover:text-pink-700 font-bold py-2.5"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      ออกจากระบบ
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate("/auth")}
                  className="text-gray-700 hover:text-pink-600 hover:bg-pink-50 font-semibold px-5 py-2.5 rounded-xl transition-all duration-300"
                >
                  เข้าสู่ระบบ
                </Button>
                <Button
                  onClick={() => navigate("/auth")}
                  className="bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 hover:from-pink-700 hover:via-rose-700 hover:to-pink-800 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-pink-500/40 hover:shadow-xl hover:shadow-pink-500/50 transition-all duration-300 hover:scale-105"
                >
                  สมัครสมาชิก
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t-2 border-pink-100 animate-fade-in">
            <div className="space-y-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Button
                    key={link.path}
                    variant="ghost"
                    onClick={() => {
                      navigate(link.path);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full justify-start text-gray-700 hover:text-pink-600 hover:bg-pink-50 font-semibold px-4 py-3 rounded-xl transition-all duration-300"
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {link.name}
                  </Button>
                );
              })}

              {user ? (
                <>
                  <div className="h-px bg-pink-100 my-2" />

                  <Button
                    variant="ghost"
                    onClick={() => {
                      navigate("/profile");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full justify-start text-gray-700 hover:text-pink-600 hover:bg-pink-50 font-semibold px-4 py-3 rounded-xl"
                  >
                    <User className="w-4 h-4 mr-3" />
                    โปรไฟล์
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => {
                      navigate("/portfolio");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full justify-start text-gray-700 hover:text-pink-600 hover:bg-pink-50 font-semibold px-4 py-3 rounded-xl"
                  >
                    <FileText className="w-4 h-4 mr-3" />
                    พอร์ตโฟลิโอ
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => {
                      navigate("/settings");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full justify-start text-gray-700 hover:text-pink-600 hover:bg-pink-50 font-semibold px-4 py-3 rounded-xl"
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    ตั้งค่า
                  </Button>

                  <div className="h-px bg-pink-100 my-2" />

                  <Button
                    variant="ghost"
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full justify-start text-pink-600 hover:text-pink-700 hover:bg-pink-50 font-bold px-4 py-3 rounded-xl"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    ออกจากระบบ
                  </Button>
                </>
              ) : (
                <>
                  <div className="h-px bg-pink-100 my-2" />

                  <Button
                    variant="ghost"
                    onClick={() => {
                      navigate("/auth");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full justify-start text-gray-700 hover:text-pink-600 hover:bg-pink-50 font-semibold px-4 py-3 rounded-xl"
                  >
                    เข้าสู่ระบบ
                  </Button>

                  <Button
                    onClick={() => {
                      navigate("/auth");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 hover:from-pink-700 hover:via-rose-700 hover:to-pink-800 text-white font-bold px-4 py-3 rounded-xl shadow-lg shadow-pink-500/40"
                  >
                    สมัครสมาชิก
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
