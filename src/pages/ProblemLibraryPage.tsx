import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Library,
  Plus,
  Trash2,
  Pencil,
  ChevronRight,
  ChevronLeft,
  Search,
  X,
  FolderOpen,
  Code,
  BookMarked,
  MoreVertical,
  Check,
  ListPlus,
  Hash,
  Sparkles,
  GripVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { problems } from "@/data/mockData";
import type { Problem } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Link } from "react-router-dom";

/* ═══════════════  localStorage helpers  ═══════════════ */

interface ProblemLibrary {
  id: string;
  name: string;
  description: string;
  problemIds: string[];
  createdAt: string;
  color: string;
}

const STORAGE_KEY = "gfg_problem_libraries";

const PALETTE = [
  "from-emerald-500 to-green-600",
  "from-violet-500 to-purple-600",
  "from-amber-500 to-orange-600",
  "from-blue-500 to-cyan-600",
  "from-rose-500 to-pink-600",
  "from-teal-500 to-emerald-600",
  "from-indigo-500 to-blue-600",
  "from-fuchsia-500 to-pink-600",
];

function loadLibraries(): ProblemLibrary[] {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    return s ? JSON.parse(s) : getDefaultLibraries();
  } catch {
    return getDefaultLibraries();
  }
}

function saveLibraries(libs: ProblemLibrary[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(libs));
}

function getDefaultLibraries(): ProblemLibrary[] {
  return [
    {
      id: "lib-1",
      name: "DSA Must-Do",
      description: "Essential data structure & algorithm problems for interviews",
      problemIds: ["d1", "d2", "w1", "w3", "w4"],
      createdAt: new Date().toISOString(),
      color: PALETTE[0],
    },
    {
      id: "lib-2",
      name: "Hard Practice",
      description: "Challenging problems for advanced preparation",
      problemIds: ["w2", "w29", "w30", "w31", "w32", "w34", "w35"],
      createdAt: new Date().toISOString(),
      color: PALETTE[1],
    },
    {
      id: "lib-3",
      name: "Weekly Review",
      description: "Problems to review every week",
      problemIds: ["w18", "w19", "w20", "w21"],
      createdAt: new Date().toISOString(),
      color: PALETTE[4],
    },
  ];
}

/* build a lookup map for problems */
const problemMap = new Map<string, Problem>();
problems.forEach((p) => problemMap.set(p.id, p));

/* ═══════════════  difficulty badge  ═══════════════ */

function DifficultyBadge({ d }: { d: string }) {
  const cls =
    d === "Easy"
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : d === "Medium"
      ? "bg-amber-100 text-amber-700 border-amber-200"
      : "bg-red-100 text-red-700 border-red-200";
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cls}`}>{d}</span>;
}

/* ═══════════════  create / edit modal  ═══════════════ */

interface LibFormProps {
  initial?: ProblemLibrary;
  onSave: (name: string, desc: string) => void;
  onClose: () => void;
}

function LibraryFormModal({ initial, onSave, onClose }: LibFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [desc, setDesc] = useState(initial?.description ?? "");

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative w-full max-w-md bg-card rounded-2xl shadow-2xl border border-border overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 25 }}
      >
        <div className="p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <BookMarked className="h-5 w-5 text-primary" />
            {initial ? "Rename Library" : "Create New Library"}
          </h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!name.trim()) {
                toast.error("Library name is required");
                return;
              }
              onSave(name.trim(), desc.trim());
            }}
            className="space-y-3"
          >
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Library Name *</label>
              <Input
                placeholder="e.g. Interview Prep, DP Patterns"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                className="h-10"
                maxLength={50}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Description</label>
              <Input
                placeholder="Short description (optional)"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="h-10"
                maxLength={120}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" size="sm">
                {initial ? "Save" : "Create Library"}
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════  add-problems modal  ═══════════════ */

interface AddProblemsModalProps {
  library: ProblemLibrary;
  onAdd: (ids: string[]) => void;
  onClose: () => void;
}

function AddProblemsModal({ library, onAdd, onClose }: AddProblemsModalProps) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [filterDiff, setFilterDiff] = useState<string>("all");

  const available = useMemo(() => {
    return problems.filter((p) => {
      if (library.problemIds.includes(p.id)) return false;
      if (filterDiff !== "all" && p.difficulty !== filterDiff) return false;
      if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [search, filterDiff, library.problemIds]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative w-full max-w-2xl bg-card rounded-2xl shadow-2xl border border-border overflow-hidden max-h-[80vh] flex flex-col"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 25 }}
      >
        {/* header */}
        <div className="p-5 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <ListPlus className="h-5 w-5 text-primary" />
              Add Problems to "{library.name}"
            </h3>
            <button className="p-1.5 rounded-full hover:bg-muted" onClick={onClose}>
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search problems..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
            </div>
            <div className="flex gap-1">
              {["all", "Easy", "Medium", "Hard"].map((d) => (
                <button
                  key={d}
                  onClick={() => setFilterDiff(d)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                    filterDiff === d ? "bg-primary text-white border-primary" : "bg-card border-border text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  {d === "all" ? "All" : d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
          {available.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              {search ? "No matching problems found." : "All problems are already in this library!"}
            </div>
          ) : (
            available.map((p) => (
              <button
                key={p.id}
                onClick={() => toggle(p.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                  selected.has(p.id) ? "border-primary bg-primary/5" : "border-border hover:border-primary/20 hover:bg-muted/50"
                }`}
              >
                <div
                  className={`h-5 w-5 rounded border-2 flex items-center justify-center transition-colors ${
                    selected.has(p.id) ? "bg-primary border-primary" : "border-muted-foreground/30"
                  }`}
                >
                  {selected.has(p.id) && <Check className="h-3 w-3 text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium block truncate">{p.title}</span>
                  <span className="text-[10px] text-muted-foreground">{p.tag === "daily" ? "Daily" : "Weekly"} Problem</span>
                </div>
                <DifficultyBadge d={p.difficulty} />
              </button>
            ))
          )}
        </div>

        {/* footer */}
        <div className="p-4 border-t border-border flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{selected.size} problem{selected.size !== 1 ? "s" : ""} selected</span>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={selected.size === 0}
              onClick={() => {
                onAdd(Array.from(selected));
                onClose();
              }}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add {selected.size > 0 ? `(${selected.size})` : ""}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════  library card  ═══════════════ */

