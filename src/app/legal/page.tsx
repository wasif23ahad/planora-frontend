import React from "react";
import { SectionTitle } from "@/components/ui/SectionTitle";

export default function LegalPage() {
  return (
    <main className="max-w-[1440px] mx-auto px-4 md:px-8 py-24 space-y-20">
      <header className="max-w-2xl">
        <SectionTitle subtitle="Legal Framework">
          Terms & Privacy
        </SectionTitle>
        <p className="text-secondary mt-8">
          Last updated: April 20, 2026
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
        <aside className="md:col-span-3 hidden md:block">
           <nav className="sticky top-32 space-y-4">
              <a href="#terms" className="block text-primary font-bold uppercase tracking-widest text-xs">Terms of Service</a>
              <a href="#privacy" className="block text-secondary hover:text-on-surface transition-colors uppercase tracking-widest text-xs">Privacy Policy</a>
              <a href="#payment" className="block text-secondary hover:text-on-surface transition-colors uppercase tracking-widest text-xs">Payment Terms</a>
           </nav>
        </aside>

        <div className="md:col-span-9 space-y-24">
           {/* Section 1 */}
           <section id="terms" className="space-y-8">
              <h2 className="font-headline text-3xl font-semibold text-on-surface">Terms of Service</h2>
              <div className="prose prose-stone dark:prose-invert max-w-none space-y-4 text-secondary leading-relaxed">
                 <p>By using Planora, you agree to abide by our community guidelines and respect the intellectual property of event hosts.</p>
                 <h4 className="text-on-surface font-semibold pt-4">User Conduct</h4>
                 <p>Users must provide accurate information when creating or registering for events. Harassment or discriminatory behavior at events hosted on Planora will result in immediate account termination.</p>
                 <h4 className="text-on-surface font-semibold pt-4">Host Responsibilities</h4>
                 <p>Hosts are responsible for the physical safety of their events and the accuracy of their event descriptions.</p>
              </div>
           </section>

           <hr className="border-outline-variant/30" />

           {/* Section 2 */}
           <section id="privacy" className="space-y-8">
              <h2 className="font-headline text-3xl font-semibold text-on-surface">Privacy Policy</h2>
              <div className="prose prose-stone dark:prose-invert max-w-none space-y-4 text-secondary leading-relaxed">
                 <p>Our Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from Planora.</p>
                 <h4 className="text-on-surface font-semibold pt-4">Data Collection</h4>
                 <p>We collect essential information like your name and email to process event tickets. We do not store credit card information on our servers; all payments are processed through Stripe.</p>
              </div>
           </section>
        </div>
      </div>
    </main>
  );
}
