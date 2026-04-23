"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ContactPage() {
  return (
    <main className="max-w-[1440px] mx-auto px-4 md:px-8 py-24">
      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 overflow-hidden grid grid-cols-1 lg:grid-cols-2 ambient-shadow">
        <div className="p-12 md:p-20 flex flex-col justify-center space-y-10">
          <div>
             <h3 className="text-primary font-bold uppercase tracking-[0.2em] text-xs mb-4">Support</h3>
             <h1 className="font-headline text-5xl md:text-6xl font-semibold tracking-[-0.04em] text-on-surface">Get in touch</h1>
          </div>
          
          <p className="text-secondary text-lg leading-relaxed max-w-md">
            Have a question about an event? Or maybe you're interested in partnership? Drop us a line and our team will get back to you within 24 hours.
          </p>

          <div className="space-y-6">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                   <span className="material-symbols-outlined">mail</span>
                </div>
                <div>
                   <p className="text-xs font-bold text-secondary uppercase tracking-widest leading-none mb-1">Email us</p>
                   <p className="text-on-surface font-semibold">hello@planora.com</p>
                </div>
             </div>
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                   <span className="material-symbols-outlined">location_on</span>
                </div>
                <div>
                   <p className="text-xs font-bold text-secondary uppercase tracking-widest leading-none mb-1">Our Studio</p>
                   <p className="text-on-surface font-semibold">Emerald Valley, Digital Plaza</p>
                </div>
             </div>
          </div>
        </div>

        <div className="bg-surface-container p-12 md:p-20">
          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input label="First Name" placeholder="John" required />
                <Input label="Last Name" placeholder="Doe" required />
             </div>
             <Input label="Email Address" type="email" placeholder="john@example.com" required />
             <div className="space-y-2">
                <label className="text-sm font-semibold text-on-surface-variant px-1">Message</label>
                <textarea 
                   rows={5}
                   className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-all"
                   placeholder="How can we help?"
                ></textarea>
             </div>
             <Button size="lg" className="w-full" variant="primary">Send Message</Button>
          </form>
        </div>
      </div>
    </main>
  );
}
