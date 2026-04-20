"use client";

import React, { useState, useEffect } from "react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { StarRating } from "@/components/ui/StarRating";
import api from "@/lib/api";

export default function MyReviewsPage() {
  const [activeTab, setActiveTab] = useState<"received" | "given">("received");
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const endpoint = activeTab === "received" ? "/reviews/received" : "/reviews/given";
        const { data } = await api.get(endpoint);
        setReviews(data);
      } catch (error) {
        console.error("Failed to load reviews:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [activeTab]);

  return (
    <div className="max-w-[800px] mx-auto">
      <SectionTitle>Reviews History</SectionTitle>

      {/* ── TABS ────────────────────────────────────────── */}
      <div className="flex gap-10 border-b border-border-base mb-10">
        {[
          { key: "received", label: "Received" },
          { key: "given", label: "Given" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            className={`pb-4 text-[14px] font-bold uppercase tracking-wider border-b-2 transition-colors ${
              activeTab === t.key ? "text-accent border-accent" : "text-muted border-transparent hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── LIST ────────────────────────────────────────── */}
      {loading ? (
        <div className="py-24 text-center text-muted animate-pulse">Loading feedback...</div>
      ) : reviews.length === 0 ? (
        <div className="py-24 text-center bg-white border border-border-base rounded-2xl shadow-sm">
          <p className="text-muted text-[14px] italic">No reviews found in this category.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((rev) => (
            <div key={rev.id} className="bg-white border border-border-base rounded-2xl p-8 shadow-sm space-y-4 hover:border-accent transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-[16px] font-bold text-foreground font-tight leading-tight">
                    {rev.event.title}
                  </h3>
                  <p className="text-[12px] text-muted font-medium mt-1 uppercase tracking-widest">
                    {activeTab === "received" ? `From: ${rev.user.name}` : "By: You"}
                  </p>
                </div>
                <StarRating value={rev.rating} readOnly />
              </div>
              
              <p className="text-[15px] text-muted leading-relaxed italic border-l-4 border-accent/10 pl-4 py-1 bg-accent/5 rounded-r-lg">
                "{rev.comment}"
              </p>
              
              <div className="text-[11px] text-muted/60 font-bold uppercase tracking-widest pt-2">
                {new Date(rev.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
