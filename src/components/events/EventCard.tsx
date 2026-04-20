"use client";

import React from "react";
import Link from "next/link";
import { CategoryPill } from "@/components/ui/Pill";

export interface EventData {
  id: string;
  title: string;
  description: string;
  date: string; // ISO string
  time?: string;
  venue: string;
  feeCents: number;
  visibility: "PUBLIC" | "PRIVATE";
  coverImage?: string;
  participantsCount: number;
}

interface EventCardProps {
  event: EventData;
}

export function EventCard({ event }: EventCardProps) {
  const isFree = event.feeCents === 0;
  const dateObj = new Date(event.date);
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link
      href={`/events/${event.id}`}
      className="group block bg-white border border-border-base rounded-radius-card overflow-hidden transition-all duration-200 hover:border-accent hover:shadow-sm"
    >
      {/* Cover Image Placeholder */}
      <div className="h-[160px] bg-muted/10 border-b border-border-base flex items-center justify-center relative overflow-hidden">
        {event.coverImage ? (
          <img
            src={event.coverImage}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="text-[11px] font-mono text-muted/40 uppercase tracking-widest group-hover:opacity-60 transition-opacity">
            event cover image
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-[16px] font-bold text-foreground mb-1.5 leading-tight group-hover:text-accent transition-colors truncate">
          {event.title}
        </h3>
        
        <div className="text-[13px] text-muted mb-4 font-medium">
          {formattedDate} · {event.venue}
        </div>

        <div className="flex items-center justify-between">
          <CategoryPill type={event.visibility === "PUBLIC" ? "public" : "private"} fee={event.feeCents} />
          <span className={`text-[13px] font-bold tabular-nums ${isFree ? "text-success" : "text-foreground"}`}>
            {isFree ? "Free" : `৳${(event.feeCents / 100).toLocaleString()}`}
          </span>
        </div>
      </div>
    </Link>
  );
}
