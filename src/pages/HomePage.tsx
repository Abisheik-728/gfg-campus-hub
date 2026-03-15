import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, Calendar, Trophy, BookOpen, Code, Users,
  BrainCircuit, Rocket, Zap, Flame, Globe, GitBranch, BarChart2,
  LayoutDashboard, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { students, events } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 0.61, 0.36, 1] } },
};

const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const learningPaths = [
  {
    title: "Data Structures & Algorithms",
    desc: "Master arrays, trees, graphs and ace coding interviews.",
    icon: BrainCircuit,
    accent: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    glow: "hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]",
  },
  {
    title: "Full Stack Web Dev",
    desc: "Build production-grade apps from frontend to backend.",
    icon: Code,
    accent: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    glow: "hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]",
  },
  {
    title: "Competitive Programming",
    desc: "Compete globally and climb the ranking ladder.",
    icon: Trophy,
    accent: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    glow: "hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]",
  },
];

const techTags = [
  "React", "Python", "DSA", "Leetcode", "Node.js", "Hackathon",
  "TypeScript", "System Design", "ML/AI", "Docker", "Git", "SQL",
  "C++", "GraphQL", "REST APIs", "Cloud", "Open Source",
];

const mockBlogs = [
  {
    id: "1",
    title: "Getting Started with React Three Fiber",
    category: "Web Dev",
    readTime: "5 min",
    date: "Oct 24, 2026",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Mastering Dynamic Programming",
    category: "Algorithms",
    readTime: "8 min",
    date: "Oct 22, 2026",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "Winning Your First Hackathon",
    category: "Advice",
    readTime: "6 min",
    date: "Oct 20, 2026",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop",
  },
];

