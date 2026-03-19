import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

export default function LoginPage() {
  const { login, signup, user, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", department: "", year: "1", password: "" });

  const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      try {
        const decoded: any = jwtDecode(credentialResponse.credential);
        loginWithGoogle({
          email: decoded.email,
          name: decoded.name,
          picture: decoded.picture || "",
        });
        toast.success("Successfully logged in with Google!");
        navigate(decoded.email === "admin@gfgclub.com" ? "/admin" : "/dashboard");
      } catch (error) {
        toast.error("Failed to authenticate with Google.");
      }
    }
  };

  const handleGoogleError = () => {
    toast.error("Google login failed. Please try again.");
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
          // Navigate based on the auth state — user will be set by onAuthStateChanged
          // We navigate to admin if the email matches, otherwise dashboard
          // The actual role-redirect also happens via PublicRoute once user is set
          navigate(form.email === "admin@gfgclub.com" ? "/admin" : "/dashboard");
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
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="filled_black"
              shape="pill"
            />
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
