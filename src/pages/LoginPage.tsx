import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function LoginPage() {
  const { login, signup, user, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", department: "", year: "1", password: "" });

  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const res = await loginWithGoogle();
      if (res.success) {
        toast.success(res.message);
        navigate(res.role === "admin" ? "/admin" : "/dashboard", { replace: true });
      } else if (res.message) {
        toast.error(res.message);
      }
      // empty message = user cancelled popup — do nothing
    } finally {
      setGoogleLoading(false);
    }
  };

  if (user) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isSignup) {
        const res = await signup({
          name: form.name,
          email: form.email,
          department: form.department,
          year: parseInt(form.year),
          password: form.password,
        });
        if (res.success) {
          toast.success(res.message);
          navigate("/dashboard");
        } else {
          toast.error(res.message);
        }
      } else {
        const res = await login(form.email, form.password);
        if (res.success) {
          toast.success(res.message);
          // Wait for onAuthStateChanged to set user role, then navigate
          // Use a brief delay so Firestore profile is loaded before we navigate
          setTimeout(() => {
            // The user object in context will be updated; navigate based on email as fallback
            navigate(form.email.toLowerCase() === "admin@gfgclub.com" ? "/admin" : "/dashboard", { replace: true });
          }, 800);
        } else {
          toast.error(res.message);
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [key]: e.target.value });

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-card p-8 rounded-3xl border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.6)] bg-gradient-to-br from-white/5 to-black/60">
          <div className="text-center mb-8">
            <div className="h-16 w-16 mx-auto mb-4 bg-black/40 rounded-2xl flex items-center justify-center shadow-lg border border-white/10 overflow-hidden">
              <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
            </div>
            <h1 className="text-3xl font-extrabold text-white">{isSignup ? "Create Account" : "Welcome Back"}</h1>
            <p className="text-sm text-gray-400 mt-2">{isSignup ? "Join the GfG Campus Hub community" : "Login to access your dashboard"}</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-4">
                <Input 
                  placeholder="Full Name" 
                  value={form.name} 
                  onChange={set("name")} 
                  required 
                  className="bg-black/40 border-white/10 text-white placeholder-gray-500 focus-visible:ring-primary h-12"
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    placeholder="Department" 
                    value={form.department} 
                    onChange={set("department")} 
                    required 
                    className="bg-black/40 border-white/10 text-white placeholder-gray-500 focus-visible:ring-primary h-12"
                  />
                  <Input 
                    type="number" 
                    placeholder="Year" 
                    min="1" max="5" 
                    value={form.year} 
                    onChange={set("year")} 
                    required 
                    className="bg-black/40 border-white/10 text-white placeholder-gray-500 focus-visible:ring-primary h-12"
                  />
                </div>
              </motion.div>
            )}
            
            <Input 
              type="email" 
              placeholder="Email" 
              value={form.email} 
              onChange={set("email")} 
              required 
              className="bg-black/40 border-white/10 text-white placeholder-gray-500 focus-visible:ring-primary h-12"
            />
            <Input 
              type="password" 
              placeholder="Password" 
              value={form.password} 
              onChange={set("password")} 
              required 
              className="bg-black/40 border-white/10 text-white placeholder-gray-500 focus-visible:ring-primary h-12"
            />
            
            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-12 bg-primary hover:bg-primary/80 font-bold text-white shadow-[0_0_15px_rgba(34,197,94,0.3)] mt-2 transition-transform hover:-translate-y-1 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Please wait..." : isSignup ? "Start Learning" : "Login Securely"}
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
            <span className="w-full h-px border-t border-white/10 block"></span>
            <span className="px-2 whitespace-nowrap">Or continue with</span>
            <span className="w-full h-px border-t border-white/10 block"></span>
          </div>
          
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed w-full justify-center"
            >
              {googleLoading ? (
                <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              {googleLoading ? "Signing in..." : "Continue with Google"}
            </button>
          </div>
          
          <div className="mt-6 text-center text-sm text-gray-400">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button 
              onClick={() => setIsSignup(!isSignup)} 
              className="text-primary font-bold hover:underline transition-colors focus:outline-none"
            >
              {isSignup ? "Login here" : "Sign Up"}
            </button>
          </div>
          
          {!isSignup && (
            <div className="mt-8 pt-6 border-t border-white/10 text-xs text-gray-500">
              <span className="font-bold text-gray-400 block mb-1">Demo Accounts:</span>
              <p>Student: any student email (e.g. email@gfg.com) + any password</p>
              <p>Admin: admin@gfgclub.com / admin123</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
