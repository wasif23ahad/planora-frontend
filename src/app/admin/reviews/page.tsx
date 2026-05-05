"use client";

import React, { useEffect, useState } from "react";
import { TablePager } from "@/components/ui/TablePager";
import { useTable } from "@/hooks/useTable";
import api from "@/lib/api";
import { StarRating } from "@/components/ui/StarRating";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/reviews")
      .then(({ data }) => setReviews(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const t = useTable(reviews, {
    searchKeys: ["event.title", "user.name", "comment"],
    pageSize: 10
  });

  if (loading) return (
    <div className="py-24 text-center text-secondary animate-pulse font-headline">
      Loading community reviews...
    </div>
  );

  return (
    <div className="space-y-12">
      <header>
        <h1 className="font-headline text-4xl font-semibold tracking-tighter text-on-surface">All reviews</h1>
        <p className="text-secondary mt-1">Read what attendees said about events on the platform.</p>
      </header>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="relative flex-grow w-full md:w-auto">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-secondary text-[20px]">search</span>
          <input
            value={t.search}
            onChange={(e) => { t.setSearch(e.target.value); t.setPage(1); }}
            placeholder="Search event, user, or comment…"
            className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl pl-12 pr-4 py-3 text-sm focus:border-primary outline-none transition-colors"
          />
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden ambient-shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-body text-sm border-collapse">
            <thead className="bg-surface-container-low border-b border-outline-variant/30 text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">
              <tr>
                <th className="px-6 py-4">Event</th>
                <th className="px-6 py-4">Reviewer</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4">Comment</th>
                <th className="px-6 py-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {t.rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-24 text-secondary">
                    <div className="flex flex-col items-center gap-4">
                      <span className="material-symbols-outlined text-[48px] opacity-20">rate_review</span>
                      <p>No reviews found matching your search.</p>
                      {reviews.length > 0 && (
                        <button onClick={() => t.setSearch("")} className="text-primary text-sm font-bold uppercase tracking-wider hover:underline">Clear Search</button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : t.rows.map((r) => (
                <tr key={r.id} className="hover:bg-surface-container-low/40 transition-colors group">
                  <td className="px-6 py-5 font-medium text-on-surface">
                    {r.event?.title}
                  </td>
                  <td className="px-6 py-5 text-on-surface-variant">
                    {r.user?.name}
                  </td>
                  <td className="px-6 py-5">
                    <StarRating rating={r.rating} />
                  </td>
                  <td className="px-6 py-5 text-on-surface-variant max-w-md">
                    <p className="line-clamp-2 leading-relaxed">{r.comment}</p>
                  </td>
                  <td className="px-6 py-5 text-right text-secondary text-xs tabular-nums">
                    {new Date(r.createdAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <TablePager 
          page={t.page} 
          totalPages={t.totalPages} 
          total={t.total} 
          pageSize={t.pageSize} 
          onChange={t.setPage} 
        />
      </div>
    </div>
  );
}
