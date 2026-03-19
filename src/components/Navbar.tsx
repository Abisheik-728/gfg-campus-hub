import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { Menu, X, User, LogOut, Shield, Zap, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Shown when NOT logged in
const publicNavLinks = [{ to: "/", label: "Home" }];

// Shown for students only
const studentNavLinks = [
  { to: "/dashboard",   label: "Dashboard" },
  { to: "/learn",       label: "Learn" },
  { to: "/events",      label: "Events" },
  { to: "/resources",   label: "Resources" },
  { to: "/challenges",  label: "Challenges" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/team",        label: "Team" },
  { to: "/blog",        label: "Blog & News" },
  { to: "/ai-tools",   label: "AI Tools" },
  { to: "/contact",     label: "Contact" },
];

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  // Determine which links to show
  const links = user
    ? isAdmin
      ? []           // admin sees NO student nav links
      : studentNavLinks
    : publicNavLinks;

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileOpen(false);
  };

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
          <Link to={isAdmin ? "/admin" : "/"} className="flex items-center gap-2.5 group">
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

        {/* Admin top bar — replaces regular nav pill */}
        {isAdmin ? (
          <div className="hidden lg:flex flex-1 items-center justify-center">
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold">
              <Shield className="h-3.5 w-3.5" />
              Admin Panel — GfG Campus Hub
            </div>
          </div>
        ) : (
          /* Desktop nav links for students/guests */
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
        )}

        {/* Right side buttons */}
        <div className="flex shrink-0 items-center justify-end gap-1.5">
          {user ? (
            <>
              {/* Admin badge + panel link */}
              {isAdmin && (
                <Link to="/admin" className="hidden sm:block">
                  <Button variant="outline" size="sm" className="h-8 border-primary/30 bg-primary/5 hover:bg-primary/15 text-primary text-xs gap-1.5 font-bold">
                    <Shield className="h-3.5 w-3.5" /> Admin Panel
                  </Button>
                </Link>
              )}

              {/* User info chip */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted border border-border text-xs text-muted-foreground">
                <User className="h-3 w-3" />
                {(user.name && user.name !== "User" ? user.name : user.email?.split("@")[0] || "User").split(" ")[0]}
              </div>

              {/* Logout */}
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3 rounded-full hover:bg-destructive/10 hover:text-destructive text-muted-foreground text-xs gap-1.5"
                onClick={handleLogout}
                title="Log out"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
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

            {isAdmin ? (
              /* Admin mobile menu — only admin panel link */
              <div className="space-y-1">
                <div className="px-4 py-2 text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                  <Shield className="h-3.5 w-3.5" /> Admin Panel
                </div>
                <Link
                  to="/admin"
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    location.pathname === "/admin"
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Shield className="h-4 w-4" /> Dashboard
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 opacity-40" />
                </Link>
              </div>
            ) : (
              /* Student/guest mobile menu */
              links.map((l) => (
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
              ))
            )}

            {/* Login / Logout section */}
            {!user ? (
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
            ) : (
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 border border-transparent transition-colors mt-2"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