export default function HomePage() {
  const { user } = useAuth();
  const topCoders = [...students]
    .filter((s) => s.role === "student")
    .sort((a, b) => b.codingPoints - a.codingPoints)
    .slice(0, 5);
  const upcomingEvents = events.filter((e) => !e.isPast).slice(0, 3);
  const tagList = [...techTags, ...techTags]; // duplicate for seamless scroll

  return (
    <div className="min-h-screen page-fade-in">

      {/* ──────────────────── HERO ──────────────────── */}
      <section className="relative overflow-hidden min-h-[92vh] flex flex-col justify-center border-b border-border/50 bg-background !mt-0 !pt-0">

        {/* Dot-grid background */}
        <div className="absolute inset-0 hero-grid-bg pointer-events-none" />
        {/* Radial vignette over grid */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 55% at 50% 50%, transparent 30%, hsl(var(--background)) 100%)" }}
        />
        {/* Ambient glow blobs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/8 rounded-full blur-[80px] pointer-events-none" />

        <div className="gfg-container relative z-10 py-24 flex flex-col items-center text-center">

          {/* Live badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-semibold mb-8 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            1,242 coders active on campus
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-extrabold tracking-tight leading-[1.06] mb-6 max-w-4xl"
          >
            Where Campus Coders{" "}
            <span className="text-gradient-green">Level Up</span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.35 }}
            className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl font-light leading-relaxed"
          >
            Learn programming, enter hackathons, climb the leaderboard, and build
            your dev reputation — all in one place designed for campus coders.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.48 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            {user ? (
              <Link to="/dashboard">
                <Button
                  size="lg"
                  className="h-12 px-7 font-semibold bg-primary hover:bg-primary/90 text-white rounded-full shadow-glow-md hover:shadow-glow-lg transition-all"
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button
                  size="lg"
                  className="h-12 px-7 font-semibold bg-primary hover:bg-primary/90 text-white rounded-full shadow-glow-md hover:shadow-glow-lg transition-all"
                >
                  Join the Club
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}
            <Link to="/resources">
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-7 font-medium rounded-full border-border/70 hover:bg-muted hover:border-primary/30 transition-all"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                View Resources
              </Button>
            </Link>
            <Link to="/challenges">
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-7 font-medium rounded-full border-border/70 hover:bg-muted hover:border-primary/30 transition-all"
              >
                <Trophy className="mr-2 h-4 w-4 text-amber-500" />
                Challenges
              </Button>
            </Link>
          </motion.div>

          {/* Floating stat chips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap items-center justify-center gap-3 mt-14"
          >
            {[
              { icon: Users, label: "Active Members", value: "1,242+" },
              { icon: Code, label: "Problems Solved", value: "48,300+" },
              { icon: Calendar, label: "Events Hosted", value: "90+" },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-card border border-border/60 text-sm shadow-sm"
              >
                <Icon className="h-3.5 w-3.5 text-primary" />
                <span className="font-semibold text-foreground">{value}</span>
                <span className="text-muted-foreground text-xs">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </section>

      {/* ──────────────────── TECH TAG SCROLL ──────────────────── */}
      <div className="py-8 border-b border-border/40 bg-muted/30 overflow-hidden">
        <div className="flex gap-3 animate-scroll-left w-max">
          {tagList.map((tag, i) => (
            <span
              key={i}
              className="px-3.5 py-1.5 rounded-full bg-card border border-border/60 text-xs font-medium text-muted-foreground whitespace-nowrap select-none"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ──────────────────── STATS ──────────────────── */}
      <section className="gfg-container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-3 gap-5"
        >
          {[
            { icon: Flame, label: "Active Coders", value: "1,242", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
            { icon: Code, label: "Problems Solved", value: "48,300+", color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
            { icon: Calendar, label: "Weekly Events", value: "12", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className={`glass-card p-8 flex flex-col items-center text-center border ${stat.border}`}
            >
              <div className={`h-11 w-11 rounded-xl ${stat.bg} flex items-center justify-center mb-4`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className="font-display text-4xl font-extrabold text-foreground mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ──────────────────── LEARNING PATHS ──────────────────── */}
      <section className="gfg-container">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px w-8 bg-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-widest">Learn</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              Master Your Skills
            </h2>
            <p className="text-muted-foreground mt-2 text-base max-w-md">
              Structured paths from beginner to pro. Pick a domain and start today.
            </p>
          </div>
          <Link to="/learn" className="hidden sm:flex items-center gap-1 text-sm text-primary font-medium hover:gap-2 transition-all">
            All Paths <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {learningPaths.map((path, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className={`glass-card p-7 flex flex-col border ${path.border} ${path.glow} group cursor-pointer`}
            >
              <div className={`h-12 w-12 rounded-xl ${path.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <path.icon className={`h-6 w-6 ${path.accent}`} />
              </div>
              <h3 className="font-display text-lg font-bold text-foreground mb-2 tracking-tight">{path.title}</h3>
              <p className="text-sm text-muted-foreground mb-5 flex-1 leading-relaxed">{path.desc}</p>
              <Link to="/learn" className={`flex items-center gap-1.5 text-sm font-semibold ${path.accent} group-hover:gap-2.5 transition-all`}>
                Start Path <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ──────────────────── EVENTS + LEADERBOARD ──────────────────── */}
      <section className="gfg-container grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* Events */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-px w-6 bg-primary" />
                <span className="text-xs font-semibold text-primary uppercase tracking-widest">Live</span>
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground tracking-tight">Upcoming Events</h2>
            </div>
            <Link to="/events" className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
              View all <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-4">
            {upcomingEvents.map((event, i) => (
              <motion.div
                key={event.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                transition={{ delay: i * 0.08 }}
                className="glass-card p-5 group flex gap-4 items-start"
              >
                {/* Date badge */}
                <div className="shrink-0 w-[58px] h-[58px] rounded-xl bg-primary/10 border border-primary/20 flex flex-col items-center justify-center">
                  <span className="text-[10px] font-bold text-primary uppercase leading-none">
                    {new Date(event.date).toLocaleString("default", { month: "short" })}
                  </span>
                  <span className="font-display text-xl font-extrabold text-foreground leading-none mt-0.5">
                    {new Date(event.date).getDate()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="mb-1.5">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        event.type === "hackathon"
                          ? "bg-primary/10 text-primary border-primary/20"
                          : event.type === "contest"
                          ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                          : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      {event.type}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-base text-foreground mb-1 group-hover:text-primary transition-colors leading-tight">
                    {event.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">{event.description}</p>
                  <Link to="/events">
                    <Button
                      size="sm"
                      className="h-7 px-3 text-xs bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-full border border-primary/20 hover:border-primary transition-all"
                    >
                      Register Now →
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-px w-6 bg-amber-500" />
                <span className="text-xs font-semibold text-amber-500 uppercase tracking-widest">Rankings</span>
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground tracking-tight">Leaderboard</h2>
            </div>
            <Link to="/leaderboard" className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
              Full standings <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="glass-card overflow-hidden !p-0">
            <div className="divide-y divide-border/60">
              {topCoders.map((coder, i) => (
                <motion.div
                  key={coder.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  transition={{ delay: i * 0.06 }}
                  className={`flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/40 ${
                    i === 0 ? "bg-amber-500/5" : ""
                  }`}
                >
                  {/* Rank */}
                  <div className="w-8 shrink-0 text-center">
                    {i === 0 ? <span className="text-lg">🥇</span>
                      : i === 1 ? <span className="text-lg">🥈</span>
                      : i === 2 ? <span className="text-lg">🥉</span>
                      : <span className="font-display font-bold text-sm text-muted-foreground">#{i + 1}</span>}
                  </div>
                  {/* Avatar */}
                  <div
                    className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      i === 0
                        ? "bg-amber-500/15 text-amber-600 ring-2 ring-amber-500/30"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {coder.avatar}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground truncate">{coder.name}</p>
                    <p className="text-xs text-muted-foreground">{coder.problemsSolved} solved</p>
                  </div>
                  {/* Score */}
                  <div className="shrink-0 text-right">
                    <p className="font-display font-bold text-primary text-sm">{coder.codingPoints}</p>
                    <p className="text-[10px] text-muted-foreground">pts</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────── BLOGS ──────────────────── */}
      <section className="gfg-container mb-24">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px w-8 bg-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-widest">Editorial</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground tracking-tight">Latest Tech Blogs</h2>
          </div>
          <Link to="/blog" className="hidden sm:flex items-center gap-1 text-sm text-primary font-medium hover:gap-2 transition-all">
            All Articles <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {mockBlogs.map((blog, i) => (
            <motion.div
              key={blog.id}
              variants={fadeUp}
              className="glass-card overflow-hidden !p-0 group"
            >
              {/* Image */}
              <div className="h-48 overflow-hidden relative">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                  style={{ transform: "scale(1)" }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.07)")}
                  onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                {/* Category chip */}
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white uppercase tracking-wider">
                  {blog.category}
                </span>
              </div>
              {/* Content */}
              <div className="p-5">
                <div className="flex items-center text-xs text-muted-foreground mb-2.5 gap-2">
                  <span>{blog.date}</span>
                  <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                  <span>{blog.readTime} read</span>
                </div>
                <h3 className="font-display font-bold text-base text-foreground mb-3 leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                  {blog.title}
                </h3>
                <Link to="/blog" className="flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:gap-2.5 transition-all">
                  Read Article <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ──────────────────── CTA BANNER ──────────────────── */}
      <section className="gfg-container mb-24 !mt-0">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-emerald-500/5 p-10 text-center"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-primary/10 rounded-full blur-[60px] pointer-events-none" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-5">
              <Rocket className="h-3 w-3" /> Ready to launch?
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-foreground mb-3 tracking-tight">
              Join 1,200+ Campus Coders
            </h2>
            <p className="text-muted-foreground mb-7 max-w-md mx-auto leading-relaxed">
              Start solving problems, join hackathons, earn certificates, and build
              your developer profile today.
            </p>
            {user ? (
              <Link to="/dashboard">
                <Button size="lg" className="h-12 px-8 font-semibold bg-primary hover:bg-primary/90 text-white rounded-full shadow-glow-md hover:shadow-glow-lg transition-all">
                  <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button size="lg" className="h-12 px-8 font-semibold bg-primary hover:bg-primary/90 text-white rounded-full shadow-glow-md hover:shadow-glow-lg transition-all">
                  Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </motion.div>
      </section>

    </div>
  );
}
