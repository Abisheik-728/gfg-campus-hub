import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Filter, PlayCircle, Tag, Code2, BookOpen, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { practiceProblems } from "@/data/learningData";

export default function PracticeCodingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [language, setLanguage] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [topic, setTopic] = useState("all");

  const languages = ["all", ...Array.from(new Set(practiceProblems.map(p => p.language)))];
  const difficulties = ["all", "Easy", "Medium", "Hard"];
  const topics = ["all", ...Array.from(new Set(practiceProblems.map(p => p.topic)))];

  const filteredProblems = practiceProblems.filter(p => {
    const matchesSearch = searchQuery === "" || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.topic.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesLang = language === "all" || p.language === language;
    const matchesDiff = difficulty === "all" || p.difficulty === difficulty;
    const matchesTopic = topic === "all" || p.topic === topic;
    
    return matchesSearch && matchesLang && matchesDiff && matchesTopic;
  });

  return (
    <div className="gfg-container py-12">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Code2 className="h-8 w-8 text-primary" /> Practice Dashboard
          </h1>
          <p className="text-muted-foreground">Apply what you've learned. Solve algorithmic challenges tailored to your learning path.</p>
        </div>
        
        {/* Progress Card */}
        <div className="gfg-card bg-card/50 backdrop-blur-md p-4 min-w-[300px] border-primary/20">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold flex items-center gap-2"><Clock className="h-4 w-4 text-gfg-amber"/> Learning Streak</h3>
            <span className="text-gfg-amber font-bold">12 Days 🔥</span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1 mt-4">
            <span>Python Learning Path</span>
            <span>80% Complete</span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
            <div className="bg-primary h-1.5 rounded-full w-4/5" />
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search problems, topics (e.g. 'Python loops')..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
        
        <select 
          value={language}
          onChange={e => setLanguage(e.target.value)}
          className="bg-muted border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary h-10"
        >
          {languages.map(l => (
            <option key={l} value={l}>{l === "all" ? "All Languages" : l}</option>
          ))}
        </select>

        <select 
          value={difficulty}
          onChange={e => setDifficulty(e.target.value)}
          className="bg-muted border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary h-10"
        >
          {difficulties.map(d => (
            <option key={d} value={d}>{d === "all" ? "All Difficulties" : d}</option>
          ))}
        </select>
      </div>

      {/* Topics Filter Bar */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase text-muted-foreground mr-2 shrink-0">
          <Filter className="h-3.5 w-3.5" /> Topics:
        </div>
        {topics.map(t => (
          <button 
            key={t}
            onClick={() => setTopic(t)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${
              topic === t ? "bg-primary text-white shadow-sm" : "bg-muted text-foreground hover:bg-muted/80"
            }`}
          >
            {t === "all" ? "All Topics" : t}
          </button>
        ))}
      </div>

      {/* Problem Grid */}
      {filteredProblems.length === 0 ? (
        <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed border-border">
          <BookOpen className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-1">No practice problems found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredProblems.map((prob, i) => (
            <motion.div
              key={prob.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="gfg-card gfg-card-hover group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold group-hover:text-primary transition-colors flex items-center gap-2">
                    {prob.title}
                  </h3>
                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                    prob.difficulty === "Easy" ? "bg-primary/20 text-primary" :
                    prob.difficulty === "Medium" ? "bg-gfg-amber/20 text-gfg-amber" :
                    "bg-destructive/20 text-destructive"
                  }`}>
                    {prob.difficulty}
                  </span>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {prob.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-5">
                  <span className="flex items-center gap-1 text-[11px] font-semibold uppercase px-2 py-1 rounded bg-muted text-muted-foreground">
                    <Code2 className="h-3.5 w-3.5" /> {prob.language}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-semibold uppercase px-2 py-1 rounded bg-muted text-muted-foreground">
                    <Tag className="h-3.5 w-3.5" /> {prob.topic}
                  </span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-border flex justify-between items-center">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground/60 invisible group-hover:visible transition-all">
                  <PlayCircle className="h-4 w-4" /> Ready to solve
                </div>
                {/* Note: In a real app, this would route to a dedicated practice editor similar to CodingEditorPage */}
                {/* For our prototype, we'll route to the existing editor or a new practice editor route */}
                <Link to={`/editor/${prob.id}?type=practice`} className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto font-semibold">
                    Solve Challenge
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
