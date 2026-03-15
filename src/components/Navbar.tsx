import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { Menu, X, User, LogOut, Shield, Trophy, LayoutDashboard, Zap, Sun, Moon, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

// Shown only when the user is NOT logged in
const publicNavLinks = [
  { to: "/", label: "Home" },
];

// Shown only when the user IS logged in
const authNavLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/learn", label: "Learn" },
  { to: "/events", label: "Events" },
  { to: "/resources", label: "Resources" },
  { to: "/challenges", label: "Challenges" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/team", label: "Team" },
  { to: "/blog", label: "Blog & News" },
  { to: "/ai-tools", label: "AI Tools" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const links = user ? authNavLinks : publicNavLinks;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border/60 bg-background/80 backdrop-blur-xl shadow-sm"
          : "border-b border-transparent bg-background/60 backdrop-blur-md"
      }`}
    >
      <div className="gfg-container flex h-16 items-center justify-between gap-4">

        {/* Logo */}
        <div className="flex shrink-0 items-center">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative h-8 w-8 rounded-lg overflow-hidden bg-primary/10 border border-primary/20 group-hover:border-primary/40 transition-colors flex items-center justify-center">
              <img
                src="/logo.png"
                alt="GfG Logo"
                className="h-6 w-6 object-contain group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <span className="font-display font-700 text-base tracking-tight text-foreground hidden md:block">
              GfG Campus{" "}
              <span className="text-primary">Hub</span>
            </span>
          </Link>
        </div>

        {/* Desktop nav links */}
        <div className="hidden lg:flex flex-1 items-center justify-center px-4">
          <div className="flex items-center gap-0.5 p-1 rounded-full bg-muted/50 border border-border/50">
            {links.map((l) => {
              const isActive = location.pathname === l.to;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`relative px-3 py-1.5 xl:px-3.5 rounded-full text-[13px] xl:text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-white shadow-glow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-background"
                  }`}
                >
                  {l.label === "AI Tools" ? (
                    <span className="flex items-center gap-1">
                      <Zap className={`w-3 h-3 ${isActive ? "text-white" : "text-primary"}`} />
                      {l.label}
                    </span>
                  ) : (
                    l.label
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right side */}
        <div className="flex shrink-0 items-center justify-end gap-1.5">

          {/* Auth controls */}
          {user ? (
            <>
              {isAdmin && (
                <Link to="/admin" className="hidden sm:block">
                  <Button variant="outline" size="sm" className="h-8 border-border/60 bg-transparent hover:bg-muted text-foreground text-xs gap-1.5">
                    <Shield className="h-3.5 w-3.5 text-primary" /> Admin
                  </Button>
                </Link>
              )}
              <div className="flex items-center gap-1 pl-2 border-l border-border/60 ml-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => { logout(); navigate("/"); }}
                  title="Log out"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </Button>
              </div>
            </>
          ) : (
            <Link to="/login">
              <Button
                size="sm"
                className="h-8 px-4 bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-full shadow-glow-sm hover:shadow-glow-md transition-all"
              >
                Login
              </Button>
            </Link>
          )}

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-8 w-8 rounded-full hover:bg-muted ml-0.5"
          >
            {theme === "dark"
              ? <Sun className="h-3.5 w-3.5" />
              : <Moon className="h-3.5 w-3.5" />}
          </Button>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border/60 bg-background/95 backdrop-blur-xl shadow-lg animate-fade-in">
          <div className="gfg-container py-4 space-y-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  location.pathname === l.to
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent"
                }`}
              >
                <span className="flex items-center gap-2">
                  {l.label === "AI Tools" && <Zap className="w-4 h-4 text-primary" />}
                  {l.label}
                </span>
                <ChevronRight className="h-3.5 w-3.5 opacity-40" />
              </Link>
            ))}

            {/* Login link for guests */}
            {!user && (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold bg-primary text-white mt-2"
              >
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4" /> Login
                </span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            )}

            {/* Authenticated extras */}
            {user && (
              <div className="pt-3 mt-3 border-t border-border/60 space-y-1">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-muted border border-transparent"
                >
                  <span className="flex items-center gap-2"><LayoutDashboard className="h-4 w-4 text-primary" /> Dashboard</span>
                  <ChevronRight className="h-3.5 w-3.5 opacity-40" />
                </Link>
                <Link
                  to="/learn-dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-muted border border-transparent"
                >
                  <span className="flex items-center gap-2"><Trophy className="h-4 w-4 text-yellow-500" /> My Progress</span>
                  <ChevronRight className="h-3.5 w-3.5 opacity-40" />
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-foreground hover:bg-muted border border-transparent"
                  >
                    <span className="flex items-center gap-2"><Shield className="h-4 w-4 text-primary" /> Admin Panel</span>
                    <ChevronRight className="h-3.5 w-3.5 opacity-40" />
                  </Link>
                )}
                <button
                  onClick={() => { logout(); setMobileOpen(false); navigate("/"); }}
                  className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 border border-transparent transition-colors"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
