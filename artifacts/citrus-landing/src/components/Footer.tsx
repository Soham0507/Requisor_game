import React from "react";
import { SiX, SiGithub, SiDribbble, SiInstagram } from "react-icons/si";

export function Footer() {
  return (
    <footer className="bg-background border-t border-white/10 py-12">
      <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-white font-bold text-xl tracking-tight">
        Requisor.AI
        </div>
        
        <div className="text-muted-foreground text-sm">
          © 2026 Requisor.AI . All rights reserved.
        </div>

        <div className="flex items-center gap-4">
          <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-white hover:bg-white/10 transition-all">
            <SiX size={18} />
          </a>
          <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-white hover:bg-white/10 transition-all">
            <SiGithub size={18} />
          </a>
          <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-white hover:bg-white/10 transition-all">
            <SiInstagram size={18} />
          </a>
          <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-white hover:bg-white/10 transition-all">
            <SiDribbble size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}
