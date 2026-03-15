import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin, Code2 } from "lucide-react";

const footerLinks = {
  Platform: [
    { label: "Events", to: "/events" },
    { label: "Resources", to: "/resources" },
    { label: "Leaderboard", to: "/leaderboard" },
    { label: "Challenges", to: "/challenges" },
    { label: "AI Tools", to: "/ai-tools" },
  ],
  Community: [
    { label: "Our Team", to: "/team" },
    { label: "Blog & News", to: "/blog" },
    { label: "Contact Us", to: "/contact" },
    { label: "GeeksforGeeks", to: "https://www.geeksforgeeks.org", external: true },
  ],
  "Get Started": [
    { label: "Join the Club", to: "/login" },
    { label: "Practice Coding", to: "/editor" },
    { label: "Learning Paths", to: "/learn" },
  ],
};

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-border/50 bg-card/50">
      <div className="gfg-container py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Brand col */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group w-fit">
              <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:border-primary/40 transition-colors">
                <Code2 className="h-4 w-4 text-primary" />
              </div>
              <span className="font-display font-bold text-base tracking-tight">
                GfG Campus <span className="text-primary">Hub</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[200px]">
              Your campus coding community — learn, build, and grow together.
            </p>
            {/* Socials */}
            <div className="flex items-center gap-2 pt-1">
              {[
                { Icon: Github, href: "https://github.com", label: "GitHub" },
                { Icon: Twitter, href: "https://twitter.com", label: "Twitter" },
                { Icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="font-display font-semibold text-sm text-foreground mb-4 tracking-tight">{heading}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.to}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150 hover:translate-x-0.5 inline-block"
                      >
                        {link.label} ↗
                      </a>
                    ) : (
                      <Link
                        to={link.to}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150 hover:translate-x-0.5 inline-block"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom strip */}
        <div className="mt-12 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>© 2026 GfG Campus Hub. All rights reserved.</span>
          <span>Built with ❤️ for the campus coding community</span>
        </div>
      </div>
    </footer>
  );
}
