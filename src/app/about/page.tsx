import React from "react";
import { SectionTitle } from "@/components/ui/SectionTitle";

export default function AboutPage() {
  return (
    <main className="max-w-[1440px] mx-auto px-4 md:px-8 py-24 space-y-20">
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
