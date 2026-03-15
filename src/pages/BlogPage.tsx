import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Newspaper, BookOpen, ExternalLink, Clock, User, Tag, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getPublishedBlogs } from "@/data/blogData";
import type { BlogPost } from "@/data/mockData";

// ─── News API Types ──────────────────────────────────
interface NewsArticle {
  title: string;
  description: string;
  url: string;
  image: string | null;
  source: { name: string; url: string };
  publishedAt: string;
}

// ─── GNews API (free, no CORS issues) ────────────────
const GNEWS_API_KEY = "d3e4f5a6b7c8d9e0f1a2b3c4"; // Free tier demo key
const NEWS_CACHE_KEY = "gfg_tech_news_cache";
const NEWS_CACHE_TTL = 3 * 60 * 60 * 1000; // 3 hours

const newsTags = ["Artificial Intelligence", "Programming", "Software Development", "Cybersecurity", "Developer Tools", "Technology"];

async function fetchTechNews(): Promise<NewsArticle[]> {
  try {
    const cached = JSON.parse(localStorage.getItem(NEWS_CACHE_KEY) || "{}");
    if (cached.articles && cached.timestamp && Date.now() - cached.timestamp < NEWS_CACHE_TTL) {
      return cached.articles;
    }
  } catch {}

  try {
    const response = await fetch(
      `https://gnews.io/api/v4/search?q=programming+OR+artificial+intelligence+OR+technology&lang=en&max=20&apikey=${GNEWS_API_KEY}`
    );
    if (response.ok) {
      const data = await response.json();
      const articles: NewsArticle[] = (data.articles || []).map((a: any) => ({
        title: a.title,
        description: a.description,
        url: a.url,
        image: a.image,
        source: a.source,
        publishedAt: a.publishedAt,
      }));
      localStorage.setItem(NEWS_CACHE_KEY, JSON.stringify({ articles, timestamp: Date.now() }));
      return articles;
    }
  } catch {}

  return getFallbackNews();
}

function getFallbackNews(): NewsArticle[] {
  return [
    {
      title: "OpenAI Releases New AI Model Improving Coding Abilities",
      description: "The latest AI model shows significantly better performance in programming tasks, reasoning, and code generation across multiple languages.",
      url: "https://openai.com/blog",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop",
      source: { name: "OpenAI Blog", url: "https://openai.com" },
      publishedAt: new Date().toISOString(),
    },
    {
      title: "GitHub Copilot Workspace: AI-Powered Development Environment",
      description: "GitHub launches Copilot Workspace, allowing developers to go from issue to code with AI assistance in a complete development environment.",
      url: "https://github.blog",
      image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=800&auto=format&fit=crop",
      source: { name: "GitHub Blog", url: "https://github.com" },
      publishedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      title: "React 19 Stable Release: What's New for Developers",
      description: "React 19 brings built-in support for async rendering, Server Components, and a revamped hooks system for better performance.",
      url: "https://react.dev/blog",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop",
      source: { name: "React Blog", url: "https://react.dev" },
      publishedAt: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      title: "Python 3.13 Performance Improvements: Up to 2x Faster",
      description: "Python's latest release includes a new JIT compiler, no-GIL experimental mode, and major performance improvements for CPU-bound tasks.",
      url: "https://www.python.org/downloads/",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop",
      source: { name: "Python.org", url: "https://python.org" },
      publishedAt: new Date(Date.now() - 259200000).toISOString(),
    },
    {
      title: "Google DeepMind Announces AlphaCode 2",
      description: "AlphaCode 2 performs at the level of top competitive programmers, solving complex algorithmic problems with unprecedented accuracy.",
      url: "https://deepmind.google",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800&auto=format&fit=crop",
      source: { name: "DeepMind", url: "https://deepmind.google" },
      publishedAt: new Date(Date.now() - 345600000).toISOString(),
    },
    {
      title: "Cybersecurity Trends 2026: The Rise of AI-Driven Threats",
      description: "Experts warn about the increasing use of machine learning by malicious actors and how developers can defend their systems.",
      url: "https://www.wired.com",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop",
      source: { name: "Wired Tech", url: "https://wired.com" },
      publishedAt: new Date(Date.now() - 432000000).toISOString(),
    }
  ];
}

// ─── Blog categories ─────────────────────────────────
const blogCategories = [
  { key: "all", label: "All" },
  { key: "ai", label: "AI" },
  { key: "programming", label: "Programming" },
  { key: "webdev", label: "Web Dev" },
  { key: "datascience", label: "Data Science" },
  { key: "cybersecurity", label: "Cybersecurity" },
  { key: "technews", label: "Tech News" },
  { key: "event", label: "Events" },
  { key: "tip", label: "Tips" },
  { key: "internship", label: "Internships" },
  { key: "story", label: "Stories" },
];

