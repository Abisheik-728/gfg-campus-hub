import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Flame, Star, Zap, Calendar, CheckCircle2, Circle, Clock, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { problems } from "@/data/mockData";
import { useState, useEffect } from "react";

const STORAGE_KEY = "gfg_solved_problems";
const CARRYOVER_KEY = "gfg_carryover_week";

function getSolvedProblems(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch { return []; }
}

function getWeekNumber(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  return Math.ceil(((now.getTime() - start.getTime()) / 86400000 + start.getDay() + 1) / 7);
}

function getCarryoverProblems(): string[] {
  try {
    const data = JSON.parse(localStorage.getItem(CARRYOVER_KEY) || "{}");
    const currentWeek = getWeekNumber();
    if (data.week && data.week < currentWeek && data.unsolved) {
      return data.unsolved;
    }
    return [];
  } catch { return []; }
}

const diffBadge = (d: string) =>
  d === "Easy" ? "bg-primary/10 text-primary" :
  d === "Medium" ? "bg-gfg-amber/10 text-gfg-amber" :
  "bg-destructive/10 text-destructive";

export default function ChallengesPage() {
  const daily = problems.filter(p => p.tag === "daily");
  const weekly = problems.filter(p => p.tag === "weekly");
  const [solved, setSolved] = useState<string[]>(getSolvedProblems());
  const carryover = getCarryoverProblems();
  const carryoverProblems = problems.filter(p => carryover.includes(p.id) && !solved.includes(p.id));

  useEffect(() => {
    // Save carryover at end of week
    const currentWeek = getWeekNumber();
    const unsolvedWeekly = weekly
      .filter(p => !solved.includes(p.id))
      .map(p => p.id);
    localStorage.setItem(CARRYOVER_KEY, JSON.stringify({ week: currentWeek, unsolved: unsolvedWeekly }));
  }, [solved]);

  const dailySolved = daily.filter(p => solved.includes(p.id)).length;
  const weeklySolved = weekly.filter(p => solved.includes(p.id)).length;
  const streak = Math.min(dailySolved + weeklySolved, 40);

  // Organize weekly by difficulty
  const weeklyEasy = weekly.filter(p => p.difficulty === "Easy");
  const weeklyMedium = weekly.filter(p => p.difficulty === "Medium");
  const weeklyHard = weekly.filter(p => p.difficulty === "Hard");

  return (
    <div className="gfg-container py-12 page-fade-in">
      <h1 className="text-3xl font-bold mb-2">Coding Challenges</h1>
      <p className="text-muted-foreground mb-8">Sharpen your skills with daily and weekly challenges.</p>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="gfg-card flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Flame className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Coding Streak</div>
            <div className="text-2xl font-bold text-primary">{streak} days 🔥</div>
          </div>
        </div>
        <div className="gfg-card flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Star className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Daily Progress</div>
            <div className="text-2xl font-bold">{dailySolved}/{daily.length}</div>
          </div>
        </div>
        <div className="gfg-card flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Calendar className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Weekly Progress</div>
            <div className="text-2xl font-bold">{weeklySolved}/{weekly.length}</div>
          </div>
        </div>
        <div className="gfg-card flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Trophy className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Total Solved</div>
            <div className="text-2xl font-bold">{solved.length}</div>
          </div>
        </div>
      </div>

      {/* Weekly Streak Tracker */}
      <div className="gfg-card mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold">This Week</span>
          <span className="text-xs text-muted-foreground">Week {getWeekNumber()}</span>
        </div>
        <div className="flex gap-1.5">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className={`h-8 w-full rounded-md flex items-center justify-center text-xs font-medium transition-all ${i < Math.min(streak, 7) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
              {["M", "T", "W", "T", "F", "S", "S"][i]}
            </div>
          ))}
        </div>
      </div>

      {/* Carryover Problems */}
      {carryoverProblems.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold">Carried Over from Last Week</h2>
            <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">{carryoverProblems.length} pending</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {carryoverProblems.slice(0, 6).map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="gfg-card border-destructive/20 bg-destructive/5">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${diffBadge(p.difficulty)}`}>{p.difficulty}</span>
                  <Circle className="h-4 w-4 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-1">{p.title}</h3>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{p.description}</p>
                <Link to={`/editor/${p.id}`}><Button size="sm" variant="destructive">Solve Now</Button></Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Daily Tasks (5) */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Star className="h-5 w-5 text-gfg-amber" />
          <h2 className="text-xl font-semibold">Daily Tasks</h2>
          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{dailySolved}/{daily.length} completed</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {daily.map((p, i) => {
            const isSolved = solved.includes(p.id);
            return (
              <motion.div key={p.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className={`gfg-card-hover relative ${isSolved ? "border-primary/30 bg-primary/5" : ""}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${diffBadge(p.difficulty)}`}>{p.difficulty}</span>
                  {isSolved ? <CheckCircle2 className="h-5 w-5 text-primary" /> : <Circle className="h-5 w-5 text-muted-foreground" />}
                </div>
                <h3 className="font-semibold mb-1 text-sm">{p.title}</h3>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{p.description}</p>
                <Link to={`/editor/${p.id}`}>
                  <Button size="sm" variant={isSolved ? "outline" : "default"} className="w-full">
                    {isSolved ? "Review" : "Solve"} <Zap className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Weekly Challenges (35) */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Weekly Challenges</h2>
          <span className="text-xs bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full">{weeklySolved}/{weekly.length} completed</span>
        </div>

        {/* Easy */}
        <h3 className="text-sm font-semibold text-primary mb-3 mt-4 flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">Easy</span>
          <span className="text-muted-foreground text-xs">{weeklyEasy.filter(p => solved.includes(p.id)).length}/{weeklyEasy.length}</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mb-6">
          {weeklyEasy.map((p, i) => {
            const isSolved = solved.includes(p.id);
            return (
              <motion.div key={p.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className={`gfg-card-hover ${isSolved ? "border-primary/30 bg-primary/5" : ""}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">{p.difficulty}</span>
                  {isSolved ? <CheckCircle2 className="h-4 w-4 text-primary" /> : <Circle className="h-4 w-4 text-muted-foreground" />}
                </div>
                <h3 className="font-semibold text-sm mb-1">{p.title}</h3>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{p.description}</p>
                <Link to={`/editor/${p.id}`}><Button size="sm" variant={isSolved ? "outline" : "default"} className="w-full text-xs">{isSolved ? "Review" : "Solve"}</Button></Link>
              </motion.div>
            );
          })}
        </div>

        {/* Medium */}
        <h3 className="text-sm font-semibold text-gfg-amber mb-3 flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-gfg-amber/10 text-gfg-amber text-xs">Medium</span>
          <span className="text-muted-foreground text-xs">{weeklyMedium.filter(p => solved.includes(p.id)).length}/{weeklyMedium.length}</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mb-6">
          {weeklyMedium.map((p, i) => {
            const isSolved = solved.includes(p.id);
            return (
              <motion.div key={p.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className={`gfg-card-hover ${isSolved ? "border-gfg-amber/30 bg-gfg-amber/5" : ""}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gfg-amber/10 text-gfg-amber">{p.difficulty}</span>
                  {isSolved ? <CheckCircle2 className="h-4 w-4 text-gfg-amber" /> : <Circle className="h-4 w-4 text-muted-foreground" />}
                </div>
                <h3 className="font-semibold text-sm mb-1">{p.title}</h3>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{p.description}</p>
                <Link to={`/editor/${p.id}`}><Button size="sm" variant={isSolved ? "outline" : "default"} className="w-full text-xs">{isSolved ? "Review" : "Solve"}</Button></Link>
              </motion.div>
            );
          })}
        </div>

        {/* Hard */}
        <h3 className="text-sm font-semibold text-destructive mb-3 flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-destructive/10 text-destructive text-xs">Hard</span>
          <span className="text-muted-foreground text-xs">{weeklyHard.filter(p => solved.includes(p.id)).length}/{weeklyHard.length}</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mb-6">
          {weeklyHard.map((p, i) => {
            const isSolved = solved.includes(p.id);
            return (
              <motion.div key={p.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className={`gfg-card-hover ${isSolved ? "border-destructive/30 bg-destructive/5" : ""}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive">{p.difficulty}</span>
                  {isSolved ? <CheckCircle2 className="h-4 w-4 text-destructive" /> : <Circle className="h-4 w-4 text-muted-foreground" />}
                </div>
                <h3 className="font-semibold text-sm mb-1">{p.title}</h3>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{p.description}</p>
                <Link to={`/editor/${p.id}`}><Button size="sm" variant={isSolved ? "outline" : "default"} className="w-full text-xs">{isSolved ? "Review" : "Solve"}</Button></Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 text-center">
        <a href="https://www.geeksforgeeks.org/explore" target="_blank" rel="noreferrer">
          <Button variant="outline">Browse More Problems on GeeksforGeeks</Button>
        </a>
      </div>
    </div>
  );
}
