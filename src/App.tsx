import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ChatbotProvider } from "./contexts/ChatbotContext";
import RequireAuth from "./components/RequireAuth";
import Layout from "./components/Layout";
import LawyerLayout from "./components/LawyerLayout";
import AdminLayout from "./components/AdminLayout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import DocumentAnalysis from "./pages/DocumentAnalysis";
import Lawyers from "./pages/Lawyers";
import Updates from "./pages/Updates";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import LawyerDashboard from "./pages/lawyer/Dashboard";
import Consultations from "./pages/lawyer/Consultations";
import LawyerProfile from "./pages/lawyer/Profile";
import LawyerSettings from "./pages/lawyer/Settings";
import PendingApproval from "./pages/lawyer/PendingApproval";
import Messages from "./pages/Messages";
import VerifyEmail from "./pages/VerifyEmail";
// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/Dashboard";
import LawyerApplications from "./pages/admin/LawyerApplications";
import LawyerDetail from "./pages/admin/LawyerDetail";
import RejectLawyer from "./pages/admin/RejectLawyer";
import AdminUsers from "./pages/admin/Users";
import AdminLegalUpdates from "./pages/admin/LegalUpdates";
import NewLegalUpdate from "./pages/admin/NewLegalUpdate";
import EditLegalUpdate from "./pages/admin/EditLegalUpdate";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ChatbotProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-email" element={
                <RequireAuth roles={['USER', 'LAWYER']} allowUnverified>
                  <VerifyEmail />
                </RequireAuth>
              } />
            
            {/* User Routes - Protected */}
            <Route path="/app" element={
              <RequireAuth roles={['USER']}>
                <Layout />
              </RequireAuth>
            }>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="documents" element={<Documents />} />
              <Route path="documents/:id" element={<DocumentAnalysis />} />
              <Route path="lawyers" element={<Lawyers />} />
              <Route path="messages" element={<Messages />} />
              <Route path="updates" element={<Updates />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            
            {/* Lawyer Routes - Protected */}
            <Route path="/lawyer" element={
              <RequireAuth roles={['LAWYER']}>
                <LawyerLayout />
              </RequireAuth>
            }>
              <Route index element={<LawyerDashboard />} />
              <Route path="dashboard" element={<LawyerDashboard />} />
              <Route path="consultations" element={<Consultations />} />
              <Route path="messages" element={<Messages />} />
              <Route path="profile" element={<LawyerProfile />} />
              <Route path="settings" element={<LawyerSettings />} />
            </Route>

            {/* Lawyer Pending Approval Page */}
            <Route path="/lawyer/pending" element={
              <RequireAuth roles={['LAWYER']} allowUnverified allowPending>
                <PendingApproval />
              </RequireAuth>
            } />
            
            {/* Admin Portal Routes */}
            <Route path="/admin-portal/login" element={<AdminLogin />} />
            <Route path="/admin-portal" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="lawyers" element={<LawyerApplications />} />
              <Route path="lawyers/:id" element={<LawyerDetail />} />
              <Route path="lawyers/:id/reject" element={<RejectLawyer />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="legal-updates" element={<AdminLegalUpdates />} />
              <Route path="legal-updates/new" element={<NewLegalUpdate />} />
              <Route path="legal-updates/:id/edit" element={<EditLegalUpdate />} />
            </Route>
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </ChatbotProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
