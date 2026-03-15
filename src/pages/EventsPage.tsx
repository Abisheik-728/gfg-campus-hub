import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Trophy,
  Search,
  Filter,
  ChevronDown,
  Bell,
  Pin,
  Megaphone,
  X,
  CheckCircle2,
  AlertCircle,
  Star,
  Tag,
  User,
  ArrowRight,
  Flame,
  Sparkles,
  PartyPopper,
  Timer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { events, announcements } from "@/data/mockData";
import type { Event, Announcement } from "@/data/mockData";
import { toast } from "sonner";

/* ────────────────── helpers ────────────────── */

function getCountdown(dateStr: string) {
  const target = new Date(dateStr).getTime();
  const now = Date.now();
  const diff = target - now;
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, expired: true };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return { days, hours, minutes, expired: false };
}

function getCapacityPercent(event: Event) {
  return Math.round((event.registeredCount / event.capacity) * 100);
}

const typeConfig: Record<Event["type"], { color: string; bg: string; icon: React.ReactNode }> = {
  contest: { color: "text-amber-600", bg: "bg-amber-50 border-amber-200", icon: <Trophy className="h-3.5 w-3.5" /> },
  hackathon: { color: "text-violet-600", bg: "bg-violet-50 border-violet-200", icon: <Flame className="h-3.5 w-3.5" /> },
  workshop: { color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200", icon: <Sparkles className="h-3.5 w-3.5" /> },
  seminar: { color: "text-blue-600", bg: "bg-blue-50 border-blue-200", icon: <Megaphone className="h-3.5 w-3.5" /> },
  meetup: { color: "text-rose-600", bg: "bg-rose-50 border-rose-200", icon: <Users className="h-3.5 w-3.5" /> },
};

const priorityConfig: Record<Announcement["priority"], { color: string; border: string }> = {
  high: { color: "text-red-600", border: "border-l-red-500" },
  medium: { color: "text-amber-600", border: "border-l-amber-500" },
  low: { color: "text-emerald-600", border: "border-l-emerald-500" },
};

const categoryIcons: Record<Announcement["category"], React.ReactNode> = {
  general: <Megaphone className="h-4 w-4" />,
  event: <Calendar className="h-4 w-4" />,
  result: <Trophy className="h-4 w-4" />,
  deadline: <AlertCircle className="h-4 w-4" />,
  achievement: <Star className="h-4 w-4" />,
};

const filterOptions = ["all", "contest", "hackathon", "workshop", "seminar", "meetup"] as const;

/* ────────────────── countdown hook ────────────────── */

function useCountdown(dateStr: string) {
  const [cd, setCd] = useState(() => getCountdown(dateStr));
  useEffect(() => {
    const id = setInterval(() => setCd(getCountdown(dateStr)), 60_000);
    return () => clearInterval(id);
  }, [dateStr]);
  return cd;
}

/* ────────────────── sub-components ────────────────── */

function CountdownBadge({ date }: { date: string }) {
  const cd = useCountdown(date);
  if (cd.expired) return null;
  return (
    <div className="flex items-center gap-1.5 text-xs font-medium">
      <Timer className="h-3.5 w-3.5 text-primary" />
      <div className="flex items-center gap-1">
        <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold tabular-nums">{cd.days}d</span>
        <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold tabular-nums">{cd.hours}h</span>
        <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold tabular-nums">{cd.minutes}m</span>
      </div>
    </div>
  );
}

function CapacityBar({ event }: { event: Event }) {
  const pct = getCapacityPercent(event);
  const isFull = pct >= 100;
  const isAlmostFull = pct >= 85;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground flex items-center gap-1">
          <Users className="h-3 w-3" />
          {event.registeredCount}/{event.capacity} registered
        </span>
        <span className={`font-semibold ${isFull ? "text-red-500" : isAlmostFull ? "text-amber-500" : "text-emerald-600"}`}>
          {isFull ? "Full" : isAlmostFull ? "Almost Full" : `${pct}%`}
        </span>
      </div>
      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${isFull ? "bg-red-500" : isAlmostFull ? "bg-amber-500" : "bg-primary"}`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(pct, 100)}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

/* ────────────────── registration modal ────────────────── */

interface RegModalProps {
  event: Event;
  onClose: () => void;
}

function RegistrationModal({ event, onClose }: RegModalProps) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", department: "", year: "", teamName: "" });
  const [step, setStep] = useState<1 | 2>(1);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success(`Successfully registered for ${event.title}!`);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

        {/* modal */}
        <motion.div
          className="relative w-full max-w-lg bg-card rounded-2xl shadow-2xl border border-border overflow-hidden"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25 }}
        >
          {/* header */}
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 pb-4 border-b border-border">
            <button
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-muted transition-colors"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10">
                {typeConfig[event.type].icon}
              </div>
              <div>
                <h3 className="text-lg font-bold">{event.title}</h3>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {event.time}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* body */}
          <div className="p-6">
            {submitted ? (
              <motion.div
                className="text-center py-8"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 20 }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4">
                  <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                </div>
                <h4 className="text-xl font-bold mb-2">Registration Successful! 🎉</h4>
                <p className="text-muted-foreground text-sm mb-1">You're now registered for <strong>{event.title}</strong>.</p>
                <p className="text-muted-foreground text-sm mb-6">A confirmation email has been sent to <strong>{form.email}</strong>.</p>
                <Button onClick={onClose}>Done</Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* step indicator */}
                <div className="flex items-center gap-2 mb-6">
                  <div className={`flex items-center gap-1.5 text-xs font-medium ${step >= 1 ? "text-primary" : "text-muted-foreground"}`}>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 1 ? "bg-primary text-white" : "bg-muted"}`}>1</span>
                    Personal Info
                  </div>
                  <div className="flex-1 h-px bg-border" />
                  <div className={`flex items-center gap-1.5 text-xs font-medium ${step >= 2 ? "text-primary" : "text-muted-foreground"}`}>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 2 ? "bg-primary text-white" : "bg-muted"}`}>2</span>
                    Academic Details
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {step === 1 ? (
                    <motion.div
                      key="step1"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: -20, opacity: 0 }}
                      className="space-y-3"
                    >
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Full Name *</label>
                        <Input
                          placeholder="Enter your full name"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          required
                          className="h-10"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Email Address *</label>
                        <Input
                          type="email"
                          placeholder="your.email@college.com"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          required
                          className="h-10"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Phone Number *</label>
                        <Input
                          type="tel"
                          placeholder="+91 XXXXX XXXXX"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          required
                          className="h-10"
                        />
                      </div>
                      <div className="pt-2 flex justify-end">
                        <Button type="button" onClick={() => {
                          if (!form.name || !form.email || !form.phone) {
                            toast.error("Please fill all fields");
                            return;
                          }
                          setStep(2);
                        }}>
                          Next <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="step2"
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 20, opacity: 0 }}
                      className="space-y-3"
                    >
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Department *</label>
                        <Input
                          placeholder="e.g. CSE, IT, ECE"
                          value={form.department}
                          onChange={(e) => setForm({ ...form, department: e.target.value })}
                          required
                          className="h-10"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Year of Study *</label>
                        <Input
                          placeholder="e.g. 1, 2, 3, 4"
                          value={form.year}
                          onChange={(e) => setForm({ ...form, year: e.target.value })}
                          required
                          className="h-10"
                        />
                      </div>
                      {(event.type === "hackathon" || event.type === "contest") && (
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1 block">Team Name (optional)</label>
                          <Input
                            placeholder="Your team name"
                            value={form.teamName}
                            onChange={(e) => setForm({ ...form, teamName: e.target.value })}
                            className="h-10"
                          />
                        </div>
                      )}
                      <div className="pt-2 flex justify-between">
                        <Button type="button" variant="ghost" onClick={() => setStep(1)}>Back</Button>
                        <Button type="submit">
                          <CheckCircle2 className="h-4 w-4 mr-1" /> Register Now
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ────────────────── event card ────────────────── */

function EventCard({ event, index, onRegister }: { event: Event; index: number; onRegister: (e: Event) => void }) {
  const cfg = typeConfig[event.type];
  const isFull = getCapacityPercent(event) >= 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className="group relative glass-card border border-border overflow-hidden hover:shadow-[0_8px_30px_rgba(34,197,94,0.15)] hover:border-primary/40 transition-all duration-300"
    >
      {/* top accent */}
      <div className={`h-1 w-full ${
        event.type === "contest" ? "bg-gradient-to-r from-amber-400 to-orange-500" :
        event.type === "hackathon" ? "bg-gradient-to-r from-violet-500 to-purple-600" :
        event.type === "workshop" ? "bg-gradient-to-r from-emerald-400 to-green-600" :
        event.type === "seminar" ? "bg-gradient-to-r from-blue-400 to-cyan-500" :
        "bg-gradient-to-r from-rose-400 to-pink-500"
      }`} />

      <div className="p-5">
        {/* type badge + countdown */}
        <div className="flex items-center justify-between mb-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.color}`}>
            {cfg.icon}
            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
          </span>
          <CountdownBadge date={event.date} />
        </div>

        {/* title */}
        <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{event.title}</h3>

        {/* description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{event.description}</p>

        {/* meta info */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 text-primary/70" />
            {new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5 text-primary/70" />
            {event.time}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-primary/70" />
            {event.location}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <User className="h-3.5 w-3.5 text-primary/70" />
            {event.organizer}
          </div>
        </div>

        {/* tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {event.tags.map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-[10px] font-medium text-muted-foreground">
              <Tag className="h-2.5 w-2.5" />{tag}
            </span>
          ))}
        </div>

        {/* prize money */}
        {event.prizeMoney && (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 mb-4 bg-amber-50 rounded-lg px-3 py-1.5 border border-amber-200">
            <Trophy className="h-3.5 w-3.5" />
            Prize Pool: {event.prizeMoney}
          </div>
        )}

        {/* capacity bar */}
        <CapacityBar event={event} />

        {/* register button */}
        <div className="mt-4">
          <Button
            className="w-full"
            size="sm"
            disabled={isFull}
            onClick={() => onRegister(event)}
          >
            {isFull ? "Registrations Closed" : "Register Now"}
            {!isFull && <ArrowRight className="h-4 w-4 ml-1" />}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

/* ────────────────── past event card ────────────────── */

function PastEventCard({ event, index }: { event: Event; index: number }) {
  const cfg = typeConfig[event.type];
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass-card border border-border p-4 opacity-80 hover:opacity-100 transition-opacity"
    >
      <div className="flex items-start justify-between mb-2">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${cfg.bg} ${cfg.color}`}>
          {cfg.icon}
          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
        </span>
        <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Completed</span>
      </div>
      <h4 className="font-semibold mb-1">{event.title}</h4>
      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{event.description}</p>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{event.location}</span>
        <span className="flex items-center gap-1"><Users className="h-3 w-3" />{event.registeredCount} attended</span>
      </div>
    </motion.div>
  );
}

/* ────────────────── announcement card ────────────────── */

function AnnouncementCard({ ann, index }: { ann: Announcement; index: number }) {
  const pCfg = priorityConfig[ann.priority];
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      className={`glass-card border border-border border-l-4 ${pCfg.border} p-4 hover:shadow-lg hover:shadow-primary/10 transition-shadow cursor-pointer`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start gap-3">
        {ann.isPinned && (
          <div className="mt-0.5">
            <Pin className="h-4 w-4 text-primary fill-primary" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`${pCfg.color}`}>{categoryIcons[ann.category]}</span>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{ann.category}</span>
            <span className="text-[10px] text-muted-foreground">
              {new Date(ann.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
            </span>
          </div>
          <h4 className="font-semibold text-sm mb-1">{ann.title}</h4>
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-xs text-muted-foreground mb-2">{ann.content}</p>
                <p className="text-[10px] text-muted-foreground">— {ann.author}</p>
              </motion.div>
            )}
          </AnimatePresence>
          {!expanded && (
            <p className="text-xs text-muted-foreground truncate">{ann.content}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════
   MAIN PAGE
   ════════════════════════════════════════════════════ */

export default function EventsPage() {
  const upcoming = useMemo(() => events.filter((e) => !e.isPast), []);
  const past = useMemo(() => events.filter((e) => e.isPast), []);

  const [activeTab, setActiveTab] = useState<"upcoming" | "announcements">("upcoming");
  const [filterType, setFilterType] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [regEvent, setRegEvent] = useState<Event | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // sorted announcements — pinned first, then by date
  const sortedAnnouncements = useMemo(
    () => [...announcements].sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }),
    []
  );

  // filtered upcoming events
  const filteredUpcoming = useMemo(() => {
    return upcoming
      .filter((e) => filterType === "all" || e.type === filterType)
      .filter((e) =>
        search === "" ||
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.description.toLowerCase().includes(search.toLowerCase()) ||
        e.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
      );
  }, [upcoming, filterType, search]);

  // stats
  const totalUpcoming = upcoming.length;
  const totalRegistrations = upcoming.reduce((sum, e) => sum + e.registeredCount, 0);
  const nextEvent = upcoming.reduce((nearest, e) =>
    new Date(e.date) < new Date(nearest.date) ? e : nearest
  , upcoming[0]);

  return (
    <>
      <div className="min-h-screen bg-background page-fade-in">
        {/* ─── hero banner ─── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10 border-b border-border">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          </div>
          <div className="gfg-container relative py-12 md:py-16">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
                <PartyPopper className="h-3.5 w-3.5" />
                Event Management Hub
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
                Campus <span className="text-primary">Events</span>
              </h1>
              <p className="text-muted-foreground md:text-lg">
                Discover coding contests, hackathons, workshops, and seminars. Register, learn, and grow with your community.
              </p>
            </motion.div>

            {/* quick stats */}
            <motion.div
              className="grid grid-cols-3 gap-4 mt-8 max-w-xl"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <div className="glass-card p-4 text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors pointer-events-none" />
                <p className="text-2xl font-bold text-primary">{totalUpcoming}</p>
                <p className="text-xs text-muted-foreground">Upcoming Events</p>
              </div>
              <div className="glass-card p-4 text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors pointer-events-none" />
                <p className="text-2xl font-bold text-primary">{totalRegistrations}+</p>
                <p className="text-xs text-muted-foreground">Registrations</p>
              </div>
              <div className="glass-card p-4 text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors pointer-events-none" />
                <p className="text-2xl font-bold text-primary">{announcements.length}</p>
                <p className="text-xs text-muted-foreground">Announcements</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── tab bar ─── */}
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
          <div className="gfg-container">
            <div className="flex items-center gap-1 py-2">
              <button
                onClick={() => setActiveTab("upcoming")}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  activeTab === "upcoming"
                    ? "bg-primary text-white shadow-sm"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <Calendar className="h-4 w-4" />
                Upcoming Events
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  activeTab === "upcoming" ? "bg-primary-foreground/20" : "bg-muted"
                }`}>{totalUpcoming}</span>
              </button>
              <button
                onClick={() => setActiveTab("announcements")}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-all ${
                  activeTab === "announcements"
                    ? "bg-primary text-white shadow-sm"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <Bell className="h-4 w-4" />
                Announcements
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  activeTab === "announcements" ? "bg-primary-foreground/20" : "bg-muted"
                }`}>{announcements.length}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ─── main content ─── */}
        <div className="gfg-container py-8">
          <AnimatePresence mode="wait">
            {activeTab === "upcoming" ? (
              <motion.div
                key="upcoming"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {/* search & filter bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
                  <div className="relative flex-1 w-full sm:max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search events..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9 h-10"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-1.5"
                  >
                    <Filter className="h-3.5 w-3.5" />
                    Filter
                    <ChevronDown className={`h-3 w-3 transition-transform ${showFilters ? "rotate-180" : ""}`} />
                  </Button>
                </div>

                {/* filter pills */}
                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mb-6 overflow-hidden"
                    >
                      <div className="flex flex-wrap gap-2 pb-2">
                        {filterOptions.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => setFilterType(opt)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                              filterType === opt
                                ? "bg-primary text-white border-primary"
                                : "bg-card border-border text-muted-foreground hover:border-primary/30"
                            }`}
                          >
                            {opt === "all" ? "All Events" : opt.charAt(0).toUpperCase() + opt.slice(1) + "s"}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* next event highlight */}
                {nextEvent && (
                  <motion.div
                    className="mb-8 glass-card border-2 border-primary/20 bg-gradient-to-r from-primary/10 to-transparent p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4 relative overflow-hidden group"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 blur-3xl rounded-full pointer-events-none group-hover:bg-primary/20 transition-colors" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">Next Event</span>
                        <CountdownBadge date={nextEvent.date} />
                      </div>
                      <h3 className="text-xl font-bold mb-1">{nextEvent.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{nextEvent.description}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{new Date(nextEvent.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{nextEvent.location}</span>
                        <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{nextEvent.registeredCount}/{nextEvent.capacity}</span>
                      </div>
                    </div>
                    <Button onClick={() => setRegEvent(nextEvent)} className="shrink-0">
                      Register Now <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </motion.div>
                )}

                {/* event grid */}
                {filteredUpcoming.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
                    {filteredUpcoming.map((event, i) => (
                      <EventCard key={event.id} event={event} index={i} onRegister={setRegEvent} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <Search className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground">No events found matching your criteria.</p>
                    <Button variant="ghost" size="sm" className="mt-2" onClick={() => { setSearch(""); setFilterType("all"); }}>
                      Clear filters
                    </Button>
                  </div>
                )}

                {/* past events */}
                <div className="mt-4">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    Past Events
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {past.map((event, i) => (
                      <PastEventCard key={event.id} event={event} index={i} />
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="announcements"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {/* pinned banner */}
                <div className="flex items-center gap-2 mb-6">
                  <Pin className="h-4 w-4 text-primary fill-primary" />
                  <h2 className="text-lg font-bold">Pinned Announcements</h2>
                </div>

                {/* pinned announcements */}
                <div className="space-y-3 mb-8">
                  {sortedAnnouncements
                    .filter((a) => a.isPinned)
                    .map((ann, i) => (
                      <AnnouncementCard key={ann.id} ann={ann} index={i} />
                    ))}
                </div>

                {/* all announcements */}
                <div className="flex items-center gap-2 mb-4">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <h2 className="text-lg font-bold">All Announcements</h2>
                </div>
                <div className="space-y-3">
                  {sortedAnnouncements
                    .filter((a) => !a.isPinned)
                    .map((ann, i) => (
                      <AnnouncementCard key={ann.id} ann={ann} index={i} />
                    ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ─── registration modal ─── */}
      {regEvent && <RegistrationModal event={regEvent} onClose={() => setRegEvent(null)} />}
    </>
  );
}
