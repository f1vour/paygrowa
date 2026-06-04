import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/context/AppContext";
import { AdminProvider } from "@/context/AdminContext";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import TaskDetailPage from "./pages/TaskDetailPage";
import SurveyPage from "./pages/SurveyPage";
import SuccessPage from "./pages/SuccessPage";
import WalletPage from "./pages/WalletPage";
import WithdrawPage from "./pages/WithdrawPage";
import SavingsPage from "./pages/SavingsPage";
import ProfilePage from "./pages/ProfilePage";
import ProfileSetupPage from "./pages/ProfileSetupPage";
import NotFound from "./pages/NotFound";
import AppShell from "./components/AppShell";
import CommunityTaskPage from "./pages/CommunityTaskPage";

import AdminProtected from "./components/admin/AdminProtected";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminTasks from "./pages/admin/AdminTasks";
import AdminSubmissions from "./pages/admin/AdminSubmissions";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSettings from "./pages/admin/AdminSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <AdminProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route element={<AppShell />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/task/:id" element={<TaskDetailPage />} />
                <Route path="/community/:id" element={<CommunityTaskPage />} />
                <Route path="/survey/:id" element={<SurveyPage />} />
                <Route path="/success" element={<SuccessPage />} />
                <Route path="/wallet" element={<WalletPage />} />
                <Route path="/withdraw" element={<WithdrawPage />} />
                <Route path="/savings" element={<SavingsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/profile-setup" element={<ProfileSetupPage />} />
              </Route>


              {/* Admin Panel (allowlist-gated) */}
              <Route
                path="/admin"
                element={
                  <AdminProtected>
                    <AdminLayout />
                  </AdminProtected>
                }
              >
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="tasks" element={<AdminTasks />} />
                <Route path="submissions" element={<AdminSubmissions />} />
                <Route path="payments" element={<AdminPayments />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AdminProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
