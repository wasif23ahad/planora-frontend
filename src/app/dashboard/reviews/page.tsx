"use client";

import { useState, useEffect } from "react";
import { StarRating } from "@/components/ui/StarRating";
import { Button } from "@/components/ui/Button";
import api from "@/lib/api";

export default function MyReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/reviews/me")
      .then(({ data }) => setReviews(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/reviews/${id}`);
      setReviews(prev => prev.filter(r => r.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.error?.message || "Failed to delete");
    }
  };

  if (loading) return <div className="py-12 text-[14px] text-muted">Loading…</div>;

  return (
    <div>
      <h1 className="text-[28px] font-bold text-foreground tracking-[-0.02em] mb-8">My Reviews</h1>

      <div className="flex flex-col gap-4">
        {reviews.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border-base rounded-[12px] text-muted text-[14px]">
            No reviews yet.
          </div>
        ) : reviews.map(r => (
          <div key={r.id} className="bg-white rounded-[12px] border border-border-base px-6 py-5">
            <div className="flex justify-between mb-2.5">
              <div className="text-[15px] font-semibold text-foreground">{r.event?.title}</div>
              <StarRating value={r.rating} size={14} />
            </div>
            <p className="text-[14px] text-muted leading-[1.7] mb-3.5">{r.comment}</p>
            <div className="flex justify-between items-center">
              <div className="text-[12px] text-muted">{new Date(r.createdAt).toLocaleDateString()}</div>
              <div className="flex gap-2">
                <Button variant="ghost" small>Edit</Button>
                <Button variant="danger" small onClick={() => handleDelete(r.id)}>Delete</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
