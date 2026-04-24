"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
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
  const [participation, setParticipation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"details" | "reviews">("details");
  const [isOwner, setIsOwner] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await api.get(`/events/${id}`);
        setEvent(data);
        if (user) {
          if (data.ownerId === user.id) setIsOwner(true);
          
          // Check if current user is already joined
          try {
            const { data: joinedData } = await api.get("/events/joined");
            const myParticipation = joinedData.find((p: any) => p.eventId === id);
            setParticipation(myParticipation);
          } catch (e) {
            console.error("Failed to fetch joined events", e);
          }
        }
        // Fetch reviews
        try {
          const { data: reviewsData } = await api.get(`/events/${id}/reviews`);
          setReviews(reviewsData || []);
        } catch (e) {
          console.error("Failed to fetch reviews", e);
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
    <div className="flex-1 flex items-center justify-center bg-surface">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="text-2xl font-headline font-bold text-on-surface">Planora</div>
        <div className="text-sm text-secondary">Loading details…</div>
      </div>
    </div>
  );

  if (!event) return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
      <span className="material-symbols-outlined text-[64px] text-secondary/30">event_busy</span>
      <h3 className="font-headline text-2xl font-semibold text-on-surface">Event not found</h3>
      <Button onClick={() => router.push("/events")}>Back to events</Button>
    </div>
  );

  const displayFee = event.fee ?? (event.feeCents ? event.feeCents / 100 : 0);
  const isPast = new Date(event.date) < new Date();

  const handleAction = async () => {
    if (!user) { router.push("/login"); return; }
    
    if (participation) {
      alert("You have already joined this event. Redirecting to your dashboard...");
      router.push("/dashboard");
      return;
    }

    if (isPast) {
      alert("This event has already passed.");
      return;
    }

    // Check if user info is complete (Name and Phone)
    if (!user.name || !user.phoneNumber) {
      router.push(`/events/${event.id}/checkout`);
      return;
    }

    const isPaid = displayFee > 0;
    if (isPaid) {
      try {
        const { data } = await api.post("/payments/checkout", { 
          eventId: event.id, 
          phoneNumber: user.phoneNumber 
        });
        window.location.href = data.url;
      } catch (err: any) {
        alert(err.response?.data?.message || "Payment service unavailable");
      }
    } else {
      try {
        await api.post(`/events/${event.id}/join`, { 
          phoneNumber: user.phoneNumber 
        });
        alert("Success! You've joined the event.");
        router.push("/dashboard");
      } catch (err: any) {
        alert(err.response?.data?.message || "Could not join event");
      }
    }
  };

  return (
    <div className="bg-surface min-h-screen">
      
      {/* ── COVER IMAGE ─────────────────────────────────────── */}
      <div className="w-full h-[320px] md:h-[480px] relative overflow-hidden bg-surface-container-high border-b border-outline-variant/10">
        {event.coverImage ? (
          <img 
            src={event.coverImage} 
            alt={event.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-8xl font-headline font-extrabold text-secondary opacity-10 uppercase">
             {event.title[0]}
          </div>
        )}
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 -mt-20 relative z-10 pb-24">
        
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-start">
          
          {/* ── LEFT COLUMN: CONTENT ─────────────────────────── */}
          <div className="space-y-12">
            
            {/* Header Card */}
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-8 md:p-12 ambient-shadow">
               <div className="flex flex-wrap items-center gap-4 mb-6">
                  <CategoryPill type={event.visibility} fee={displayFee} />
                  {event.isFeatured && <StatusPill status="featured" />}
                  <span className="flex items-center gap-1 text-xs font-bold text-secondary uppercase tracking-widest">
                     <span className="material-symbols-outlined text-base">group</span>
                     {event._count?.participations || 0} Registered
                  </span>
               </div>

               <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-semibold tracking-[-0.04em] leading-[1.1] text-on-surface mb-8">
                {event.title}
               </h1>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-8 border-y border-outline-variant/10">
                  <div className="flex items-start gap-4">
                     <div className="w-10 h-10 rounded-full bg-primary-container/20 text-primary flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined">calendar_today</span>
                     </div>
                     <div>
                        <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-1">Date & Time</p>
                        <p className="font-headline font-semibold text-on-surface">
                           {new Date(event.date).toLocaleDateString("en-US", { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                        <p className="text-sm text-secondary">{event.time || "Event starts at 18:30"}</p>
                     </div>
                  </div>
                  <div className="flex items-start gap-4">
                     <div className="w-10 h-10 rounded-full bg-primary-container/20 text-primary flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined">location_on</span>
                     </div>
                     <div>
                        <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-1">Location</p>
                        <p className="font-headline font-semibold text-on-surface">{event.venue}</p>
                        <p className="text-sm text-secondary">Physical Presence Required</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-outline-variant/20 flex gap-8">
              {["details", "reviews"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t as any)}
                  className={`pb-4 font-headline font-semibold tracking-[-0.02em] whitespace-nowrap transition-all border-b-2 uppercase text-xs tracking-widest
                    ${tab === t ? "text-primary border-primary" : "text-secondary border-transparent hover:text-on-surface"}`}
                >
                  {t} {t === "reviews" ? `(${event._count?.reviews || 0})` : ""}
                </button>
              ))}
            </div>

            <div className="animate-fade-in min-h-[300px]">
               {tab === "details" ? (
                  <div className="space-y-8 max-w-2xl">
                     <div className="font-body text-lg leading-relaxed text-secondary whitespace-pre-wrap">
                        {event.description || "No description provided."}
                     </div>
                     
                     <div className="bg-surface-container-low/30 rounded-xl p-8 border border-outline-variant/10">
                        <h4 className="font-headline font-bold text-on-surface mb-4">About the Organizer</h4>
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-lg">
                              {event.owner?.name?.[0] || 'O'}
                           </div>
                           <div>
                              <p className="font-headline font-semibold text-on-surface">{event.owner?.name || "Event Organizer"}</p>
                              <p className="text-sm text-secondary">Verified Community Member</p>
                           </div>
                        </div>
                     </div>
                  </div>
               ) : (
                  <div className="space-y-8 max-w-2xl">
                     {/* Review Summary */}
                     <div className="p-8 bg-surface-container-lowest border border-outline-variant/20 rounded-xl flex items-center gap-8 ambient-shadow">
                        <div className="text-5xl font-headline font-bold text-on-surface tabular-nums leading-none">
                           {event._count?.reviews > 0 ? (event.avgRating || 0).toFixed(1) : "—"}
                        </div>
                        <div>
                           <StarRating rating={event.avgRating || 0} />
                           <p className="text-sm text-secondary mt-1 font-medium">Based on {event._count?.reviews || 0} verified reviews</p>
                        </div>
                     </div>

                     {/* Reviews List Placeholder */}
                     <div className="py-20 text-center space-y-4">
                        <span className="material-symbols-outlined text-[48px] text-secondary/30">rate_review</span>
                        <p className="text-secondary text-sm">No detailed reviews have been left for this event yet.</p>
                     </div>
                  </div>
               )}
            </div>
          </div>

          {/* ── RIGHT COLUMN: STICKY PANEL ─────────────────── */}
          <div className="lg:sticky lg:top-28 space-y-6">
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-8 shadow-xl ambient-shadow">
               
               {participation ? (
                 <div className="space-y-6">
                   <div className={`flex items-center gap-3 ${participation.status === 'PENDING' ? 'text-primary' : 'text-success'}`}>
                     <span className="material-symbols-outlined text-3xl">
                       {participation.status === 'PENDING' ? 'pending_actions' : 'check_circle'}
                     </span>
                     <div>
                       <p className="font-headline font-bold text-lg leading-tight">
                         {participation.status === 'PENDING' ? "Request Pending" : "You're Registered!"}
                       </p>
                       <p className="text-xs text-secondary">
                         {participation.status === 'PENDING' ? "Waiting for host approval." : "Your spot is secured."}
                       </p>
                     </div>
                   </div>
                   <Button 
                     variant="primary" 
                     size="lg" 
                     className="w-full"
                     onClick={() => router.push("/dashboard")}
                     icon="dashboard"
                   >
                     Go to Dashboard
                   </Button>
                   {participation.status !== 'PENDING' && (
                     <p className="text-xs text-center text-secondary">
                       View your <Link href={`/dashboard/tickets/${participation.id}`} className="text-primary hover:underline font-bold">E-Ticket</Link>
                     </p>
                   )}
                 </div>
               ) : (
                 <>
                   <p className="text-xs font-bold text-secondary uppercase tracking-widest mb-2">Registration Fee</p>
                   <div className="text-4xl font-headline font-bold text-on-surface mb-6 tabular-nums">
                      {displayFee === 0 ? "Free" : `৳${displayFee.toLocaleString()}`}
                   </div>
                   
                   <Button 
                      variant={isPast ? "secondary" : "primary"} 
                      size="lg" 
                      className="w-full py-6" 
                      onClick={handleAction}
                      disabled={isPast}
                      icon={isPast ? "event_busy" : "rocket_launch"}
                   >
                      {isPast 
                        ? "Registration Closed" 
                        : event.visibility === "PRIVATE"
                          ? (displayFee > 0 ? "Pay & Request" : "Request to Join")
                          : (displayFee > 0 ? "Pay & Join" : "Join Event")
                      }
                   </Button>
                   
                   <div className="mt-6 space-y-4 pt-6 border-t border-outline-variant/10">
                      <div className="flex items-center gap-3 text-xs font-medium text-secondary">
                         <span className="material-symbols-outlined text-base">verified_user</span>
                         Secure payment via SSLCommerz
                      </div>
                      <div className="flex items-center gap-3 text-xs font-medium text-secondary">
                         <span className="material-symbols-outlined text-base">mail</span>
                         Ticket sent to your email
                      </div>
                   </div>
                 </>
               )}
            </div>

            {/* Quick Links / Breadcrumb */}
            <Button 
               variant="ghost" 
               size="sm" 
               className="w-full"
               onClick={() => router.push("/events")}
               icon="arrow_back"
            >
               Back to Exploration
            </Button>

            {/* Owner Controls (if applicable) */}
            {isOwner && (
               <div className="bg-primary/5 rounded-2xl border border-primary/20 p-8 space-y-4">
                  <h4 className="font-headline font-bold text-primary uppercase text-xs tracking-widest">Host Controls</h4>
                  <p className="text-xs text-primary/70 mb-4">You are the creator of this event.</p>
                  <Button 
                     variant="outline" 
                     className="w-full text-primary border-primary/20 hover:bg-primary/5"
                     onClick={() => router.push(`/dashboard/events/${event.id}`)}
                     icon="manage_accounts"
                   >
                     Manage Participants
                  </Button>
               </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
