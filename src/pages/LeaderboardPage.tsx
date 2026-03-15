import { motion } from "framer-motion";
import { students } from "@/data/mockData";
import { Trophy, Code, Flame, Sparkles, Medal } from "lucide-react";

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

export default function LeaderboardPage() {
  const sorted = [...students].filter(s => s.role === "student").sort((a, b) => b.codingPoints - a.codingPoints);

  return (
    <div className="min-h-screen relative overflow-hidden bg-background page-fade-in">
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-gfg-gold/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="gfg-container py-20 relative z-10">
        
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gfg-gold/20 border border-gfg-gold/30 text-gfg-gold text-sm font-semibold mb-6 backdrop-blur-md">
            <Trophy className="h-4 w-4" /> Hall of Fame
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 tracking-tight">
            Top <span className="text-primary">Coders</span> Leaderboard
          </h1>
          <p className="text-muted-foreground text-lg font-light">
            Recognizing the brilliant minds who push their limits on the keyboard.
          </p>
        </motion.div>

        {/* Top 3 Podiums */}
        <div className="flex flex-col md:flex-row items-end justify-center gap-6 mb-16 max-w-4xl mx-auto">
          {[1, 0, 2].map((i) => {
            const coder = sorted[i];
            if (!coder) return null;
            const isFirst = i === 0;
            const isSecond = i === 1;
            const isThird = i === 2;
            
            return (
              <motion.div
                key={coder.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i, type: "spring", stiffness: 100 }}
                className={`flex flex-col items-center ${isFirst ? "md:order-2 z-10 -mt-10" : isSecond ? "md:order-1" : "md:order-3"}`}
              >
                <div className={`relative flex flex-col items-center glass-card border border-border p-6 w-full sm:w-64
                  ${isFirst ? "bg-card shadow-[0_0_30px_rgba(250,204,21,0.1)]" : 
                    isSecond ? "bg-card" : "bg-card"}
                `}>
                  <div className="absolute -top-6">
                    {isFirst && <div className="w-12 h-12 bg-gfg-gold rounded-full flex items-center justify-center text-black font-black shadow-[0_0_20px_rgba(250,204,21,0.6)]"><Trophy className="w-6 h-6" /></div>}
                    {isSecond && <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-black font-black"><Medal className="w-5 h-5" /></div>}
                    {isThird && <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center text-black font-black"><Medal className="w-5 h-5" /></div>}
                  </div>
                  
                  <div className={`mt-4 w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold bg-muted border-4 mb-4
                    ${isFirst ? "border-gfg-gold text-gfg-gold shadow-[0_0_20px_rgba(250,204,21,0.2)]" : 
                      isSecond ? "border-gray-400 text-gray-500" : 
                      "border-amber-700 text-amber-600"}
                  `}>
                    {coder.avatar}
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground text-center mb-1">{coder.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3 bg-muted px-2 py-1 rounded-full border border-border">
                    <Code className="w-3 h-3 text-primary" /> {coder.problemsSolved} Solved
                  </div>
                  
                  <div className={`text-3xl font-black ${isFirst ? "text-gfg-gold drop-shadow-[0_0_10px_rgba(250,204,21,0.2)]" : "text-foreground"}`}>
                    {coder.codingPoints}
                  </div>
                  <div className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mt-1">Points</div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Table List */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.4 }} 
          className="glass-card overflow-hidden border border-border p-0 shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase py-5 px-6 w-16">Rank</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase py-5 px-6">Student</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase py-5 px-6 hidden sm:table-cell">Department</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase py-5 px-6">Stats</th>
                  <th className="text-right text-xs font-semibold text-muted-foreground uppercase py-5 px-6">Score</th>
                </tr>
              </thead>
              <tbody>
                {sorted.slice(3).map((coder, index) => {
                  const rank = index + 4;
                  return (
                    <tr key={coder.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors group">
                      <td className="py-5 px-6 font-bold text-muted-foreground text-lg">#{rank}</td>
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-all">
                            {coder.avatar}
                          </div>
                          <div>
                            <div className="font-bold text-foreground text-base">{coder.name}</div>
                            <div className="text-xs text-primary font-medium tracking-wide">Year {coder.year}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6 hidden sm:table-cell text-muted-foreground text-sm">{coder.department}</td>
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5 text-sm">
                            <Code className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            <span className="text-foreground font-medium">{coder.problemsSolved}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-sm">
                            <Flame className="h-4 w-4 text-muted-foreground group-hover:text-amber-500 transition-colors" />
                            <span className="text-foreground font-medium">{coder.codingStreak} <span className="text-muted-foreground text-xs">day streak</span></span>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-6 font-mono font-bold text-xl text-primary text-right tracking-tight">
                        {coder.codingPoints}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
        
      </div>
    </div>
  );
}
