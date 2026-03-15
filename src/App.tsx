import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage";
import ResourcesPage from "./pages/ResourcesPage";
import ChallengesPage from "./pages/ChallengesPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import TeamPage from "./pages/TeamPage";
import BlogPage from "./pages/BlogPage";
import CodingEditorPage from "./pages/CodingEditorPage";
import BlogArticlePage from "./pages/BlogArticlePage";
import LearnPage from "./pages/LearnPage";
import LearningTopicPage from "./pages/LearningTopicPage";
import PracticeCodingPage from "./pages/PracticeCodingPage";
import LearningDashboardPage from "./pages/LearningDashboardPage";
import CertificatePage from "./pages/CertificatePage";
import CertificateVerificationPage from "./pages/CertificateVerificationPage";
import AdminPage from "./pages/AdminPage";
import NotFound from "./pages/NotFound";
import ProblemLibraryPage from "./pages/ProblemLibraryPage";
import AIToolsPage from "./pages/AIToolsPage";
import ContactPage from "./pages/ContactPage";
import { ReactNode } from "react";

const queryClient = new QueryClient();

/* Route guard – redirects to /login if user is not authenticated */
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

/* Public route – redirect already-logged-in users away from public pages */
function PublicRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  if (user) return <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />;
  return <>{children}</>;
}

const AppRoutes = () => (
  <>
    <Navbar />
    <Routes>
      {/* Home is public — accessible without login */}
      <Route path="/" element={<HomePage />} />
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/events" element={<ProtectedRoute><EventsPage /></ProtectedRoute>} />
      <Route path="/resources" element={<ProtectedRoute><ResourcesPage /></ProtectedRoute>} />
      <Route path="/challenges" element={<ProtectedRoute><ChallengesPage /></ProtectedRoute>} />
      <Route path="/leaderboard" element={<ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
      <Route path="/team" element={<ProtectedRoute><TeamPage /></ProtectedRoute>} />
      <Route path="/blog" element={<ProtectedRoute><BlogPage /></ProtectedRoute>} />
      <Route path="/ai-tools" element={<ProtectedRoute><AIToolsPage /></ProtectedRoute>} />
      <Route path="/contact" element={<ProtectedRoute><ContactPage /></ProtectedRoute>} />

      {/* Protected routes — require login */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/blog/:blogId" element={<ProtectedRoute><BlogArticlePage /></ProtectedRoute>} />
      <Route path="/learn" element={<ProtectedRoute><LearnPage /></ProtectedRoute>} />
      <Route path="/learn/:pathId" element={<ProtectedRoute><LearningTopicPage /></ProtectedRoute>} />
      <Route path="/learn/:pathId/:topicId" element={<ProtectedRoute><LearningTopicPage /></ProtectedRoute>} />
      <Route path="/learn-dashboard" element={<ProtectedRoute><LearningDashboardPage /></ProtectedRoute>} />
      <Route path="/practice" element={<ProtectedRoute><PracticeCodingPage /></ProtectedRoute>} />
      <Route path="/certificate/:pathId" element={<ProtectedRoute><CertificatePage /></ProtectedRoute>} />
      <Route path="/certificate/verify" element={<ProtectedRoute><CertificateVerificationPage /></ProtectedRoute>} />
      <Route path="/certificate/verify/:certId" element={<ProtectedRoute><CertificateVerificationPage /></ProtectedRoute>} />
      <Route path="/editor/:problemId?" element={<ProtectedRoute><CodingEditorPage /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
      <Route path="/problem-library" element={<ProtectedRoute><ProblemLibraryPage /></ProtectedRoute>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
    <Footer />
  </>
);

const App = () => (
  <ThemeProvider defaultTheme="light" storageKey="gfg-theme">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <GoogleOAuthProvider clientId="334537365982-fvdb8kj22ls02m8s7h74lb6kbk1hju1k.apps.googleusercontent.com">
          <AuthProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </AuthProvider>
        </GoogleOAuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
