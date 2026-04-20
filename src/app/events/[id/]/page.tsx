"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { CategoryPill, StatusPill } from "@/components/ui/Pill";
import { StarRating } from "@/components/ui/StarRating";

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

  if (loading) return (
    <div className="flex-1 flex items-center justify-center bg-surface py-32">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="text-3xl font-headline font-bold text-primary">Planora</div>
        <div className="text-sm text-secondary font-medium uppercase tracking-widest">Loading experience details...</div>
      </div>
    </div>
  );

  if (!event) return (
    <div className="max-w-[1440px] mx-auto px-8 py-32 text-center flex flex-col items-center">
      <span className="material-symbols-outlined text-[64px] text-secondary/20 mb-6">event_busy</span>
      <h1 className="font-headline text-3xl font-semibold text-on-surface mb-4">Event not found</h1>
      <p className="text-secondary mb-8">This event may have been removed or the link is invalid.</p>
      <Button variant="outline" onClick={() => router.push("/events")}>Back to Exploration</Button>
    </div>
  );

  const handleAction = async () => {
    if (!user) { router.push("/login"); return; }
    const isPaid = event.fee > 0;
    if (isPaid) {
      try {
        const { data } = await api.post("/payments/checkout", { eventId: event.id });
        window.location.href = data.url;
      } catch (err: any) {
        alert(err.response?.data?.message || "Payment service unavailable");
      }
    } else {
      try {
        await api.post(`/events/${event.id}/join`);
        alert("Success! You've joined the event.");
        window.location.reload();
      } catch (err: any) {
        alert(err.response?.data?.message || "Could not join event");
      }
    }
  };

  return (
    <div className="bg-surface antialiased min-h-screen flex flex-col">
      {/* Cover Image */}
      <header className="w-full h-[320px] md:h-[420px] bg-surface-container-high relative overflow-hidden">
        {event.coverImage ? (
          <img 
            src={event.coverImage} 
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-primary opacity-20">
             {/* Placeholder background */}
          </div>
        )}
      </header>

      <main className="flex-grow w-full max-w-[1440px] mx-auto px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 relative">
        {/* Left Column: Content */}
        <article className="lg:col-span-8 flex flex-col gap-16">
          <section className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <CategoryPill type={event.visibility} fee={event.fee} />
              {event.isFeatured && <StatusPill status="featured" />}
            </div>
            <h1 className="font-headline font-semibold text-5xl md:text-6xl tracking-tight text-on-surface leading-tight">
              {event.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-secondary text-base">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-xl">person</span>
                <span>Hosted by <strong>{event.owner?.name || "The Host"}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-xl">calendar_today</span>
                <span className="font-headline font-semibold tracking-tight text-on-surface">
                   {new Date(event.date).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-xl">location_on</span>
                <span>{event.venue}</span>
              </div>
            </div>
          </section>

          {/* Details Section */}
          <section className="prose prose-lg max-w-none text-on-surface-variant leading-relaxed font-body">
            <h2 className="font-headline font-semibold text-3xl tracking-tight text-on-surface mb-6">About this experience</h2>
            <p className="mb-6 whitespace-pre-wrap">{event.description || "The organizer hasn't provided a detailed description yet."}</p>
          </section>

          {/* Divider Replacement */}
          <div className="w-full h-16 bg-gradient-to-b from-surface to-surface-container-low rounded-xl"></div>

          {/* Reviews Section */}
          <section className="flex flex-col gap-8 bg-surface-container-low p-8 rounded-xl ghost-border">
            <div className="flex items-center justify-between">
              <h2 className="font-headline font-semibold text-3xl tracking-tight text-on-surface">Participant Reviews</h2>
              <div className="flex items-center gap-3">
                <StarRating rating={event.avgRating || 0} />
                <span className="font-headline font-semibold text-xl tracking-tight">{(event.avgRating || 0).toFixed(1)}/5</span>
              </div>
            </div>
            
            {event._count?.reviews > 0 ? (
               <div className="py-8">
                  {/* Real reviews would go here */}
                  <p className="text-secondary text-center text-sm font-medium">Viewing verified community feedback...</p>
               </div>
            ) : (
               <div className="bg-surface-container-lowest p-12 rounded-xl text-center flex flex-col items-center gap-4 ambient-shadow">
                  <span className="material-symbols-outlined text-[48px] text-secondary/30">rate_review</span>
                  <p className="text-secondary text-sm font-medium">No reviews have been left for this experience yet.</p>
               </div>
            )}
          </section>
        </article>

        {/* Right Column: Sticky Action Card */}
        <aside className="lg:col-span-4 relative">
          <div className="lg:sticky lg:top-32 flex flex-col gap-6 bg-surface-container-lowest p-8 rounded-xl ghost-border ambient-shadow">
            <div className="flex flex-col gap-1">
              <span className="text-secondary font-medium text-xs uppercase tracking-widest">Access Fee</span>
              <span className="font-headline font-semibold text-5xl tracking-tight text-on-surface">
                {event.fee === 0 ? "Free" : `৳${event.fee.toLocaleString()}`}
              </span>
            </div>
            
            <div className="flex items-center gap-3 text-secondary bg-surface-container-low px-4 py-3 rounded-lg ghost-border">
              <span className="material-symbols-outlined text-primary">group</span>
              <span className="font-medium">
                 {event.maxParticipants ? `${event.maxParticipants - (event._count?.participations || 0)} spots left` : 'Open Enrollment'}
              </span>
            </div>

            <div className="flex flex-col gap-4 mt-4">
              <button 
                onClick={handleAction}
                className="w-full bg-gradient-primary text-on-primary font-headline font-semibold tracking-tight text-lg py-4 rounded-lg hover:opacity-90 shadow-lg shadow-primary/10 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                {event.fee > 0 ? "Pay & Join" : "Join Event"}
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              
              <button className="w-full bg-transparent border border-outline text-on-surface font-headline font-semibold tracking-tight text-base py-3 rounded-lg hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">event</span>
                Add to Calendar
              </button>

              {isOwner && (
                <button 
                  onClick={() => router.push(`/dashboard/events/${event.id}`)}
                  className="w-full bg-surface-container-low text-primary font-headline font-semibold tracking-tight text-base py-3 rounded-lg hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2 mt-4"
                >
                  <span className="material-symbols-outlined">settings</span>
                  Manage Event
                </button>
              )}
            </div>

            <hr className="border-t-0 border-b border-surface-container-high my-2"/>
            <div className="text-xs text-secondary text-center leading-relaxed">
              <p>Secure transmission via Planora SSL. <br/> <a className="text-primary hover:underline underline-offset-4 decoration-primary" href="#">Read our Refund policy</a>.</p>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
