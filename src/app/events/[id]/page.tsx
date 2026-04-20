"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { CategoryPill, StatusPill } from "@/components/ui/Pill";

export default function EventDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"details" | "reviews">("details");
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await api.get(`/events/${id}`);
        setEvent(data);
        if (user && data.ownerId === user.id) {
          setIsOwner(true);
        }
      } catch (err) {
        console.error("Failed to fetch event:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchEvent();
  }, [id, user]);

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-muted font-medium">Loading event details…</div>;
  if (!event) return <div className="min-h-screen bg-background flex items-center justify-center text-muted font-medium font-sans px-8 text-center uppercase tracking-widest">Event not found</div>;

  const actionBtnLabel = () => {
    const isPaid = event.feeCents > 0;
    const isPublic = event.visibility === "public";
    
    if (isPublic) {
      return isPaid ? `Pay & Join — ৳${(event.feeCents/100).toLocaleString()}` : "Join event";
    }
    return isPaid ? `Pay & Request — ৳${(event.feeCents/100).toLocaleString()}` : "Request to Join";
  };

  return (
    <div className="bg-background min-h-screen pt-[60px] font-sans pb-20">
      
      {/* Cover Image */}
      <div 
        className="h-[320px] flex items-center justify-center text-[12px] font-mono text-white opacity-50 border-b border-border-base font-sans"
        style={{ backgroundColor: event.coverImage || "#C7D4E8" }}
      >
        event cover image — 1200×320
      </div>

      <div className="max-w-[1200px] mx-auto px-8 py-10">
        
        {/* Back Link */}
        <button 
          onClick={() => router.push("/events")}
          className="bg-none border-none text-muted text-[14px] cursor-pointer font-inherit mb-6 flex items-center gap-2 hover:text-foreground transition-colors"
        >
          ← Back to events
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-12 items-start">
          
          {/* ── LEFT COLUMN ──────────────────────────────── */}
          <div className="min-w-0">
            <div className="flex items-center gap-3 mb-4">
              <CategoryPill type={event.visibility} feePercent={event.feeCents} />
              {event.isFeatured && <StatusPill status="featured" />}
            </div>
            
            <h1 className="text-[36px] font-bold text-foreground tracking-[-0.03em] font-tight mb-4 leading-tight">
              {event.title}
            </h1>

            <div className="flex flex-wrap gap-x-8 gap-y-4 mb-8">
              {[
                { icon: "📅", text: `${new Date(event.date).toLocaleDateString()} · ${event.time || "TBA"}` },
                { icon: "📍", text: event.venue },
                { icon: "👤", text: `Organized by ${event.owner?.name || "Organizer"}` },
                { icon: "👥", text: `${event._count?.participants || 0} participants` },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-[14px] text-muted">
                  <span>{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border-base mb-8">
              {["details", "reviews"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t as any)}
                  className={`px-5 py-2.5 text-[14px] font-medium transition-colors border-b-2 -mb-px capitalize
                    ${tab === t ? "text-accent border-accent" : "text-muted border-transparent hover:text-foreground"}`}
                >
                  {t} {t === "reviews" ? `(${event._count?.reviews || 0})` : ""}
                </button>
              ))}
            </div>

            {tab === "details" && (
              <div className="text-[15px] text-foreground leading-[1.8] max-w-[600px] space-y-5 animate-fade-in">
                <p>{event.description}</p>
                <p>
                  This event is open to professionals at all levels. Whether you're pre-launch or post-Series A, 
                  the Planora platform provides the best space to grow your network and get honest feedback 
                  from peers who understand the local landscape.
                </p>
                <p>
                  Doors open 30 minutes before the start time. Light refreshments will be available throughout the session.
                </p>
              </div>
            )}

            {tab === "reviews" && (
              <div className="animate-fade-in space-y-8">
                <div className="p-5 bg-white border border-border-base rounded-[12px] flex items-center gap-6">
                  <div className="text-[40px] font-bold text-foreground tabular-nums leading-none">
                    {event._count?.reviews > 0 ? (event.avgRating || 0).toFixed(1) : "—"}
                  </div>
                  <div>
                    <div className="flex gap-0.5 text-[#F59E0B] text-[20px]">★★★★★</div>
                    <div className="text-[13px] text-muted mt-1">
                      Based on {event._count?.reviews || 0} reviews
                    </div>
                  </div>
                </div>
                
                <div className="py-12 text-center text-muted text-[14px] border-t border-border-base">
                  No detailed reviews yet for this event.
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT COLUMN (sticky panel) ──────────────── */}
          <div className="sticky top-[80px]">
            <div className="bg-white rounded-[12px] border border-border-base p-6 mb-4 shadow-sm">
              <div className="text-[28px] font-bold text-foreground tabular-nums mb-1">
                {event.feeCents === 0 ? "Free" : `৳${(event.feeCents/100).toLocaleString()}`}
              </div>
              <div className="text-[13px] text-muted mb-6">
                {event._count?.participants || 0} registered · {isOwner ? "You own this event" : "Public"}
              </div>
              
              <Button variant="primary" className="w-full h-[46px] text-[15px] font-bold">
                {actionBtnLabel()}
              </Button>
            </div>

            {/* Owner controls */}
            <div className="bg-white rounded-[12px] border border-border-base p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div className="text-[13px] font-bold text-foreground">Controls</div>
                {isOwner && <span className="bg-success/10 text-success text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Owner Profile</span>}
              </div>
              {isOwner ? (
                <div className="flex flex-col gap-2.5">
                  <Button variant="secondary" small className="w-full">Edit event details</Button>
                  <Button 
                    variant="secondary" 
                    small 
                    className="w-full"
                    onClick={() => router.push(`/dashboard/events/${event.id}`)}
                  >
                    Manage participants
                  </Button>
                  <Button variant="danger" small className="w-full">Delete event permanent</Button>
                </div>
              ) : (
                <div className="text-[13px] text-muted leading-relaxed">
                  Management controls are only visible to the event host. Log in as the organizer to moderate participants.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