function LibraryCard({
  lib,
  index,
  onOpen,
  onRename,
  onDelete,
}: {
  lib: ProblemLibrary;
  index: number;
  onOpen: () => void;
  onRename: () => void;
  onDelete: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const diffStats = useMemo(() => {
    const stats = { Easy: 0, Medium: 0, Hard: 0 };
    lib.problemIds.forEach((id) => {
      const p = problemMap.get(id);
      if (p) stats[p.difficulty]++;
    });
    return stats;
  }, [lib.problemIds]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group relative bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-300 cursor-pointer"
      onClick={onOpen}
    >
      {/* color bar */}
      <div className={`h-2 bg-gradient-to-r ${lib.color}`} />

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg bg-gradient-to-br ${lib.color} text-white`}>
              <BookMarked className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm group-hover:text-primary transition-colors">{lib.name}</h3>
              <p className="text-[10px] text-muted-foreground">{lib.problemIds.length} problem{lib.problemIds.length !== 1 ? "s" : ""}</p>
            </div>
          </div>

          {/* context menu */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              className="p-1.5 rounded-full hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <MoreVertical className="h-4 w-4 text-muted-foreground" />
            </button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-0 top-8 bg-card border border-border rounded-lg shadow-xl py-1 z-20 w-36"
                >
                  <button
                    className="flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-muted transition-colors"
                    onClick={() => {
                      setMenuOpen(false);
                      onRename();
                    }}
                  >
                    <Pencil className="h-3 w-3" /> Rename
                  </button>
                  <button
                    className="flex items-center gap-2 w-full px-3 py-2 text-xs text-destructive hover:bg-destructive/10 transition-colors"
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete();
                    }}
                  >
                    <Trash2 className="h-3 w-3" /> Delete
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {lib.description && <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{lib.description}</p>}

        {/* difficulty distribution */}
        <div className="flex items-center gap-2 mb-3">
          {diffStats.Easy > 0 && (
            <span className="text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{diffStats.Easy} Easy</span>
          )}
          {diffStats.Medium > 0 && (
            <span className="text-[10px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">{diffStats.Medium} Medium</span>
          )}
          {diffStats.Hard > 0 && (
            <span className="text-[10px] font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">{diffStats.Hard} Hard</span>
          )}
          {lib.problemIds.length === 0 && <span className="text-[10px] text-muted-foreground italic">Empty library</span>}
        </div>

        {/* progress bar */}
        {lib.problemIds.length > 0 && (
          <div className="flex h-1.5 rounded-full overflow-hidden bg-muted">
            {diffStats.Easy > 0 && (
              <div className="bg-emerald-500" style={{ width: `${(diffStats.Easy / lib.problemIds.length) * 100}%` }} />
            )}
            {diffStats.Medium > 0 && (
              <div className="bg-amber-500" style={{ width: `${(diffStats.Medium / lib.problemIds.length) * 100}%` }} />
            )}
            {diffStats.Hard > 0 && (
              <div className="bg-red-500" style={{ width: `${(diffStats.Hard / lib.problemIds.length) * 100}%` }} />
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ═══════════════  library detail view  ═══════════════ */

function LibraryDetail({
  library,
  onBack,
  onRemoveProblem,
  onAddProblems,
}: {
  library: ProblemLibrary;
  onBack: () => void;
  onRemoveProblem: (problemId: string) => void;
  onAddProblems: () => void;
}) {
  const libProblems = library.problemIds.map((id) => problemMap.get(id)).filter(Boolean) as Problem[];

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      {/* header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${library.color} text-white`}>
          <BookMarked className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold">{library.name}</h2>
          {library.description && <p className="text-sm text-muted-foreground">{library.description}</p>}
        </div>
        <Button size="sm" onClick={onAddProblems}>
          <Plus className="h-4 w-4 mr-1" /> Add Problems
        </Button>
      </div>

      {/* problems list */}
      {libProblems.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-xl border border-border">
          <FolderOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground font-medium mb-2">This library is empty</p>
          <p className="text-sm text-muted-foreground mb-4">Add problems to start building your collection</p>
          <Button size="sm" onClick={onAddProblems}>
            <Plus className="h-4 w-4 mr-1" /> Add Problems
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {libProblems.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="group flex items-center gap-4 bg-card rounded-xl border border-border p-4 hover:border-primary/20 hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-muted text-xs font-bold text-muted-foreground">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Link
                    to={`/editor/${p.id}`}
                    className="text-sm font-semibold hover:text-primary transition-colors truncate"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {p.title}
                  </Link>
                  <DifficultyBadge d={p.difficulty} />
                </div>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{p.description}</p>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Link to={`/editor/${p.id}`}>
                  <Button variant="outline" size="sm" className="h-7 text-xs">
                    <Code className="h-3 w-3 mr-1" /> Solve
                  </Button>
                </Link>
                <button
                  className="p-1.5 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  onClick={() => onRemoveProblem(p.id)}
                  title="Remove from library"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════════════ */

export default function ProblemLibraryPage() {
  const { user } = useAuth();
  const [libraries, setLibraries] = useState<ProblemLibrary[]>(() => loadLibraries());
  const [activeLib, setActiveLib] = useState<ProblemLibrary | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editLib, setEditLib] = useState<ProblemLibrary | null>(null);
  const [showAddProblems, setShowAddProblems] = useState(false);
  const [search, setSearch] = useState("");

  if (!user) return null;

  // persist on change
  useEffect(() => {
    saveLibraries(libraries);
  }, [libraries]);

  // filtered libraries
  const filtered = libraries.filter(
    (l) => !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.description.toLowerCase().includes(search.toLowerCase())
  );

  const totalProblems = libraries.reduce((sum, l) => sum + l.problemIds.length, 0);

  /* ── CRUD handlers ── */

  const handleCreate = (name: string, desc: string) => {
    const newLib: ProblemLibrary = {
      id: `lib-${Date.now()}`,
      name,
      description: desc,
      problemIds: [],
      createdAt: new Date().toISOString(),
      color: PALETTE[libraries.length % PALETTE.length],
    };
    setLibraries((prev) => [...prev, newLib]);
    setShowCreate(false);
    toast.success(`Library "${name}" created!`);
  };

  const handleRename = (name: string, desc: string) => {
    if (!editLib) return;
    setLibraries((prev) =>
      prev.map((l) => (l.id === editLib.id ? { ...l, name, description: desc } : l))
    );
    // also update active view if open
    if (activeLib?.id === editLib.id) {
      setActiveLib((prev) => (prev ? { ...prev, name, description: desc } : null));
    }
    setEditLib(null);
    toast.success("Library renamed!");
  };

  const handleDelete = (id: string) => {
    const lib = libraries.find((l) => l.id === id);
    setLibraries((prev) => prev.filter((l) => l.id !== id));
    if (activeLib?.id === id) setActiveLib(null);
    toast.success(`Library "${lib?.name}" deleted`);
  };

  const handleAddProblems = (ids: string[]) => {
    if (!activeLib) return;
    setLibraries((prev) =>
      prev.map((l) =>
        l.id === activeLib.id ? { ...l, problemIds: [...l.problemIds, ...ids] } : l
      )
    );
    setActiveLib((prev) =>
      prev ? { ...prev, problemIds: [...prev.problemIds, ...ids] } : null
    );
    toast.success(`Added ${ids.length} problem${ids.length > 1 ? "s" : ""} to "${activeLib.name}"`);
  };

  const handleRemoveProblem = (problemId: string) => {
    if (!activeLib) return;
    setLibraries((prev) =>
      prev.map((l) =>
        l.id === activeLib.id ? { ...l, problemIds: l.problemIds.filter((id) => id !== problemId) } : l
      )
    );
    setActiveLib((prev) =>
      prev ? { ...prev, problemIds: prev.problemIds.filter((id) => id !== problemId) } : null
    );
    const p = problemMap.get(problemId);
    toast.success(`Removed "${p?.title}" from library`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-500/5 via-background to-indigo-500/10 border-b border-border">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-500/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl" />
        </div>
        <div className="gfg-container relative py-10 md:py-14">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-4">
              <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Dashboard
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-sm font-medium text-primary">Problem Library</span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
                <Library className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Problem Library</h1>
                <p className="text-muted-foreground text-sm">
                  Organize your favorite coding problems into collections — just like playlists.
                </p>
              </div>
            </div>
          </motion.div>

          {/* quick stats */}
          <motion.div
            className="grid grid-cols-3 gap-4 mt-6 max-w-md"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="bg-card/80 backdrop-blur rounded-xl border border-border p-3 text-center">
              <p className="text-xl font-bold text-primary">{libraries.length}</p>
              <p className="text-[10px] text-muted-foreground">Libraries</p>
            </div>
            <div className="bg-card/80 backdrop-blur rounded-xl border border-border p-3 text-center">
              <p className="text-xl font-bold text-primary">{totalProblems}</p>
              <p className="text-[10px] text-muted-foreground">Saved Problems</p>
            </div>
            <div className="bg-card/80 backdrop-blur rounded-xl border border-border p-3 text-center">
              <p className="text-xl font-bold text-primary">{problems.length}</p>
              <p className="text-[10px] text-muted-foreground">Available</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* main */}
      <div className="gfg-container py-8">
        <AnimatePresence mode="wait">
          {activeLib ? (
            <LibraryDetail
              key={activeLib.id}
              library={activeLib}
              onBack={() => setActiveLib(null)}
              onRemoveProblem={handleRemoveProblem}
              onAddProblems={() => setShowAddProblems(true)}
            />
          ) : (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* toolbar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
                <div className="relative flex-1 w-full sm:max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search libraries..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-10" />
                </div>
                <Button onClick={() => setShowCreate(true)}>
                  <Plus className="h-4 w-4 mr-1" /> New Library
                </Button>
              </div>

              {/* grid */}
              {filtered.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filtered.map((lib, i) => (
                    <LibraryCard
                      key={lib.id}
                      lib={lib}
                      index={i}
                      onOpen={() => setActiveLib(lib)}
                      onRename={() => setEditLib(lib)}
                      onDelete={() => handleDelete(lib.id)}
                    />
                  ))}

                  {/* create-new placeholder card */}
                  <motion.button
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: filtered.length * 0.05 }}
                    onClick={() => setShowCreate(true)}
                    className="flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed border-border hover:border-primary/30 hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary"
                  >
                    <div className="p-3 rounded-full bg-muted">
                      <Plus className="h-6 w-6" />
                    </div>
                    <span className="text-sm font-medium">Create New Library</span>
                  </motion.button>
                </div>
              ) : (
                <div className="text-center py-16">
                  <FolderOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground font-medium">
                    {search ? "No libraries match your search." : "No libraries yet."}
                  </p>
                  <Button className="mt-4" onClick={() => setShowCreate(true)}>
                    <Plus className="h-4 w-4 mr-1" /> Create Your First Library
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* modals */}
      <AnimatePresence>
        {showCreate && <LibraryFormModal onSave={handleCreate} onClose={() => setShowCreate(false)} />}
        {editLib && <LibraryFormModal initial={editLib} onSave={handleRename} onClose={() => setEditLib(null)} />}
        {showAddProblems && activeLib && (
          <AddProblemsModal library={activeLib} onAdd={handleAddProblems} onClose={() => setShowAddProblems(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
