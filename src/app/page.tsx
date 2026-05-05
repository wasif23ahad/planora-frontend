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
          api.get("/events?limit=9&upcoming=true"),
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

  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  if (loading) return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-16 md:py-24 space-y-32">
      {/* Hero skeleton */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden ambient-shadow min-h-[60vh] max-h-[70vh]">
        <div className="md:col-span-5 h-[400px] md:h-[500px] bg-surface-container-low animate-pulse" />
        <div className="md:col-span-7 p-8 md:p-16 space-y-6">
          <div className="h-6 w-32 bg-surface-container-low animate-pulse rounded-full" />
          <div className="h-14 w-3/4 bg-surface-container-low animate-pulse rounded-lg" />
          <div className="h-4 w-2/3 bg-surface-container-low animate-pulse rounded" />
          <div className="h-12 w-40 bg-surface-container-low animate-pulse rounded-lg mt-6" />
        </div>
      </section>

      {/* Stats skeleton */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-surface-container-low animate-pulse rounded-xl" />
        ))}
      </section>

      {/* Card grid skeleton */}
      <section>
        <div className="h-9 w-64 bg-surface-container-low animate-pulse rounded mb-10" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-[400px] bg-surface-container-low animate-pulse rounded-xl" />
          ))}
        </div>
      </section>
    </div>
  );

  // ... rest of logic ...
  const now = new Date();
  const futureEvents = events
    .filter(e => new Date(e.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const heroEvent = featured || futureEvents[0] || events[0];
  const heroFee = heroEvent?.feeCents ? heroEvent.feeCents / 100 : (heroEvent?.fee ?? 0);

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-16 md:py-24 space-y-32">
      
      {/* ── 01: HERO SECTION ───────────────────────────────────── */}
      {heroEvent && (
        <section className="min-h-[60vh] max-h-[70vh] grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden ambient-shadow">
          <div className="md:col-span-5 h-full relative overflow-hidden bg-surface-container-high">
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

      {/* ── 02: STATS STRIP ────────────────────────────────────── */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Active events", value: events.length },
          { label: "Hosts", value: new Set(events.map(e => e.owner?.name).filter(Boolean)).size },
          { label: "Cities", value: new Set(events.map(e => (e.venue || "").split(",").pop()?.trim()).filter(Boolean)).size },
          { label: "Categories", value: new Set(events.map(e => e.category).filter(Boolean)).size },
        ].map((s, i) => (
          <div key={i} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 ambient-shadow">
            <div className="font-headline font-bold text-3xl tabular-nums text-on-surface">{s.value}</div>
            <div className="text-[10px] font-bold text-secondary uppercase tracking-widest mt-1">{s.label}</div>
          </div>
        ))}
      </section>

      {/* ── 03: CATEGORIES GRID ────────────────────────────────── */}
      <section>
        <h2 className="font-headline text-3xl md:text-4xl font-semibold tracking-tighter text-on-surface mb-8">Browse by category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: "Technology", icon: "computer" },
            { label: "Coding",     icon: "terminal" },
            { label: "Networking", icon: "groups" },
            { label: "Food",       icon: "restaurant" },
            { label: "Arts",       icon: "palette" },
            { label: "Sports",     icon: "sports_soccer" },
          ].map(c => (
            <Link
              key={c.label}
              href={`/events?category=${encodeURIComponent(c.label)}`}
              className="group bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col items-center gap-3 hover:border-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[32px] text-primary group-hover:scale-110 transition-transform">{c.icon}</span>
              <span className="text-sm font-headline font-semibold text-on-surface">{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 04: UPCOMING EVENTS SLIDER ─────────────────────────── */}
      <section>
        <div className="flex justify-between items-end mb-10">
          <h2 className="font-headline text-4xl font-semibold tracking-[-0.03em] text-on-surface">Upcoming events</h2>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex gap-2">
              <button 
                onClick={() => scroll("left")}
                className="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center hover:bg-surface-container transition-colors text-secondary hover:text-on-surface"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button 
                onClick={() => scroll("right")}
                className="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center hover:bg-surface-container transition-colors text-secondary hover:text-on-surface"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
            <Link href="/events" className="text-accent font-semibold hover:underline decoration-accent underline-offset-4 flex items-center gap-1 group">
              See all <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>
        </div>
        
        {events.length > 0 ? (
          <div className="relative group/slider">
            <div 
              ref={scrollRef}
              className="flex overflow-x-auto hide-scrollbar gap-6 pb-8 snap-x snap-mandatory -mx-4 px-4 md:-mx-8 md:px-8"
            >
              {events.map((e) => (
                <EventCard key={e.id} event={e} variant="slider" />
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-surface-container-low/30 rounded-xl border border-dashed border-outline-variant/30 py-20 text-center text-secondary">
            No upcoming events yet. Check back later!
          </div>
        )}
      </section>

      {/* ── 05: HOW IT WORKS ───────────────────────────────────── */}
      <section>
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-headline text-3xl md:text-4xl font-semibold tracking-tighter text-on-surface">How Planora works</h2>
          <p className="text-secondary mt-3">Three steps from idea to packed room.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: "01", title: "Discover", body: "Browse events by category, city, or vibe. Filter by free or paid, public or private.", icon: "search" },
            { step: "02", title: "Join",     body: "RSVP free events instantly or pay securely with SSLCommerz for ticketed ones.", icon: "confirmation_number" },
            { step: "03", title: "Show up",  body: "Get a digital ticket, leave a review afterwards, and follow hosts you love.", icon: "celebration" },
          ].map(s => (
            <div key={s.step} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 flex flex-col gap-4 ambient-shadow">
              <div className="flex items-center justify-between">
                <span className="material-symbols-outlined text-[28px] text-primary">{s.icon}</span>
                <span className="font-headline font-bold text-secondary text-sm">{s.step}</span>
              </div>
              <h3 className="font-headline font-semibold text-xl text-on-surface">{s.title}</h3>
              <p className="text-secondary text-sm leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 06: CATEGORY FILTER & GRID ────────────────────────── */}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.slice(0, 8).map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        ) : (
          <div className="bg-surface-container-low/30 rounded-xl py-20 text-center text-secondary">
            No events found in this category.
          </div>
        )}

        {filtered.length > 8 && (
          <div className="mt-12 text-center">
            <Link href="/events">
              <Button variant="outline">Load more</Button>
            </Link>
          </div>
        )}
      </section>

      {/* ── 07: TESTIMONIALS ───────────────────────────────────── */}
      <section>
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-headline text-3xl md:text-4xl font-semibold tracking-tighter text-on-surface">What people say</h2>
          <p className="text-secondary mt-3">From hosts and attendees who use Planora every week.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { quote: "I ran my first 50-person hackathon in two weekends. Ticketing, invites, reminders — handled.", name: "Tasnim R.", role: "Hackathon organizer" },
            { quote: "Found a photography walk in Old Dhaka that I never would have discovered otherwise. The category filters are genuinely useful.", name: "Arif H.", role: "Attendee" },
            { quote: "Private dinners with controlled invitations were what we needed. The RSVP approval flow is exactly right.", name: "Maya K.", role: "Founder, Supper Club" },
          ].map((t, i) => (
            <figure key={i} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 flex flex-col gap-4 ambient-shadow">
              <span className="material-symbols-outlined text-accent text-[28px]">format_quote</span>
              <blockquote className="text-on-surface leading-relaxed text-sm">{t.quote}</blockquote>
              <figcaption className="mt-auto pt-3 border-t border-outline-variant">
                <div className="text-sm font-semibold text-on-surface">{t.name}</div>
                <div className="text-xs text-secondary">{t.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ── 08: FAQ ────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-4">
          <h2 className="font-headline text-3xl md:text-4xl font-semibold tracking-tighter text-on-surface">Frequently asked</h2>
          <p className="text-secondary mt-3">If yours isn't here, ask us in <Link href="/contact" className="text-primary underline underline-offset-4">Contact</Link>.</p>
        </div>
        <div className="md:col-span-8 flex flex-col gap-3">
          {[
            { q: "Is Planora free to use?", a: "Yes for attendees. Hosts pay nothing to list events; we earn a small fee on paid ticket sales handled through SSLCommerz." },
            { q: "How do private events work?", a: "A private event is invite-only. Hosts send email invitations from the event's manage page. Invitees see the event in their dashboard and can accept, decline, or pay if it's a paid event." },
            { q: "Can I cancel a paid ticket?", a: "Refunds are at the host's discretion. Reach out to the host via the event page; if needed our support team can mediate." },
            { q: "Do you support multiple cities?", a: "Yes. Events list a venue with a city; the explore page lets you filter by it. We're focused on Dhaka but accept events anywhere." },
            { q: "Can I host without paying?", a: "Free events cost nothing to publish. There's no monthly subscription — only the per-ticket fee on paid events." },
          ].map((f, i) => (
            <details key={i} className="group bg-surface-container-lowest border border-outline-variant rounded-xl p-5 hover:border-primary/40 transition-colors">
              <summary className="cursor-pointer flex items-center justify-between font-semibold text-on-surface list-none">
                <span>{f.q}</span>
                <span className="material-symbols-outlined text-secondary group-open:rotate-45 transition-transform">add</span>
              </summary>
              <p className="mt-3 text-secondary text-sm leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── 09: NEWSLETTER ─────────────────────────────────────── */}
      <section className="bg-primary text-on-primary rounded-xl p-10 md:p-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h3 className="font-headline text-3xl font-semibold tracking-tighter">Get the weekly drop</h3>
          <p className="opacity-90 mt-2 max-w-md">A short email every Friday with the best events of the week. No spam.</p>
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); alert("Subscribed (demo)."); }}
          className="flex gap-2 w-full md:w-auto md:min-w-[420px]"
        >
          <input
            type="email"
            required
            placeholder="you@example.com"
            className="flex-1 bg-white/10 border border-white/30 placeholder:text-on-primary/60 text-on-primary rounded-lg px-4 py-3 text-sm focus:bg-white/15 outline-none transition-colors"
          />
          <button type="submit" className="bg-on-primary text-primary font-semibold uppercase tracking-wider text-xs px-5 py-3 rounded-lg hover:opacity-90 transition-opacity">
            Subscribe
          </button>
        </form>
      </section>

      {/* ── 10: CTA SECTION ───────────────────────────────────── */}
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
