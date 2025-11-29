import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import RequireAuth from "./components/RequireAuth";
import Layout from "./components/Layout";
import LawyerLayout from "./components/LawyerLayout";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/register" element={<Register />} />
            
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
              <Route path="profile" element={<LawyerProfile />} />
              <Route path="settings" element={<LawyerSettings />} />
            </Route>
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
