import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { students as mockStudents, events as mockEvents, problems as mockProblems, campusStats, Student, Event, Problem } from "@/data/mockData";
import type { BlogPost } from "@/data/mockData";
import { getAdminBlogs, saveAdminBlogs, defaultBlogPosts } from "@/data/blogData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Code, Calendar, BarChart3, Trophy, BookOpen, Trash2, Edit, Plus, RefreshCw, Save, X, FileText, Eye, EyeOff, Award, MessageSquare, Check, Mail } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { toast } from "sonner";
import { getIssuedCertificates } from "@/data/learningData";

import {
  getAllStudents, createEvent as fsCreateEvent, deleteEvent as fsDeleteEvent,
  getEvents as fsGetEvents, createProblem as fsCreateProblem,
  deleteProblem as fsDeleteProblem, getProblems as fsGetProblems,
  adminAddStudent, adminDeleteStudent,
  FirestoreUser, FSEvent, FSProblem,
} from "@/lib/firestoreService";

// Legacy localStorage keys kept ONLY for blog data (not yet migrated)

const COLORS = ["hsl(140,51%,36%)", "hsl(38,92%,50%)", "hsl(210,7%,56%)", "hsl(0,84%,60%)"];

const tabs = [
  { key: "overview", label: "Overview", icon: BarChart3 },
  { key: "students", label: "Students", icon: Users },
  { key: "events", label: "Events", icon: Calendar },
  { key: "problems", label: "Problems", icon: Code },
  { key: "leaderboard", label: "Leaderboard", icon: Trophy },
  { key: "blogs", label: "Blog & News", icon: FileText },
  { key: "learn", label: "Learn System", icon: BookOpen },
  { key: "support", label: "Support Queries", icon: MessageSquare },
];

const blogCategories = [
  { value: "ai", label: "AI" },
  { value: "programming", label: "Programming" },
  { value: "webdev", label: "Web Development" },
  { value: "datascience", label: "Data Science" },
  { value: "cybersecurity", label: "Cybersecurity" },
  { value: "technews", label: "Tech News" },
  { value: "event", label: "Event" },
  { value: "tip", label: "Tip" },
  { value: "internship", label: "Internship" },
  { value: "story", label: "Story" },
];

interface BlogFormData {
  title: string;
  author: string;
  category: string;
  tags: string;
  excerpt: string;
  content: string;
  previewImage: string;
  image: string;
  status: "published" | "draft";
}

const emptyForm: BlogFormData = {
  title: "", author: "", category: "programming", tags: "", excerpt: "", content: "", previewImage: "", image: "", status: "draft",
};

