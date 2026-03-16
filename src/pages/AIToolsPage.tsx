import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Bug, FileSearch, Navigation, FileText, Zap, Code, Send, Upload, CheckCircle2, X, Brain, HelpCircle, Terminal, Sparkles, ChevronRight } from "lucide-react";
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

// ─── Markdown Renderer for AI Chat Responses ─────────────────────────────────
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
                <div className="flex items-center justify-between px-4 py-1.5 bg-[#1a1a2e] border-b border-white/10">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{match[1]}</span>
                </div>
                <SyntaxHighlighter
                  style={oneDarkStyle}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{
                    margin: 0,
                    borderRadius: 0,
                    background: "#0d0d1a",
                    fontSize: "0.78rem",
                    lineHeight: "1.6",
                    padding: "1rem",
                    overflowX: "auto",
                  }}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              </div>
            );
          }
          return (
            <code className="bg-white/10 text-emerald-300 font-mono text-[0.8em] px-1.5 py-0.5 rounded">
              {children}
            </code>
          );
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
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-blue-500 pl-3 my-2 text-gray-400 italic text-sm">{children}</blockquote>
        ),
        a: ({ href, children }) => (
          <a href={href} target="_blank" rel="noreferrer" className="text-blue-400 underline hover:text-blue-300 text-sm">{children}</a>
        ),
        hr: () => <hr className="border-white/10 my-3" />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000") + "/api";

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
      const res = await fetch(`${API_BASE}/ai-mentor`, {
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
      const res = await fetch(`${API_BASE}/debug-code`, {
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
      const res = await fetch(`${API_BASE}/explain-code`, {
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
      const res = await fetch(`${API_BASE}/generate-roadmap`, {
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
      const res = await fetch(`${API_BASE}/analyze-resume`, {
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
              <ScrollArea className="h-[380px] w-full pr-2">
                <div className="space-y-4 pb-4">

                  {/* Learning Stages */}
                  {Array.isArray(roadmapResult.LearningStages) && roadmapResult.LearningStages.length > 0 && (
                    <div>
                      <h4 className="text-xs font-black text-purple-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" /> Learning Stages
                      </h4>
                      <div className="space-y-2">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {roadmapResult.LearningStages.map((stage: any, i: number) => (
                          <div key={i} className="p-3.5 bg-purple-500/5 border border-purple-500/20 rounded-xl">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 text-[10px] font-black flex items-center justify-center shrink-0">{i + 1}</span>
                              <span className="font-bold text-sm text-white">{stage.title || stage.stage || stage.name || `Stage ${i + 1}`}</span>
                              {stage.duration && (
                                <span className="ml-auto text-[10px] text-purple-400 font-semibold bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20 shrink-0">{stage.duration}</span>
                              )}
                            </div>
                            {stage.description && <p className="text-xs text-gray-400 mb-1.5 ml-8">{stage.description}</p>}
                            {Array.isArray(stage.objectives) && (
                              <ul className="ml-8 space-y-0.5">
                                {stage.objectives.map((obj: string, j: number) => (
                                  <li key={j} className="text-xs text-gray-300 flex items-start gap-1.5"><span className="text-purple-400 mt-0.5 shrink-0">•</span>{obj}</li>
                                ))}
                              </ul>
                            )}
                            {Array.isArray(stage.topics) && (
                              <ul className="ml-8 space-y-0.5">
                                {stage.topics.map((t: string, j: number) => (
                                  <li key={j} className="text-xs text-gray-300 flex items-start gap-1.5"><span className="text-purple-400 mt-0.5 shrink-0">•</span>{t}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Topics To Study */}
                  {roadmapResult.TopicsToStudy && (
                    <div className="p-3.5 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                      <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Topics To Study
                      </h4>
                      <ul className="space-y-1">
                        {(Array.isArray(roadmapResult.TopicsToStudy)
                          ? roadmapResult.TopicsToStudy
                          : Object.entries(roadmapResult.TopicsToStudy).map(([k, v]) => `${k}: ${Array.isArray(v) ? (v as string[]).join(', ') : v}`)
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        ).map((item: any, i: number) => (
                          <li key={i} className="text-xs text-gray-300 flex items-start gap-1.5 list-none">
                            <span className="text-blue-400 mt-0.5 shrink-0">•</span>
                            {typeof item === 'object' ? JSON.stringify(item) : String(item)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Suggested Projects */}
                  {roadmapResult.SuggestedProjects && (
                    <div className="p-3.5 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                      <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Suggested Projects
                      </h4>
                      <ul className="space-y-1">
                        {(Array.isArray(roadmapResult.SuggestedProjects)
                          ? roadmapResult.SuggestedProjects
                          : Object.values(roadmapResult.SuggestedProjects)
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        ).map((item: any, i: number) => (
                          <li key={i} className="text-xs text-gray-300 flex items-start gap-1.5 list-none">
                            <span className="text-emerald-400 mt-0.5 shrink-0">•</span>
                            {typeof item === 'object' ? (item.name || item.title || JSON.stringify(item)) : String(item)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Recommended Tools */}
                  {roadmapResult.RecommendedTools && (
                    <div className="p-3.5 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                      <h4 className="text-xs font-black text-amber-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Recommended Tools
                      </h4>
                      <ul className="space-y-1">
                        {(Array.isArray(roadmapResult.RecommendedTools)
                          ? roadmapResult.RecommendedTools
                          : Object.entries(roadmapResult.RecommendedTools).map(([k, v]) => `${k}: ${Array.isArray(v) ? (v as string[]).join(', ') : v}`)
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        ).map((item: any, i: number) => (
                          <li key={i} className="text-xs text-gray-300 flex items-start gap-1.5 list-none">
                            <span className="text-amber-400 mt-0.5 shrink-0">•</span>
                            {typeof item === 'object' ? JSON.stringify(item) : String(item)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Fallback for any unexpected extra keys */}
                  {Object.keys(roadmapResult)
                    .filter(k => !['LearningStages', 'TopicsToStudy', 'SuggestedProjects', 'RecommendedTools'].includes(k))
                    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                    .map((key: string) => (
                      <div key={key} className="p-3.5 bg-white/5 border border-white/10 rounded-xl">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                        <pre className="text-xs text-gray-400 whitespace-pre-wrap break-words">
                          {typeof roadmapResult[key] === 'string' ? roadmapResult[key] : JSON.stringify(roadmapResult[key], null, 2)}
                        </pre>
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
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-4 space-y-3"
              >
                {/* Score */}
                <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-orange-400 uppercase tracking-widest">Resume Score</span>
                    <span className={`text-xl font-black ${
                      resumeResult.score >= 75 ? 'text-emerald-400' :
                      resumeResult.score >= 50 ? 'text-amber-400' : 'text-red-400'
                    }`}>{resumeResult.score}<span className="text-xs text-gray-500 font-medium">/100</span></span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        resumeResult.score >= 75 ? 'bg-emerald-500' :
                        resumeResult.score >= 50 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${resumeResult.score}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1.5 text-right">
                    {resumeResult.score >= 75 ? '🟢 Strong resume' : resumeResult.score >= 50 ? '🟡 Needs improvement' : '🔴 Significant gaps'}
                  </p>
                </div>

                {/* Skills */}
                {resumeResult.skills && (
                  <div className="p-3.5 bg-orange-500/5 border border-orange-500/15 rounded-xl">
                    <h4 className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 inline-block" /> Detected Skills
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {(Array.isArray(resumeResult.skills)
                        ? resumeResult.skills
                        : String(resumeResult.skills).split(/[,;|•\n]+/)
                      ).map((s: string, i: number) => s.trim() && (
                        <span key={i} className="px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/25 text-orange-300 text-[10px] font-semibold">
                          {s.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Strengths */}
                {resumeResult.strengths && (
                  <div className="p-3.5 bg-emerald-500/5 border border-emerald-500/15 rounded-xl">
                    <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" /> Strengths
                    </h4>
                    <ul className="space-y-1">
                      {(Array.isArray(resumeResult.strengths)
                        ? resumeResult.strengths
                        : String(resumeResult.strengths).split(/[•\n]+/)
                      ).map((item: string, i: number) => item.trim() && (
                        <li key={i} className="text-xs text-gray-300 flex items-start gap-1.5">
                          <span className="text-emerald-400 shrink-0 mt-0.5">•</span>{item.trim()}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Weaknesses */}
                {resumeResult.weaknesses && (
                  <div className="p-3.5 bg-red-500/5 border border-red-500/15 rounded-xl">
                    <h4 className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" /> Weaknesses
                    </h4>
                    <ul className="space-y-1">
                      {(Array.isArray(resumeResult.weaknesses)
                        ? resumeResult.weaknesses
                        : String(resumeResult.weaknesses).split(/[•\n]+/)
                      ).map((item: string, i: number) => item.trim() && (
                        <li key={i} className="text-xs text-gray-300 flex items-start gap-1.5">
                          <span className="text-red-400 shrink-0 mt-0.5">•</span>{item.trim()}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Suggestions */}
                {resumeResult.suggestions && (
                  <div className="p-3.5 bg-blue-500/5 border border-blue-500/15 rounded-xl">
                    <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" /> Suggestions
                    </h4>
                    <ul className="space-y-1">
                      {(Array.isArray(resumeResult.suggestions)
                        ? resumeResult.suggestions
                        : String(resumeResult.suggestions).split(/[•\n]+/)
                      ).map((item: string, i: number) => item.trim() && (
                        <li key={i} className="text-xs text-gray-300 flex items-start gap-1.5">
                          <span className="text-blue-400 shrink-0 mt-0.5">→</span>{item.trim()}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
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
                      {msg.role === 'user' ? (
                        <span className="text-sm leading-relaxed">{msg.content}</span>
                      ) : (
                        <MarkdownMessage content={msg.content} />
                      )}
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
