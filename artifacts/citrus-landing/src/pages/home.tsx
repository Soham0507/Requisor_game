import React from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ScrollTicker } from "@/components/ScrollTicker";
import { Games } from "@/components/Games";
import { Stats } from "@/components/Stats";
import { Services } from "@/components/Services";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { CursorGrid } from "@/components/cursor";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-white">
      <CursorGrid />
      <Navbar />
      <main>
        <Hero />
        <ScrollTicker />
        <Stats />
        <Games />
        <Services />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
