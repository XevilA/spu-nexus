import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Eye, EyeOff, ArrowLeft, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent, mode: "login" | "register") => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "register" && formData.password !== formData.confirmPassword) {
        toast({
          title: "Error",
          description: "Passwords do not match",
          variant: "destructive",
        });
        return;
      }

      let result;
      if (mode === "login") {
        result = await signInWithEmail(formData.email, formData.password);
      } else {
        result = await signUpWithEmail(formData.email, formData.password);
      }

      if (!result.error) {
        toast({
          title: "Success",
          description:
            mode === "login"
              ? "Signed in successfully"
              : "Account created successfully. Please check your email to verify your account.",
        });
      }
    } catch (error) {
      console.error("Auth error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-pink-50/30" />

      {/* Animated blur circles */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-700" />

      <div className="w-full max-w-md relative z-10">
        {/* Back Button - Minimal Style */}
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-8 text-gray-600 hover:text-gray-900 hover:bg-white/60 backdrop-blur-sm rounded-full px-4 transition-all duration-300"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">กลับ</span>
        </Button>

        {/* Main Card */}
        <Card className="border-0 shadow-2xl shadow-gray-200/50 bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden">
          <CardHeader className="text-center space-y-6 pt-12 pb-8 px-8">
            {/* Logo Icon */}
            <div className="mx-auto relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-[24px] flex items-center justify-center shadow-lg shadow-purple-500/30 relative">
                <Sparkles className="w-10 h-10 text-white" strokeWidth={1.5} />
                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-[24px]" />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <CardTitle className="text-4xl font-semibold tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                SPU Smart
              </CardTitle>
              <CardDescription className="text-base text-gray-500 font-light">Welcome back</CardDescription>
            </div>
          </CardHeader>

          <CardContent className="px-8 pb-12">
            <Tabs defaultValue="login" className="w-full">
              {/* Minimal Tab Selector */}
              <TabsList className="grid w-full grid-cols-2 bg-gray-100/80 backdrop-blur-sm p-1 rounded-2xl mb-8">
                <TabsTrigger
                  value="login"
                  className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 text-gray-600 font-medium transition-all duration-300"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 text-gray-600 font-medium transition-all duration-300"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              {/* Login Form */}
              <TabsContent value="login" className="mt-0">
                <form onSubmit={(e) => handleSubmit(e, "login")} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="h-12 bg-gray-50/50 border-gray-200 rounded-xl focus:bg-white focus:border-gray-300 focus:ring-4 focus:ring-gray-100 transition-all duration-300 text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="h-12 bg-gray-50/50 border-gray-200 rounded-xl focus:bg-white focus:border-gray-300 focus:ring-4 focus:ring-gray-100 transition-all duration-300 pr-12 text-base"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 mt-8"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Signing in...
                      </div>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Register Form */}
              <TabsContent value="register" className="mt-0">
                <form onSubmit={(e) => handleSubmit(e, "register")} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="text-sm font-medium text-gray-700">
                      Email Address
                    </Label>
                    <Input
                      id="register-email"
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="h-12 bg-gray-50/50 border-gray-200 rounded-xl focus:bg-white focus:border-gray-300 focus:ring-4 focus:ring-gray-100 transition-all duration-300 text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="text-sm font-medium text-gray-700">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="register-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="h-12 bg-gray-50/50 border-gray-200 rounded-xl focus:bg-white focus:border-gray-300 focus:ring-4 focus:ring-gray-100 transition-all duration-300 pr-12 text-base"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-sm font-medium text-gray-700">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        className="h-12 bg-gray-50/50 border-gray-200 rounded-xl focus:bg-white focus:border-gray-300 focus:ring-4 focus:ring-gray-100 transition-all duration-300 pr-12 text-base"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 mt-8"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating account...
                      </div>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Divider */}
            <div className="my-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-4 text-gray-400 font-light tracking-wide">OR</span>
                </div>
              </div>
            </div>

            {/* Google Sign In */}
            <Button
              variant="outline"
              onClick={signInWithGoogle}
              className="w-full h-12 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-xl transition-all duration-300 shadow-sm hover:shadow group"
              disabled={loading}
            >
              <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-gray-700 font-medium">Continue with Google</span>
            </Button>
          </CardContent>
        </Card>

        {/* Footer Text */}
        <p className="text-center text-sm text-gray-400 mt-8 font-light">
          Secure authentication powered by <span className="font-medium text-gray-500">SPU Smart</span>
        </p>
      </div>
    </div>
  );
};

export default Auth;
