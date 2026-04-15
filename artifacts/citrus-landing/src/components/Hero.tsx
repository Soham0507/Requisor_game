import React from "react";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 opacity-50" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-secondary/15 rounded-full blur-[150px] translate-x-1/3 translate-y-1/3 opacity-50" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl"
        >
          <div className="relative inline-flex items-center justify-center mb-8">

            {/* OUTER FLOW (animated aura) */}
            <span className="absolute inset-0 rounded-full 
              bg-blue-500/30 blur-xl 
              animate-[ping_2.5s_infinite]" />

            {/* SECOND LAYER (slower softer glow) */}
            <span className="absolute inset-0 rounded-full 
              bg-blue-400/20 blur-2xl 
              animate-[pulse_3s_infinite]" />

            {/* MAIN BADGE */}
            <div className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full 
              bg-white/5 border border-blue-400/30 backdrop-blur-md
              shadow-[0_0_20px_rgba(59,130,246,0.6)]">

              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse 
                shadow-[0_0_10px_rgba(59,130,246,0.9)]" />

              <span className="text-xs font-semibold tracking-wider text-blue-200 uppercase">
                Web Based Games
              </span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.1] text-white mb-6">
            We Build <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#ff3b00]">Interactive Games</span> & Experiences
          </h1>
          
          <p className="text-lg md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Engaging, scalable, and built for brands, apps, and campaigns.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#games"
              className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(255,115,0,0.3)] hover:shadow-[0_0_30px_rgba(255,115,0,0.5)] transform hover:-translate-y-1"
            >
              View Our Games
            </a>
            <a
              href="#contact"
              className="w-full sm:w-auto px-8 py-4 bg-transparent text-white border border-white/20 font-semibold rounded-lg hover:bg-white/5 transition-all backdrop-blur-sm"
            >
              Contact Us
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
