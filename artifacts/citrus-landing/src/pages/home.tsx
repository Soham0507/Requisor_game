import React, { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ScrollTicker } from "@/components/ScrollTicker";
import { Games } from "@/components/Games";
import { Stats } from "@/components/Stats";
import { Services } from "@/components/Services";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { CursorGrid } from "@/components/cursor";
import { Team } from "@/components/Team";
import { CyberCaseStudy } from "@/components/Cyber";
import { ProfileCard } from "@/components/ProfileCard";
import { RSAC } from "@/components/RSAC";
export default function Home() {
  // Nav links elsewhere in the app (e.g. from /games) land here as "/#id" —
  // a real page load, so the browser's own anchor-jump races this page's
  // animated sections and images still settling into their final layout,
  // and usually ends up short. Re-issue the scroll a few times as things
  // finish loading instead of a single one-shot attempt.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    const scroll = () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    scroll();
    const timers = [100, 400, 1000].map((ms) => setTimeout(scroll, ms));
    window.addEventListener("load", scroll);
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("load", scroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-white">
      <CursorGrid />
      <Navbar />
      <main>
        <Hero />
        {/* <ScrollTicker /> */}
        {/* <Stats /> */}
        {/* <Games /> */}
        <Services />
        <CyberCaseStudy />
        <RSAC />
        <Team />
        

        {/* <ProfileCard
          name="Javi A. Torres"
          title="Software Engineer"
          handle="javicodes"
          status="Online"
          contactText="Contact Me"
          avatarUrl="/team/soham.png"
          showUserInfo
          enableTilt={true}
          enableMobileTilt
          onContactClick={() => console.log('Contact clicked')}
          behindGlowColor="rgba(125, 190, 255, 0.67)"
          iconUrl="/assets/demo/iconpattern.png"
          behindGlowEnabled
          innerGradient="linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)"
        /> */}
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
