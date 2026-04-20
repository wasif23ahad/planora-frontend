"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { CategoryPill } from "@/components/ui/Pill";
import { StarRating } from "@/components/ui/StarRating";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface Review {
  id: string;
  rating: number;
  comment: string;
  userName: string;
  createdAt: string;
}

interface EventDetail extends ProjectDataType {
  id: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  feeCents: number;
  visibility: "PUBLIC" | "PRIVATE";
  ownerId: string;
  participants: { userId: string }[];
  reviews: Review[];
}

export default function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();

  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"about" | "reviews">("about");
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await api.get(`/events/${id}`);
        setEvent(data);
      } catch (error) {
        console.error("Failed to load event:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen py-32 text-center text-muted animate-pulse">Loading event...</div>;
  }

  if (!event) {
    return <div className="min-h-screen py-32 text-center text-muted">Event not found.</div>;
  }

  const isOwner = user?.id === event.ownerId;
  const isJoined = event.participants.some((p) => p.userId === user?.id);
  const isPaid = event.feeCents > 0;

  const handleJoin = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    
    if (isPaid) {
      // Step F9 will handle real Stripe redirect
      router.push(`/events/${id}/checkout`);
      return;
    }

    setJoining(true);
    try {
      await api.post(`/events/${id}/join`);
      window.location.reload(); // Refresh to show "Joined" state
    } catch (error) {
      console.error("Failed to join event:", error);
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="bg-background min-h-screen">
      {/* ── HEADER ────────────────────────────────────────── */}
      <div className="bg-white border-b border-border-base relative">
        <div className="max-w-[1000px] mx-auto px-8 py-16 flex flex-col md:flex-row gap-12 items-start">
          <div className="aspect-[16/9] w-full md:w-[400px] rounded-2xl overflow-hidden bg-muted/5 border border-border-base shadow-sm">
            <div className="w-full h-full flex items-center justify-center text-[11px] font-mono text-muted/30 uppercase tracking-widest text-center">
              event cover image
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <CategoryPill type={event.visibility === "PUBLIC" ? "public" : "private"} fee={event.feeCents} />
            <h1 className="text-[32px] font-bold text-foreground tracking-tight font-tight leading-[1.1]">
              {event.title}
            </h1>
            
            <div className="flex flex-col gap-2 text-[14px] text-muted font-medium">
              <div className="flex items-center gap-2">
                <span>📅</span>
                {new Date(event.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
              </div>
              <div className="flex items-center gap-2">
                <span>📍</span>
                {event.venue}
              </div>
            </div>

            <div className="pt-4 flex gap-4">
              {isOwner ? (
                <>
                  <Link href={`/dashboard/events/${id}/edit`}>
                    <Button variant="secondary">Edit Event</Button>
                  </Link>
                  <Button variant="danger">Delete Event</Button>
                </>
              ) : isJoined ? (
                <Button variant="secondary" disabled>✓ Already Joined</Button>
              ) : (
                <Button 
                  variant="primary" 
                  onClick={handleJoin} 
                  disabled={joining}
                >
                  {joining ? "Joining..." : isPaid ? `Pay ৳${(event.feeCents / 100).toLocaleString()}` : "Join for Free"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── CONTENT TABS ─────────────────────────────────── */}
      <div className="max-w-[1000px] mx-auto px-8 py-12">
        <div className="flex gap-10 border-b border-border-base mb-10">
          {["about", "reviews"].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t as any)}
              className={`pb-4 text-[14px] font-bold uppercase tracking-wider border-b-2 transition-colors ${
                activeTab === t ? "text-accent border-accent" : "text-muted border-transparent hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {activeTab === "about" ? (
          <div className="prose prose-sm max-w-none text-muted leading-relaxed whitespace-pre-wrap text-[15px]">
            {event.description}
          </div>
        ) : (
          <div className="space-y-8">
            {event.reviews.length === 0 ? (
              <div className="py-20 text-center text-muted italic text-[14px]">No reviews yet.</div>
            ) : (
              event.reviews.map((rev) => (
                <div key={rev.id} className="border-b border-border-base pb-8 space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="font-bold text-foreground text-[14px]">{rev.userName}</div>
                    <StarRating value={rev.rating} readOnly />
                  </div>
                  <p className="text-[14px] text-muted leading-relaxed italic">"{rev.comment}"</p>
                  <div className="text-[11px] text-muted/60 uppercase font-bold tracking-widest">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper to keep Link working inside the component template
function Link({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} onClick={(e) => { e.preventDefault(); window.location.href = href; }}>
      {children}
    </a>
  );
}
