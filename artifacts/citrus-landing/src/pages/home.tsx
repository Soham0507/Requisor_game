import React from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Games } from "@/components/Games";
import { Services } from "@/components/Services";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <Games />
        {/* <Services /> */}
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
