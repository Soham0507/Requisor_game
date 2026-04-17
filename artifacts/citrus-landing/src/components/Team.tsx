import React from "react";
import { motion } from "framer-motion";

const team = [
  {
    name: "Naveen Kankate",
    role: "Founder & CEO",
    desc: "Builds interactive web-based games with smooth mechanics and optimized performance.",
    img: "/team/naveen.png",
    linkedin: "https://www.linkedin.com/in/naveenkankate/"
  },
  {
    name: "Soham Mhatre",
    role: "Full Stack Developer",
    desc: "Designs engaging interfaces and immersive game experiences for booth interactions.",
    img: "/team/soham.png",
    linkedin: "https://www.linkedin.com/in/sohamsatejmhatre/"
  },
];

function FloatingOrb({ x, y, color }: any) {
  return (
    <motion.div
      className="absolute rounded-full blur-2xl opacity-20 pointer-events-none"
      style={{ width: 200, height: 200, left: x, top: y, background: color }}
      animate={{ y: [0, -40, 0], x: [0, 30, 0] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

function PlayerCard({ member, index }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.2, duration: 0.6 }}
      className="group relative bg-white/[0.03] border border-white/10 rounded-2xl p-6 
      backdrop-blur-md hover:border-primary/40 transition-all duration-300
      hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] overflow-hidden"
    >
      {/* HUD Scan Line */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition" />

      {/* Avatar */}
      <div className="relative w-24 h-24 mx-auto mb-4">
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl group-hover:blur-2xl transition" />
        <img
          src={member.img}
          alt={member.name}
          className="relative w-full h-full object-cover rounded-full border border-white/20"
        />
      </div>

      {/* Info */}
      <h3 className="text-xl font-bold text-white text-center">
        {member.name}
      </h3>
      <p className="text-primary text-sm text-center mb-2">
        {member.role}
      </p>
      <p className="text-white/60 text-sm text-center">
        {member.desc}
      </p>
      <div className="flex justify-center mt-4">
        <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-primary transition">
          LinkedIn
          <span className="ml-1">→</span> </a>
        </div>

      {/* XP Bar */}
      <div className="mt-4">
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            initial={{ width: "0%" }}
            whileInView={{ width: "80%" }}
            transition={{ duration: 1.2, delay: 0.5 }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export function Team() {
  return (
    <section id='team' className="relative min-h-screen py-24 bg-black overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#020617] to-black" />

      {/* Grid */}
      <div className="absolute inset-0 opacity-20 
        bg-[linear-gradient(rgba(0,255,255,0.05)_1px,transparent_1px),
        linear-gradient(90deg,rgba(0,255,255,0.05)_1px,transparent_1px)]
        bg-[size:60px_60px]" />

      {/* Floating orbs */}
      <FloatingOrb x="10%" y="20%" color="#3b82f6" />
      <FloatingOrb x="70%" y="60%" color="#a855f7" />

      {/* Content */}
      <div className="container mx-auto px-6 md:px-12 relative z-10 text-center">

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold text-white mb-14" style={{fontFamily:"'PixelGamer', monospace"}}
        >
          Meet The Team
        </motion.h2>

        <p className="text-white/60 max-w-2xl mx-auto mb-16">
          The creators behind interactive booth gaming experiences — blending creativity, technology, and engagement.
        </p>

        {/* Team Grid */}
        <div className="flex flex-wrap justify-center gap-8">
          {team.map((member, i) => (
            <div key={i} className="w-[300px]">
              <PlayerCard member={member} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}