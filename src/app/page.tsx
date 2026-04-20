"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { CategoryPill } from "@/components/ui/Pill";
import { EventCard, EventData } from "@/components/events/EventCard";
import api from "@/lib/api";

export default function Home() {
  const [featured, setFeatured] = useState<EventData | null>(null);
  const [upcoming, setUpcoming] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [featuredRes, upcomingRes] = await Promise.all([
          api.get("/events/featured"),
          api.get("/events?limit=6"), // Paginated list from backend
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-[14px] text-muted font-medium animate-pulse">Loading Planora...</div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {/* ── HERO ──────────────────────────────────────────── */}
      {featured && (
        <section className="max-w-[1200px] mx-auto px-8 py-24 sm:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Featured Image Left */}
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

            {/* Text Content Right */}
            <div className="space-y-6">
              <CategoryPill type={featured.visibility === "PUBLIC" ? "public" : "private"} fee={featured.feeCents} />
              
              <h1 className="text-[48px] font-bold text-foreground tracking-[-0.03em] leading-[1.05] font-tight max-w-[500px]">
                {featured.title}
              </h1>
              
              <div className="text-[15px] font-medium text-muted tabular-nums">
                {new Date(featured.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} · {featured.venue}
              </div>

              <p className="text-[15px] text-muted leading-relaxed max-w-[480px]">
                {featured.description.length > 200 
                  ? featured.description.substring(0, 200) + "..." 
                  : featured.description}
              </p>

              <div className="flex items-center gap-6 pt-2">
                <Link href={`/events/${featured.id}`}>
                  <Button variant="primary">Join event</Button>
                </Link>
                <span className="text-[13px] text-muted font-semibold italic">
                  Be part of this featured gathering
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── UPCOMING EVENTS ───────────────────────────────── */}
      <section className="max-w-[1200px] mx-auto px-8 py-20 border-t border-border-base">
        <SectionTitle
          action={
            <Link href="/events" className="text-[14px] text-accent font-bold hover:underline underline-offset-4">
              See all →
            </Link>
          }
        >
          Upcoming events
        </SectionTitle>

        {upcoming.length === 0 ? (
          <div className="py-20 text-center text-[14px] text-muted italic">
            No upcoming events found. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
