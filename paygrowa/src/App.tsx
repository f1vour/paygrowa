import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/context/AppContext";
import { AdminProvider } from "@/context/AdminContext";
import { ClientProvider } from "@/context/ClientContext";
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
import TasksHubPage from "./pages/TasksHubPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import NotFound from "./pages/NotFound";
import AppShell from "./components/AppShell";
import CommunityTaskPage from "./pages/CommunityTaskPage";

import OrganizationsLandingPage from "./pages/OrganizationsLandingPage";
import OrganizationLoginPage from "./pages/OrganizationLoginPage";
import OrganizationSignupPage from "./pages/OrganizationSignupPage";
import ClientProtected from "./components/client/ClientProtected";
import ClientLayout from "./components/client/ClientLayout";
import ClientDashboard from "./pages/client/ClientDashboard";
import ClientProjects from "./pages/client/ClientProjects";
import ClientCreateProject from "./pages/client/ClientCreateProject";
import ClientAnalytics from "./pages/client/ClientAnalytics";
import ClientPayments from "./pages/client/ClientPayments";
import ClientProfile from "./pages/client/ClientProfile";

import AdminProtected from "./components/admin/AdminProtected";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminTasks from "./pages/admin/AdminTasks";
import AdminSubmissions from "./pages/admin/AdminSubmissions";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminProjects from "./pages/admin/AdminProjects";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <ClientProvider>
        <AdminProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/login" element={<LoginPage />} />

                {/* Contributor app */}
                <Route element={<AppShell />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/tasks" element={<TasksHubPage />} />
                  <Route path="/task/:id" element={<TaskDetailPage />} />
                  <Route path="/community/:id" element={<CommunityTaskPage />} />
                  <Route path="/survey/:id" element={<SurveyPage />} />
                  <Route path="/success" element={<SuccessPage />} />
                  <Route path="/wallet" element={<WalletPage />} />
                  <Route path="/withdraw" element={<WithdrawPage />} />
                  <Route path="/savings" element={<SavingsPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/profile-setup" element={<ProfileSetupPage />} />
                  <Route path="/leaderboard" element={<LeaderboardPage />} />
                </Route>

                {/* Organization (a.k.a. Client) Portal */}
                <Route path="/organizations" element={<OrganizationsLandingPage />} />
                <Route path="/organization/login" element={<OrganizationLoginPage />} />
                <Route path="/organization/signup" element={<OrganizationSignupPage />} />
                <Route
                  path="/organization"
                  element={
                    <ClientProtected>
                      <ClientLayout />
                    </ClientProtected>
                  }
                >
                  <Route index element={<Navigate to="/organization/dashboard" replace />} />
                  <Route path="dashboard" element={<ClientDashboard />} />
                  <Route path="projects" element={<ClientProjects />} />
                  <Route path="create" element={<ClientCreateProject />} />
                  <Route path="analytics" element={<ClientAnalytics />} />
                  <Route path="payments" element={<ClientPayments />} />
                  <Route path="profile" element={<ClientProfile />} />
                </Route>

                {/* Admin Panel */}
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
                  <Route path="projects" element={<AdminProjects />} />
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
      </ClientProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
