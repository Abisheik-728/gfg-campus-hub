// ─── XP & Streak System ───────────────────────────────
const XP_KEY = "gfg_xp_data";
const STREAK_KEY = "gfg_streak_data";

export interface XPData {
  totalXP: number;
  history: { action: string; xp: number; date: string }[];
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
}

export function getXPData(): XPData {
  try {
    const d = localStorage.getItem(XP_KEY);
    return d ? JSON.parse(d) : { totalXP: 0, history: [] };
  } catch { return { totalXP: 0, history: [] }; }
}

export function addXP(action: string, xp: number) {
  const data = getXPData();
  data.totalXP += xp;
  data.history.unshift({ action, xp, date: new Date().toISOString() });
  if (data.history.length > 100) data.history = data.history.slice(0, 100);
  localStorage.setItem(XP_KEY, JSON.stringify(data));
  updateStreak();
  return data;
}

export function getStreakData(): StreakData {
  try {
    const d = localStorage.getItem(STREAK_KEY);
    return d ? JSON.parse(d) : { currentStreak: 0, longestStreak: 0, lastActiveDate: "" };
  } catch { return { currentStreak: 0, longestStreak: 0, lastActiveDate: "" }; }
}

function updateStreak() {
  const streak = getStreakData();
  const today = new Date().toISOString().slice(0, 10);
  
  if (streak.lastActiveDate === today) return;
  
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  
  if (streak.lastActiveDate === yesterday) {
    streak.currentStreak += 1;
  } else if (streak.lastActiveDate !== today) {
    streak.currentStreak = 1;
  }
  
  streak.lastActiveDate = today;
  if (streak.currentStreak > streak.longestStreak) {
    streak.longestStreak = streak.currentStreak;
  }
  
  localStorage.setItem(STREAK_KEY, JSON.stringify(streak));
}

// ─── Leaderboard ──────────────────────────────────────
const LB_KEY = "gfg_leaderboard";

export interface LeaderboardEntry {
  name: string;
  xp: number;
  modulesCompleted: number;
}

export function getLeaderboard(): LeaderboardEntry[] {
  try {
    const d = localStorage.getItem(LB_KEY);
    const entries: LeaderboardEntry[] = d ? JSON.parse(d) : getDefaultLeaderboard();
    return entries.sort((a, b) => b.xp - a.xp);
  } catch { return getDefaultLeaderboard(); }
}

export function updateLeaderboard(name: string, xp: number, modulesCompleted: number) {
  const lb = getLeaderboard();
  const idx = lb.findIndex(e => e.name === name);
  if (idx >= 0) {
    lb[idx].xp = xp;
    lb[idx].modulesCompleted = modulesCompleted;
  } else {
    lb.push({ name, xp, modulesCompleted });
  }
  localStorage.setItem(LB_KEY, JSON.stringify(lb));
}

function getDefaultLeaderboard(): LeaderboardEntry[] {
  return [
    { name: "Aarav Sharma", xp: 2450, modulesCompleted: 38 },
    { name: "Priya Patel", xp: 2100, modulesCompleted: 32 },
    { name: "Rohan Gupta", xp: 1850, modulesCompleted: 28 },
    { name: "Sneha Reddy", xp: 1600, modulesCompleted: 24 },
    { name: "Vikram Singh", xp: 1450, modulesCompleted: 21 },
    { name: "Ananya Iyer", xp: 1300, modulesCompleted: 19 },
    { name: "Karan Mehta", xp: 1150, modulesCompleted: 17 },
    { name: "Diya Nair", xp: 980, modulesCompleted: 14 },
    { name: "Arjun Das", xp: 820, modulesCompleted: 12 },
    { name: "Meera Joshi", xp: 650, modulesCompleted: 9 },
  ];
}
