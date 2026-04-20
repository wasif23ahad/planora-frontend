"use client";

import React from "react";
import Link from "next/link";
import { CategoryPill } from "@/components/ui/Pill";

interface Event {
  id: string | number;
  title: string;
  date: string;
  venue: string;
  fee?: number; // fallback/calculated BDT
  feeCents?: number; // authoritative backend units
  coverImage?: string;
  visibility: string;
  participantsCount?: number;
  maxParticipants?: number;
}

interface EventCardProps {
  event: Event;
  variant?: "grid" | "slider";
}

export function EventCard({ event, variant = "grid" }: EventCardProps) {
  const isSlider = variant === "slider";
  
  // Normalize fee to BDT
  const displayFee = event.fee ?? (event.feeCents ? event.feeCents / 100 : 0);

  return (
    <Link 
      href={`/events/${event.id}`}
      className={`group bg-surface-container-lowest rounded-xl ghost-border overflow-hidden flex flex-col h-full hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 active:scale-[0.98] ${isSlider ? 'w-[320px] shrink-0 snap-start' : 'ambient-shadow'}`}
    >
      {/* Cover Image Container */}
      <div className={`${isSlider ? 'h-[200px]' : 'aspect-video'} relative overflow-hidden bg-surface-container-high`}>
        {event.coverImage ? (
          <img 
            src={event.coverImage} 
            alt={event.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-primary opacity-[0.03]">
             {/* Gradient Background for placeholders */}
          </div>
        )}
        
        {/* Category Overlay */}
        <div className="absolute top-4 left-4 z-10 transition-transform group-hover:scale-105">
          <CategoryPill type={event.visibility} fee={displayFee} />
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col grow gap-3">
        <div className="flex items-center gap-2 text-secondary">
          <span className="material-symbols-outlined text-[18px]">calendar_today</span>
          <span className="font-headline font-semibold text-xs uppercase tracking-widest text-on-surface">
            {new Date(event.date).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        <h3 className="text-xl md:text-2xl font-headline font-semibold text-on-surface line-clamp-2 leading-tight tracking-tight group-hover:text-primary transition-colors">
          {event.title}
        </h3>

        {!isSlider && (
          <div className="text-sm text-secondary flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-[18px]">location_on</span>
            <span className="truncate">{event.venue}</span>
          </div>
        )}

        {/* Footer Meta */}
        <div className="mt-auto flex justify-between items-center pt-4 border-t border-surface-container-low transition-colors group-hover:border-primary/10">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.05em] mb-0.5">Registration</span>
            <span className="text-sm font-headline font-bold text-on-surface tracking-tight">
              {displayFee === 0 ? "Complimentary" : `৳${displayFee.toLocaleString()}`}
            </span>
          </div>
          
          <div className="flex items-center gap-1.5 text-primary text-sm font-semibold group-hover:gap-2 transition-all">
             {isSlider ? "Join" : "View"}
             <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
