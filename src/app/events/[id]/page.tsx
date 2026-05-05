"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import planoraApi from "../../../lib/api";
const api = planoraApi;
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { CategoryPill, StatusPill } from "@/components/ui/Pill";
import { StarRating } from "@/components/ui/StarRating";
import { RelatedEvents } from "@/components/events/RelatedEvents";

export default function EventDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [event, setEvent] = useState<any>(null);
  const [participation, setParticipation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);

  const avgRating = reviews.length > 0 
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length 
    : 0;

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
    
    if (participation && participation.status !== 'REJECTED') {
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
    const isPrivate = event.visibility === "PRIVATE";

    if (isPrivate) {
      setShowRequestModal(true);
      return;
    }

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

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    
    setSubmittingReview(true);
    try {
      if (editingReviewId) {
        const { data } = await api.patch(`/reviews/${editingReviewId}`, {
          rating: reviewRating,
          comment: reviewText
        });
        setReviews(reviews.map(r => r.id === editingReviewId ? data : r));
        setEditingReviewId(null);
      } else {
        const { data } = await api.post(`/events/${id}/reviews`, {
          rating: reviewRating,
          comment: reviewText
        });
        setReviews([data, ...reviews]);
      }
      setReviewText("");
      setReviewRating(5);
      const { data: eventData } = await api.get(`/events/${id}`);
      setEvent(eventData);
    } catch (err: any) {
      const msg = err.response?.data?.error?.message || err.response?.data?.message || "Failed to submit review";
      alert(msg);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      await api.delete(`/reviews/${reviewId}`);
      setReviews(reviews.filter(r => r.id !== reviewId));
      // Update event rating
      const { data: eventData } = await api.get(`/events/${id}`);
      setEvent(eventData);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete review");
    }
  };

  const startEditing = (review: any) => {
    setEditingReviewId(review.id);
    setReviewText(review.comment);
    setReviewRating(review.rating);
    // Scroll to form
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const submitRequest = async () => {
    if (!requestMessage.trim()) {
      alert("Please provide a reason for joining.");
      return;
    }

    setSubmitting(true);
    try {
      await api.post(`/events/${event.id}/join`, { 
        phoneNumber: user?.phoneNumber,
        message: requestMessage
      });
      setRequestSubmitted(true);
      setTimeout(() => {
        setShowRequestModal(false);
        router.push("/dashboard");
      }, 1500);
    } catch (err: any) {
      alert(err.response?.data?.message || "Request failed");
      setSubmitting(false);
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

            <div className="animate-fade-in space-y-20">
              {/* Overview Section */}
              <section id="overview">
                <h2 className="font-headline text-on-surface mb-6 uppercase text-xs tracking-widest border-b border-outline-variant/10 pb-2 font-bold">Overview</h2>
                <div className="font-body text-lg leading-relaxed text-secondary whitespace-pre-wrap max-w-2xl">
                  {event.description || "No description provided."}
                </div>
              </section>

              {/* Details Section */}
              <section id="details">
                <h2 className="font-headline text-on-surface mb-6 uppercase text-xs tracking-widest border-b border-outline-variant/10 pb-2 font-bold">Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 max-w-2xl">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Visibility</span>
                    <span className="text-on-surface font-medium capitalize">{event.visibility?.toLowerCase()} Event</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Category</span>
                    <span className="text-on-surface font-medium">{event.category || "General"}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Registration Fee</span>
                    <span className="text-on-surface font-medium">{displayFee === 0 ? "Free" : `৳${displayFee.toLocaleString()}`}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Participants</span>
                    <span className="text-on-surface font-medium">{event._count?.participations || 0} Joined</span>
                  </div>
                </div>

                <div className="mt-10 bg-surface-container-low/30 rounded-xl p-8 border border-outline-variant/10 max-w-2xl">
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
              </section>

              {/* Reviews Section */}
              <section id="reviews">
                <h2 className="font-headline text-on-surface mb-8 uppercase text-xs tracking-widest border-b border-outline-variant/10 pb-2 font-bold">Reviews ({reviews.length})</h2>
                
                <div className="max-w-2xl space-y-8">
                  {/* Review Summary */}
                  <div className="p-8 bg-surface-container-lowest border border-outline-variant/20 rounded-xl flex items-center gap-8 ambient-shadow mb-8">
                    <div className="text-5xl font-headline font-bold text-on-surface tabular-nums leading-none">
                      {reviews.length > 0 ? avgRating.toFixed(1) : "—"}
                    </div>
                    <div>
                      <StarRating rating={avgRating} />
                      <p className="text-sm text-secondary mt-1 font-medium">Based on {reviews.length} verified review{reviews.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>

                  {/* Write Review Form */}
                  {participation?.status === 'APPROVED' && (!reviews.some(r => r.userId === user?.id) || editingReviewId) && (
                    <div className="p-8 bg-primary/5 border border-primary/10 rounded-2xl animate-fade-in mb-8">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h4 className="font-headline font-bold text-on-surface mb-2">
                            {editingReviewId ? "Edit Your Review" : "Write a Review"}
                          </h4>
                          <p className="text-xs text-secondary uppercase tracking-widest font-bold">
                            {editingReviewId ? "Update your experience" : "Share your experience with the community"}
                          </p>
                        </div>
                        {editingReviewId && (
                          <button 
                            onClick={() => { setEditingReviewId(null); setReviewText(""); setReviewRating(5); }}
                            className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline"
                          >
                            Cancel Editing
                          </button>
                        )}
                      </div>
                      
                      <form onSubmit={handleReviewSubmit} className="space-y-6">
                        <div className="flex items-center gap-4 bg-surface px-4 py-2 rounded-lg w-fit border border-outline-variant/20">
                          <span className="text-xs font-bold text-secondary">Rating:</span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setReviewRating(star)}
                                className={`material-symbols-outlined text-2xl transition-all ${star <= reviewRating ? 'text-yellow-500 fill-1' : 'text-secondary/30'}`}
                                style={{ fontVariationSettings: star <= reviewRating ? "'FILL' 1" : "'FILL' 0" }}
                              >
                                star
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        <textarea
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          placeholder="Tell others what you thought about this event..."
                          className="w-full bg-surface border border-outline-variant/30 rounded-xl p-4 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all min-h-[120px] resize-none"
                          required
                        />
                        
                        <Button 
                          type="submit" 
                          variant="primary" 
                          disabled={submittingReview}
                          icon={submittingReview ? undefined : "send"}
                        >
                          {submittingReview ? (editingReviewId ? "Updating..." : "Posting...") : (editingReviewId ? "Update Review" : "Post Review")}
                        </Button>
                      </form>
                    </div>
                  )}

                  {/* Reviews List */}
                  <div className="space-y-6">
                    {reviews.length > 0 ? (
                      reviews.map((review) => (
                        <div key={review.id} className="p-6 bg-surface-container-lowest border border-outline-variant/10 rounded-2xl animate-fade-in">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-primary">
                                {review.user?.name?.[0] || 'U'}
                              </div>
                              <div>
                                <p className="font-headline font-semibold text-on-surface text-sm">{review.user?.name}</p>
                                <p className="text-[10px] text-secondary uppercase tracking-wider">
                                  {new Date(review.createdAt).toLocaleDateString()}
                                  {review.updatedAt !== review.createdAt && " (edited)"}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <StarRating rating={review.rating} />
                              {user && review.userId === user.id && (
                                <div className="flex gap-4">
                                  <button 
                                    onClick={() => startEditing(review)}
                                    className="text-[10px] font-bold text-secondary hover:text-primary transition-colors flex items-center gap-1 uppercase tracking-widest"
                                  >
                                    <span className="material-symbols-outlined text-[14px]">edit</span>
                                    Edit
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteReview(review.id)}
                                    className="text-[10px] font-bold text-secondary hover:text-error transition-colors flex items-center gap-1 uppercase tracking-widest"
                                  >
                                    <span className="material-symbols-outlined text-[14px]">delete</span>
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                          <p className="text-secondary text-sm leading-relaxed italic">"{review.comment}"</p>
                        </div>
                      ))
                    ) : (
                      <div className="py-20 text-center space-y-4">
                        <span className="material-symbols-outlined text-[48px] text-secondary/30">rate_review</span>
                        <p className="text-secondary text-sm">No detailed reviews have been left for this event yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* Related Events Section */}
              <RelatedEvents currentEventId={event.id} category={event.category} />
            </div>
          </div>

          {/* ── RIGHT COLUMN: STICKY PANEL ─────────────────── */}
          <div className="lg:sticky lg:top-28 space-y-6">
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-8 shadow-xl ambient-shadow">
               
               {participation && participation.status !== 'REJECTED' ? (
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
                   {participation?.status === 'REJECTED' && (
                     <div className="mb-6 p-4 bg-error/5 border border-error/20 rounded-2xl flex items-start gap-3 animate-fade-in">
                       <span className="material-symbols-outlined text-error text-[20px]">block</span>
                       <div>
                         <p className="text-sm font-bold text-error">Request Rejected</p>
                         <p className="text-[11px] text-secondary mt-1 leading-relaxed">The host has declined your request. You can update your message and try applying again.</p>
                       </div>
                     </div>
                   )}
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
                          ? "Request to Join"
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

      {/* Join Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface w-full max-w-md rounded-3xl p-8 shadow-2xl border border-outline-variant/20 animate-scale-in">
            {requestSubmitted ? (
              <div className="py-12 text-center animate-fade-in">
                <div className="w-20 h-20 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="material-symbols-outlined text-4xl">check_circle</span>
                </div>
                <h3 className="font-headline text-2xl font-bold text-on-surface mb-2">Request Submitted!</h3>
                <p className="text-secondary text-sm">The host will review your request. Redirecting you to your dashboard...</p>
              </div>
            ) : (
              <>
                <h3 className="font-headline text-2xl font-bold text-on-surface mb-2">Request to Join</h3>
                <p className="text-secondary text-sm mb-6">This is a private event. Please tell the host why you'd like to attend.</p>
                
                <div className="space-y-4">
                  <textarea
                    className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-4 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all min-h-[120px] resize-none"
                    placeholder="Ex: I'm a fellow developer and I'd love to learn from this masterclass..."
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                  />
                  
                  <div className="flex gap-3 pt-2">
                    <Button 
                      variant="ghost" 
                      className="flex-1" 
                      onClick={() => setShowRequestModal(false)}
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="primary" 
                      className="flex-1" 
                      onClick={submitRequest}
                      disabled={submitting}
                    >
                      {submitting ? "Submitting..." : "Submit Request"}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
