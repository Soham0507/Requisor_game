import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ParticleText } from "@/components/ParticleText";

function FloatingController() {
  return (
    <motion.div
      className="absolute top-[12%] right-[8%] opacity-10 pointer-events-none"
      animate={{ y: [0, -20, 0], rotate: [0, 6, 0] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg width="220" height="160" viewBox="0 0 220 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="30" y="50" width="160" height="80" rx="40" fill="white" fillOpacity="0.08" stroke="white" strokeOpacity="0.2" strokeWidth="2"/>
        <circle cx="75" cy="90" r="22" fill="none" stroke="white" strokeOpacity="0.3" strokeWidth="1.5"/>
        <line x1="75" y1="68" x2="75" y2="112" stroke="white" strokeOpacity="0.3" strokeWidth="2"/>
        <line x1="53" y1="90" x2="97" y2="90" stroke="white" strokeOpacity="0.3" strokeWidth="2"/>
        <circle cx="145" cy="80" r="8" fill="white" fillOpacity="0.15" stroke="white" strokeOpacity="0.3" strokeWidth="1.5"/>
        <circle cx="165" cy="90" r="8" fill="white" fillOpacity="0.15" stroke="white" strokeOpacity="0.3" strokeWidth="1.5"/>
        <circle cx="145" cy="100" r="8" fill="white" fillOpacity="0.15" stroke="white" strokeOpacity="0.3" strokeWidth="1.5"/>
        <circle cx="125" cy="90" r="8" fill="white" fillOpacity="0.15" stroke="white" strokeOpacity="0.3" strokeWidth="1.5"/>
        <rect x="100" y="78" width="14" height="6" rx="3" fill="white" fillOpacity="0.2"/>
        <rect x="106" y="72" width="6" height="14" rx="3" fill="white" fillOpacity="0.2"/>
        <ellipse cx="45" cy="55" rx="14" ry="10" fill="white" fillOpacity="0.06" stroke="white" strokeOpacity="0.15" strokeWidth="1"/>
        <ellipse cx="175" cy="55" rx="14" ry="10" fill="white" fillOpacity="0.06" stroke="white" strokeOpacity="0.15" strokeWidth="1"/>
      </svg>
    </motion.div>
  );
}

function FloatingBall({ x, y, size, delay, color }: { x: string; y: string; size: number; delay: number; color: string }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ left: x, top: y, width: size, height: size, background: color, opacity: 0.12, filter: "blur(1px)" }}
      animate={{ y: [0, -30, 0], x: [0, 10, 0], opacity: [0.12, 0.2, 0.12] }}
      transition={{ duration: 6 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

function PixelStar({ x, y, delay }: { x: string; y: string; delay: number }) {
  return (
    <motion.div
      className="absolute text-white/20 font-mono text-lg pointer-events-none select-none"
      style={{ left: x, top: y }}
      animate={{ opacity: [0, 0.5, 0], scale: [0.8, 1.2, 0.8] }}
      transition={{ duration: 3 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    >
      +
    </motion.div>
  );
}

function HUDPanel() {
  return (
    <motion.div
      className="absolute bottom-[12%] left-[4%] pointer-events-none hidden lg:block"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.2, duration: 0.8 }}
    >
      <div className="bg-black/60 border border-white/10 backdrop-blur-sm rounded-xl p-4 font-mono text-xs space-y-2 w-44">
        <div className="text-green-400/80 uppercase tracking-widest text-[10px] mb-2">// PLAYER 1</div>
        <div className="flex justify-between text-white/50">
          <span>LVL</span>
          <span className="text-cyan-400">MAX</span>
        </div>
        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "88%" }}
            transition={{ delay: 1.5, duration: 1.5, ease: "easeOut" }}
          />
        </div>
        <div className="flex justify-between text-white/50">
          <span>SCORE</span>
          <motion.span
            className="text-orange-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            99,880
          </motion.span>
        </div>
        <div className="flex gap-1 mt-1">
          {[1,2,3].map(i => (
            <div key={i} className="w-3 h-3 rounded-sm bg-orange-500/60 border border-orange-400/30" />
          ))}
          <div className="w-3 h-3 rounded-sm bg-white/5 border border-white/10" />
        </div>
      </div>
    </motion.div>
  );
}

function ScorePopup() {
  return (
    <motion.div
      className="absolute top-[30%] right-[5%] pointer-events-none hidden lg:block"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: [0, 1, 1, 0], y: [20, 0, 0, -20] }}
      transition={{ delay: 2, duration: 3, ease: "easeInOut", repeat: Infinity, repeatDelay: 5 }}
    >
      <div className="font-mono text-orange-400/70 text-sm font-bold tracking-widest">
        +100 COMBO!
      </div>
    </motion.div>
  );
}

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const gridY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-black"
    >
      {/* Base gradient */}
       <div className="absolute inset-0 bg-gradient-to-b from-black via-[#030712] to-black" />

  
      <motion.div
        className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:60px_60px]"
        style={{ y: gridY }}
      />

      
      <div className="absolute top-[20%] left-[15%] w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[140px] animate-pulse" />

  
      <FloatingController />
      <FloatingBall x="10%" y="20%" size={60} delay={0} color="radial-gradient(circle, #f97316, transparent)" />
      <FloatingBall x="80%" y="60%" size={40} delay={1.5} color="radial-gradient(circle, #a855f7, transparent)" />
      <FloatingBall x="60%" y="15%" size={30} delay={0.8} color="radial-gradient(circle, #22d3ee, transparent)" />
      <FloatingBall x="20%" y="70%" size={50} delay={2} color="radial-gradient(circle, #3b82f6, transparent)" />
      <PixelStar x="12%" y="45%" delay={0} />
      <PixelStar x="55%" y="80%" delay={1} />
      <PixelStar x="88%" y="30%" delay={2} />
      <PixelStar x="35%" y="12%" delay={0.5} />
      <PixelStar x="72%" y="72%" delay={1.5} />

    
      <HUDPanel />
      <ScorePopup />

      
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, black 2px, black 4px)" }} /> 

      {/* <video src="/public/home/home.mp4" autoPlay muted className="absolute inset-0 w-full h-full object-cover" /> */}
      
      {/* CONTENT */}
      <div className="container mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="w-full"
        >
          {/* Badge */}
          <div className="relative inline-flex items-center justify-center mb-8">
            <span className="absolute inset-0 rounded-full bg-blue-500/60 blur-sm animate-[ping_2s_infinite]" />
            <span className="absolute inset-0 rounded-full bg-blue-400/50 blur-sm animate-[pulse_2s_infinite]" />
            <div className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-blue-400/30 backdrop-blur-md shadow-[0_0_20px_rgba(59,130,246,0.6)]">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.9)]" />
              <span className="text-xs font-semibold tracking-wider text-blue-200 uppercase">Web Based Games</span>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-normal tracking-tight leading-[1.05] text-white mb-6" style={{fontFamily:"'PixelGamer', monospace"}}>
            Interactive Games<br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-400 to-purple-500">
              Built for Booth Experiences
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-lg md:text-xl text-gray-300 mt-6 max-w-2xl mx-auto leading-relaxed">
            Web-based interactive games designed for exhibition booths, brand activations, and on-ground engagement.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-20 mb-16">
            <a
              href="#games"
              className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold rounded-xl shadow-[0_0_25px_rgba(249,115,22,0.5)] hover:shadow-[0_0_40px_rgba(249,115,22,0.8)] transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2 justify-center"
            >
              <span className="text-lg">View Our Games</span>
            </a>
            <a
              href="#contact"
              className="w-full sm:w-auto px-8 py-4 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/5 backdrop-blur-md transition-all flex items-center gap-2 justify-center"
            >
              Contact Us
            </a>
          </div>

          {/* Game type tags */}
          <div className="flex flex-wrap justify-center gap-3">
            {["Basketball", "Soccer", "Cyber Runner", "Gamification"].map((tag, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="px-4 py-1.5 text-sm rounded-full bg-white/5 border border-white/10 text-gray-300 backdrop-blur-md"
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
