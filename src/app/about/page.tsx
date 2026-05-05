import React from "react";
import { SectionTitle } from "@/components/ui/SectionTitle";

export default function AboutPage() {
  return (
    <main className="max-w-[1440px] mx-auto px-4 md:px-8 py-24 space-y-32">
      {/* ── MISSION ───────────────────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <header>
            <SectionTitle subtitle="The Planora Concept">
              Empowering Connection
            </SectionTitle>
            <h2 className="font-headline text-4xl md:text-5xl font-semibold text-on-surface tracking-[-0.04em] mt-4">
              Where Every Idea Finds its Audience.
            </h2>
          </header>
          <div className="space-y-6 text-lg text-on-surface-variant leading-relaxed">
            <p>
              Planora is more than just an event management tool; it's a bridge between visionaries and participants. 
              Our concept is built on the belief that community is the core of human progress. We've engineered 
              a platform that removes the technical barriers to hosting, allowing organizers to focus on what 
              truly matters: the experience.
            </p>
            <p>
              From tech summits and sports championships to intimate tea garden meetups, Planora provides a 
              unified ecosystem where events are not just scheduled, but discovered and nurtured.
            </p>
          </div>
        </div>
        
        <div className="relative group">
          <div className="absolute -inset-4 bg-primary/5 rounded-3xl blur-2xl group-hover:bg-primary/10 transition-all duration-500"></div>
          <div className="relative bg-surface-container aspect-video rounded-3xl overflow-hidden shadow-2xl border border-outline-variant/30 ambient-shadow">
             <img 
                src="/images/community.png" 
                alt="Community Gathering" 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
             />
          </div>
        </div>
      </section>

      {/* ── COMMUNITY FOCUS ────────────────────────────────── */}
      <section className="bg-surface-container-low rounded-[40px] p-8 md:p-16 border border-outline-variant/10">
        <div className="max-w-4xl mx-auto text-center space-y-16">
          <div className="space-y-6">
            <h3 className="text-primary font-bold uppercase tracking-[0.2em] text-xs">Community Impact</h3>
            <h2 className="font-headline text-4xl md:text-5xl font-semibold text-on-surface tracking-[-0.04em]">
              How Planora Helps the Community
            </h2>
            <p className="text-xl text-secondary leading-loose max-w-2xl mx-auto">
              We believe in the power of localized connection to drive social and professional growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
            <div className="space-y-4">
               <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center">
                  <span className="material-symbols-outlined">diversity_3</span>
               </div>
               <h4 className="font-headline text-2xl font-bold text-on-surface">Democratizing Hosting</h4>
               <p className="text-on-surface-variant leading-relaxed">
                 Planora gives everyone a professional-grade platform. Whether you are an individual hobbyist or a 
                 large organization, you have access to the same high-end tools to manage invitations, ticketing, 
                 and attendee engagement.
               </p>
            </div>

            <div className="space-y-4">
               <div className="w-12 h-12 rounded-xl bg-secondary text-on-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined">verified</span>
               </div>
               <h4 className="font-headline text-2xl font-bold text-on-surface">Safe & Secure Spaces</h4>
               <p className="text-on-surface-variant leading-relaxed">
                 By implementing manual moderation and secure payment gateways (SSLCommerz), we protect the community 
                 from fraudulent events. Every attendee can join with confidence, knowing their participation is 
                 verified and their data is secure.
               </p>
            </div>

            <div className="space-y-4">
               <div className="w-12 h-12 rounded-xl bg-accent text-on-accent flex items-center justify-center">
                  <span className="material-symbols-outlined">local_activity</span>
               </div>
               <h4 className="font-headline text-2xl font-bold text-on-surface">Local Economy Growth</h4>
               <p className="text-on-surface-variant leading-relaxed">
                 We support local businesses and organizers by facilitating BDT transactions. By making it easy 
                 for local events to monetize, we help stimulate the cultural and professional economy across 
                 cities like Dhaka, Sylhet, and Chittagong.
               </p>
            </div>

            <div className="space-y-4">
               <div className="w-12 h-12 rounded-xl bg-on-surface-variant text-surface flex items-center justify-center">
                  <span className="material-symbols-outlined">hub</span>
               </div>
               <h4 className="font-headline text-2xl font-bold text-on-surface">Unified Discovery</h4>
               <p className="text-on-surface-variant leading-relaxed">
                 Instead of fragmented social media posts, Planora provides a central hub. This makes it easier 
                 for people to find meetups that align with their interests, fostering stronger social bonds 
                 and professional networks.
               </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CORE PHILOSOPHY ──────────────────────────────── */}
      <section className="max-w-4xl mx-auto text-center space-y-12 pb-12">
        <div className="space-y-8">
          <h2 className="font-headline text-4xl md:text-5xl font-semibold text-on-surface tracking-[-0.04em]">What is Planora?</h2>
          <p className="text-xl text-secondary leading-loose max-w-2xl mx-auto">
            A premium event management ecosystem built for the modern organizer.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-8">
            <div className="flex flex-col items-center gap-4 text-center">
               <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 ambient-shadow border border-primary/5">
                  <span className="material-symbols-outlined text-[32px]">public</span>
               </div>
               <div>
                  <h4 className="font-headline font-bold text-on-surface text-lg mb-2">Global Discovery</h4>
                  <p className="text-sm text-secondary leading-relaxed">A marketplace for public events where anyone can discover community gatherings.</p>
               </div>
            </div>
            
            <div className="flex flex-col items-center gap-4 text-center">
               <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 ambient-shadow border border-primary/5">
                  <span className="material-symbols-outlined text-[32px]">lock</span>
               </div>
               <div>
                  <h4 className="font-headline font-bold text-on-surface text-lg mb-2">Private Access</h4>
                  <p className="text-sm text-secondary leading-relaxed">Exclusive events with a 'Request to Join' workflow for full guest list control.</p>
               </div>
            </div>

            <div className="flex flex-col items-center gap-4 text-center">
               <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 ambient-shadow border border-primary/5">
                  <span className="material-symbols-outlined text-[32px]">payments</span>
               </div>
               <div>
                  <h4 className="font-headline font-bold text-on-surface text-lg mb-2">Local Payments</h4>
                  <p className="text-sm text-secondary leading-relaxed">Seamless BDT transactions via SSLCommerz supporting bKash and local cards.</p>
               </div>
            </div>
          </div>

          <div className="flex justify-center gap-16 pt-12 border-t border-outline-variant/10">
             <div className="space-y-2">
                <span className="text-4xl font-headline font-bold text-primary">100%</span>
                <p className="text-xs font-bold text-secondary uppercase tracking-widest">Community Focused</p>
             </div>
             <div className="space-y-2">
                <span className="text-4xl font-headline font-bold text-primary">Secure</span>
                <p className="text-xs font-bold text-secondary uppercase tracking-widest">Verified Ticketing</p>
             </div>
          </div>
        </div>
      </section>
    </main>
  );
}
