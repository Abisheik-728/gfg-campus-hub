import { motion } from "framer-motion";
import { teamMembers } from "@/data/mockData";
import { Users, Target, Rocket, Lightbulb, Code, BookOpen, Briefcase } from "lucide-react";

const teamGroups = [
  { key: "faculty", label: "Faculty Coordinators" },
  { key: "lead", label: "Club Leadership" },
  { key: "technical", label: "Technical Team" },
  { key: "event", label: "Event Team" },
];

const objectives = [
  { icon: Code, title: "Promote Coding Culture", desc: "Build a thriving community of passionate developers and problem solvers." },
  { icon: BookOpen, title: "Teach DSA", desc: "Master Data Structures and Algorithms with peer-to-peer learning and expert sessions." },
  { icon: Briefcase, title: "Placement Preparation", desc: "Equip students with the right skills and mock interviews to crack top tech companies." },
];

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute -top-[300px] -right-[300px] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="gfg-container py-20 relative z-10">
        
        {/* Header Section */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm font-semibold mb-6 backdrop-blur-md">
            <Users className="h-4 w-4" /> About GfG Campus Club
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-6 tracking-tight">
            Learn. <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Inspire.</span> Grow.
          </h1>
          <p className="text-lg text-gray-300 font-light leading-relaxed">
            The official student chapter of GeeksforGeeks at our campus. We are a community of passionate developers dedicated to fostering a strong coding culture, learning together, and building real-world solutions.
          </p>
        </motion.div>

        {/* Mission & Objectives Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="glass-card p-8 border border-white/10 relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 text-primary/10 transition-transform group-hover:scale-110 group-hover:text-primary/20">
              <Target className="w-32 h-32" />
            </div>
            <div className="h-12 w-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
              <Rocket className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-gray-400 leading-relaxed">
              To create an ecosystem where every student has the resources, mentorship, and opportunity to grow their technical skills, collaborate on innovative projects, and ultimately become industry-ready software engineers.
            </p>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-4">
            {objectives.map((obj, i) => (
              <motion.div key={i} variants={fadeUp} className="glass-card p-5 border border-white/10 flex gap-5 hover:bg-white/5 transition-colors group">
                <div className="h-12 w-12 shrink-0 rounded-xl bg-white/5 flex items-center justify-center text-primary border border-white/10 group-hover:bg-primary/20 group-hover:border-primary/30 transition-all">
                  <obj.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">{obj.title}</h3>
                  <p className="text-sm text-gray-400">{obj.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Core Team Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-accent">Core Team</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto">The brilliant minds driving the club forward, organizing events, and mentoring the next generation.</p>
        </div>

        {teamGroups.map((group, groupIdx) => {
          const members = teamMembers.filter(m => m.team === group.key);
          if (members.length === 0) return null;
          
          return (
            <motion.div 
              key={group.key} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mb-16"
            >
              <h3 className="text-2xl font-bold text-white mb-8 border-b border-white/10 pb-4 flex items-center gap-3">
                <div className="w-2 h-8 bg-primary rounded-full"></div>
                {group.label}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {members.map((m, i) => (
                  <motion.div 
                    key={m.id} 
                    initial={{ opacity: 0, scale: 0.9 }} 
                    whileInView={{ opacity: 1, scale: 1 }} 
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }} 
                    className="glass-card p-6 text-center border border-white/10 hover:border-primary/30 hover:-translate-y-2 transition-all duration-300 group"
                  >
                    <div className="relative mx-auto w-24 h-24 mb-4">
                      {/* Placeholder for real photos */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary to-accent opacity-20 blur-md group-hover:opacity-40 transition-opacity" />
                      <div className="relative w-full h-full rounded-full bg-black border-2 border-white/20 flex flex-col items-center justify-center overflow-hidden shrink-0 group-hover:border-primary/50 transition-colors">
                        <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary to-accent">
                          {m.name.split(" ").map(n => n[0]).join("")}
                        </span>
                      </div>
                    </div>
                    
                    <h4 className="text-lg font-bold text-white mb-1">{m.name}</h4>
                    <p className="text-sm font-medium text-emerald-400 mb-3">{m.role}</p>
                    
                    {/* Social/Stats placeholder */}
                    <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-white/10">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer">
                        <Code className="w-4 h-4" />
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer">
                        <Lightbulb className="w-4 h-4" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}

      </div>
    </div>
  );
}
