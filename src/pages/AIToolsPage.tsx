import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Bug, FileSearch, Navigation, FileText, Zap, Send, Upload, X, Brain, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const oneDarkStyle = oneDark as any;

// ─── Groq API helper ───────────────────────────────────────────────────────────
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";
const GROQ_MODEL   = "llama-3.3-70b-versatile";

interface GroqMessage { role: "system" | "user" | "assistant"; content: string; }

async function askGroq(messages: GroqMessage[]): Promise<string> {
  if (!GROQ_API_KEY) {
    return "⚠️ Groq API key is missing. Add `VITE_GROQ_API_KEY` to your `.env` file.";
  }
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 2048,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `HTTP ${res.status}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "No response from AI.";
}

// ─── Markdown Renderer ─────────────────────────────────────────────────────────
function MarkdownMessage({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        code({ className, children }: any) {
          const match = /language-(\w+)/.exec(className || "");
          if (match) {
            return (
              <div className="my-3 rounded-xl overflow-hidden border border-white/10">
                <div className="flex items-center px-4 py-1.5 bg-[#1a1a2e] border-b border-white/10">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{match[1]}</span>
                </div>
                <SyntaxHighlighter
                  style={oneDarkStyle}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{ margin: 0, borderRadius: 0, background: "#0d0d1a", fontSize: "0.78rem", lineHeight: "1.6", padding: "1rem" }}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              </div>
            );
          }
          return <code className="bg-white/10 text-emerald-300 font-mono text-[0.8em] px-1.5 py-0.5 rounded">{children}</code>;
        },
        h1: ({ children }) => <h1 className="text-base font-bold text-white mt-4 mb-2 border-b border-white/10 pb-1">{children}</h1>,
        h2: ({ children }) => <h2 className="text-sm font-bold text-blue-300 mt-3 mb-1.5">{children}</h2>,
        h3: ({ children }) => <h3 className="text-sm font-semibold text-gray-200 mt-2 mb-1">{children}</h3>,
        p: ({ children }) => <p className="text-sm text-gray-200 leading-relaxed mb-2">{children}</p>,
        ul: ({ children }) => <ul className="list-disc list-inside text-sm text-gray-300 space-y-1 mb-2 ml-2">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal list-inside text-sm text-gray-300 space-y-1 mb-2 ml-2">{children}</ol>,
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
        em: ({ children }) => <em className="italic text-gray-300">{children}</em>,
        blockquote: ({ children }) => <blockquote className="border-l-2 border-blue-500 pl-3 my-2 text-gray-400 italic text-sm">{children}</blockquote>,
        a: ({ href, children }) => <a href={href} target="_blank" rel="noreferrer" className="text-blue-400 underline hover:text-blue-300 text-sm">{children}</a>,
        hr: () => <hr className="border-white/10 my-3" />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

export default function AIToolsPage() {
  const [activeAnalysis, setActiveAnalysis] = useState<string | null>(null);

  // ── AI Mentor ───────────────────────────────────────
  const [isMentorOpen, setIsMentorOpen] = useState(false);
  const [mentorInput, setMentorInput] = useState("");
  const [mentorMessages, setMentorMessages] = useState<{ role: string; content: string }[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // ── Debugger ────────────────────────────────────────
  const [debugCode, setDebugCode] = useState("");
  const [debugLang, setDebugLang] = useState("python");
  const [debugResult, setDebugResult] = useState<string | null>(null);

  // ── Explainer ───────────────────────────────────────
  const [explainCode, setExplainCode] = useState("");
  const [explainResult, setExplainResult] = useState<string | null>(null);

  // ── Roadmap ─────────────────────────────────────────
  const [roadmapGoal, setRoadmapGoal] = useState("Placement preparation");
  const [roadmapLevel, setRoadmapLevel] = useState("Beginner");
  const [roadmapResult, setRoadmapResult] = useState<string | null>(null);

  // ── Resume ──────────────────────────────────────────
  const [resumeText, setResumeText] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeResult, setResumeResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Handlers ────────────────────────────────────────

  const handleMentorSend = async () => {
    if (!mentorInput.trim()) return;
    const userMsg = { role: "user", content: mentorInput };
    const history = [...mentorMessages, userMsg];
    setMentorMessages(history);
    setMentorInput("");
    setActiveAnalysis("mentor");
    setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), 100);

    try {
      // Build message history in OpenAI format
      const messages: GroqMessage[] = [
        { role: "system", content: "You are an expert AI Coding Mentor for students. Be helpful, concise, and use markdown with code blocks (with language names) where appropriate." },
        ...history.map(m => ({ role: m.role as "user" | "assistant", content: m.content })),
      ];
      const reply = await askGroq(messages);
      setMentorMessages(prev => [...prev, { role: "assistant", content: reply }]);
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (err: any) {
      toast.error(`AI Mentor error: ${err.message}`);
    } finally {
      setActiveAnalysis(null);
    }
  };

  const handleDebugger = async () => {
    if (!debugCode.trim()) return toast.error("Please paste some code first");
    setActiveAnalysis("debugger");
    setDebugResult(null);
    try {
      const result = await askGroq([
        { role: "system", content: "You are an expert code debugger. Identify bugs clearly, explain what is wrong, then provide corrected code. Use markdown with fenced code blocks." },
        { role: "user", content: `Debug this ${debugLang} code:\n\n\`\`\`${debugLang}\n${debugCode}\n\`\`\`\n\nFormat response as:\n## 🐛 Issues Found\n## ✅ Fixed Code\n## 💡 Improvements` },
      ]);
      setDebugResult(result);
    } catch (err: any) {
      toast.error(`Debugger error: ${err.message}`);
    } finally {
      setActiveAnalysis(null);
    }
  };

  const handleExplainer = async () => {
    if (!explainCode.trim()) return toast.error("Please paste some code first");
    setActiveAnalysis("explainer");
    setExplainResult(null);
    try {
      const result = await askGroq([
        { role: "system", content: "You are a coding teacher. Explain code in a clear, beginner-friendly way, breaking it down section by section with plain English and analogies. Use markdown." },
        { role: "user", content: `Explain this code:\n\n\`\`\`\n${explainCode}\n\`\`\`` },
      ]);
      setExplainResult(result);
    } catch (err: any) {
      toast.error(`Explainer error: ${err.message}`);
    } finally {
      setActiveAnalysis(null);
    }
  };

  const handleRoadmap = async () => {
    setActiveAnalysis("roadmap");
    setRoadmapResult(null);
    try {
      const result = await askGroq([
        { role: "system", content: "You are an expert programming educator and career coach. Create detailed, actionable learning roadmaps with specific tools, resources, and timelines. Use markdown headers and bullet points." },
        { role: "user", content: `Create a detailed learning roadmap for a ${roadmapLevel} student with goal: ${roadmapGoal}. Include phases, topics, estimated time, projects, recommended books/sites, and a realistic timeline.` },
      ]);
      setRoadmapResult(result);
    } catch (err: any) {
      toast.error(`Roadmap error: ${err.message}`);
    } finally {
      setActiveAnalysis(null);
    }
  };

  const handleResumeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setResumeFile(file);
    // Read file as text
    const text = await file.text().catch(() => "");
    setResumeText(text || `[File: ${file.name} — paste resume text below for analysis]`);
  };

  const handleResume = async () => {
    if (!resumeText.trim()) return toast.error("Please upload a file or paste your resume text");
    setActiveAnalysis("resume");
    setResumeResult(null);
    try {
      const result = await askGroq([
        { role: "system", content: "You are an expert technical recruiter and resume coach specializing in software/tech roles. Analyze resumes and provide detailed, actionable feedback. Use markdown formatting." },
        { role: "user", content: `Analyze this resume and provide: a score out of 100, strengths, weaknesses, detected skills, improvement suggestions, and suitable job roles.\n\nResume:\n${resumeText.slice(0, 3000)}` },
      ]);
      setResumeResult(result);
    } catch (err: any) {
      toast.error(`Resume analysis error: ${err.message}`);
    } finally {
      setActiveAnalysis(null);
    }
  };

  return (
    <div className="min-h-screen bg-background relative font-sans overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="gfg-container py-16 relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 border border-accent/30 text-accent text-sm font-semibold mb-6 backdrop-blur-md">
            <Zap className="h-4 w-4" /> Powered by Groq · Llama 3.3
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            AI Developer <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-accent">Tools</span>
          </h1>
          <p className="text-gray-400 text-lg">Smart tools powered by Google Gemini to accelerate your coding journey.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* ── AI Coding Mentor ── */}
          <motion.div whileHover={{ y: -5 }}
            className="glass-card flex flex-col p-6 rounded-2xl border border-white/10 hover:border-blue-500/40 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all bg-gradient-to-br from-white/5 to-black/40 group"
          >
            <div className="w-14 h-14 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">AI Coding Mentor</h3>
            <p className="text-sm text-gray-400 mb-6 flex-1">Chat 1-on-1 with an AI mentor for Python, Java, Web Dev and more.</p>
            <Button className="w-full bg-white/5 border border-white/10 hover:bg-blue-500 hover:text-white transition-all text-white font-bold h-11" onClick={() => setIsMentorOpen(true)}>
              Open Mentor Chat
            </Button>
          </motion.div>

          {/* ── AI Code Debugger ── */}
          <motion.div whileHover={{ y: -5 }}
            className="glass-card flex flex-col p-6 rounded-2xl border border-white/10 hover:border-red-500/40 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all bg-gradient-to-br from-white/5 to-black/40 group md:col-span-2 lg:col-span-1"
          >
            <div className="w-14 h-14 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Bug className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">AI Code Debugger</h3>
            <div className="flex gap-3 mb-3">
              <select className="bg-black/50 border border-white/10 rounded-md px-2 py-1 text-xs text-white outline-none focus:border-red-500" value={debugLang} onChange={e => setDebugLang(e.target.value)}>
                {["python","javascript","java","cpp","typescript","go","rust","c"].map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div className="bg-black/50 border border-white/10 p-3 rounded-lg mb-4 flex-1">
              <Textarea value={debugCode} onChange={e => setDebugCode(e.target.value)} placeholder="Paste your buggy code here..." className="bg-transparent border-none focus-visible:ring-0 text-white font-mono text-sm resize-none h-full min-h-[120px] p-0" />
            </div>
            <Button className="w-full bg-white/5 border border-white/10 hover:bg-red-500 hover:text-white transition-all text-white font-bold h-11 mb-3" onClick={handleDebugger} disabled={activeAnalysis === "debugger"}>
              {activeAnalysis === "debugger" ? <span className="animate-pulse">Analyzing with Gemini...</span> : "🐛 Debug Code"}
            </Button>
            {debugResult && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 max-h-[280px] overflow-y-auto rounded-xl border border-white/10 bg-black/30 p-3">
                <MarkdownMessage content={debugResult} />
              </motion.div>
            )}
          </motion.div>

          {/* ── AI Code Explainer ── */}
          <motion.div whileHover={{ y: -5 }}
            className="glass-card flex flex-col p-6 rounded-2xl border border-white/10 hover:border-emerald-500/40 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all bg-gradient-to-br from-white/5 to-black/40 group"
          >
            <div className="w-14 h-14 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <FileSearch className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">AI Code Explainer</h3>
            <div className="bg-black/50 border border-white/10 p-3 rounded-lg mb-4 flex-1">
              <Textarea value={explainCode} onChange={e => setExplainCode(e.target.value)} placeholder="Paste code to get a plain-English explanation..." className="bg-transparent border-none focus-visible:ring-0 text-white font-mono text-sm resize-none h-full min-h-[120px] p-0" />
            </div>
            <Button className="w-full bg-white/5 border border-white/10 hover:bg-emerald-500 hover:text-white transition-all text-white font-bold h-11" onClick={handleExplainer} disabled={activeAnalysis === "explainer"}>
              {activeAnalysis === "explainer" ? <span className="animate-pulse">Explaining...</span> : "📖 Explain Code"}
            </Button>
            {explainResult && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 max-h-[240px] overflow-y-auto rounded-xl border border-white/10 bg-black/30 p-3">
                <MarkdownMessage content={explainResult} />
              </motion.div>
            )}
          </motion.div>

          {/* ── Roadmap Generator ── */}
          <motion.div whileHover={{ y: -5 }}
            className="glass-card flex flex-col p-6 rounded-2xl border border-white/10 hover:border-purple-500/40 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all bg-gradient-to-br from-white/5 to-black/40 group lg:col-span-2"
          >
            <div className="w-14 h-14 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Navigation className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors">Learning Roadmap Generator</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Goal</label>
                <select className="w-full bg-black/50 border border-white/10 rounded-lg h-11 px-3 text-sm text-white focus:outline-none focus:border-purple-500" value={roadmapGoal} onChange={e => setRoadmapGoal(e.target.value)}>
                  {["Placement preparation","Competitive programming","Web development","AI Engineer","DSA Master","Mobile development","DevOps & Cloud"].map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Skill Level</label>
                <select className="w-full bg-black/50 border border-white/10 rounded-lg h-11 px-3 text-sm text-white focus:outline-none focus:border-purple-500" value={roadmapLevel} onChange={e => setRoadmapLevel(e.target.value)}>
                  {["Beginner","Intermediate","Advanced"].map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>
            <Button className="w-full bg-white/5 border border-white/10 hover:bg-purple-500 hover:text-white transition-all text-white font-bold h-11 mb-4" onClick={handleRoadmap} disabled={activeAnalysis === "roadmap"}>
              {activeAnalysis === "roadmap" ? <span className="animate-pulse">Generating Roadmap...</span> : "🗺️ Generate Roadmap"}
            </Button>
            {roadmapResult && (
              <ScrollArea className="h-[380px] w-full pr-2">
                <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                  <MarkdownMessage content={roadmapResult} />
                </div>
              </ScrollArea>
            )}
          </motion.div>

          {/* ── Resume Analyzer ── */}
          <motion.div whileHover={{ y: -5 }}
            className="glass-card flex flex-col p-6 rounded-2xl border border-white/10 hover:border-orange-500/40 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all bg-gradient-to-br from-white/5 to-black/40 group"
          >
            <div className="w-14 h-14 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <FileText className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">Resume Analyzer</h3>
            <p className="text-xs text-gray-400 mb-3">Upload or paste your resume to get AI feedback.</p>
            <div onClick={() => fileInputRef.current?.click()} className={`border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center mb-3 cursor-pointer hover:bg-black/40 transition-colors ${resumeFile ? "border-orange-500" : "border-white/10"}`}>
              <Input type="file" ref={fileInputRef} className="hidden" accept=".txt,.pdf,.doc,.docx" onChange={handleResumeFile} />
              <Upload className={`w-7 h-7 mb-2 ${resumeFile ? "text-orange-400" : "text-gray-500"}`} />
              <span className="text-xs font-semibold text-gray-300 text-center">{resumeFile ? resumeFile.name : "Click to upload (PDF/TXT/DOCX)"}</span>
            </div>
            <Textarea value={resumeText} onChange={e => setResumeText(e.target.value)} placeholder="Or paste your resume text here..." className="bg-black/50 border border-white/10 text-white font-mono text-xs resize-none min-h-[80px] mb-3 rounded-lg" />
            <Button className="w-full bg-white/5 border border-white/10 hover:bg-orange-500 hover:text-white transition-all text-white font-bold h-11" onClick={handleResume} disabled={activeAnalysis === "resume"}>
              {activeAnalysis === "resume" ? <span className="animate-pulse">Analyzing...</span> : "📄 Analyze Resume"}
            </Button>
            {resumeResult && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 max-h-[300px] overflow-y-auto rounded-xl border border-white/10 bg-black/30 p-3">
                <MarkdownMessage content={resumeResult} />
              </motion.div>
            )}
          </motion.div>

        </div>
      </div>

      {/* ── AI Mentor Chat Modal ── */}
      <AnimatePresence>
        {isMentorOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-2xl h-[600px] bg-[#0c0c0c] border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <Brain className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Coding Mentor</h3>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Groq · Llama 3.3 · Online</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsMentorOpen(false)} className="rounded-full hover:bg-white/10">
                  <X className="w-5 h-5 text-gray-400" />
                </Button>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-5">
                {mentorMessages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center p-10 opacity-50">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                      <HelpCircle className="w-8 h-8" />
                    </div>
                    <p className="text-sm font-medium">Hi! I'm your AI Coding Mentor powered by Google Gemini.<br />Ask me anything about programming, DSA, algorithms, or Web Dev!</p>
                  </div>
                )}
                {mentorMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} mb-4`}>
                    <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${msg.role === "user" ? "bg-blue-600 text-white rounded-br-none" : "bg-white/5 border border-white/10 text-gray-200 rounded-bl-none"}`}>
                      {msg.role === "user" ? (
                        <span className="text-sm leading-relaxed">{msg.content}</span>
                      ) : (
                        <MarkdownMessage content={msg.content} />
                      )}
                    </div>
                  </div>
                ))}
                {activeAnalysis === "mentor" && (
                  <div className="flex justify-start mb-4">
                    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-bl-none flex gap-2 items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" />
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce delay-100" />
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce delay-200" />
                      <span className="text-[10px] text-gray-500 ml-1">Gemini is thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={scrollRef} />
              </ScrollArea>

              {/* Input */}
              <div className="p-4 bg-white/5 border-t border-white/10">
                <div className="flex gap-2">
                  <Input
                    value={mentorInput}
                    onChange={e => setMentorInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleMentorSend()}
                    placeholder="Ask a coding question..."
                    className="flex-1 bg-black/50 border-white/10 text-white"
                    disabled={activeAnalysis === "mentor"}
                  />
                  <Button onClick={handleMentorSend} disabled={activeAnalysis === "mentor"} className="bg-blue-600 hover:bg-blue-700 h-10 w-10 p-0 rounded-xl">
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
