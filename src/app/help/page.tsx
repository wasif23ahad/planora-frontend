"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SectionTitle } from "@/components/ui/SectionTitle";

const sections = [
  {
    title: "Getting started",
    icon: "rocket_launch",
    items: [
      { q: "How do I create an account?", a: "Click Sign Up in the navbar, fill in your name, email, and password, or sign in with Google. You'll land on your dashboard immediately." },
      { q: "How do I reset my password?", a: "On the login page, click Forgot under the password field. We'll email you a reset link valid for 30 minutes. (Coming soon — for now, contact support.)" },
      { q: "Can I delete my account?", a: "Yes. Go to Dashboard → Settings and use the Delete account button at the bottom. Deletions are immediate and irreversible." },
    ],
  },
  {
    title: "Hosting events",
    icon: "event_note",
    items: [
      { q: "How much does hosting cost?", a: "Free events are entirely free to publish. For paid events, a small per-ticket fee is taken at checkout via SSLCommerz." },
      { q: "How do I change visibility from public to private?", a: "Open the event in your dashboard, click Edit, and switch the Visibility toggle. Private events stop appearing in public listings instantly." },
      { q: "Can I cancel an event?", a: "If no one has paid yet, yes — Edit → Delete. If there are paid participants, contact support; refunds need to be coordinated." },
    ],
  },
  {
    title: "Joining & paying",
    icon: "confirmation_number",
    items: [
      { q: "Why does my join request say PENDING?", a: "Some events require host approval before you're confirmed. The host sees your request in their dashboard and approves or rejects it." },
      { q: "How do refunds work?", a: "Refunds are at the host's discretion. Reach the host via the event page; if needed our support team can mediate." },
      { q: "I paid but my status is still PENDING", a: "Allow up to 5 minutes for the SSLCommerz callback to land. If it persists, contact support with your transaction ID." },
    ],
  },
  {
    title: "Account & security",
    icon: "shield",
    items: [
      { q: "Is my payment info stored on Planora?", a: "No. Card details go directly to SSLCommerz. We only store transaction IDs and amounts for your records." },
      { q: "How do I change my email address?", a: "Email changes go through support to prevent account takeover. Contact us with the new address from the current one." },
      { q: "What data does Planora collect?", a: "See our Privacy section in /legal for the full list. Short version: name, email, phone (if given), events you host or join, and reviews you write." },
    ],
  },
];

export default function HelpPage() {
  const [open, setOpen] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = sections.map(s => ({
    ...s,
    items: s.items.filter(i =>
      !search.trim() ||
      i.q.toLowerCase().includes(search.toLowerCase()) ||
      i.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(s => s.items.length > 0);

  return (
    <main className="max-w-[1200px] mx-auto px-4 md:px-8 py-24 space-y-12">
      <header className="max-w-2xl">
        <SectionTitle subtitle="Help center">How can we help?</SectionTitle>
        <p className="text-on-surface-variant text-lg leading-relaxed mt-6">
          Search the most common questions, or reach the team directly through <Link href="/contact" className="text-primary underline underline-offset-4">Contact</Link>.
        </p>
        <div className="mt-8 relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-secondary text-[20px]">search</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search help articles…"
            className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg pl-12 pr-4 py-3 text-sm focus:border-primary outline-none ambient-shadow"
          />
        </div>
      </header>

      {filtered.length === 0 ? (
        <div className="bg-surface-container-low border border-dashed border-outline-variant rounded-xl py-16 text-center text-secondary font-headline">
          Nothing matched. Try a shorter query.
        </div>
      ) : (
        <div className="space-y-12">
          {filtered.map(section => (
            <section key={section.title}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">{section.icon}</span>
                </div>
                <h2 className="font-headline text-2xl font-semibold tracking-tighter text-on-surface">{section.title}</h2>
              </div>
              <div className="space-y-3">
                {section.items.map((it, i) => {
                  const id = `${section.title}-${i}`;
                  const isOpen = open === id;
                  return (
                    <div key={id} className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden transition-all duration-300">
                      <button
                        onClick={() => setOpen(isOpen ? null : id)}
                        className="w-full p-5 flex items-center justify-between text-left group"
                      >
                        <span className={`font-semibold transition-colors ${isOpen ? 'text-primary' : 'text-on-surface'}`}>{it.q}</span>
                        <span className={`material-symbols-outlined text-secondary transition-transform duration-300 ${isOpen ? "rotate-45 text-primary" : ""}`}>add</span>
                      </button>
                      <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="px-5 pb-5 text-secondary text-sm leading-relaxed border-t border-outline-variant/30 pt-4">
                          {it.a}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      <section className="bg-primary text-on-primary rounded-xl p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mt-12 ambient-shadow">
        <div>
          <h3 className="font-headline text-2xl font-semibold tracking-tighter">Still stuck?</h3>
          <p className="opacity-90 mt-2 max-w-md text-sm leading-relaxed">If you couldn't find what you needed above, our team usually replies within a business day.</p>
        </div>
        <Link href="/contact" className="bg-white text-primary font-bold uppercase tracking-wider text-[11px] px-6 py-3.5 rounded-lg hover:shadow-xl hover:scale-105 transition-all">
          Contact support
        </Link>
      </section>
    </main>
  );
}
