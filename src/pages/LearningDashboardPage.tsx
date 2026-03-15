import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { learningPaths, getUserProgress, getPathProgress, getIssuedCertificates } from "@/data/learningData";
import { getXPData, getStreakData, getLeaderboard } from "@/data/xpSystem";
import { BookOpen, Trophy, Award, CheckCircle2, ArrowRight, Download, ShieldCheck, Flame, Sparkles, Medal, Crown, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";

export default function LearningDashboardPage() {
  const { user } = useAuth();
  const [progress, setProgress] = useState(getUserProgress());
  const [certificates, setCertificates] = useState(getIssuedCertificates());
  const xpData = getXPData();
  const streakData = getStreakData();
  const leaderboard = getLeaderboard();

  useEffect(() => {
    setProgress(getUserProgress());
    setCertificates(getIssuedCertificates());
  }, []);

  const enrolledPaths = learningPaths.filter(path => getPathProgress(path.id) > 0);
  const totalTopics = learningPaths.reduce((s, p) => s + p.modules.flatMap(m => m.topics).length, 0);

  return (
    <div className="min-h-screen bg-background pb-20 page-fade-in">
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/5 to-transparent py-10 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-1 text-foreground">My Learning Dashboard</h1>
              <p className="text-muted-foreground">Track progress, earn XP, maintain streaks, and collect certificates.</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {/* Stats pills */}
              <div className="flex items-center gap-2 bg-card px-4 py-2.5 rounded-xl border border-border shadow-sm">
                <Flame className="h-5 w-5 text-orange-500" />
                <div className="text-center">
                  <div className="text-xl font-black text-foreground leading-none">{streakData.currentStreak}</div>
                  <div className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Day Streak</div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-card px-4 py-2.5 rounded-xl border border-border shadow-sm">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <div className="text-center">
                  <div className="text-xl font-black text-foreground leading-none">{xpData.totalXP}</div>
                  <div className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Total XP</div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-card px-4 py-2.5 rounded-xl border border-border shadow-sm">
                <BookOpen className="h-5 w-5 text-primary" />
                <div className="text-center">
                  <div className="text-xl font-black text-foreground leading-none">{progress.completedTopics.length}</div>
                  <div className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Lessons</div>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-card px-4 py-2.5 rounded-xl border border-border shadow-sm">
                <Award className="h-5 w-5 text-amber-500" />
                <div className="text-center">
                  <div className="text-xl font-black text-foreground leading-none">{certificates.length}</div>
                  <div className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Certs</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Enrolled Courses */}
        <div className="lg:col-span-2 space-y-5">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" /> Active Courses
          </h2>
          
          {enrolledPaths.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {enrolledPaths.map(path => {
                const pathProgress = getPathProgress(path.id);
                const allTopics = path.modules.flatMap(m => m.topics);
                const completedCount = allTopics.filter(t => progress.completedTopics.includes(t.id)).length;
                
                return (
                  <div key={path.id} className="glass-card p-5 flex flex-col sm:flex-row gap-4 items-center">
                    <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center text-3xl shadow-sm shrink-0">
                      {path.icon}
                    </div>
                    <div className="flex-1 w-full">
                      <div className="flex justify-between items-start mb-1.5">
                        <div>
                          <h3 className="text-lg font-bold text-foreground">{path.title}</h3>
                          <p className="text-xs text-muted-foreground">{completedCount} of {allTopics.length} lessons completed</p>
                        </div>
                        <span className="text-base font-bold text-primary">{pathProgress}%</span>
                      </div>
                      <Progress value={pathProgress} className="h-2 mb-4" />
                      <div className="flex flex-wrap gap-2">
                        <Link to={`/learn/${path.id}`}>
                          <Button size="sm" className="gap-1.5 h-8">
                            {pathProgress === 100 ? "Review" : "Continue"} <ArrowRight className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                        {pathProgress === 100 && (
                          <Button variant="outline" size="sm" className="border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white h-8" asChild>
                            <Link to={`/certificate/${path.id}`}>
                              <Award className="h-3.5 w-3.5 mr-1.5" /> Certificate
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-card border-2 border-dashed border-border rounded-xl p-10 text-center">
              <BookOpen className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
              <h3 className="text-lg font-bold mb-1.5">No active courses yet</h3>
              <p className="text-muted-foreground text-sm mb-4">Start learning to see your progress here.</p>
              <Link to="/learn"><Button>Explore Courses</Button></Link>
            </div>
          )}

          {/* XP History */}
          {xpData.history.length > 0 && (
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                <Target className="h-5 w-5 text-primary" /> Recent Activity
              </h2>
              <div className="space-y-2">
                {xpData.history.slice(0, 8).map((entry, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-card border border-border hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{entry.action}</p>
                        <p className="text-[10px] text-muted-foreground">{new Date(entry.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-amber-500">+{entry.xp} XP</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          
          {/* Certificates */}
          <div className="bg-card rounded-2xl border border-border shadow-sm p-5 relative overflow-hidden">
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-amber-500/10 rounded-full blur-2xl" />
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" /> Certificates
            </h2>
            {certificates.length > 0 ? (
              <div className="space-y-3">
                {certificates.map(cert => (
                  <div key={cert.id} className="p-3 rounded-xl bg-muted/30 border border-border hover:border-amber-500/30 transition-colors">
                    <h4 className="font-bold text-sm mb-0.5">{cert.courseName}</h4>
                    <p className="text-[10px] text-muted-foreground mb-2 font-mono">ID: {cert.certificateId}</p>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2" asChild>
                        <Link to={`/certificate/verify/${cert.certificateId}`}>
                          <ShieldCheck className="h-3 w-3 mr-1" /> Verify
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2 text-primary" asChild>
                        <Link to={`/certificate/${learningPaths.find(p => p.title === cert.courseName)?.id || ''}`}>
                          <Download className="h-3 w-3 mr-1" /> View
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Trophy className="h-10 w-10 text-muted mx-auto mb-3 opacity-20" />
                <p className="text-xs text-muted-foreground">Complete a course to earn a certificate!</p>
              </div>
            )}
          </div>

          {/* Mini Leaderboard */}
          <div className="bg-card rounded-2xl border border-border shadow-sm p-5">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-500" /> Top Learners
            </h2>
            <div className="space-y-2">
              {leaderboard.slice(0, 5).map((entry, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                    i === 0 ? "bg-amber-500/20 text-amber-500" : i === 1 ? "bg-gray-400/20 text-gray-400" : i === 2 ? "bg-amber-700/20 text-amber-700" : "bg-muted text-muted-foreground"
                  }`}>
                    {i === 0 ? <Medal className="h-3.5 w-3.5" /> : `#${i + 1}`}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{entry.name}</p>
                    <p className="text-[10px] text-muted-foreground">{entry.modulesCompleted} modules</p>
                  </div>
                  <span className="text-xs font-bold text-amber-500">{entry.xp} XP</span>
                </div>
              ))}
            </div>
            <Link to="/leaderboard" className="block mt-3">
              <Button variant="outline" size="sm" className="w-full h-8 text-xs">View Full Leaderboard</Button>
            </Link>
          </div>

          {/* Streak Info */}
          <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl border border-orange-500/20 p-5">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" /> Learning Streak
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-card/80 backdrop-blur-sm p-3 rounded-xl border border-border text-center">
                <div className="text-2xl mb-0.5">🔥</div>
                <div className="text-lg font-black text-foreground">{streakData.currentStreak}</div>
                <div className="text-[9px] text-muted-foreground font-bold uppercase">Current</div>
              </div>
              <div className="bg-card/80 backdrop-blur-sm p-3 rounded-xl border border-border text-center">
                <div className="text-2xl mb-0.5">🏆</div>
                <div className="text-lg font-black text-foreground">{streakData.longestStreak}</div>
                <div className="text-[9px] text-muted-foreground font-bold uppercase">Best</div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-center">
              Complete a lesson daily to keep your streak alive!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
