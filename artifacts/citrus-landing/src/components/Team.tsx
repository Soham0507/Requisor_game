import React from "react";
import { motion } from "framer-motion";
import PlayerCard from "./PlayerCard";

const team = [
  {
    name: "Naveen Kankate",
    role: "Founder & CEO",
    desc: "Builds interactive web-based games with smooth mechanics and optimized performance.",
    img: "/team/naveen.png",
    linkedin: "https://www.linkedin.com/in/naveenkankate/",
  },
  {
    name: "Soham Mhatre",
    role: "Full Stack Developer",
    desc: "Designs engaging interfaces and immersive game experiences for booth interactions.",
    img: "/team/soham.png",
    linkedin: "https://www.linkedin.com/in/sohamsatejmhatre/",
  },
];

function FloatingOrb({ x, y, color }: any) {
  return (
    <motion.div
      className="absolute rounded-full blur-[120px] opacity-20 pointer-events-none"
      style={{ width: 300, height: 300, left: x, top: y, background: color }}
      animate={{ y: [0, -50, 0], x: [0, 40, 0] }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

export function Team() {
  return (
    <section className="relative min-h-screen py-24 bg-black overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[#020617]" />

      {/* Gradient lighting */}
      <div className="absolute inset-0 
        bg-[radial-gradient(circle_at_20%_30%,rgba(3,169,244,0.12),transparent_40%),
             radial-gradient(circle_at_80%_70%,rgba(255,0,88,0.15),transparent_40%),
             radial-gradient(circle_at_50%_50%,rgba(0,255,204,0.08),transparent_60%)]
      " />

      {/* Noise texture */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('/noise.png')] mix-blend-overlay pointer-events-none" />

      {/* Floating Orbs */}
      <FloatingOrb x="10%" y="20%" color="#03a9f4" />
      <FloatingOrb x="70%" y="60%" color="#ff0058" />
      <FloatingOrb x="40%" y="80%" color="#00d4ff" />

      {/* Content */}
      <div className="container mx-auto px-6 md:px-12 relative z-10 text-center">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold text-white mb-6"
          style={{ fontFamily: "'PixelGamer', monospace" }}
        >
          Meet The Team
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-white/60 max-w-2xl mx-auto mb-16"
        >
          The creators behind interactive booth gaming experiences — blending creativity, technology, and engagement.
        </motion.p>

        {/* Cards Grid */}
        <div className="flex flex-wrap justify-center gap-10">
          {team.map((member, i) => (
            <div key={i} className="w-[340px]">
              <PlayerCard member={member} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}