import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import {
  Trophy, Flame, Star, Code, Award, BookOpen, Library, Sparkles,
  ChevronRight, BookMarked, User as UserIcon, MapPin, GraduationCap,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { getIssuedCertificates, getUserProgress, Certificate } from "@/data/learningData";
import { getXPData, getStreakData } from "@/data/xpSystem";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#8b5cf6"];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 0.61, 0.36, 1] } }),
};

function getLibraryStats() {
  try {
    const s = localStorage.getItem("gfg_problem_libraries");
    if (!s) return { count: 3, totalProblems: 16 };
    const libs: { problemIds: string[] }[] = JSON.parse(s);
    return {
      count: libs.length,
      totalProblems: libs.reduce((sum, l) => sum + l.problemIds.length, 0),
    };
  } catch {
    return { count: 0, totalProblems: 0 };
  }
}

/** Deduplicate certificates by certificateId AND courseName to prevent showing the same course twice */
function deduplicateCerts(certs: Certificate[]): Certificate[] {
  const seenIds = new Set<string>();
  const seenCourses = new Set<string>();
  return certs.filter((c) => {
    if (seenIds.has(c.certificateId) || seenCourses.has(c.courseName)) return false;
    seenIds.add(c.certificateId);
    seenCourses.add(c.courseName);
    return true;
  });
}

