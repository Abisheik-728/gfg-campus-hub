import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, User, Tag, Clock, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPublishedBlogs } from "@/data/blogData";
import { defaultBlogPosts } from "@/data/blogData";

// Simple markdown renderer for blog content
function renderMarkdown(content: string): JSX.Element {
  const lines = content.split("\n");
  const elements: JSX.Element[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code blocks
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      elements.push(
        <div key={key++} className="relative my-4 group">
          {lang && (
            <div className="absolute top-0 right-0 px-3 py-1 bg-muted-foreground/10 rounded-bl-lg rounded-tr-lg text-[10px] font-mono text-muted-foreground uppercase">
              {lang}
            </div>
          )}
          <pre className="bg-[#1e1e1e] text-[#d4d4d4] rounded-lg p-4 overflow-x-auto text-sm font-mono leading-relaxed border border-border">
            <code>{codeLines.join("\n")}</code>
          </pre>
        </div>
      );
      continue;
    }

    // Tables
    if (line.includes("|") && i + 1 < lines.length && lines[i + 1]?.match(/^\|[\s-:|]+\|$/)) {
      const headerCells = line.split("|").filter(c => c.trim()).map(c => c.trim());
      i += 2; // skip header divider
      const rows: string[][] = [];
      while (i < lines.length && lines[i].includes("|")) {
        rows.push(lines[i].split("|").filter(c => c.trim()).map(c => c.trim()));
        i++;
      }
      elements.push(
        <div key={key++} className="my-4 overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                {headerCells.map((cell, ci) => (
                  <th key={ci} className="text-left p-3 font-semibold text-sm">{cell}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} className="border-b last:border-0 border-border">
                  {row.map((cell, ci) => (
                    <td key={ci} className="p-3 text-sm text-muted-foreground">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // Headings
    if (line.startsWith("## ")) {
      elements.push(<h2 key={key++} className="text-2xl font-bold mt-8 mb-4 text-foreground">{renderInline(line.slice(3))}</h2>);
      i++; continue;
    }
    if (line.startsWith("### ")) {
      elements.push(<h3 key={key++} className="text-xl font-semibold mt-6 mb-3 text-foreground">{renderInline(line.slice(4))}</h3>);
      i++; continue;
    }
    if (line.startsWith("#### ")) {
      elements.push(<h4 key={key++} className="text-lg font-semibold mt-4 mb-2 text-foreground">{renderInline(line.slice(5))}</h4>);
      i++; continue;
    }

    // Blockquotes
    if (line.startsWith("> ")) {
      elements.push(
        <blockquote key={key++} className="border-l-4 border-primary pl-4 py-2 my-4 bg-primary/5 rounded-r-lg italic text-muted-foreground">
          {renderInline(line.slice(2))}
        </blockquote>
      );
      i++; continue;
    }

    // Unordered lists
    if (line.startsWith("- ")) {
      const listItems: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        listItems.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={key++} className="my-3 space-y-1.5">
          {listItems.map((item, li) => (
            <li key={li} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Ordered lists
    if (line.match(/^\d+\.\s/)) {
      const listItems: string[] = [];
      while (i < lines.length && lines[i].match(/^\d+\.\s/)) {
        listItems.push(lines[i].replace(/^\d+\.\s/, ""));
        i++;
      }
      elements.push(
        <ol key={key++} className="my-3 space-y-1.5 counter-reset-list">
          {listItems.map((item, li) => (
            <li key={li} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="mt-0.5 h-5 w-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                {li + 1}
              </span>
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Empty lines
    if (line.trim() === "") {
      i++; continue;
    }

    // Paragraphs
    elements.push(<p key={key++} className="text-sm text-muted-foreground leading-relaxed my-2">{renderInline(line)}</p>);
    i++;
  }

  return <>{elements}</>;
}

// Inline formatting
function renderInline(text: string): (string | JSX.Element)[] {
  const parts: (string | JSX.Element)[] = [];
  let remaining = text;
  let k = 0;

  while (remaining.length > 0) {
    // Bold
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    if (boldMatch && boldMatch.index !== undefined) {
      if (boldMatch.index > 0) parts.push(remaining.slice(0, boldMatch.index));
      parts.push(<strong key={k++} className="font-semibold text-foreground">{boldMatch[1]}</strong>);
      remaining = remaining.slice(boldMatch.index + boldMatch[0].length);
      continue;
    }

    // Inline code
    const codeMatch = remaining.match(/`(.+?)`/);
    if (codeMatch && codeMatch.index !== undefined) {
      if (codeMatch.index > 0) parts.push(remaining.slice(0, codeMatch.index));
      parts.push(<code key={k++} className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono text-primary">{codeMatch[1]}</code>);
      remaining = remaining.slice(codeMatch.index + codeMatch[0].length);
      continue;
    }

    // No more matches
    parts.push(remaining);
    break;
  }

  return parts;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

function getReadTime(content: string): number {
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
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

export default function BlogArticlePage() {
  const { blogId } = useParams();
  const allBlogs = getPublishedBlogs();
  const post = allBlogs.find(p => p.id === blogId);

  if (!post) return <Navigate to="/blog" />;

  const readTime = getReadTime(post.content);

  // Related posts (same category, exclude self)
  const relatedPosts = allBlogs
    .filter(p => p.id !== post.id && (p.category === post.category || p.tags.some(t => post.tags.includes(t))))
    .slice(0, 3);

  return (
    <div className="gfg-container py-8 max-w-4xl mx-auto">
      {/* Back Link */}
      <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Blog & News
      </Link>

      <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Featured Image */}
        <div className="rounded-xl overflow-hidden mb-8 h-64 md:h-[400px] bg-muted shadow-md">
          <img src={post.image || categoryImages[post.category] || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200&auto=format&fit=crop"} alt={post.title} className="w-full h-full object-cover" />
        </div>

        {/* Category + Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
            post.category === "ai" ? "bg-purple-500/10 text-purple-600" :
            post.category === "programming" ? "bg-blue-500/10 text-blue-600" :
            post.category === "webdev" ? "bg-emerald-500/10 text-emerald-600" :
            post.category === "datascience" ? "bg-orange-500/10 text-orange-600" :
            post.category === "cybersecurity" ? "bg-red-500/10 text-red-600" :
            post.category === "event" ? "bg-primary/10 text-primary" :
            post.category === "tip" ? "bg-gfg-amber/10 text-gfg-amber" :
            "bg-muted text-muted-foreground"
          }`}>
            {post.category}
          </span>
          {post.tags.map(tag => (
            <span key={tag} className="px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground flex items-center gap-1">
              <Tag className="h-2.5 w-2.5" /> {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">{post.title}</h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-6 border-b border-border">
          <span className="flex items-center gap-1.5">
            <User className="h-4 w-4" /> {post.author}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" /> {formatDate(post.date)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" /> {readTime} min read
          </span>
        </div>

        {/* Article Content */}
        <div className="prose-custom">
          {renderMarkdown(post.content)}
        </div>

        {/* Author Box */}
        <div className="mt-10 p-5 rounded-xl bg-muted/50 border border-border flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
            {post.author.charAt(0)}
          </div>
          <div>
            <div className="font-semibold">{post.author}</div>
            <div className="text-sm text-muted-foreground">Campus contributor • GfG Campus Hub</div>
          </div>
        </div>
      </motion.article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="mt-12 pt-8 border-t border-border">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" /> Related Articles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedPosts.map(p => (
              <Link key={p.id} to={`/blog/${p.id}`} className="gfg-card-hover group flex flex-col">
                <div className="relative aspect-video -mx-5 -mt-5 mb-4 overflow-hidden rounded-t-xl bg-muted">
                  <img src={p.image || categoryImages[p.category] || "/images/blog/tech_default.png"} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] w-fit font-semibold capitalize ${
                  p.category === "ai" ? "bg-purple-500/10 text-purple-600" :
                  p.category === "programming" ? "bg-blue-500/10 text-blue-600" :
                  "bg-muted text-muted-foreground"
                }`}>{p.category}</span>
                <h4 className="font-semibold text-sm mt-3 mb-1 group-hover:text-primary transition-colors line-clamp-2">{p.title}</h4>
                <p className="text-xs text-muted-foreground flex-1 line-clamp-2">{p.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
