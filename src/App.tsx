import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuthStore } from "@/lib/auth-store";

// Layouts
import AdminLayout from "@/components/layout/AdminLayout";
import UserLayout from "@/components/layout/UserLayout";

// Pages
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import UploadPage from "@/pages/UploadPage";
import SchedulePage from "@/pages/SchedulePage";
import ChatPage from "@/pages/ChatPage";
import EquipmentPage from "@/pages/EquipmentPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import ReportedIssuesPage from "@/pages/admin/ReportedIssuesPage";
import UserDashboard from "@/pages/user/UserDashboard";
import UserChatPage from "@/pages/user/UserChatPage";
import ReportIssuePage from "@/pages/user/ReportIssuePage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function RootRedirect() {
  const user = useAuthStore((s) => s.user);
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === "admin" ? "/admin" : "/user"} replace />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Admin Portal */}
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout><DashboardPage /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/upload" element={<ProtectedRoute role="admin"><AdminLayout><UploadPage /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/chat" element={<ProtectedRoute role="admin"><AdminLayout><ChatPage /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/schedule" element={<ProtectedRoute role="admin"><AdminLayout><SchedulePage /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/equipment" element={<ProtectedRoute role="admin"><AdminLayout><EquipmentPage /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/analytics" element={<ProtectedRoute role="admin"><AdminLayout><AnalyticsPage /></AdminLayout></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute role="admin"><AdminLayout><ReportedIssuesPage /></AdminLayout></ProtectedRoute>} />

          {/* User (Employee) Portal */}
          <Route path="/user" element={<ProtectedRoute role="user"><UserLayout><UserDashboard /></UserLayout></ProtectedRoute>} />
          <Route path="/user/chat" element={<ProtectedRoute role="user"><UserLayout><UserChatPage /></UserLayout></ProtectedRoute>} />
          <Route path="/user/report" element={<ProtectedRoute role="user"><UserLayout><ReportIssuePage /></UserLayout></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
