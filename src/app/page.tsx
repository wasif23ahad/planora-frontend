"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { CategoryPill } from "@/components/ui/Pill";
import { EventCard } from "@/components/events/EventCard";

export default function Homepage() {
  const [events, setEvents] = useState<any[]>([]);
  const [featured, setFeatured] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("public-free");
  const [sliderIndex, setSliderIndex] = useState(0);

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

  const sliderVisible = 3;
  const maxSlider = Math.max(0, events.length - sliderVisible);

  const filterMap: Record<string, (e: any) => boolean> = {
    "public-free":  (e) => e.visibility === "PUBLIC" && e.feeCents === 0,
    "public-paid":  (e) => e.visibility === "PUBLIC" && e.feeCents > 0,
    "private-free": (e) => e.visibility === "PRIVATE" && e.feeCents === 0,
    "private-paid": (e) => e.visibility === "PRIVATE" && e.feeCents > 0,
  };

  const filtered = events.filter(filterMap[activeFilter] ?? filterMap["public-free"]);

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center text-muted font-medium">
      Loading Planora…
    </div>
  );

  return (
    <div className="bg-background min-h-screen font-sans">

      {/* ── HERO ──────────────────────────────────────────── */}
      {featured ? (
        <section className="max-w-[1200px] mx-auto px-8 pt-24 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div
              className="h-[400px] rounded-[16px] overflow-hidden border border-border-base flex items-center justify-center text-[12px] font-mono text-white opacity-50"
              style={{ backgroundColor: featured.coverImage || "#C7D4E8" }}
            >
              featured event cover image
            </div>
            <div>
              <div className="mb-3">
                <CategoryPill type={featured.visibility} feeCents={featured.feeCents} />
              </div>
              <h1 className="text-[48px] font-bold text-foreground font-tight tracking-[-0.03em] leading-[1.1] mb-4">
                {featured.title}
              </h1>
              <div className="text-[15px] text-muted mb-4 tabular-nums">
                {new Date(featured.date).toLocaleDateString()} · {featured.venue}
              </div>
              <p className="text-[15px] text-muted leading-relaxed mb-8 max-w-[480px]">
                {featured.description}
              </p>
              <div className="flex items-center gap-4">
                <Link href={`/events/${featured.id}`}>
                  <Button variant="primary">Join event</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="max-w-[1200px] mx-auto px-8 pt-24 pb-20 text-center">
          <h1 className="text-[48px] font-bold text-foreground font-tight tracking-[-0.03em] mb-4">
            Create, discover & join events
          </h1>
          <p className="text-[16px] text-muted mb-8 max-w-[500px] mx-auto">
            Planora brings people together through public and private events. Find your next experience.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/events"><Button variant="primary">Browse events</Button></Link>
            <Link href="/register"><Button variant="secondary">Get started free</Button></Link>
          </div>
        </section>
      )}

      {/* ── UPCOMING EVENTS SLIDER ─────────────────────────── */}
      <section className="pb-20">
        <div className="max-w-[1200px] mx-auto px-8 mb-8 flex justify-between items-baseline">
          <h2 className="text-[24px] font-semibold text-foreground tracking-[-0.02em]">Upcoming events</h2>
          <Link href="/events" className="text-[14px] font-medium text-accent hover:underline">See all →</Link>
        </div>

        <div className="max-w-[1200px] mx-auto px-8 relative overflow-hidden">
          {events.length === 0 ? (
            <div className="py-12 text-center text-muted text-[14px]">No events available yet.</div>
          ) : (
            <>
              <div
                className="flex gap-5 transition-transform duration-300 ease-in-out"
                style={{
                  transform: `translateX(-${sliderIndex * (100 / sliderVisible)}%)`,
                  width: `${(events.length / sliderVisible) * 100}%`,
                }}
              >
                {events.map((e) => (
                  <div key={e.id} className="w-full">
                    <EventCard event={e} />
                  </div>
                ))}
              </div>
              <div className="flex gap-2 justify-end mt-5">
                <button
                  onClick={() => setSliderIndex(Math.max(0, sliderIndex - 1))}
                  disabled={sliderIndex === 0}
                  className="w-9 h-9 rounded-lg border border-border-base bg-white flex items-center justify-center text-[16px] disabled:opacity-40 hover:bg-muted/5 cursor-pointer"
                >←</button>
                <button
                  onClick={() => setSliderIndex(Math.min(maxSlider, sliderIndex + 1))}
                  disabled={sliderIndex >= maxSlider}
                  className="w-9 h-9 rounded-lg border border-border-base bg-white flex items-center justify-center text-[16px] disabled:opacity-40 hover:bg-muted/5 cursor-pointer"
                >→</button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── EVENT CATEGORIES ──────────────────────────────── */}
      <section className="max-w-[1200px] mx-auto px-8 pb-20">
        <h2 className="text-[24px] font-semibold text-foreground tracking-[-0.02em] mb-8">Browse by category</h2>
        <div className="flex border-b border-border-base mb-8">
          {[
            { key: "public-free",  label: "Public Free" },
            { key: "public-paid",  label: "Public Paid" },
            { key: "private-free", label: "Private Free" },
            { key: "private-paid", label: "Private Paid" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`px-5 py-2.5 text-[14px] font-medium transition-colors border-b-2 -mb-px
                ${activeFilter === tab.key ? "text-accent border-accent" : "text-muted border-transparent hover:text-foreground"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-muted text-[14px]">No events in this category yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {filtered.slice(0, 6).map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        )}
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="max-w-[1200px] mx-auto px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-10 rounded-[12px] bg-white border border-border-base hover:border-accent transition-colors">
            <h3 className="text-[22px] font-semibold tracking-[-0.02em] text-foreground mb-3">Host your own event</h3>
            <p className="text-[15px] text-muted leading-relaxed mb-7 max-w-[400px]">
              Create a public or private event, set a registration fee, and manage attendees — all in one place.
            </p>
            <Link href="/dashboard"><Button variant="primary">Create an event</Button></Link>
          </div>
          <div className="p-10 rounded-[12px] bg-white border border-border-base hover:border-accent transition-colors">
            <h3 className="text-[22px] font-semibold tracking-[-0.02em] text-foreground mb-3">Find something to do</h3>
            <p className="text-[15px] text-muted leading-relaxed mb-7 max-w-[400px]">
              Browse upcoming events near you — workshops, meetups, classes, and community gatherings.
            </p>
            <Link href="/events"><Button variant="primary">Explore events</Button></Link>
          </div>
        </div>
      </section>

    </div>
  );
}
