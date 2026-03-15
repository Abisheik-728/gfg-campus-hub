import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Terminal, Trophy, ArrowRight, PlayCircle, Flame, Sparkles, GraduationCap } from "lucide-react";
import { learningPaths, getPathProgress, getUserProgress } from "@/data/learningData";
import { getXPData, getStreakData } from "@/data/xpSystem";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Progress } from "@/components/ui/progress";

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

const categoryColors: Record<string, string> = {
  python: "from-blue-500/20 to-blue-600/5 border-blue-500/30 hover:border-blue-400/50",
  java: "from-orange-500/20 to-orange-600/5 border-orange-500/30 hover:border-orange-400/50",
  c: "from-blue-400/20 to-blue-500/5 border-blue-400/30 hover:border-blue-300/50",
  cpp: "from-indigo-500/20 to-indigo-600/5 border-indigo-500/30 hover:border-indigo-400/50",
  js: "from-yellow-500/20 to-yellow-600/5 border-yellow-500/30 hover:border-yellow-400/50",
  html: "from-orange-400/20 to-red-500/5 border-orange-400/30 hover:border-orange-300/50",
  css: "from-purple-500/20 to-purple-600/5 border-purple-500/30 hover:border-purple-400/50",
  sql: "from-cyan-500/20 to-cyan-600/5 border-cyan-500/30 hover:border-cyan-400/50",
  dsa: "from-emerald-500/20 to-emerald-600/5 border-emerald-500/30 hover:border-emerald-400/50",
  git: "from-gray-500/20 to-gray-600/5 border-gray-500/30 hover:border-gray-400/50",
};

export default function LearnPage() {
  const { user } = useAuth();
  const xpData = getXPData();
  const streakData = getStreakData();
  const progress = getUserProgress();
  
  const totalTopics = learningPaths.reduce((sum, p) => sum + p.modules.reduce((s, m) => s + m.topics.length, 0), 0);
  const completedCount = progress.completedTopics.length;

  return (
    <div className="min-h-screen relative font-sans page-fade-in">
      <div className="absolute inset-0 z-0 bg-background pointer-events-none" />
      <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-bl from-primary/10 via-transparent to-transparent pointer-events-none" />
      
      <div className="gfg-container py-16 md:py-20 relative z-10">
        
        {/* Header Section */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-6 backdrop-blur-md">
            <GraduationCap className="h-4 w-4" /> Learn Programming Platform
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 tracking-tight">
            Master the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">Code</span>
          </h1>
          <p className="text-lg text-muted-foreground font-light leading-relaxed mb-8">
            10 comprehensive courses, 80+ modules, hands-on coding practice, quizzes, and certificates. 
            Start your journey today.
          </p>
        </motion.div>

        {/* Quick Stats Bar */}
        {user && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-12">
            <Link to="/learn-dashboard">
              <Button size="lg" className="h-12 px-6 bg-primary hover:bg-primary/80 transition-all rounded-full shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                <Trophy className="mr-2 h-5 w-5" /> My Dashboard
              </Button>
            </Link>
            <div className="flex items-center gap-4 bg-card/80 backdrop-blur-sm px-5 py-2.5 rounded-full border border-border shadow-sm">
              <div className="flex items-center gap-1.5 text-sm">
                <Flame className="h-4 w-4 text-orange-500" />
                <span className="font-bold text-foreground">{streakData.currentStreak}</span>
                <span className="text-muted-foreground text-xs">streak</span>
              </div>
              <div className="w-px h-5 bg-border" />
              <div className="flex items-center gap-1.5 text-sm">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span className="font-bold text-foreground">{xpData.totalXP}</span>
                <span className="text-muted-foreground text-xs">XP</span>
              </div>
              <div className="w-px h-5 bg-border" />
              <div className="flex items-center gap-1.5 text-sm">
                <BookOpen className="h-4 w-4 text-primary" />
                <span className="font-bold text-foreground">{completedCount}/{totalTopics}</span>
                <span className="text-muted-foreground text-xs">done</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Course Grid */}
        <div className="mb-20">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 flex items-center gap-3">
            <div className="w-1.5 h-7 bg-primary rounded-full"></div>
            All Courses
            <span className="text-sm font-normal text-muted-foreground ml-2">({learningPaths.length} available)</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {learningPaths.map((path, i) => {
              const pathProgress = getPathProgress(path.id);
              const topicCount = path.modules.reduce((s, m) => s + m.topics.length, 0);
              const colorClass = categoryColors[path.id] || "from-primary/20 to-primary/5 border-primary/30 hover:border-primary/50";

              return (
                <motion.div
                  key={path.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link to={`/learn/${path.id}`} className="block h-full">
                    <div className={`group flex flex-col h-full rounded-2xl border bg-gradient-to-br ${colorClass} p-0 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}>
                      <div className="p-5 pb-3 flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-background/60 backdrop-blur-sm border border-border/50 group-hover:scale-110 transition-transform shadow-sm">
                            {path.icon}
                          </div>
                          {pathProgress > 0 && (
                            <span className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                              {pathProgress}%
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-bold text-foreground mb-1.5 group-hover:text-primary transition-colors leading-tight">{path.title}</h3>
                        <p className="text-muted-foreground text-xs leading-relaxed mb-4 line-clamp-2">
                          {path.description}
                        </p>
                        
                        {pathProgress > 0 && (
                          <div className="mb-3">
                            <Progress value={pathProgress} className="h-1.5" />
                          </div>
                        )}
                      </div>
                      
                      <div className="px-5 py-3 bg-background/40 border-t border-border/30 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full border border-primary/15">
                            {path.modules.length} Modules
                          </span>
                          <span className="text-[10px] font-medium text-muted-foreground">
                            {topicCount} Topics
                          </span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Practice CTA */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card overflow-hidden border border-primary/30 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none" />
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary/20 blur-[100px] pointer-events-none" />
          
          <div className="p-8 md:p-12 text-center relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-5 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
              <Terminal className="w-8 h-8" />
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mb-3">
              Put your knowledge to the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">test</span>
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto text-base font-light leading-relaxed">
              Jump into our coding playground to solve problems across multiple languages and difficulties.
            </p>
            <Link to="/practice">
              <Button size="lg" className="h-12 px-7 bg-primary hover:bg-primary/90 text-white transition-all rounded-full shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                <PlayCircle className="h-5 w-5 mr-2" /> Start Practicing Now
              </Button>
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