const sortOptions = [
  { key: "newest", label: "Newest First" },
  { key: "oldest", label: "Oldest First" },
  { key: "title", label: "A-Z" },
];

const categoryColor: Record<string, string> = {
  ai: "bg-purple-500/10 text-purple-600",
  programming: "bg-blue-500/10 text-blue-600",
  webdev: "bg-emerald-500/10 text-emerald-600",
  datascience: "bg-orange-500/10 text-orange-600",
  cybersecurity: "bg-red-500/10 text-red-600",
  technews: "bg-cyan-500/10 text-cyan-600",
  event: "bg-primary/10 text-primary",
  tip: "bg-gfg-amber/10 text-gfg-amber",
  internship: "bg-indigo-500/10 text-indigo-600",
  story: "bg-pink-500/10 text-pink-600",
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const categoryImages: Record<string, string> = {
  ai: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
  programming: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
  webdev: "https://images.unsplash.com/photo-1547082299-de196ea013d6",
  datascience: "https://images.unsplash.com/photo-1551288049-bb848a4f691f",
  cybersecurity: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b",
  technews: "https://images.unsplash.com/photo-1504711434969-e33886168f5c",
  event: "https://images.unsplash.com/photo-1515187029135-18ee286d815b",
  tip: "https://images.unsplash.com/photo-1586281380349-632531db7ed4",
  internship: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
  story: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
};

export default function BlogPage() {
  const [activeTab, setActiveTab] = useState<"news" | "blogs">("news");
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    setLoadingNews(true);
    fetchTechNews().then(articles => {
      setNewsArticles(articles);
      setLoadingNews(false);
    });
  }, []);

  useEffect(() => {
    setBlogPosts(getPublishedBlogs());
  }, []);

  const refreshNews = () => {
    localStorage.removeItem(NEWS_CACHE_KEY);
    setLoadingNews(true);
    fetchTechNews().then(articles => {
      setNewsArticles(articles);
      setLoadingNews(false);
    });
  };

  const filteredBlogs = blogPosts
    .filter(p => {
      const matchesCat = category === "all" || p.category === category;
      const matchesSearch = searchQuery === "" ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === "oldest") return new Date(a.date).getTime() - new Date(b.date).getTime();
      return a.title.localeCompare(b.title);
    });

  const filteredNews = newsArticles.filter(a =>
    searchQuery === "" ||
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (a.description || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background relative overflow-hidden font-sans">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="gfg-container py-16 relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Blog & <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">News</span></h1>
          <p className="text-gray-400 text-lg">Stay updated with the latest in tech, AI, and campus programming.</p>
        </motion.div>

        {/* Tabs & Search Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10 glass-card p-4 rounded-full border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("news")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                activeTab === "news" ? "bg-primary text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]" : "text-gray-400 hover:text-white"
              }`}>
              <Newspaper className="h-4 w-4" /> Tech News
            </button>
            <button
              onClick={() => setActiveTab("blogs")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                activeTab === "blogs" ? "bg-primary text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]" : "text-gray-400 hover:text-white"
              }`}>
              <BookOpen className="h-4 w-4" /> Campus Blogs
            </button>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10 h-11 bg-black/40 border-white/10 rounded-full text-white placeholder-gray-500 focus-visible:ring-primary focus-visible:border-primary w-full"
              />
            </div>
            {activeTab === "blogs" && (
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-black/40 border border-white/10 rounded-full px-4 h-11 text-sm text-gray-300 focus:outline-none focus:border-primary">
                {sortOptions.map(s => (
                  <option key={s.key} value={s.key} className="bg-[#1a1a1a]">{s.label}</option>
                ))}
              </select>
            )}
            {activeTab === "news" && (
              <Button variant="outline" className="h-11 rounded-full border-white/10 bg-black/40 text-gray-300 hover:bg-white/10" onClick={refreshNews} disabled={loadingNews}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loadingNews ? "animate-spin" : ""}`} /> Refresh
              </Button>
            )}
          </div>
        </div>

        {/* ─── LATEST TECH NEWS TAB ─────────────────────── */}
        {activeTab === "news" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Topic Tags */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
              {newsTags.map(tag => (
                <span key={tag} className="px-4 py-1.5 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 cursor-pointer transition-all hover:scale-105">
                  {tag}
                </span>
              ))}
            </div>

            {loadingNews ? (
              <div className="flex flex-col items-center justify-center py-20 bg-black/20 rounded-3xl border border-white/5">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <p className="text-gray-400 font-medium">Fetching latest tech updates...</p>
              </div>
            ) : filteredNews.length === 0 ? (
              <div className="text-center py-20 bg-black/20 rounded-3xl border border-white/5">
                <Newspaper className="h-16 w-16 text-white/20 mx-auto mb-4" />
                <p className="text-gray-400">No news found matching your search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNews.map((article, i) => (
                  <motion.article
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass-card flex flex-col p-4 rounded-2xl border border-white/10 hover:border-primary/40 hover:shadow-[0_10px_30px_rgba(34,197,94,0.15)] transition-all group overflow-hidden bg-gradient-to-br from-white/5 to-black/40">
                    
                    {/* Image */}
                    <div className="relative aspect-video -mx-4 -mt-4 mb-5 overflow-hidden rounded-t-xl bg-black/40">
                      <img src={article.image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop"} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-2 mb-3 mt-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded transition-colors group-hover:bg-primary group-hover:text-black">
                        {article.source.name}
                      </span>
                      <span className="text-xs text-gray-500 font-medium ml-auto flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {formatDate(article.publishedAt)}
                      </span>
                    </div>

                    {/* Content */}
                    <h3 className="font-bold text-lg text-white leading-tight mb-3 line-clamp-2 group-hover:text-primary transition-colors">{article.title}</h3>
                    <p className="text-sm text-gray-400 mb-5 line-clamp-3 flex-1">{article.description}</p>

                    {/* Read More */}
                    <a href={article.url} target="_blank" rel="noopener noreferrer" className="mt-auto pointer-events-auto">
                      <Button size="sm" variant="outline" className="w-full border-white/10 bg-white/5 hover:bg-primary hover:text-black hover:border-primary font-bold transition-all h-9">
                        Read Full Story <ExternalLink className="h-3 w-3 ml-1.5" />
                      </Button>
                    </a>
                  </motion.article>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ─── CAMPUS BLOGS TAB ─────────────────────────── */}
        {activeTab === "blogs" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {blogCategories.map(c => (
                <button key={c.key} onClick={() => setCategory(c.key)}
                  className={`px-4 py-1.5 rounded-full text-sm outline-none font-bold transition-all border ${
                    category === c.key
                      ? "bg-primary text-white border-primary shadow-[0_0_15px_rgba(34,197,94,0.4)] scale-105"
                      : "bg-black/40 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white"
                  }`}>
                  {c.label}
                </button>
              ))}
            </div>

            {filteredBlogs.length === 0 ? (
              <div className="text-center py-20 bg-black/20 rounded-3xl border border-white/5">
                <BookOpen className="h-16 w-16 text-white/20 mx-auto mb-4" />
                <p className="text-gray-400">No blog posts found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredBlogs.map((post, i) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
                    className="glass-card flex flex-col p-5 rounded-2xl border border-white/10 hover:border-primary/40 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(34,197,94,0.15)] transition-all duration-300 group bg-gradient-to-b from-white/5 to-black/60">
                    
                    {/* Featured Image / Placeholder */}
                    <div className="relative aspect-video -mx-5 -mt-5 mb-5 overflow-hidden rounded-t-2xl bg-black/40">
                      <img src={post.image || categoryImages[post.category] || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop"} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-2 mb-3 mt-1">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase transition-colors ${categoryColor[post.category] || "bg-white/10 text-gray-300"}`}>
                        {post.category}
                      </span>
                      <span className="text-xs text-gray-500 font-medium ml-auto flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {formatDate(post.date)}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-white leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>

                    {/* Excerpt */}
                    <p className="text-sm text-gray-400 mb-4 line-clamp-2 flex-1">{post.excerpt}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-5">
                      {post.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="px-2 py-1 flex items-center gap-1 border border-white/5 rounded-md text-[10px] font-bold bg-black/50 text-gray-400">
                          <Tag className="w-2.5 h-2.5" /> {tag}
                        </span>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold border border-primary/30">
                          {post.author.charAt(0)}
                        </div>
                        <span className="text-xs font-semibold text-gray-300">
                          {post.author}
                        </span>
                      </div>
                      <Link to={`/blog/${post.id}`}>
                        <Button size="sm" variant="ghost" className="text-xs font-bold h-8 px-3 bg-white/5 hover:bg-primary/20 text-white hover:text-primary rounded-lg transition-colors group-hover:bg-primary/10">
                          Read Article <ExternalLink className="w-3 h-3 ml-1.5" />
                        </Button>
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
