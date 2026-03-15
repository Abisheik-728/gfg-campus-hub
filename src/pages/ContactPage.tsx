import { useState } from "react";
import { Mail, MessageSquare, MapPin, Send, CheckCircle2, Github, Linkedin, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.email && form.subject && form.message) {
      
      // Save to mock database (localStorage)
      const existingQueries = JSON.parse(localStorage.getItem("gfg_contact_queries") || "[]");
      const newQuery = {
        id: Date.now().toString(),
        ...form,
        date: new Date().toISOString(),
        status: "unread"
      };
      localStorage.setItem("gfg_contact_queries", JSON.stringify([newQuery, ...existingQueries]));

      setSubmitted(true);
      // Reset form after delay
      setTimeout(() => {
        setSubmitted(false);
        setForm({ name: "", email: "", subject: "", message: "" });
      }, 5000);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] relative overflow-hidden bg-background">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="gfg-container py-16 lg:py-24 relative z-10 flex flex-col items-center">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm font-semibold mb-6 backdrop-blur-md">
            <MessageSquare className="w-4 h-4" /> Get In Touch
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Contact & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-accent">Support</span></h1>
          <p className="text-gray-400 text-lg mx-auto">
            Have a question, feedback, or want to collaborate? Reach out to our team and we'll get back to you as soon as possible.
          </p>
        </motion.div>

        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 space-y-6"
          >
            <div className="glass-card p-6 border border-white/10 flex items-start gap-4 group hover:border-primary/40 shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-all rounded-2xl bg-gradient-to-br from-white/5 to-black/40">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex flex-shrink-0 items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">Email Us</h3>
                <p className="text-gray-400 text-sm mb-2 font-medium">For general queries and support.</p>
                <a href="mailto:campuscodingclub@gmail.com" className="text-primary font-bold hover:underline">campuscodingclub@gmail.com</a>
              </div>
            </div>

            <div className="glass-card p-6 border border-white/10 flex items-start gap-4 group hover:border-accent/40 shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-all rounded-2xl bg-gradient-to-br from-white/5 to-black/40">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex flex-shrink-0 items-center justify-center text-accent group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">Community Links</h3>
                <p className="text-gray-400 text-sm mb-3 font-medium">Join our active technical communities.</p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-white/5 border border-white/10 px-2 py-1.5 rounded-lg text-gray-300 hover:text-white cursor-pointer hover:bg-white/10 flex items-center gap-1.5 font-bold transition-colors"><Github className="w-3.5 h-3.5" /> GitHub</span>
                  <span className="text-xs bg-white/5 border border-white/10 px-2 py-1.5 rounded-lg text-gray-300 hover:text-white cursor-pointer hover:bg-white/10 flex items-center gap-1.5 font-bold transition-colors"><Linkedin className="w-3.5 h-3.5" /> LinkedIn</span>
                  <span className="text-xs bg-white/5 border border-white/10 px-2 py-1.5 rounded-lg text-gray-300 hover:text-white cursor-pointer hover:bg-white/10 flex items-center gap-1.5 font-bold transition-colors"><MessageCircle className="w-3.5 h-3.5" /> Discord / WhatsApp community</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form wrapper */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-3 glass-card border border-white/10 p-8 shadow-2xl relative overflow-hidden rounded-2xl bg-gradient-to-tl from-white/5 to-black/60"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[50px] pointer-events-none" />
            <h2 className="text-2xl font-bold text-white mb-6">Send a Message</h2>
            
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center justify-center text-center py-12 h-full"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)] border border-emerald-500/30">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                  <p className="text-gray-400 font-medium tracking-wide">Your message has been sent successfully.</p>
                </motion.div>
              ) : (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-5 relative z-10"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Name</label>
                      <Input
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="John Doe"
                        className="bg-black/40 border-white/10 text-white placeholder-gray-600 focus-visible:ring-primary focus-visible:border-primary h-12"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Email</label>
                      <Input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="john@example.com"
                        className="bg-black/40 border-white/10 text-white placeholder-gray-600 focus-visible:ring-primary focus-visible:border-primary h-12"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Subject</label>
                    <Input
                      required
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder="Issue with learning dashboard"
                      className="bg-black/40 border-white/10 text-white placeholder-gray-600 focus-visible:ring-primary focus-visible:border-primary h-12"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Message</label>
                    <Textarea
                      required
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="How can we help you?"
                      className="bg-black/40 border-white/10 text-white placeholder-gray-600 focus-visible:ring-primary focus-visible:border-primary min-h-[150px] resize-y p-4"
                    />
                  </div>
                  <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/80 text-white font-bold rounded-lg mt-6 shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all hover:-translate-y-1">
                    Send Message <Send className="ml-2 w-4 h-4" />
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
