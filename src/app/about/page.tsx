import React from "react";
import { SectionTitle } from "@/components/ui/SectionTitle";

export default function AboutPage() {
  return (
    <main className="max-w-[1440px] mx-auto px-4 md:px-8 py-24 space-y-24">
      {/* ── MISSION ───────────────────────────────────────── */}
      <header className="max-w-3xl">
        <SectionTitle subtitle="The Planora Story">
          Bridging Communities
        </SectionTitle>
        <p className="text-xl text-on-surface-variant leading-relaxed mt-8">
          Planora was born from a simple mission: to make community building effortless. 
          We believe that every great idea deserves a platform, and every gathering should 
          be as seamless for the host as it is inspiring for the attendee.
        </p>
      </header>

      {/* ── CEO VISION ────────────────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-10 order-2 lg:order-1">
           <div className="space-y-2">
              <h3 className="text-primary font-bold uppercase tracking-[0.2em] text-xs">Our Leadership</h3>
              <h2 className="font-headline text-5xl font-semibold text-on-surface tracking-[-0.04em]">Wasif Ahad</h2>
              <p className="text-secondary font-medium tracking-wide italic">CEO & Visionary Founder</p>
           </div>
           
           <div className="space-y-6">
              <p className="text-xl text-on-surface-variant leading-relaxed font-light">
                "As a young Tech Developer, my mission has always been about more than just code. 
                I believe in turning business better—engineering solutions that aren't just 
                functional, but transformative."
              </p>
              <div className="h-0.5 w-12 bg-primary/30"></div>
              <p className="text-secondary leading-loose">
                Under Wasif's leadership, Planora has evolved from a technical concept into 
                a community-centric powerhouse. His vision bridges the gap between complex 
                infrastructure and human-centered design, ensuring that every tool we build 
                serves the person using it first.
              </p>
           </div>
        </div>
        
        <div className="order-1 lg:order-2 lg:ml-auto lg:translate-x-12 translate-y-2">
           <div className="relative group">
              <div className="absolute -inset-4 bg-primary/5 rounded-3xl blur-2xl group-hover:bg-primary/10 transition-all duration-500"></div>
              <div className="relative bg-linear-to-br from-primary/20 via-surface-container to-surface-container-lowest aspect-square rounded-3xl overflow-hidden shadow-2xl border border-outline-variant/30 ambient-shadow flex items-end justify-center">
                 <img 
                    src="/ceo-profile.jpg" 
                    alt="Wasif Ahad - Planora CEO" 
                    className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700 hover:scale-105"
                 />
              </div>
           </div>
        </div>
      </section>

      {/* ── PHILOSOPHY ────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <h2 className="font-headline text-3xl font-semibold text-on-surface">Our Philosophy</h2>
          <p className="text-secondary leading-loose">
            In a digital world, physical and meaningful gatherings are more important than ever. 
            Planora provides the infrastructure for creators, organizers, and communities to 
            connect, manage fees, and share experiences without the technical friction.
          </p>
          <div className="grid grid-cols-2 gap-8 pt-4">
             <div className="space-y-2">
                <span className="text-4xl font-headline font-bold text-primary">100%</span>
                <p className="text-xs font-bold text-secondary uppercase tracking-widest">Community Focused</p>
             </div>
             <div className="space-y-2">
                <span className="text-4xl font-headline font-bold text-primary">0%</span>
                <p className="text-xs font-bold text-secondary uppercase tracking-widest">Technical Friction</p>
             </div>
          </div>
        </div>
        <div className="bg-surface-container aspect-square rounded-3xl overflow-hidden relative ambient-shadow border border-outline-variant/30 flex items-center justify-center text-8xl opacity-10">
           <span className="material-symbols-outlined text-[120px]">groups</span>
        </div>
      </div>
    </main>
  );
}
