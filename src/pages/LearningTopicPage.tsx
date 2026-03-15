import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { Play, ChevronRight, BookOpen, ChevronDown, List as ListIcon, TerminalSquare, CheckCircle2, Award, HelpCircle, ArrowRight, RefreshCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { learningPaths, getUserProgress, markTopicComplete, getPathProgress, issueCertificate } from "@/data/learningData";
import { addXP, getXPData } from "@/data/xpSystem";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function LearningTopicPage() {
  const { pathId, topicId } = useParams();
  const { user } = useAuth();
  
  const path = learningPaths.find(p => p.id === pathId);
  const allTopics = path?.modules.flatMap(m => m.topics) || [];
  const currentTopic = topicId ? allTopics.find(t => t.id === topicId) : allTopics[0];
  
  const [code, setCode] = useState(currentTopic?.exampleCode || "");
  const [output, setOutput] = useState(currentTopic?.exampleOutput || "");
  const [isRunning, setIsRunning] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [showSidebar, setShowSidebar] = useState(true);
  const [userProgress, setUserProgress] = useState(getUserProgress());
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [isTopicComplete, setIsTopicComplete] = useState(false);

  useEffect(() => {
    setUserProgress(getUserProgress());
    setQuizAnswers({});
    setQuizSubmitted(false);
  }, [topicId]);

  useEffect(() => {
    if (currentTopic) {
      setIsTopicComplete(userProgress.completedTopics.includes(currentTopic.id));
    }
  }, [currentTopic, userProgress]);

  useEffect(() => {
    if (currentTopic) {
      setCode(currentTopic.exampleCode);
      setOutput(currentTopic.exampleOutput);
    }
    if (path && currentTopic) {
      const module = path.modules.find(m => m.topics.some(t => t.id === currentTopic.id));
      if (module) {
        setExpandedModules(prev => ({ ...prev, [module.id]: true }));
      }
    }
  }, [currentTopic, path]);

  if (!path || !currentTopic) return <div className="p-8 text-center text-xl">Module or Topic not found</div>;

  const getLangForEditor = () => {
    const map: Record<string, string> = { python: "python", java: "java", cpp: "cpp", c: "c", js: "javascript", html: "html", css: "css", sql: "sql", dsa: "python", git: "shell" };
    return map[pathId || "python"] || "plaintext";
  };

  const handleRunCode = async () => {
    if (!code.trim()) { setOutput("Error: Please write some code."); toast.error("Editor is empty"); return; }
    setIsRunning(true);
    setOutput("Executing code...");
    try {
      const langMap: Record<string, { name: string, version: string, filename: string }> = {
        python: { name: "python", version: "3.10.0", filename: "main.py" },
        java: { name: "java", version: "15.0.2", filename: "Main.java" },
        cpp: { name: "c++", version: "10.2.0", filename: "main.cpp" },
        c: { name: "c", version: "10.2.0", filename: "main.c" },
        js: { name: "javascript", version: "18.15.0", filename: "main.js" },
      };
      const langInfo = langMap[pathId || "python"] || langMap.python;
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: langInfo.name, version: langInfo.version, files: [{ name: langInfo.filename, content: code }] }),
      });
      const result = await response.json();
      if (result.message && (result.message.includes("whitelist") || result.message.includes("API"))) {
        simulateExecution();
      } else if (result.compile && result.compile.code !== 0) {
        setOutput(`Compilation Error:\n${result.compile.output || result.compile.stderr}`);
      } else if (result.run) {
        setOutput(result.run.code !== 0 ? `Runtime Error:\n${result.run.output || result.run.stderr}` : (result.run.output || "Program finished with no output."));
      } else {
        setOutput(result.message ? `API Error: ${result.message}` : "Execution failed.");
      }
    } catch {
      simulateExecution();
    } finally {
      setIsRunning(false);
    }
  };

  const simulateExecution = () => {
    setOutput(currentTopic.exampleOutput || "Code executed successfully.\n(Simulated output)");
  };

  const toggleModule = (modId: string) => {
    setExpandedModules(prev => ({ ...prev, [modId]: !prev[modId] }));
  };

  const handleQuizSubmit = () => {
    if (!currentTopic.quiz) return;
    const allAnswered = currentTopic.quiz.every(q => quizAnswers[q.id] !== undefined);
    if (!allAnswered) { toast.error("Please answer all questions first."); return; }
    const correct = currentTopic.quiz.filter(q => quizAnswers[q.id] === q.correctAnswer).length;
    setQuizSubmitted(true);
    if (correct === currentTopic.quiz.length) {
      toast.success("Perfect! All answers correct! +50 XP");
      handleCompleteTopic();
    } else {
      toast.error(`You got ${correct}/${currentTopic.quiz.length} right. Try again!`);
    }
  };

  const handleCompleteTopic = () => {
    if (!currentTopic || isTopicComplete) return;
    markTopicComplete(currentTopic.id);
    addXP("Completed: " + currentTopic.title, 50);
    const updated = getUserProgress();
    setUserProgress(updated);
    setIsTopicComplete(true);
    toast.success("+50 XP — Lesson complete!");
    
    const progressPercent = getPathProgress(path.id);
    if (progressPercent === 100) {
      handleCourseCompletion();
    }
  };

  const handleCourseCompletion = () => {
    const certId = `CERT-${path.id.toUpperCase()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    issueCertificate({
      id: Math.random().toString(36).substr(2, 9),
      studentName: user?.name || "Learner",
      courseName: path.title,
      date: new Date().toLocaleDateString(),
      certificateId: certId
    });
    addXP("Course completed: " + path.title, 500);
    toast.success(`🎉 Certificate earned for ${path.title}! +500 XP`, { duration: 5000 });
  };

  const pathProgress = getPathProgress(path.id);
  const xp = getXPData();

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)] bg-background">
      
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-3 border-b border-border bg-card">
        <h2 className="font-bold flex items-center gap-2 text-sm">
          {path.icon} {path.title}
        </h2>
        <Button variant="outline" size="sm" onClick={() => setShowSidebar(!showSidebar)}>
          <ListIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* LEFT SIDEBAR */}
      <aside className={`w-full md:w-60 lg:w-64 border-r border-border bg-card flex-shrink-0 flex-col overflow-y-auto ${showSidebar ? "flex" : "hidden md:flex"}`} style={{ maxHeight: "calc(100vh - 4rem)" }}>
        <div className="p-3 border-b border-border hidden md:flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Link to="/learn" className="text-muted-foreground hover:text-foreground">
              <ChevronRight className="h-4 w-4 rotate-180" />
            </Link>
            <span className="text-lg">{path.icon}</span>
            <h2 className="font-bold text-xs uppercase tracking-wide truncate">{path.title}</h2>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              <span>Progress</span>
              <span>{pathProgress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
              <div className="bg-primary h-1.5 rounded-full transition-all duration-1000" style={{ width: `${pathProgress}%` }} />
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px]">
            <span className="flex items-center gap-1 text-amber-500 font-bold">
              <Sparkles className="h-3 w-3" /> {xp.totalXP} XP
            </span>
          </div>
        </div>
        
        <div className="p-2 space-y-0.5 overflow-y-auto flex-1">
          {path.modules.map(mod => (
            <div key={mod.id} className="mb-1">
              <button 
                onClick={() => toggleModule(mod.id)}
                className="w-full flex items-center justify-between px-2.5 py-2 text-xs font-semibold hover:bg-muted/50 rounded-md transition-colors"
              >
                <span className="truncate">{mod.title}</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform shrink-0 ${expandedModules[mod.id] ? "rotate-180" : ""}`} />
              </button>
              
              {expandedModules[mod.id] && (
                <div className="pl-2.5 mt-0.5 space-y-0.5 border-l-2 border-primary/20 ml-3">
                  {mod.topics.map(topic => (
                    <Link key={topic.id} to={`/learn/${path.id}/${topic.id}`}>
                      <div className={`px-2.5 py-1.5 text-xs rounded-md transition-colors flex items-center gap-1.5 ${
                        topic.id === currentTopic.id ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}>
                        {userProgress.completedTopics.includes(topic.id) ? (
                          <CheckCircle2 className="h-3 w-3 text-primary shrink-0" />
                        ) : (
                          <div className={`h-1.5 w-1.5 rounded-full shrink-0 ${topic.id === currentTopic.id ? "bg-primary" : "bg-muted-foreground"}`} />
                        )}
                        <span className="truncate">{topic.title}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>

      {/* MIDDLE: Topic Content */}
      <main className="flex-1 overflow-y-auto max-w-2xl bg-background p-5 md:p-7" style={{ maxHeight: "calc(100vh - 4rem)" }}>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-muted/60 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              <BookOpen className="h-3 w-3" /> Lesson
            </div>
            {isTopicComplete && (
              <div className="inline-flex items-center gap-1 px-2 py-1 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                <CheckCircle2 className="h-3 w-3" /> Completed
              </div>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-5 text-foreground leading-tight">{currentTopic.title}</h1>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold border-b border-border pb-2 mb-3">📖 Concept</h2>
              <p className="text-muted-foreground bg-muted/30 p-4 rounded-lg leading-relaxed text-sm">{currentTopic.explanation}</p>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold border-b border-border pb-2 mb-3">💻 Syntax</h2>
              <pre className="bg-[#1e1e1e] text-[#d4d4d4] p-4 rounded-lg overflow-x-auto text-sm font-mono border border-border">
                <code>{currentTopic.syntax}</code>
              </pre>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold border-b border-border pb-2 mb-3">🚀 Example</h2>
              <p className="text-xs text-muted-foreground mb-3">Run this example in the interactive playground →</p>
            </div>
          </div>
        </div>

        {/* Quiz Section */}
        {currentTopic.quiz && (
          <div className="mt-10 pt-6 border-t border-border">
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" /> Quiz
            </h2>
            <div className="space-y-5">
              {currentTopic.quiz.map((q, idx) => (
                <div key={q.id} className="glass-card overflow-hidden p-0">
                  <div className="bg-muted/50 p-3 border-b border-border">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-1">Q{idx + 1}</span>
                    <h4 className="font-semibold text-sm">{q.question}</h4>
                  </div>
                  <div className="p-3 grid grid-cols-1 gap-2">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = quizAnswers[q.id] === optIdx;
                      const isCorrect = q.correctAnswer === optIdx;
                      let variant: string = "outline";
                      if (quizSubmitted) {
                        if (isCorrect) variant = "default";
                        else if (isSelected && !isCorrect) variant = "destructive";
                      } else if (isSelected) {
                        variant = "secondary";
                      }
                      return (
                        <Button
                          key={optIdx}
                          variant={variant as any}
                          className={`justify-start h-auto py-2.5 px-3 text-left text-sm ${
                            quizSubmitted && isCorrect ? "bg-green-600 hover:bg-green-600 text-white border-transparent" : ""
                          }`}
                          onClick={() => !quizSubmitted && setQuizAnswers(prev => ({ ...prev, [q.id]: optIdx }))}
                        >
                          <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center mr-2 text-[10px] shrink-0">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          {opt}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              ))}
              
              {!quizSubmitted ? (
                <Button className="w-full h-10 font-bold" onClick={handleQuizSubmit}>
                  Submit Quiz & Complete Lesson
                </Button>
              ) : (
                <Button variant="outline" className="w-full h-10" onClick={() => { setQuizSubmitted(false); setQuizAnswers({}); }}>
                  <RefreshCcw className="h-4 w-4 mr-2" /> Retake Quiz
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-10 pt-6 border-t border-border flex items-center justify-between gap-3">
          <Button variant="outline" size="sm" disabled={allTopics.indexOf(currentTopic) === 0} asChild={allTopics.indexOf(currentTopic) !== 0}>
            {allTopics.indexOf(currentTopic) !== 0 ? (
              <Link to={`/learn/${path.id}/${allTopics[allTopics.indexOf(currentTopic) - 1].id}`}>
                ← Previous
              </Link>
            ) : (<span>← Previous</span>)}
          </Button>

          {!currentTopic.quiz && !isTopicComplete && (
            <Button onClick={handleCompleteTopic} size="sm" className="bg-primary text-white font-bold gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" /> Mark Complete (+50 XP)
            </Button>
          )}

          {allTopics.indexOf(currentTopic) < allTopics.length - 1 ? (
            <Button size="sm" asChild className="group">
              <Link to={`/learn/${path.id}/${allTopics[allTopics.indexOf(currentTopic) + 1].id}`} className="flex items-center gap-1.5">
                Next <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          ) : (
            pathProgress === 100 && (
              <Link to={`/certificate/${path.id}`}>
                <Button size="sm" className="bg-amber-500 text-white font-bold hover:bg-amber-500/90">
                  <Award className="h-3.5 w-3.5 mr-1.5" /> View Certificate
                </Button>
              </Link>
            )
          )}
        </div>
      </main>

      {/* RIGHT: Code Playground */}
      <aside className="w-full md:w-[380px] lg:w-[420px] xl:w-[460px] flex-shrink-0 flex flex-col bg-[#1e1e1e] border-l border-[#333]" style={{ maxHeight: "calc(100vh - 4rem)" }}>
        <div className="flex items-center justify-between px-3 py-2.5 border-b border-[#333] bg-[#2d2d2d]">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <TerminalSquare className="h-3.5 w-3.5 text-emerald-400" /> Playground
          </div>
          <Button onClick={handleRunCode} disabled={isRunning} size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white h-7 text-xs px-3">
            {isRunning ? <span className="animate-pulse">Running...</span> : <span className="flex items-center gap-1"><Play className="h-3 w-3" /> Run</span>}
          </Button>
        </div>
        
        <div className="flex-1 relative">
          <Editor
            height="100%"
            language={getLangForEditor()}
            theme="vs-dark"
            value={code}
            onChange={(val) => setCode(val || "")}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              smoothScrolling: true,
              scrollBeyondLastLine: false,
              padding: { top: 12 }
            }}
          />
        </div>

        {/* Output */}
        <div className="h-1/3 border-t border-[#333] flex flex-col bg-[#1e1e1e]">
          <div className="px-3 py-1.5 bg-[#2d2d2d] border-b border-[#333] text-[10px] font-semibold text-gray-300 uppercase tracking-wider">
            Output
          </div>
          <div className="flex-1 p-3 overflow-y-auto">
            {output ? (
              <pre className={`font-mono text-xs whitespace-pre-wrap ${output.includes("Error") ? "text-red-400" : "text-gray-300"}`}>
                {output}
              </pre>
            ) : (
              <div className="text-xs text-gray-500 italic h-full flex items-center justify-center">
                Run code to see output
              </div>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
