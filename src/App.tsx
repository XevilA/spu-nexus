import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import StudentDashboard from "./pages/StudentDashboard";
import JobListings from "./pages/JobListings";
import PortfolioBuilder from "./pages/PortfolioBuilder";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAuth from "./pages/AdminAuth";
import Auth from "./pages/Auth";
import BusinessRegistration from "./pages/BusinessRegistration";
import BusinessDashboard from "./pages/BusinessDashboard";
import JobAcceptance from "./pages/JobAcceptance";
import JobSeekerDashboard from "./pages/JobSeekerDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/jobs" element={<JobListings />} />
            <Route path="/portfolio" element={<PortfolioBuilder />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin-auth" element={<AdminAuth />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/business-registration" element={<BusinessRegistration />} />
            <Route path="/business-dashboard" element={<BusinessDashboard />} />
            <Route path="/job-acceptance/:applicationId" element={<JobAcceptance />} />
            <Route path="/job-seeker" element={<JobSeekerDashboard />} />
            <Route path="/employer" element={<EmployerDashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
