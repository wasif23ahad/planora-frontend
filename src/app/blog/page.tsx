import React from "react";
import Link from "next/link";
import { SectionTitle } from "@/components/ui/SectionTitle";

const posts = [
  {
    slug: "hosting-your-first-event",
    title: "Hosting your first event on Planora",
    summary: "From idea to a published event page in under 10 minutes — including how to choose between public and private visibility.",
    date: "2026-04-22",
    minutes: 5,
    tag: "Guide",
  },
  {
    slug: "moderation-playbook",
    title: "How we moderate paid events",
    summary: "What our managers look for, what gets pulled, and how to flag a problem if you spot one.",
    date: "2026-04-08",
    minutes: 4,
    tag: "Trust & Safety",
  },
  {
    slug: "private-vs-public",
    title: "Private vs public — what's the right call?",
    summary: "Three rules of thumb for picking visibility, and what we've seen work for community-led gatherings.",
    date: "2026-03-29",
    minutes: 3,
    tag: "Playbook",
  },
  {
    slug: "ssl-commerz-flow",
    title: "What happens when someone pays for your ticket",
    summary: "An end-to-end walkthrough of the SSLCommerz checkout, from redirect to ticket issuance.",
    date: "2026-03-15",
    minutes: 6,
    tag: "Engineering",
  },
];

export default function BlogPage() {
  return (
    <main className="max-w-[1200px] mx-auto px-4 md:px-8 py-24 space-y-12">
      <header className="max-w-2xl">
        <SectionTitle subtitle="The Planora blog">Notes from the team</SectionTitle>
        <p className="text-on-surface-variant text-lg leading-relaxed mt-6">
          Short reads on hosting, attending, and building Planora. New posts roughly every two weeks.
        </p>
      </header>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/blog/${p.slug}`}
              className="group block bg-surface-container-lowest border border-outline-variant rounded-xl p-8 hover:border-primary transition-colors ambient-shadow h-full"
            >
              <div className="flex items-center gap-3 mb-4 text-xs">
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold uppercase tracking-wider">{p.tag}</span>
                <span className="text-secondary">{new Date(p.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                <span className="text-secondary">·</span>
                <span className="text-secondary">{p.minutes} min read</span>
              </div>
              <h2 className="font-headline text-2xl font-semibold tracking-tighter text-on-surface group-hover:text-primary transition-colors">
                {p.title}
              </h2>
              <p className="text-on-surface-variant text-sm leading-relaxed mt-3">{p.summary}</p>
              <div className="mt-6 inline-flex items-center gap-1 text-primary text-sm font-semibold group-hover:gap-2 transition-all">
                Read post <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