export default function AdminPage() {
  const { user, isAdmin } = useAuth();
  const [tab, setTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");

  // ── Blog state
  const [adminBlogs, setAdminBlogs] = useState<BlogPost[]>([]);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [blogForm, setBlogForm] = useState<BlogFormData>(emptyForm);

  // ── Support queries
  const [supportQueries, setSupportQueries] = useState<any[]>([]);

  // ── Firestore state (replaces localStorage)
  const [fsStudents,  setFsStudents]  = useState<FirestoreUser[]>([]);
  const [fsEvents,    setFsEvents]    = useState<FSEvent[]>([]);
  const [fsProblems,  setFsProblems]  = useState<FSProblem[]>([]);
  const [fsLoading,   setFsLoading]   = useState(true);

  useEffect(() => {
    setAdminBlogs(getAdminBlogs());
    const queries = JSON.parse(localStorage.getItem("gfg_contact_queries") || "[]");
    setSupportQueries(queries);

    // Fetch Firestore data
    Promise.all([getAllStudents(), fsGetEvents(), fsGetProblems()])
      .then(([students, events, problems]) => {
        setFsStudents(students);
        setFsEvents(events);
        setFsProblems(problems);
      })
      .catch(() => { /* Firestore unavailable — show mock data only */ })
      .finally(() => setFsLoading(false));
  }, []);

  if (!user || !isAdmin) return <Navigate to="/login" />;

  // ── Merged lists (Firestore + mock fallback)
  const allStudents = [
    ...mockStudents.filter(s => s.role === "student"),
    ...fsStudents.map(s => ({
      id: s.uid, name: s.name, email: s.email,
      department: s.department, year: s.year,
      problemsSolved: s.problemsSolved, codingPoints: s.codingPoints,
      codingStreak: s.codingStreak, eventsJoined: s.eventsJoined,
      achievements: s.achievements, role: s.role, avatar: s.avatar,
    } as Student)),
  ];
  const allEvents = [
    ...mockEvents,
    ...fsEvents.map(e => ({
      id: e.id!, title: e.title, description: e.description,
      date: e.date, time: e.time, location: e.location,
      type: e.type, isPast: e.isPast, capacity: e.capacity,
      registeredCount: e.registeredCount, organizer: e.organizer,
      tags: e.tags, prizeMoney: e.prizeMoney,
    } as Event)),
  ];
  const allProblems = [
    ...mockProblems,
    ...fsProblems.map(p => ({
      id: p.id!, title: p.title, difficulty: p.difficulty,
      description: p.description, inputFormat: p.inputFormat,
      outputFormat: p.outputFormat, sampleInput: p.sampleInput,
      sampleOutput: p.sampleOutput, constraints: p.constraints, testCases: [],
    } as Problem)),
  ];

  const filteredStudents = allStudents.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ── Add Student (Firestore)
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [studentForm, setStudentForm] = useState({ name:"", email:"", department:"", year:"1" });
  const [studentSaving, setStudentSaving] = useState(false);

  const handleAddStudent = async () => {
    if (!studentForm.name.trim() || !studentForm.email.trim() || !studentForm.department.trim()) {
      toast.error("Name, email and department are required!"); return;
    }
    setStudentSaving(true);
    try {
      const data: Omit<FirestoreUser, "uid" | "createdAt"> = {
        name: studentForm.name.trim(),
        email: studentForm.email.trim(),
        department: studentForm.department.trim(),
        year: parseInt(studentForm.year) || 1,
        problemsSolved: 0, codingPoints: 0, codingStreak: 0,
        eventsJoined: 0, achievements: [], role: "student",
        avatar: studentForm.name[0].toUpperCase(),
      };
      const newId = await adminAddStudent(data);
      setFsStudents(prev => [...prev, { uid: newId, ...data }]);
      setStudentForm({ name:"", email:"", department:"", year:"1" });
      setShowStudentForm(false);
      toast.success(`Student "${data.name}" added to Firestore!`);
    } catch {
      toast.error("Failed to save student. Check Firestore connection.");
    } finally {
      setStudentSaving(false);
    }
  };

  const handleDeleteStudent = async (uid: string) => {
    try {
      await adminDeleteStudent(uid);
      setFsStudents(prev => prev.filter(s => s.uid !== uid));
      toast.success("Student removed from Firestore!");
    } catch {
      toast.error("Failed to delete student.");
    }
  };

  // ── Create Event (Firestore)
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventForm, setEventForm] = useState({ title:"", description:"", date:"", time:"10:00 AM", location:"", type:"workshop" as FSEvent["type"], capacity:"50", organizer:"", prizeMoney:"" });
  const [eventSaving, setEventSaving] = useState(false);

  const handleCreateEvent = async () => {
    if (!eventForm.title.trim() || !eventForm.date || !eventForm.location.trim()) {
      toast.error("Title, date and location are required!"); return;
    }
    setEventSaving(true);
    try {
      const data: Omit<FSEvent, "id"|"createdAt"> = {
        title: eventForm.title.trim(),
        description: eventForm.description.trim() || "No description provided.",
        date: eventForm.date, time: eventForm.time,
        location: eventForm.location.trim(), type: eventForm.type,
        isPast: new Date(eventForm.date) < new Date(),
        capacity: parseInt(eventForm.capacity) || 50,
        registeredCount: 0,
        organizer: eventForm.organizer.trim() || user.name || "Admin",
        tags: [], prizeMoney: eventForm.prizeMoney.trim() || undefined,
      };
      const newId = await fsCreateEvent(data);
      setFsEvents(prev => [...prev, { id: newId, ...data }]);
      setEventForm({ title:"", description:"", date:"", time:"10:00 AM", location:"", type:"workshop", capacity:"50", organizer:"", prizeMoney:"" });
      setShowEventForm(false);
      toast.success(`Event "${data.title}" saved to Firestore!`);
    } catch {
      toast.error("Failed to save event. Check Firestore connection.");
    } finally {
      setEventSaving(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    // Only delete if it's a Firestore event (has Firestore id)
    const isFs = fsEvents.some(e => e.id === id);
    if (!isFs) { toast.info("Default events cannot be deleted."); return; }
    try {
      await fsDeleteEvent(id);
      setFsEvents(prev => prev.filter(e => e.id !== id));
      toast.success("Event deleted from Firestore!");
    } catch {
      toast.error("Failed to delete event.");
    }
  };

  // ── Add Problem (Firestore)
  const [showProblemForm, setShowProblemForm] = useState(false);
  const [problemForm, setProblemForm] = useState({ title:"", difficulty:"Easy" as FSProblem["difficulty"], description:"", inputFormat:"", outputFormat:"", sampleInput:"", sampleOutput:"", constraints:"" });
  const [problemSaving, setProblemSaving] = useState(false);

  const handleAddProblem = async () => {
    if (!problemForm.title.trim() || !problemForm.description.trim()) {
      toast.error("Title and description are required!"); return;
    }
    setProblemSaving(true);
    try {
      const data: Omit<FSProblem, "id"|"createdAt"> = {
        title: problemForm.title.trim(),
        difficulty: problemForm.difficulty,
        description: problemForm.description.trim(),
        inputFormat: problemForm.inputFormat.trim() || "Standard input",
        outputFormat: problemForm.outputFormat.trim() || "Standard output",
        sampleInput: problemForm.sampleInput.trim(),
        sampleOutput: problemForm.sampleOutput.trim(),
        constraints: problemForm.constraints.trim() || "1 ≤ N ≤ 10^5",
      };
      const newId = await fsCreateProblem(data);
      setFsProblems(prev => [...prev, { id: newId, ...data }]);
      setProblemForm({ title:"", difficulty:"Easy", description:"", inputFormat:"", outputFormat:"", sampleInput:"", sampleOutput:"", constraints:"" });
      setShowProblemForm(false);
      toast.success(`Problem "${data.title}" saved to Firestore!`);
    } catch {
      toast.error("Failed to save problem. Check Firestore connection.");
    } finally {
      setProblemSaving(false);
    }
  };

  const handleDeleteProblem = async (id: string) => {
    const isFs = fsProblems.some(p => p.id === id);
    if (!isFs) { toast.info("Default problems cannot be deleted."); return; }
    try {
      await fsDeleteProblem(id);
      setFsProblems(prev => prev.filter(p => p.id !== id));
      toast.success("Problem deleted from Firestore!");
    } catch {
      toast.error("Failed to delete problem.");
    }
  };

  // Blog management functions
  const allBlogs = [...defaultBlogPosts, ...adminBlogs];

  const handleBlogFormChange = (field: keyof BlogFormData, value: string) => {
    setBlogForm(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateBlog = () => {
    setEditingBlogId(null);
    setBlogForm({ ...emptyForm, author: user.name || "" });
    setShowBlogForm(true);
  };

  const handleEditBlog = (blog: BlogPost) => {
    setEditingBlogId(blog.id);
    setBlogForm({
      title: blog.title,
      author: blog.author,
      category: blog.category,
      tags: blog.tags.join(", "),
      excerpt: blog.excerpt,
      content: blog.content,
      previewImage: blog.image || "",
      image: blog.image || "",
      status: blog.status,
    });
    setShowBlogForm(true);
  };

  const handleSaveBlog = () => {
    if (!blogForm.title.trim() || !blogForm.content.trim()) {
      toast.error("Title and content are required!");
      return;
    }

    const blogPost: BlogPost = {
      id: editingBlogId || `admin_${Date.now()}`,
      title: blogForm.title,
      author: blogForm.author || user.name || "Admin",
      category: blogForm.category as BlogPost["category"],
      tags: blogForm.tags.split(",").map(t => t.trim()).filter(Boolean),
      excerpt: blogForm.excerpt || blogForm.content.slice(0, 120) + "...",
      content: blogForm.content,
      image: blogForm.image || blogForm.previewImage || undefined,
      status: blogForm.status,
      date: editingBlogId
        ? adminBlogs.find(b => b.id === editingBlogId)?.date || new Date().toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };

    let updated: BlogPost[];
    if (editingBlogId) {
      updated = adminBlogs.map(b => b.id === editingBlogId ? blogPost : b);
      toast.success("Blog post updated!");
    } else {
      updated = [...adminBlogs, blogPost];
      toast.success("Blog post created!");
    }

    setAdminBlogs(updated);
    saveAdminBlogs(updated);
    setShowBlogForm(false);
    setBlogForm(emptyForm);
    setEditingBlogId(null);
  };

  const handleDeleteBlog = (blogId: string) => {
    const updated = adminBlogs.filter(b => b.id !== blogId);
    setAdminBlogs(updated);
    saveAdminBlogs(updated);
    toast.success("Blog post deleted!");
  };

  const handleToggleStatus = (blogId: string) => {
    const updated = adminBlogs.map(b =>
      b.id === blogId ? { ...b, status: b.status === "published" ? "draft" as const : "published" as const } : b
    );
    setAdminBlogs(updated);
    saveAdminBlogs(updated);
    toast.success("Blog status updated!");
  };

  const handleMarkQueryRead = (id: string) => {
    const updated = supportQueries.map(q => q.id === id ? { ...q, status: "read" } : q);
    setSupportQueries(updated);
    localStorage.setItem("gfg_contact_queries", JSON.stringify(updated));
    toast.success("Query marked as read!");
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="hidden md:flex w-56 flex-col border-r border-border bg-card p-4 gap-1">
        <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">Admin Panel</div>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === t.key ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}>
            <t.icon className="h-4 w-4" />{t.label}
          </button>
        ))}
      </aside>

      {/* Mobile tabs */}
      <div className="md:hidden flex overflow-x-auto border-b border-border bg-card fixed top-16 left-0 right-0 z-40">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-3 text-xs font-medium whitespace-nowrap border-b-2 ${
              tab === t.key ? "border-primary text-primary" : "border-transparent text-muted-foreground"
            }`}>
            <t.icon className="h-3.5 w-3.5" />{t.label}
          </button>
        ))}
      </div>

      {/* Main */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto md:mt-0 mt-12">
        {tab === "overview" && (
          <div>
            <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { icon: Users, label: "Total Students", value: allStudents.length },
                { icon: Code, label: "Total Problems", value: allProblems.length },
                { icon: Trophy, label: "Certificates Issued", value: getIssuedCertificates().length },
                { icon: FileText, label: "Blog Posts", value: allBlogs.length },
              ].map((s, i) => (
                <div key={i} className="gfg-stat-card">
                  <s.icon className="h-5 w-5 text-primary" />
                  <div className="text-2xl font-bold">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="gfg-card">
                <h3 className="font-semibold mb-4">Weekly Activity</h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={campusStats.weeklyActivity}>
                      <XAxis dataKey="day" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Bar dataKey="problems" fill="hsl(140,51%,36%)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="gfg-card">
                <h3 className="font-semibold mb-4">Language Distribution</h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={campusStats.languageDistribution} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={4} dataKey="value">
                        {campusStats.languageDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-3 justify-center">
                  {campusStats.languageDistribution.map((d, i) => (
                    <div key={d.name} className="flex items-center gap-1.5 text-xs">
                      <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />{d.name} ({d.value}%)
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "students" && (
          <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <h1 className="text-2xl font-bold">Student Management</h1>
              <Button size="sm" onClick={() => setShowStudentForm(v => !v)}>
                {showStudentForm ? <X className="h-4 w-4 mr-1" /> : <Plus className="h-4 w-4 mr-1" />}
                {showStudentForm ? "Cancel" : "Add Student"}
              </Button>
            </div>

            {/* ── Add Student Form ── */}
            {showStudentForm && (
              <div className="gfg-card mb-6 border-primary/30 bg-primary/5">
                <h3 className="font-semibold text-base mb-4 text-primary">Add New Student</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Full Name *</label>
                    <Input value={studentForm.name} onChange={e => setStudentForm(p => ({...p, name: e.target.value}))} placeholder="e.g. Rohit Sharma" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Email *</label>
                    <Input type="email" value={studentForm.email} onChange={e => setStudentForm(p => ({...p, email: e.target.value}))} placeholder="student@college.edu" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Department *</label>
                    <Input value={studentForm.department} onChange={e => setStudentForm(p => ({...p, department: e.target.value}))} placeholder="e.g. CSE, IT, ECE" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Year</label>
                    <select value={studentForm.year} onChange={e => setStudentForm(p => ({...p, year: e.target.value}))} className="w-full bg-muted border border-border rounded-md px-3 py-2 text-sm">
                      {[1,2,3,4,5].map(y => <option key={y} value={y}>Year {y}</option>)}
                    </select>
                  </div>
                </div>
                <Button onClick={handleAddStudent} className="gap-2"><Save className="h-4 w-4" /> Save Student</Button>
              </div>
            )}

            <Input placeholder="Search students..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="mb-4 max-w-sm" />
            <div className="gfg-card overflow-hidden p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase p-3">Name</th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase p-3 hidden sm:table-cell">Email</th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase p-3">Dept</th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase p-3">Problems</th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase p-3">Points</th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map(s => (
                      <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                        <td className="p-3 font-medium">{s.name}</td>
                        <td className="p-3 text-sm text-muted-foreground hidden sm:table-cell">{s.email}</td>
                        <td className="p-3 text-sm">{s.department}</td>
                        <td className="p-3 text-sm">{s.problemsSolved}</td>
                        <td className="p-3 text-sm font-medium">{s.codingPoints}</td>
                        <td className="p-3">
                          <div className="flex gap-1">
                            {fsStudents.find(a => a.uid === s.id) ? (
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteStudent(s.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                            ) : (
                              <span className="text-xs text-muted-foreground px-2">Default</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {tab === "events" && (
          <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <h1 className="text-2xl font-bold">Event Management</h1>
              <Button size="sm" onClick={() => setShowEventForm(v => !v)}>
                {showEventForm ? <X className="h-4 w-4 mr-1" /> : <Plus className="h-4 w-4 mr-1" />}
                {showEventForm ? "Cancel" : "Create Event"}
              </Button>
            </div>

            {/* ── Create Event Form ── */}
            {showEventForm && (
              <div className="gfg-card mb-6 border-primary/30 bg-primary/5">
                <h3 className="font-semibold text-base mb-4 text-primary">Create New Event</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Event Title *</label>
                    <Input value={eventForm.title} onChange={e => setEventForm(p => ({...p, title: e.target.value}))} placeholder="e.g. HackCampus 2026" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Date *</label>
                    <Input type="date" value={eventForm.date} onChange={e => setEventForm(p => ({...p, date: e.target.value}))} />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Time</label>
                    <Input value={eventForm.time} onChange={e => setEventForm(p => ({...p, time: e.target.value}))} placeholder="10:00 AM" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Location *</label>
                    <Input value={eventForm.location} onChange={e => setEventForm(p => ({...p, location: e.target.value}))} placeholder="e.g. CS Lab 301" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Type</label>
                    <select value={eventForm.type} onChange={e => setEventForm(p => ({...p, type: e.target.value as Event["type"]}))} className="w-full bg-muted border border-border rounded-md px-3 py-2 text-sm">
                      {["contest","hackathon","workshop","seminar","meetup"].map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Capacity</label>
                    <Input type="number" value={eventForm.capacity} onChange={e => setEventForm(p => ({...p, capacity: e.target.value}))} placeholder="50" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Organizer</label>
                    <Input value={eventForm.organizer} onChange={e => setEventForm(p => ({...p, organizer: e.target.value}))} placeholder="Team / Person name" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Prize Money (optional)</label>
                    <Input value={eventForm.prizeMoney} onChange={e => setEventForm(p => ({...p, prizeMoney: e.target.value}))} placeholder="e.g. ₹50,000" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Description</label>
                    <textarea value={eventForm.description} onChange={e => setEventForm(p => ({...p, description: e.target.value}))} rows={3} placeholder="Brief description of the event..." className="w-full bg-muted border border-border rounded-md px-3 py-2 text-sm resize-y" />
                  </div>
                </div>
                <Button onClick={handleCreateEvent} className="gap-2"><Save className="h-4 w-4" /> Create Event</Button>
              </div>
            )}

            <div className="space-y-3">
              {allEvents.map(e => (
                <div key={e.id} className="gfg-card flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{e.title}</h3>
                      {fsEvents.find(a => a.id === e.id) && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/15 text-primary font-bold">NEW</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{new Date(e.date).toLocaleDateString()} • {e.location} • {e.type}</p>
                  </div>
                  <div className="flex gap-1">
                    {fsEvents.find(a => a.id === e.id) ? (
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteEvent(e.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                    ) : (
                      <span className="text-xs text-muted-foreground px-2">Default</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "problems" && (
          <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <h1 className="text-2xl font-bold">Coding Problems</h1>
              <Button size="sm" onClick={() => setShowProblemForm(v => !v)}>
                {showProblemForm ? <X className="h-4 w-4 mr-1" /> : <Plus className="h-4 w-4 mr-1" />}
                {showProblemForm ? "Cancel" : "Add Problem"}
              </Button>
            </div>

            {/* ── Add Problem Form ── */}
            {showProblemForm && (
              <div className="gfg-card mb-6 border-primary/30 bg-primary/5">
                <h3 className="font-semibold text-base mb-4 text-primary">Add New Coding Problem</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Problem Title *</label>
                    <Input value={problemForm.title} onChange={e => setProblemForm(p => ({...p, title: e.target.value}))} placeholder="e.g. Two Sum" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Difficulty</label>
                    <select value={problemForm.difficulty} onChange={e => setProblemForm(p => ({...p, difficulty: e.target.value as Problem["difficulty"]}))} className="w-full bg-muted border border-border rounded-md px-3 py-2 text-sm">
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Constraints</label>
                    <Input value={problemForm.constraints} onChange={e => setProblemForm(p => ({...p, constraints: e.target.value}))} placeholder="1 ≤ N ≤ 10^5" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Description *</label>
                    <textarea value={problemForm.description} onChange={e => setProblemForm(p => ({...p, description: e.target.value}))} rows={3} placeholder="Describe the problem clearly..." className="w-full bg-muted border border-border rounded-md px-3 py-2 text-sm resize-y" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Input Format</label>
                    <Input value={problemForm.inputFormat} onChange={e => setProblemForm(p => ({...p, inputFormat: e.target.value}))} placeholder="First line: N ..." />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Output Format</label>
                    <Input value={problemForm.outputFormat} onChange={e => setProblemForm(p => ({...p, outputFormat: e.target.value}))} placeholder="A single integer ..." />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Sample Input</label>
                    <textarea value={problemForm.sampleInput} onChange={e => setProblemForm(p => ({...p, sampleInput: e.target.value}))} rows={2} className="w-full bg-muted border border-border rounded-md px-3 py-2 text-sm font-mono resize-y" placeholder="5&#10;1 2 3 4 5" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Sample Output</label>
                    <textarea value={problemForm.sampleOutput} onChange={e => setProblemForm(p => ({...p, sampleOutput: e.target.value}))} rows={2} className="w-full bg-muted border border-border rounded-md px-3 py-2 text-sm font-mono resize-y" placeholder="15" />
                  </div>
                </div>
                <Button onClick={handleAddProblem} className="gap-2"><Save className="h-4 w-4" /> Add Problem</Button>
              </div>
            )}

            <div className="space-y-3">
              {allProblems.map(p => (
                <div key={p.id} className="gfg-card flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      p.difficulty === "Easy" ? "bg-primary/10 text-primary" : p.difficulty === "Medium" ? "bg-gfg-amber/10 text-gfg-amber" : "bg-destructive/10 text-destructive"
                    }`}>{p.difficulty}</span>
                    <div>
                      <h3 className="font-semibold text-sm">{p.title}</h3>
                      {fsProblems.find(a => a.id === p.id) && (
                        <span className="text-[10px] text-primary font-bold">Admin-created</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {fsProblems.find(a => a.id === p.id) ? (
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteProblem(p.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                    ) : (
                      <span className="text-xs text-muted-foreground px-2">Default</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "leaderboard" && (
          <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <h1 className="text-2xl font-bold">Leaderboard Control</h1>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => toast.success("Leaderboard recalculated!")}><RefreshCw className="h-4 w-4 mr-1" />Recalculate</Button>
                <Button size="sm" variant="outline" onClick={() => toast.success("Leaderboard reset!")}><Trash2 className="h-4 w-4 mr-1" />Reset Weekly</Button>
              </div>
            </div>
            <div className="gfg-card overflow-hidden p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase p-3">Rank</th>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase p-3">Name</th>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase p-3">Points</th>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase p-3">Badge</th>
                    <th className="text-left text-xs font-medium text-muted-foreground uppercase p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[...mockStudents].filter(s => s.role === "student").sort((a, b) => b.codingPoints - a.codingPoints).map((s, i) => (
                    <tr key={s.id} className="border-b border-border last:border-0">
                      <td className="p-3 font-bold">{i + 1}</td>
                      <td className="p-3 font-medium">{s.name}</td>
                      <td className="p-3">{s.codingPoints}</td>
                      <td className="p-3">
                        <span className={i === 0 ? "gfg-badge-gold" : i === 1 ? "gfg-badge-silver" : i === 2 ? "gfg-badge-bronze" : ""}>
                          {i === 0 ? "🥇 Gold" : i === 1 ? "🥈 Silver" : i === 2 ? "🥉 Bronze" : "—"}
                        </span>
                      </td>
                      <td className="p-3">
                        <Button variant="ghost" size="sm" onClick={() => toast.info(`Award badge to ${s.name}`)}><Trophy className="h-3.5 w-3.5 text-gfg-amber" /></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── BLOG MANAGEMENT TAB ─────────────────────── */}
        {tab === "blogs" && (
          <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <h1 className="text-2xl font-bold">Blog & News Management</h1>
              <Button size="sm" onClick={handleCreateBlog}>
                <Plus className="h-4 w-4 mr-1" /> New Blog Post
              </Button>
            </div>

            {/* Blog Editor Form */}
            {showBlogForm && (
              <div className="gfg-card mb-6 border-primary/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">{editingBlogId ? "Edit Blog Post" : "Create New Blog Post"}</h3>
                  <Button variant="ghost" size="sm" onClick={() => { setShowBlogForm(false); setBlogForm(emptyForm); }}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Title *</label>
                    <Input value={blogForm.title} onChange={e => handleBlogFormChange("title", e.target.value)} placeholder="Enter blog title" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Author</label>
                    <Input value={blogForm.author} onChange={e => handleBlogFormChange("author", e.target.value)} placeholder="Author name" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Category</label>
                    <select value={blogForm.category} onChange={e => handleBlogFormChange("category", e.target.value)}
                      className="w-full bg-muted border border-border rounded-md px-3 py-2 text-sm">
                      {blogCategories.map(c => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Tags (comma separated)</label>
                    <Input value={blogForm.tags} onChange={e => handleBlogFormChange("tags", e.target.value)} placeholder="Python, AI, Web Dev" />
                  </div>
                  <div className="md:col-span-1">
                    <label className="text-sm font-medium mb-1 block">Preview Image URL (Thumbnail)</label>
                    <Input value={blogForm.previewImage} onChange={e => handleBlogFormChange("previewImage", e.target.value)} placeholder="https://example.com/thumb.jpg" />
                  </div>
                  <div className="md:col-span-1">
                    <label className="text-sm font-medium mb-1 block">Featured Article Image URL</label>
                    <Input value={blogForm.image} onChange={e => handleBlogFormChange("image", e.target.value)} placeholder="https://example.com/hero.jpg" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium mb-1 block">Excerpt (short preview)</label>
                    <Input value={blogForm.excerpt} onChange={e => handleBlogFormChange("excerpt", e.target.value)} placeholder="A short description of the blog post" />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="text-sm font-medium mb-1 block">Content * (Markdown supported)</label>
                  <div className="text-xs text-muted-foreground mb-2">
                    Supports: ## Headings, **bold**, `code`, ```code blocks```, - lists, 1. ordered lists, &gt; blockquotes, | tables |
                  </div>
                  <textarea
                    value={blogForm.content}
                    onChange={e => handleBlogFormChange("content", e.target.value)}
                    placeholder="Write your blog content here... Markdown formatting is supported."
                    className="w-full h-64 bg-muted border border-border rounded-md px-4 py-3 text-sm font-mono resize-y"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Status:</label>
                    <select value={blogForm.status} onChange={e => handleBlogFormChange("status", e.target.value)}
                      className="bg-muted border border-border rounded-md px-3 py-1.5 text-sm">
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => { setShowBlogForm(false); setBlogForm(emptyForm); }}>Cancel</Button>
                    <Button onClick={handleSaveBlog}>
                      <Save className="h-4 w-4 mr-1" /> {editingBlogId ? "Update" : "Create"} Post
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Default Blog Posts (Read-only) */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Default Posts ({defaultBlogPosts.length})</h3>
              <div className="space-y-2">
                {defaultBlogPosts.map(b => (
                  <div key={b.id} className="gfg-card flex items-center justify-between flex-wrap gap-3 py-3">
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
                        b.category === "ai" ? "bg-purple-500/10 text-purple-600" :
                        b.category === "programming" ? "bg-blue-500/10 text-blue-600" :
                        b.category === "webdev" ? "bg-emerald-500/10 text-emerald-600" :
                        "bg-muted text-muted-foreground"
                      }`}>{b.category}</span>
                      <div>
                        <h4 className="font-medium text-sm">{b.title}</h4>
                        <p className="text-xs text-muted-foreground">{b.author} • {b.date}</p>
                      </div>
                    </div>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Published</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Admin-Created Blog Posts */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Your Posts ({adminBlogs.length})</h3>
              {adminBlogs.length === 0 ? (
                <div className="gfg-card text-center py-8">
                  <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground mb-3">No admin blog posts yet.</p>
                  <Button size="sm" onClick={handleCreateBlog}>
                    <Plus className="h-4 w-4 mr-1" /> Create Your First Post
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {adminBlogs.map(b => (
                    <div key={b.id} className="gfg-card flex items-center justify-between flex-wrap gap-3 py-3">
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
                          b.category === "ai" ? "bg-purple-500/10 text-purple-600" :
                          b.category === "programming" ? "bg-blue-500/10 text-blue-600" :
                          b.category === "webdev" ? "bg-emerald-500/10 text-emerald-600" :
                          "bg-muted text-muted-foreground"
                        }`}>{b.category}</span>
                        <div>
                          <h4 className="font-medium text-sm">{b.title}</h4>
                          <p className="text-xs text-muted-foreground">{b.author} • {b.date} • {b.tags.join(", ")}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleToggleStatus(b.id)} title={b.status === "published" ? "Unpublish" : "Publish"}>
                          {b.status === "published" ? <Eye className="h-3.5 w-3.5 text-primary" /> : <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEditBlog(b)}><Edit className="h-3.5 w-3.5" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteBlog(b.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full font-medium ${
                          b.status === "published" ? "bg-primary/10 text-primary" : "bg-gfg-amber/10 text-gfg-amber"
                        }`}>{b.status === "published" ? "Published" : "Draft"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── LEARN SYSTEM MANAGEMENT TAB ─────────────────────── */}
        {tab === "learn" && (
          <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <h1 className="text-2xl font-bold">Learn & Practice Content Management</h1>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => toast.info("Add Topic form opened")}><Plus className="h-4 w-4 mr-1" /> Add Learning Topic</Button>
                <Button size="sm" variant="outline" onClick={() => toast.info("Add Practice Problem form opened")}><Code className="h-4 w-4 mr-1" /> Add Practice Problem</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Learning Streams Panel */}
              <div className="gfg-card">
                <h3 className="text-lg font-semibold mb-4 border-b border-border pb-2">Learning Streams & Topics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm border border-border p-3 rounded-md bg-muted/30">
                    <div>
                      <span className="font-bold text-blue-500">Python Programming</span>
                      <p className="text-muted-foreground text-xs mt-1">3 Modules • 6 Topics</p>
                    </div>
                    <Button variant="ghost" size="sm">Manage</Button>
                  </div>
                  <div className="flex justify-between items-center text-sm border border-border p-3 rounded-md bg-muted/30">
                    <div>
                      <span className="font-bold text-orange-500">Java Programming</span>
                      <p className="text-muted-foreground text-xs mt-1">1 Module • 1 Topic</p>
                    </div>
                    <Button variant="ghost" size="sm">Manage</Button>
                  </div>
                  <div className="flex justify-between items-center text-sm border border-border p-3 rounded-md bg-muted/30">
                    <div>
                      <span className="font-bold text-blue-600">C++ Programming</span>
                      <p className="text-muted-foreground text-xs mt-1">1 Module • 1 Topic</p>
                    </div>
                    <Button variant="ghost" size="sm">Manage</Button>
                  </div>
                </div>
              </div>

              {/* Practice Problems Panel */}
              <div className="gfg-card">
                <h3 className="text-lg font-semibold mb-4 border-b border-border pb-2">Practice Problems Database</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm border-l-4 border-l-primary bg-muted/30 p-2 rounded-r-md">
                    <div>
                      <span className="font-semibold block mb-0.5">Print Numbers 1 to N</span>
                      <span className="text-xs text-muted-foreground">Python • Loops • Easy</span>
                    </div>
                    <Button variant="ghost" size="sm"><Edit className="h-3 w-3" /></Button>
                  </div>
                  <div className="flex justify-between items-center text-sm border-l-4 border-l-gfg-amber bg-muted/30 p-2 rounded-r-md">
                    <div>
                      <span className="font-semibold block mb-0.5">Find Factorial</span>
                      <span className="text-xs text-muted-foreground">Python • Loops • Medium</span>
                    </div>
                    <Button variant="ghost" size="sm"><Edit className="h-3 w-3" /></Button>
                  </div>
                  <div className="flex justify-between items-center text-sm border-l-4 border-l-primary bg-muted/30 p-2 rounded-r-md">
                    <div>
                      <span className="font-semibold block mb-0.5">Multiplication Table</span>
                      <span className="text-xs text-muted-foreground">Python • Loops • Easy</span>
                    </div>
                    <Button variant="ghost" size="sm"><Edit className="h-3 w-3" /></Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-gfg-amber" /> Issued Course Certificates
              </h3>
              <div className="gfg-card p-0 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase p-3">Student</th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase p-3">Course</th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase p-3">Date</th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase p-3">ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getIssuedCertificates().length > 0 ? (
                      getIssuedCertificates().map(cert => (
                        <tr key={cert.certificateId} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                          <td className="p-3 font-medium text-sm">{cert.studentName}</td>
                          <td className="p-3 text-sm">{cert.courseName}</td>
                          <td className="p-3 text-sm text-muted-foreground">{cert.date}</td>
                          <td className="p-3 text-xs font-mono text-primary">{cert.certificateId}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-10 text-center text-muted-foreground text-sm">No certificates issued yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ─── SUPPORT QUERIES TAB ─────────────────────── */}
        {tab === "support" && (
          <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-primary" /> Support Queries
              </h1>
            </div>
            
            {supportQueries.length === 0 ? (
              <div className="gfg-card text-center py-16 flex flex-col items-center">
                <Mail className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-bold mb-2">No queries yet</h3>
                <p className="text-muted-foreground">When users submit the contact form, their messages will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {supportQueries.map(q => (
                  <div key={q.id} className={`gfg-card relative overflow-hidden flex flex-col md:flex-row gap-4 justify-between transition-all ${q.status === "unread" ? "border-primary/50 bg-primary/5 shadow-md" : "opacity-80"}`}>
                    {q.status === "unread" && (
                      <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-primary m-3 animate-pulse" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg">{q.subject}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${q.status === "unread" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                          {q.status}
                        </span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          {new Date(q.date).toLocaleString()}
                        </span>
                      </div>
                      
                      <p className="text-sm font-medium mb-3">From: <span className="text-primary">{q.name}</span> <span className="text-muted-foreground">({q.email})</span></p>
                      
                      <div className="bg-black/30 p-4 rounded-lg border border-white/5 text-sm text-gray-300 whitespace-pre-wrap">
                        {q.message}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2 md:w-32">
                      {q.status === "unread" && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full text-xs font-bold border-primary/30 hover:bg-primary/20 text-primary"
                          onClick={() => handleMarkQueryRead(q.id)}
                        >
                          <Check className="w-3.5 h-3.5 mr-1" /> Mark Read
                        </Button>
                      )}
                      <a href={`mailto:${q.email}?subject=Re: ${q.subject}`} className="w-full">
                        <Button size="sm" className="w-full text-xs font-bold">
                          <Mail className="w-3.5 h-3.5 mr-1" /> Reply
                        </Button>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
