import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Bug, FileSearch, Navigation, FileText, Zap, Code, Send, Upload, CheckCircle2, X, Brain, HelpCircle, Terminal, Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

const API_BASE = "http://localhost:5000/api";

export default function AIToolsPage() {
  const [activeAnalysis, setActiveAnalysis] = useState<string | null>(null);
  
  // ─── AI Coding Mentor Stats ────────────────────────
  const [isMentorOpen, setIsMentorOpen] = useState(false);
  const [mentorInput, setMentorInput] = useState("");
  const [mentorMessages, setMentorMessages] = useState<{role: string, content: string}[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // ─── AI Code Debugger Stats ────────────────────────
  const [debugCode, setDebugCode] = useState("");
  const [debugLang, setDebugLang] = useState("python");
  const [debugResult, setDebugResult] = useState<{errorExplanation: string, fixedCode: string, improvementSuggestions: string} | null>(null);

  // ─── AI Code Explainer Stats ───────────────────────
  const [explainCode, setExplainCode] = useState("");
  const [explainResult, setExplainResult] = useState<string | null>(null);

  // ─── Roadmap Generator Stats ───────────────────────
  const [roadmapGoal, setRoadmapGoal] = useState("placement");
  const [roadmapLevel, setRoadmapLevel] = useState("beginner");
  const [roadmapResult, setRoadmapResult] = useState<any>(null);

  // ─── Resume Analyzer Stats ─────────────────────────
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeResult, setResumeResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── Handlers ──────────────────────────────────────
  
  const handleMentorSend = async () => {
    if (!mentorInput.trim()) return;
    const userMsg = { role: "user", content: mentorInput };
    setMentorMessages(prev => [...prev, userMsg]);
    setMentorInput("");
    setActiveAnalysis("mentor");

    try {
      const res = await fetch(`${API_BASE}/mentor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...mentorMessages, userMsg] })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMentorMessages(prev => [...prev, { role: "assistant", content: data.response }]);
    } catch (err) {
      toast.error("Mentor is offline. Check if server is running.");
    } finally {
      setActiveAnalysis(null);
    }
  };

  const handleDebugger = async () => {
    if (!debugCode.trim()) return toast.error("Please paste some code");
    setActiveAnalysis("debugger");
    setDebugResult(null);
    try {
      const res = await fetch(`${API_BASE}/debug`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: debugCode, language: debugLang })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setDebugResult(data);
    } catch (err) {
      toast.error("Debugger failed.");
    } finally {
      setActiveAnalysis(null);
    }
  };

  const handleExplainer = async () => {
    if (!explainCode.trim()) return toast.error("Please paste some code");
    setActiveAnalysis("explainer");
    setExplainResult(null);
    try {
      const res = await fetch(`${API_BASE}/explain`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: explainCode })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setExplainResult(data.explanation);
    } catch (err) {
      toast.error("Explainer failed.");
    } finally {
      setActiveAnalysis(null);
    }
  };

  const handleRoadmap = async () => {
    setActiveAnalysis("roadmap");
    setRoadmapResult(null);
    try {
      const res = await fetch(`${API_BASE}/roadmap`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal: roadmapGoal, skillLevel: roadmapLevel })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setRoadmapResult(data);
    } catch (err) {
      toast.error("Roadmap generation failed.");
    } finally {
      setActiveAnalysis(null);
    }
  };

  const handleResume = async () => {
    if (!resumeFile) return toast.error("Please upload a file");
    setActiveAnalysis("resume");
    setResumeResult(null);
    const formData = new FormData();
    formData.append("resume", resumeFile);
    try {
      const res = await fetch(`${API_BASE}/resume-analyze`, {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResumeResult(data);
    } catch (err) {
      toast.error("Resume analysis failed.");
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
            <Zap className="h-4 w-4" /> Next-Generation
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            AI Developer <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-accent">Tools</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Smart tools powered by AI to accelerate your coding journey.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* AI Coding Mentor */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="glass-card flex flex-col p-6 rounded-2xl border border-white/10 hover:border-accent/40 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all bg-gradient-to-br from-white/5 to-black/40 group"
          >
            <div className="w-14 h-14 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-xl shadow-lg shadow-blue-500/10 mb-5 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">AI Coding Mentor</h3>
            <p className="text-sm text-gray-400 mb-6 flex-1">Chat 1-on-1 with an AI mentor for Python, Java, Web Dev and more.</p>
            <Button className="w-full bg-white/5 border border-white/10 hover:bg-blue-500 hover:text-white transition-all text-white font-bold h-11" onClick={() => setIsMentorOpen(true)}>
              Open Tool
            </Button>
          </motion.div>

          {/* AI Code Debugger */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="glass-card flex flex-col p-6 rounded-2xl border border-white/10 hover:border-red-500/40 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all bg-gradient-to-br from-white/5 to-black/40 group md:col-span-2 lg:col-span-1"
          >
            <div className="w-14 h-14 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center text-xl shadow-lg shadow-red-500/10 mb-5 group-hover:scale-110 transition-transform">
              <Bug className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">AI Code Debugger</h3>
            <div className="flex items-center gap-4 mb-4">
               <select 
                className="bg-black/50 border border-white/10 rounded-md px-2 py-1 text-xs text-white outline-none focus:border-red-500"
                value={debugLang}
                onChange={(e) => setDebugLang(e.target.value)}
              >
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
            </div>
            <div className="bg-black/50 border border-white/10 p-3 rounded-lg mb-4 flex-1">
              <Textarea 
                value={debugCode}
                onChange={(e) => setDebugCode(e.target.value)}
                placeholder="Paste code here..." 
                className="bg-transparent border-none focus-visible:ring-0 text-white font-mono text-sm resize-none h-full min-h-[100px] p-0" 
              />
            </div>
            <Button 
              className="w-full bg-white/5 border border-white/10 hover:bg-red-500 hover:text-white transition-all text-white font-bold h-11 mb-3" 
              onClick={handleDebugger}
              disabled={activeAnalysis === "debugger"}
            >
              {activeAnalysis === 'debugger' ? <span className="animate-pulse">Analyzing...</span> : 'Debug Code'}
            </Button>
            
            {debugResult && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-3 pt-3 border-t border-white/10">
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <h4 className="text-xs font-bold text-red-400 mb-1 uppercase tracking-wider">Error Explanation</h4>
                  <p className="text-xs text-gray-300 leading-relaxed">{debugResult.errorExplanation}</p>
                </div>
                <div className="p-3 bg-black/50 border border-white/10 rounded-lg">
                  <h4 className="text-xs font-bold text-emerald-400 mb-1 uppercase tracking-wider">Fixed Code</h4>
                  <pre className="text-[10px] text-gray-300 font-mono overflow-x-auto"><code>{debugResult.fixedCode}</code></pre>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* AI Code Explainer */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="glass-card flex flex-col p-6 rounded-2xl border border-white/10 hover:border-emerald-500/40 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all bg-gradient-to-br from-white/5 to-black/40 group"
          >
            <div className="w-14 h-14 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl shadow-lg shadow-emerald-500/10 mb-5 group-hover:scale-110 transition-transform">
              <FileSearch className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">AI Code Explainer</h3>
            <div className="bg-black/50 border border-white/10 p-3 rounded-lg mb-4 flex-1">
              <Textarea 
                value={explainCode}
                onChange={(e) => setExplainCode(e.target.value)}
                placeholder="Paste code for explanation..." 
                className="bg-transparent border-none focus-visible:ring-0 text-white font-mono text-sm resize-none h-full min-h-[100px] p-0" 
              />
            </div>
            <Button 
              className="w-full bg-white/5 border border-white/10 hover:bg-emerald-500 hover:text-white transition-all text-white font-bold h-11" 
              onClick={handleExplainer}
              disabled={activeAnalysis === "explainer"}
            >
              {activeAnalysis === 'explainer' ? <span className="animate-pulse">Generating...</span> : 'Explain Code'}
            </Button>
            
            {explainResult && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-4 bg-muted/20 border border-white/10 rounded-xl max-h-[200px] overflow-y-auto">
                <p className="text-xs text-gray-300 whitespace-pre-wrap leading-relaxed">{explainResult}</p>
              </motion.div>
            )}
          </motion.div>

          {/* Learning Roadmap Generator */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="glass-card flex flex-col p-6 rounded-2xl border border-white/10 hover:border-purple-500/40 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all bg-gradient-to-br from-white/5 to-black/40 group lg:col-span-2"
          >
            <div className="w-14 h-14 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-xl shadow-lg shadow-purple-500/10 mb-5 group-hover:scale-110 transition-transform">
              <Navigation className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">Learning Roadmap Generator</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Goal</label>
                <select 
                  className="w-full bg-black/50 border border-white/10 rounded-lg h-11 px-3 text-sm text-white focus:outline-none focus:border-purple-500"
                  value={roadmapGoal}
                  onChange={(e) => setRoadmapGoal(e.target.value)}
                >
                  <option value="Placement preparation">Placement preparation</option>
                  <option value="Competitive programming">Competitive programming</option>
                  <option value="Web development">Web development</option>
                  <option value="AI Engineer">AI Engineer</option>
                  <option value="DSA Master">DSA Master</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Skill Level</label>
                <select 
                  className="w-full bg-black/50 border border-white/10 rounded-lg h-11 px-3 text-sm text-white focus:outline-none focus:border-purple-500"
                  value={roadmapLevel}
                  onChange={(e) => setRoadmapLevel(e.target.value)}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <Button 
              className="w-full bg-white/5 border border-white/10 hover:bg-purple-500 hover:text-white transition-all text-white font-bold h-11 mb-4" 
              onClick={handleRoadmap}
              disabled={activeAnalysis === "roadmap"}
            >
              {activeAnalysis === 'roadmap' ? <span className="animate-pulse">Generating...</span> : 'Generate Roadmap'}
            </Button>

            {roadmapResult && (
              <ScrollArea className="h-[300px] w-full pr-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                  {Object.entries(roadmapResult).map(([key, val]: any) => (
                    <div key={key} className="p-4 bg-muted/20 border border-white/10 rounded-xl">
                      <h4 className="text-sm font-bold text-purple-400 mb-2 capitalize">{key.replace(/([A-Z])/g, ' $1')}</h4>
                      <pre className="text-xs text-gray-400 whitespace-pre-wrap">{typeof val === 'string' ? val : JSON.stringify(val, null, 2)}</pre>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </motion.div>

          {/* Resume Analyzer */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="glass-card flex flex-col p-6 rounded-2xl border border-white/10 hover:border-orange-500/40 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all bg-gradient-to-br from-white/5 to-black/40 group"
          >
            <div className="w-14 h-14 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center text-xl shadow-lg shadow-orange-500/10 mb-5 group-hover:scale-110 transition-transform">
              <FileText className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">Resume Analyzer</h3>
            <p className="text-xs text-gray-400 mb-4">Improve your chances for tech jobs.</p>
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center mb-6 bg-black/20 hover:bg-black/40 transition-colors cursor-pointer flex-1 ${resumeFile ? "border-orange-500" : "border-white/10"}`}
            >
              <Input type="file" ref={fileInputRef} className="hidden" onChange={(e) => setResumeFile(e.target.files?.[0] || null)} />
              <Upload className={`w-8 h-8 mb-2 ${resumeFile ? "text-orange-400" : "text-gray-500"}`} />
              <span className="text-xs font-semibold text-gray-300">{resumeFile ? resumeFile.name : "Click to upload Resume (PDF/DOCX)"}</span>
            </div>

            <Button 
              className="w-full bg-white/5 border border-white/10 hover:bg-orange-500 hover:text-white transition-all text-white font-bold h-11" 
              onClick={handleResume}
              disabled={activeAnalysis === "resume"}
            >
              {activeAnalysis === 'resume' ? <span className="animate-pulse">Analyzing...</span> : 'Analyze Resume'}
            </Button>

            {resumeResult && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-4 bg-muted/20 border border-white/10 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-orange-400 uppercase">Resume Score</span>
                  <span className="text-lg font-black text-white">{resumeResult.score}/100</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 transition-all duration-1000" style={{ width: `${resumeResult.score}%` }} />
                </div>
                <div className="text-[10px] text-gray-400 line-clamp-3">
                  <span className="text-orange-400 font-bold">Skills: </span>{resumeResult.skills}
                </div>
              </motion.div>
            )}
          </motion.div>

        </div>
      </div>

      {/* ─── AI Mentor Chat Modal ────────────────────── */}
      <AnimatePresence>
        {isMentorOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-2xl h-[600px] bg-[#0c0c0c] border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <Brain className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">Coding Mentor</h3>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">AI Expert Online</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsMentorOpen(false)} className="rounded-full hover:bg-white/10">
                  <X className="w-5 h-5 text-gray-400" />
                </Button>
              </div>

              <ScrollArea className="flex-1 p-5 space-y-4">
                {mentorMessages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center p-10 opacity-40">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                      <HelpCircle className="w-8 h-8" />
                    </div>
                    <p className="text-sm font-medium">Hello! I'm your AI Coding Mentor. <br/> Ask me anything about programming, DSA, or Web Dev!</p>
                  </div>
                )}
                {mentorMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
                    <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${
                      msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-white/5 border border-white/10 text-gray-200 rounded-bl-none'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {activeAnalysis === "mentor" && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-bl-none flex gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce" />
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce delay-100" />
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-500 animate-bounce delay-200" />
                    </div>
                  </div>
                )}
                <div ref={scrollRef} />
              </ScrollArea>

              <div className="p-4 bg-white/5 border-t border-white/10">
                <div className="flex gap-2">
                  <Input 
                    value={mentorInput}
                    onChange={(e) => setMentorInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleMentorSend()}
                    placeholder="Type your coding question..." 
                    className="flex-1 bg-black/50 border-white/10 text-white"
                  />
                  <Button onClick={handleMentorSend} className="bg-blue-600 hover:bg-blue-700 h-10 w-10 p-0 rounded-xl">
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
