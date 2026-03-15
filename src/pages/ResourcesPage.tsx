import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { resources } from "@/data/mockData";

const categories = [
  { key: "all", label: "All" },
  { key: "dsa", label: "DSA" },
  { key: "webdev", label: "Web Dev" },
  { key: "python", label: "Python" },
  { key: "aiml", label: "AI / ML" },
  { key: "database", label: "Database" },
  { key: "devops", label: "DevOps & Cloud" },
  { key: "sysdesign", label: "System Design" },
  { key: "cp", label: "Competitive Programming" },
];

const diffColors: Record<string, string> = {
  beginner: "bg-primary/10 text-primary",
  intermediate: "bg-gfg-amber/10 text-gfg-amber",
  advanced: "bg-destructive/10 text-destructive",
};

export default function ResourcesPage() {
  const [cat, setCat] = useState("all");
  const filtered = cat === "all" ? resources : resources.filter(r => r.category === cat);

  return (
    <div className="gfg-container py-12 page-fade-in">
      <h1 className="text-3xl font-bold mb-2">Learning Resources</h1>
      <p className="text-muted-foreground mb-6">Curated resources to level up your coding skills.</p>

      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map(c => (
          <button key={c.key} onClick={() => setCat(c.key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${cat === c.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}>
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((res, i) => (
          <motion.div key={res.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="gfg-card-hover">
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${diffColors[res.difficulty]}`}>{res.difficulty}</span>
            </div>
            <h3 className="font-semibold mb-1">{res.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{res.description}</p>
            <a href={res.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-primary font-medium hover:underline">
              Open Resource <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
