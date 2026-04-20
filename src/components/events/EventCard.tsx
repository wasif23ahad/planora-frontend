"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CategoryPill } from "@/components/ui/Pill";

interface EventCardProps {
  event: {
    id: string | number;
    title: string;
    date: string;
    venue: string;
    feeCents: number;
    coverImage?: string;
    visibility: string;
    owner?: {
      name: string;
    };
  };
}

export function EventCard({ event }: EventCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link 
      href={`/events/${event.id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="block bg-white rounded-radius-card overflow-hidden cursor-pointer transition-all duration-150 border font-sans"
      style={{ 
        borderColor: hovered ? "var(--accent)" : "var(--border)"
      }}
    >
      {/* Cover Image Placeholder */}
      <div 
        className="h-[160px] flex items-center justify-center text-[11px] font-mono text-white opacity-60"
        style={{ backgroundColor: event.coverImage || "#C7D4E8" }}
      >
        event cover image
      </div>

      {/* Content */}
      <div className="p-[14px_16px_16px]">
        <h3 className="text-[16px] font-semibold text-foreground mb-1.5 leading-[1.3] tracking-[-0.01em]">
          {event.title}
        </h3>
        
        <div className="text-[13px] text-muted mb-3 flex items-center gap-1.5">
          {new Date(event.date).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })} · {event.owner?.name || "Organizer"}
        </div>

        <div className="flex items-center justify-between">
          <CategoryPill type={event.visibility} feeCents={event.feeCents} />
          
          <span className="text-[13px] font-semibold text-foreground tabular-nums">
            {event.feeCents === 0 ? (
              <span className="text-success">Free</span>
            ) : (
              `৳${(event.feeCents / 100).toLocaleString()}`
            )}
          </span>
        </div>
      </div>
    </Link>
  );
}
