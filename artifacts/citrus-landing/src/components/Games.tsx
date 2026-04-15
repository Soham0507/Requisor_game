import React from "react";
import { motion } from "framer-motion";
import { Gamepad2, Zap, Shield } from "lucide-react";

const games = [
  {
    title: "Basketball Game",
    description: "Gesture-based controls, real-time scoring, and smooth gameplay mechanics designed for maximum engagement.",
    icon: Gamepad2,
    color: "from-orange-500/20 to-orange-500/0",
    border: "group-hover:border-orange-500/50",
    glow: "group-hover:shadow-[0_0_30px_rgba(249,115,22,0.15)]",
  },
  {
    title: "Soccer Game",
    description: "Fast-paced gameplay with the same core logic as basketball, fully customizable for client campaigns and events.",
    icon: Zap,
    color: "from-blue-500/20 to-blue-500/0",
    border: "group-hover:border-blue-500/50",
    glow: "group-hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]",
  },
  {
    title: "Cyber Adventure Game",
    description: "Temple-run style endless runner with a cybersecurity theme (phishing, malware). Educational and highly addictive.",
    icon: Shield,
    color: "from-purple-500/20 to-purple-500/0",
    border: "group-hover:border-purple-500/50",
    glow: "group-hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export function Games() {
  return (
    <section id="games" className="py-32 bg-background relative border-t border-white/5">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="mb-16 md:mb-24 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold text-white mb-4"
          >
            Our Games
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="w-24 h-1 bg-primary mx-auto rounded-full"
          />
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {games.map((game, index) => (
            <motion.div key={index} variants={itemVariants} className="h-full">
              <div className={`group h-full relative p-8 rounded-2xl bg-card border border-white/10 transition-all duration-500 overflow-hidden ${game.border} ${game.glow}`}>
                <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-b ${game.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-500">
                    <game.icon size={28} />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-4">{game.title}</h3>
                  <p className="text-muted-foreground leading-relaxed flex-grow">
                    {game.description}
                  </p>
                  
                  <div className="mt-8 flex items-center text-sm font-semibold text-white/70 group-hover:text-white transition-colors">
                    Explore game
                    <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
