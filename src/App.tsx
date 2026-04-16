import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/components/AppLayout";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import DashboardPage from "@/pages/DashboardPage";
import VendorListPage from "@/pages/VendorListPage";
import RFQListPage from "@/pages/RFQListPage";
import QuotationListPage from "@/pages/QuotationListPage";
import POListPage from "@/pages/POListPage";
import AuditLogPage from "@/pages/AuditLogPage";
import UserManagementPage from "@/pages/UserManagementPage";
import RoleManagementPage from "@/pages/RoleManagementPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedPage = ({ children, roles }: { children: React.ReactNode; roles?: any[] }) => (
  <ProtectedRoute roles={roles}>
    <AppLayout>{children}</AppLayout>
  </ProtectedRoute>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<ProtectedPage><DashboardPage /></ProtectedPage>} />
              <Route path="/analytics" element={<ProtectedPage roles={['ADMIN', 'PROCUREMENT_MANAGER']}><AnalyticsPage /></ProtectedPage>} />
              <Route path="/vendors" element={<ProtectedPage roles={['ADMIN', 'PROCUREMENT_MANAGER', 'COMPLIANCE_OFFICER']}><VendorListPage /></ProtectedPage>} />
              <Route path="/rfqs" element={<ProtectedPage roles={['ADMIN', 'PROCUREMENT_MANAGER', 'VENDOR']}><RFQListPage /></ProtectedPage>} />
              <Route path="/quotations" element={<ProtectedPage roles={['PROCUREMENT_MANAGER', 'VENDOR']}><QuotationListPage /></ProtectedPage>} />
              <Route path="/purchase-orders" element={<ProtectedPage roles={['ADMIN', 'PROCUREMENT_MANAGER', 'VENDOR']}><POListPage /></ProtectedPage>} />
              <Route path="/audit-logs" element={<ProtectedPage roles={['ADMIN', 'COMPLIANCE_OFFICER']}><AuditLogPage /></ProtectedPage>} />
              <Route path="/users" element={<ProtectedPage roles={['ADMIN']}><UserManagementPage /></ProtectedPage>} />
              <Route path="/roles" element={<ProtectedPage roles={['ADMIN']}><RoleManagementPage /></ProtectedPage>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
