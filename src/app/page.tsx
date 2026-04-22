"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import api from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { CategoryPill } from "@/components/ui/Pill";
import { EventCard } from "@/components/events/EventCard";

export default function Homepage() {
  const [events, setEvents] = useState<any[]>([]);
  const [featured, setFeatured] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("public-free");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, featuredRes] = await Promise.allSettled([
          api.get("/events?limit=9"),
          api.get("/events/featured"),
        ]);
        if (eventsRes.status === "fulfilled") setEvents(eventsRes.value.data.items ?? []);
        if (featuredRes.status === "fulfilled") setFeatured(featuredRes.value.data);
      } catch {
        // silently handle
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filterMap: Record<string, (e: any) => boolean> = {
    "public-free":  (e) => e.visibility?.toLowerCase() === "public" && (e.fee === 0 || e.feeCents === 0 || (!e.fee && !e.feeCents)),
    "public-paid":  (e) => e.visibility?.toLowerCase() === "public" && (e.fee > 0 || e.feeCents > 0),
    "private-free": (e) => e.visibility?.toLowerCase() === "private" && (e.fee === 0 || e.feeCents === 0 || (!e.fee && !e.feeCents)),
    "private-paid": (e) => e.visibility?.toLowerCase() === "private" && (e.fee > 0 || e.feeCents > 0),
  };

  const filtered = events.filter(filterMap[activeFilter] ?? filterMap["public-free"]);

  if (loading) return (
    <div className="flex-1 flex items-center justify-center bg-surface">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="text-2xl font-headline font-bold text-on-surface">Planora</div>
        <div className="text-sm text-secondary">Loading community…</div>
      </div>
    </div>
  );

  // Find the nearest upcoming event (dynamic hero)
  const now = new Date();
  const futureEvents = events
    .filter(e => new Date(e.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const heroEvent = futureEvents[0] || events[0];
  
  // Normalize fee display
  const heroFee = heroEvent?.fee ?? (heroEvent?.feeCents ? heroEvent.feeCents / 100 : 0);

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-16 md:py-24 space-y-32">
      
      {/* ── HERO SECTION ───────────────────────────────────── */}
      {heroEvent && (
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-surface-container-lowest rounded-xl border border-outline-variant/20 overflow-hidden ambient-shadow">
          <div className="md:col-span-5 h-[400px] md:h-full relative overflow-hidden bg-surface-container-high">
            {heroEvent.coverImage ? (
              <Image 
                src={heroEvent.coverImage} 
                alt={heroEvent.title}
                fill
                priority
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-4xl font-headline font-bold text-secondary opacity-20 capitalize">
                {heroEvent.title[0]}
              </div>
            )}
          </div>
          <div className="md:col-span-7 p-8 md:p-16 flex flex-col justify-center items-start">
            <CategoryPill type={heroEvent.visibility} fee={heroFee} />
            <h1 className="font-headline text-5xl md:text-6xl font-semibold tracking-[-0.04em] leading-[1.1] my-6 text-on-surface">
              {heroEvent.title}
            </h1>
            <div className="flex items-center gap-2 text-secondary mb-6 font-headline font-semibold text-lg tracking-[-0.02em]">
              <span className="material-symbols-outlined text-[20px]">calendar_today</span>
              {new Date(heroEvent.date).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
            <p className="text-on-surface-variant text-lg leading-[1.6] mb-10 max-w-xl line-clamp-3">
              {heroEvent.description || "Join us for an evening of shared learning and collective building. Bring your current project, meet fellow creators, and collaborate in an inspiring environment."}
            </p>
            <Link href={`/events/${heroEvent.id}`}>
              <Button size="lg" icon="arrow_forward">Join event</Button>
            </Link>
          </div>
        </section>
      )}

      {/* ── UPCOMING EVENTS SLIDER ─────────────────────────── */}
      <section>
        <div className="flex justify-between items-end mb-10">
          <h2 className="font-headline text-4xl font-semibold tracking-[-0.03em] text-on-surface">Upcoming events</h2>
          <Link href="/events" className="text-accent font-semibold hover:underline decoration-accent underline-offset-4 flex items-center gap-1 group">
            See all <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Link>
        </div>
        
        {events.length > 0 ? (
          <div className="flex overflow-x-auto hide-scrollbar gap-6 pb-8 snap-x snap-mandatory -mx-4 px-4 md:-mx-8 md:px-8">
            {events.map((e) => (
              <EventCard key={e.id} event={e} variant="slider" />
            ))}
          </div>
        ) : (
          <div className="bg-surface-container-low/30 rounded-xl border border-dashed border-outline-variant/30 py-20 text-center text-secondary">
            No upcoming events yet. Check back later!
          </div>
        )}
      </section>

      {/* ── CATEGORY FILTER & GRID ────────────────────────── */}
      <section>
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-outline-variant/30 mb-10">
          <nav className="flex gap-8 overflow-x-auto hide-scrollbar">
            {[
              { key: "public-free",  label: "Public Free" },
              { key: "public-paid",  label: "Public Paid" },
              { key: "private-free", label: "Private Free" },
              { key: "private-paid", label: "Private Paid" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className={`pb-4 font-headline font-semibold tracking-[-0.02em] whitespace-nowrap transition-all border-b-2 
                  ${activeFilter === tab.key ? "text-accent border-accent" : "text-secondary border-transparent hover:text-on-surface"}`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.slice(0, 6).map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        ) : (
          <div className="bg-surface-container-low/30 rounded-xl py-20 text-center text-secondary">
            No events found in this category.
          </div>
        )}

        {filtered.length > 6 && (
          <div className="mt-12 text-center">
            <Link href="/events">
              <Button variant="outline">Load more</Button>
            </Link>
          </div>
        )}
      </section>

      {/* ── CTA SECTION ───────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Link href="/dashboard" className="bg-surface-container border border-outline-variant/20 rounded-xl p-10 md:p-16 hover:border-accent transition-all group flex flex-col items-start cursor-pointer">
          <span className="material-symbols-outlined text-[48px] text-accent mb-6 group-hover:scale-110 transition-transform">add_circle</span>
          <h3 className="font-headline text-3xl font-semibold tracking-[-0.03em] text-on-surface mb-4">Host your own event</h3>
          <p className="text-secondary mb-8 leading-relaxed max-w-sm">Bring your community together. Create and manage your events with our simple tools.</p>
          <span className="mt-auto text-accent font-semibold flex items-center gap-1 group-hover:underline underline-offset-4">
            Get started <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </span>
        </Link>

        <Link href="/events" className="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-10 md:p-16 hover:border-accent transition-all group flex flex-col items-start cursor-pointer ambient-shadow">
          <span className="material-symbols-outlined text-[48px] text-accent mb-6 group-hover:scale-110 transition-transform">search</span>
          <h3 className="font-headline text-3xl font-semibold tracking-[-0.03em] text-on-surface mb-4">Find something to do</h3>
          <p className="text-secondary mb-8 leading-relaxed max-w-sm">Discover what's happening around you this week and meet people who share your interests.</p>
          <span className="mt-auto text-accent font-semibold flex items-center gap-1 group-hover:underline underline-offset-4">
            Explore events <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </span>
        </Link>
      </section>

    </div>
  );
}