export default function DashboardPage() {
  const { user } = useAuth();
  if (!user) return null;

  const rawCertificates = getIssuedCertificates();
  const certificates = deduplicateCerts(rawCertificates);  // fix: remove duplicates
  const learningProgress = getUserProgress();
  const libStats = getLibraryStats();
  const xpData = getXPData();
  const streakData = getStreakData();

  const isAdmin = user.role === "admin";

  // Resolve the best available display name
  const displayName =
    user.name && user.name !== "User"
      ? user.name
      : user.email?.split("@")[0] || "User";

  const progressData = [
    { name: "DSA", value: 45 },
    { name: "Web Dev", value: 25 },
    { name: "CP", value: 20 },
    { name: "Other", value: 10 },
  ];

  // Only show the distribution chart if the user has solved at least one problem
  const hasSolvedProblems = user.problemsSolved > 0;

  const stats = [
    { icon: Sparkles, label: "XP Points", value: xpData.totalXP, accent: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    { icon: BookOpen, label: "Lessons Done", value: learningProgress.completedTopics.length, accent: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { icon: Trophy, label: "Certificates", value: certificates.length, accent: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { icon: Flame, label: "Day Streak", value: streakData.currentStreak || user.codingStreak, accent: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20" },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden page-fade-in">
      {/* Background ambient */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/6 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="gfg-container py-10 relative z-10 space-y-6">

        {/* ── Profile Header ── */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
          className="glass-card p-7 sm:p-8 relative overflow-hidden border-primary/10 group"
        >
          {/* Subtle background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/4 via-transparent to-blue-500/4 pointer-events-none rounded-2xl" />
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/6 rounded-full blur-[60px] pointer-events-none" />

          <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-gradient-to-br from-primary via-emerald-400 to-teal-500 flex items-center justify-center text-3xl font-extrabold text-white shadow-glow-md">
                {displayName[0].toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-primary border-2 border-background flex items-center justify-center">
                <UserIcon className="h-3 w-3 text-white" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted border border-border text-xs font-semibold text-muted-foreground mb-3">
                <UserIcon className="h-3 w-3" /> {isAdmin ? "Administrator" : "Student Profile"}
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mb-1">{displayName}</h1>
              <p className="text-sm text-muted-foreground mb-3">{user.email}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-wide">
                  <GraduationCap className="h-3 w-3" /> {user.department}
                </span>
                {/* Only show Year for non-admin users with a valid year */}
                {!isAdmin && user.year > 0 && (
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 text-xs font-bold uppercase tracking-wide">
                    <MapPin className="h-3 w-3" /> Year {user.year}
                  </span>
                )}
              </div>
            </div>

            {/* Points */}
            <div className="shrink-0 text-center sm:text-right">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                {isAdmin ? "Admin Account" : "Total Points"}
              </p>
              {isAdmin ? (
                <p className="font-display text-2xl sm:text-3xl font-black text-primary leading-none">⚙ Admin</p>
              ) : (
                <>
                  <p className="font-display text-4xl sm:text-5xl font-black text-gradient-gold leading-none tabular-nums">{user.codingPoints}</p>
                  <p className="text-xs font-bold text-amber-500 uppercase tracking-widest mt-2">Global Rank: #42</p>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={i + 1}
              className={`glass-card p-5 sm:p-6 flex flex-col items-center justify-center text-center border ${stat.border}`}
            >
              <div className={`h-11 w-11 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                <stat.icon className={`w-5 h-5 ${stat.accent}`} />
              </div>
              <div className={`font-display text-3xl font-black tabular-nums ${stat.accent} mb-1`}>{stat.value}</div>
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* ── Problem Library CTA ── */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={5}>
          <Link to="/problem-library" className="block group">
            <div className="relative overflow-hidden rounded-2xl border border-indigo-500/25 bg-gradient-to-r from-indigo-500/8 via-transparent to-violet-500/8 p-6 sm:p-7 hover:border-indigo-400/45 transition-all duration-300">
              <div className="absolute -top-16 -right-16 w-56 h-56 bg-gradient-to-br from-indigo-500/15 to-violet-500/15 rounded-full blur-[60px] group-hover:scale-110 transition-transform duration-500 pointer-events-none" />
              <div className="relative flex flex-col sm:flex-row items-center justify-between gap-5">
                <div className="flex items-center gap-5 text-center sm:text-left">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/25 flex items-center justify-center shrink-0">
                    <Library className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-display font-bold text-lg text-foreground">My Problem Library</h3>
                      <span className="px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-500 border border-indigo-500/25 text-[10px] font-black uppercase tracking-wider">
                        {libStats.count} collections
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {libStats.totalProblems} problems saved across your personal libraries for later practice.
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="shrink-0 h-10 px-5 border-indigo-500/25 bg-transparent hover:bg-indigo-500 hover:text-white hover:border-indigo-500 transition-all text-foreground text-sm"
                >
                  <BookMarked className="h-4 w-4 mr-2" /> Open Library
                </Button>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* ── Chart + Achievements ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Pie chart */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={6} className="glass-card p-6 lg:p-7">
            <h3 className="font-display font-bold text-base text-foreground mb-6 flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-500" />
              Problem Solving Distribution
            </h3>
            {hasSolvedProblems ? (
              <>
                <div className="h-56 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={progressData}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={98}
                        paddingAngle={4}
                        dataKey="value"
                        stroke="none"
                      >
                        {progressData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: "12px" }}
                        itemStyle={{ color: "hsl(var(--foreground))" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-black text-foreground tabular-nums leading-none">{user.problemsSolved}</span>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider mt-1">Total Solved</span>
                  </div>
                </div>
                {/* Legend */}
                <div className="flex flex-wrap gap-2.5 justify-center mt-5">
                  {progressData.map((d, i) => (
                    <div key={d.name} className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground px-2.5 py-1.5 bg-muted/50 rounded-full border border-border/60">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                      {d.name} <span className="text-muted-foreground/60 ml-0.5">{d.value}%</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              /* Empty state when no problems solved yet */
              <div className="h-56 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-2xl text-center">
                <Code className="w-10 h-10 text-muted-foreground/40 mb-3" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Start solving problems to see your distribution chart!
                </p>
                <Link to="/practice">
                  <Button variant="outline" size="sm" className="mt-4 text-primary border-primary/30 hover:bg-primary/10">
                    Practice Now
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>

          {/* Achievements */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={7} className="glass-card p-6 lg:p-7 flex flex-col">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-bold text-base text-foreground flex items-center gap-2">
                <Award className="h-4 w-4 text-primary" /> Recent Achievements
              </h3>
              <Link to="/learn-dashboard">
                <Button variant="ghost" size="sm" className="text-xs text-primary hover:bg-primary/10 h-7 px-2.5">
                  View All <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="flex-1 space-y-3">
              {certificates.length > 0 || user.achievements.length > 0 ? (
                <>
                  {certificates.slice(0, 2).map((cert, i) => (
                    <Link
                      key={`cert-${cert.certificateId}`}
                      to="/learn-dashboard"
                      className="flex items-center gap-3.5 p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 hover:border-amber-500/40 hover:bg-amber-500/10 transition-all group"
                    >
                      <div className="h-10 w-10 rounded-xl bg-amber-500/20 text-amber-500 border border-amber-500/25 flex items-center justify-center text-lg shrink-0 group-hover:scale-110 transition-transform">
                        🏅
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-semibold text-sm text-foreground block truncate">{cert.courseName}</span>
                        <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">Course Completed</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </Link>
                  ))}
                  {user.achievements.slice(0, 3).map((a, i) => (
                    <div key={`ach-${i}-${a}`} className="flex items-center gap-3.5 p-3.5 rounded-xl bg-muted/50 border border-border/60 hover:bg-muted transition-colors">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-lg border border-primary/20 shrink-0">🏆</div>
                      <span className="text-sm font-medium text-foreground">{a}</span>
                    </div>
                  ))}
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-border rounded-2xl p-8 text-center min-h-[160px]">
                  <Trophy className="w-10 h-10 text-muted-foreground/40 mb-3" />
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Solve problems and complete courses to earn your first achievement!
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
