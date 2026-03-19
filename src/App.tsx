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

/** Wait for auth hydration, then require login */
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

/** Wait for auth hydration, then require admin role */
function AdminRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

/** Wait for auth hydration, then block admin from student-only routes */
function StudentRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "admin") return <Navigate to="/admin" replace />;
  return <>{children}</>;
}

/** Redirect logged-in users away from login page */
function PublicRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (user) return <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />;
  return <>{children}</>;
}

const AppRoutes = () => {
  const { user, isLoading } = useAuth();
  const isAdmin = !isLoading && user?.role === "admin";

  return (
    <>
      <Navbar />
      <Routes>
        {/* Always public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />

        {/* Student-only routes */}
        <Route path="/dashboard"      element={<StudentRoute><DashboardPage /></StudentRoute>} />
        <Route path="/events"         element={<StudentRoute><EventsPage /></StudentRoute>} />
        <Route path="/resources"      element={<StudentRoute><ResourcesPage /></StudentRoute>} />
        <Route path="/challenges"     element={<StudentRoute><ChallengesPage /></StudentRoute>} />
        <Route path="/leaderboard"    element={<StudentRoute><LeaderboardPage /></StudentRoute>} />
        <Route path="/team"           element={<StudentRoute><TeamPage /></StudentRoute>} />
        <Route path="/blog"           element={<StudentRoute><BlogPage /></StudentRoute>} />
        <Route path="/blog/:blogId"   element={<StudentRoute><BlogArticlePage /></StudentRoute>} />
        <Route path="/ai-tools"       element={<StudentRoute><AIToolsPage /></StudentRoute>} />
        <Route path="/contact"        element={<StudentRoute><ContactPage /></StudentRoute>} />
        <Route path="/learn"          element={<StudentRoute><LearnPage /></StudentRoute>} />
        <Route path="/learn/:pathId"  element={<StudentRoute><LearningTopicPage /></StudentRoute>} />
        <Route path="/learn/:pathId/:topicId" element={<StudentRoute><LearningTopicPage /></StudentRoute>} />
        <Route path="/learn-dashboard"  element={<StudentRoute><LearningDashboardPage /></StudentRoute>} />
        <Route path="/practice"       element={<StudentRoute><PracticeCodingPage /></StudentRoute>} />
        <Route path="/certificate/:pathId" element={<StudentRoute><CertificatePage /></StudentRoute>} />
        <Route path="/certificate/verify" element={<ProtectedRoute><CertificateVerificationPage /></ProtectedRoute>} />
        <Route path="/certificate/verify/:certId" element={<ProtectedRoute><CertificateVerificationPage /></ProtectedRoute>} />
        <Route path="/editor/:problemId?" element={<StudentRoute><CodingEditorPage /></StudentRoute>} />
        <Route path="/problem-library"  element={<StudentRoute><ProblemLibraryPage /></StudentRoute>} />

        {/* Admin-only route */}
        <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      {/* Footer is hidden inside the Admin panel area — Admin page has its own layout */}
      {!isAdmin && <Footer />}
    </>
  );
};

const App = () => (
  <ThemeProvider>
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
