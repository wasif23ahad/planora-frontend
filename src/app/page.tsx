"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { CategoryPill } from "@/components/ui/Pill";
import { EventCard, EventData } from "@/components/events/EventCard";
import api from "@/lib/api";

const filterTabs = [
  { key: "public-free", label: "Public Free" },
  { key: "public-paid", label: "Public Paid" },
  { key: "private-free", label: "Private Free" },
  { key: "private-paid", label: "Private Paid" },
];

export default function Home() {
  const [featured, setFeatured] = useState<EventData | null>(null);
  const [upcoming, setUpcoming] = useState<EventData[]>([]);
  const [activeFilter, setActiveFilter] = useState("public-free");
  const [filteredEvents, setFilteredEvents] = useState<EventData[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [featuredRes, upcomingRes] = await Promise.all([
          api.get("/events/featured"),
          api.get("/events?limit=6"),
        ]);
        setFeatured(featuredRes.data);
        setUpcoming(upcomingRes.data.items);
      } catch (error) {
        console.error("Error fetching homepage data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  useEffect(() => {
    const fetchFilteredData = async () => {
      setFilterLoading(true);
      try {
        const res = await api.get(`/events?category=${activeFilter}&limit=6`);
        setFilteredEvents(res.data.items);
      } catch (error) {
        console.error("Error fetching filtered events:", error);
      } finally {
        setFilterLoading(false);
      }
    };
    fetchFilteredData();
  }, [activeFilter]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-[14px] text-muted font-medium animate-pulse">Loading Planora...</div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pb-24">
      {/* ── HERO ──────────────────────────────────────────── */}
      {featured && (
        <section className="max-w-[1200px] mx-auto px-8 py-24 sm:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-muted/10 border border-border-base flex items-center justify-center relative shadow-sm group">
              {featured.coverImage ? (
                <img
                  src={featured.coverImage}
                  alt={featured.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="text-[12px] font-mono text-muted/30 uppercase tracking-[0.2em]">featured event</div>
              )}
            </div>

            <div className="space-y-6">
              <CategoryPill type={featured.visibility === "PUBLIC" ? "public" : "private"} fee={featured.feeCents} />
              <h1 className="text-[48px] font-bold text-foreground tracking-[-0.03em] leading-[1.05] font-tight max-w-[500px]">
                {featured.title}
              </h1>
              <div className="text-[15px] font-medium text-muted tabular-nums">
                {new Date(featured.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} · {featured.venue}
              </div>
              <p className="text-[15px] text-muted leading-relaxed max-w-[480px]">
                {featured.description.length > 200 ? featured.description.substring(0, 200) + "..." : featured.description}
              </p>
              <div className="flex items-center gap-6 pt-2">
                <Link href={`/events/${featured.id}`}>
                  <Button variant="primary">Join event</Button>
                </Link>
                <span className="text-[13px] text-muted font-semibold italic">Be part of this featured gathering</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── UPCOMING EVENTS ───────────────────────────────── */}
      <section className="max-w-[1200px] mx-auto px-8 py-20 border-t border-border-base mb-16">
        <SectionTitle
          action={
            <Link href="/events" className="text-[14px] text-accent font-bold hover:underline underline-offset-4">
              See all →
            </Link>
          }
        >
          Upcoming events
        </SectionTitle>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcoming.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      {/* ── CATEGORY FILTER ───────────────────────────────── */}
      <section className="max-w-[1200px] mx-auto px-8 py-20 mb-16">
        <SectionTitle>Browse by category</SectionTitle>
        
        {/* Filter Tabs */}
        <div className="flex gap-0 border-b border-border-base mb-10 overflow-x-auto no-scrollbar">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className={`px-6 py-2.5 transition-colors duration-150 text-[14px] font-bold whitespace-nowrap border-b-2 mb-[-2px] ${
                  isActive 
                    ? "text-accent border-accent" 
                    : "text-muted border-transparent hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {filterLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[300px] bg-muted/5 rounded-radius-card border border-border-base" />
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="py-24 text-center bg-muted/5 rounded-2xl border border-dashed border-border-base">
            <p className="text-muted text-[14px] font-medium">No events in this category yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* ── CTA CARDS ─────────────────────────────────────── */}
      <section className="max-w-[1200px] mx-auto px-8 py-10 mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { 
              title: "Host your own event", 
              body: "Create a public or private event, set a registration fee, and manage attendees — all in one place.", 
              cta: "Create an event", 
              href: "/dashboard" 
            },
            { 
              title: "Find something to do", 
              body: "Browse upcoming events near you — workshops, meetups, classes, and community gatherings.", 
              cta: "Explore events", 
              href: "/events" 
            },
          ].map((card, i) => (
            <div key={i} className="p-10 rounded-2xl bg-white border border-border-base hover:border-accent transition-all duration-200 group shadow-sm flex flex-col items-start gap-4">
              <h3 className="text-[22px] font-bold tracking-tight text-foreground font-tight leading-tight group-hover:text-accent transition-colors">
                {card.title}
              </h3>
              <p className="text-[15px] text-muted leading-relaxed mb-6 max-w-[400px]">
                {card.body}
              </p>
              <Link href={card.href} className="mt-auto">
                <Button variant="primary">{card.cta}</Button>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
