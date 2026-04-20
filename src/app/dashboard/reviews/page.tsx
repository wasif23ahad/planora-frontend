"use client";

import React, { useState, useEffect } from "react";
import { StarRating } from "@/components/ui/StarRating";
import { Button } from "@/components/ui/Button";
import api from "@/lib/api";

export default function MyReviewsPage() {
  const [givenReviews, setGivenReviews] = useState<any[]>([]);
  const [receivedReviews, setReceivedReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"given" | "received">("given");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const [givenRes, receivedRes] = await Promise.all([
          api.get("/reviews/given"),
          api.get("/reviews/received")
        ]);
        setGivenReviews(givenRes.data || []);
        setReceivedReviews(receivedRes.data || []);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      await api.delete(`/reviews/${id}`);
      setGivenReviews(prev => prev.filter(r => r.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete review.");
    }
  };

  if (loading) return (
    <div className="py-24 text-center text-secondary animate-pulse font-headline">
       Retreiving community feedback...
    </div>
  );

  return (
    <div className="space-y-10">
      <header>
        <h1 className="font-headline text-4xl font-semibold tracking-[-0.03em] text-on-surface">Reviews</h1>
        <p className="text-secondary mt-1">Manage your feedback and review responses from the community.</p>
      </header>

      {/* Tabs */}
      <div className="border-b border-surface-container-high flex gap-8">
        {[
          { key: "given", label: "Reviews I've Written" },
          { key: "received", label: "Reviews Received" }
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            className={`pb-4 text-sm font-semibold transition-all border-b-2 uppercase tracking-widest
              ${activeTab === t.key ? "text-primary border-primary" : "text-secondary border-transparent hover:text-on-surface"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="animate-fade-in grid grid-cols-1 gap-6">
        {activeTab === "given" ? (
          givenReviews.length === 0 ? (
            <div className="py-24 text-center bg-surface-container-low/20 rounded-2xl border border-dashed border-outline-variant/30 flex flex-col items-center gap-4">
               <span className="material-symbols-outlined text-4xl text-secondary opacity-30">rate_review</span>
               <p className="text-secondary text-sm">You haven't written any reviews yet.</p>
            </div>
          ) : (
            givenReviews.map(r => (
              <div key={r.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-6 flex flex-col md:flex-row justify-between items-start gap-6 ambient-shadow">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <StarRating rating={r.rating} size="18px" />
                    <span className="text-xs font-bold text-secondary uppercase tracking-widest">
                       {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-headline font-semibold text-on-surface text-lg leading-tight">{r.event?.title}</h3>
                  <p className="text-sm text-secondary leading-relaxed max-w-2xl">{r.comment}</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(r.id)} className="text-error hover:bg-error/5 flex-1 md:flex-none">
                    Delete
                  </Button>
                </div>
              </div>
            ))
          )
        ) : (
          receivedReviews.length === 0 ? (
            <div className="py-24 text-center bg-surface-container-low/20 rounded-2xl border border-dashed border-outline-variant/30 flex flex-col items-center gap-4">
               <span className="material-symbols-outlined text-4xl text-secondary opacity-30">forum</span>
               <p className="text-secondary text-sm">No one has reviewed your events yet.</p>
            </div>
          ) : (
            receivedReviews.map(r => (
              <div key={r.id} className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-6 flex flex-col gap-4 ambient-shadow">
                <div className="flex justify-between items-start">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary-container/20 text-primary flex items-center justify-center font-bold text-xs">
                         {r.user?.name?.[0] || "U"}
                      </div>
                      <div>
                         <p className="text-sm font-semibold text-on-surface">{r.user?.name}</p>
                         <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">Reviewed {r.event?.title}</p>
                      </div>
                   </div>
                   <StarRating rating={r.rating} size="16px" />
                </div>
                <p className="text-sm text-secondary leading-relaxed bg-surface-container-low/30 p-4 rounded-lg italic">
                  "{r.comment}"
                </p>
                <div className="text-[10px] font-bold text-secondary/50 uppercase tracking-widest">
                   {new Date(r.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
}
