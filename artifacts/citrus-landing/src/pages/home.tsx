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
import { Team } from "@/components/Team";
import { CyberCaseStudy } from "@/components/Cyber";
import { ProfileCard } from "@/components/ProfileCard";
import { RSAC } from "@/components/RSAC";
export default function Home() {
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
