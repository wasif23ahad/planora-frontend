"use client";

import React, { useState, useEffect } from "react";
import { TablePager } from "@/components/ui/TablePager";
import { useTable } from "@/hooks/useTable";
import api from "@/lib/api";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await api.get("/support");
        setMessages(data);
      } catch (err) {
        console.error("Failed to load messages:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const t = useTable(messages, {
    searchKeys: ["sender.name", "sender.email", "content"],
    pageSize: 5
  });

  if (loading) return <div className="py-24 text-center text-secondary animate-pulse font-headline">Loading community inquiries...</div>;

  return (
    <div className="space-y-12">
      <header>
        <h1 className="font-headline text-4xl font-semibold tracking-[-0.03em] text-on-surface">Support Inquiries</h1>
        <p className="text-secondary mt-1">Direct messages from our community members.</p>
      </header>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="relative flex-grow w-full md:w-auto">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-secondary text-[20px]">search</span>
          <input
            value={t.search}
            onChange={(e) => { t.setSearch(e.target.value); t.setPage(1); }}
            placeholder="Search by name, email, or content…"
            className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl pl-12 pr-4 py-3 text-sm focus:border-primary outline-none transition-colors"
          />
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 overflow-hidden ambient-shadow">
        {t.rows.length === 0 ? (
          <div className="py-32 text-center text-secondary">
            <span className="material-symbols-outlined text-4xl mb-4 opacity-20">chat_bubble_outline</span>
            <p>{messages.length === 0 ? "No support messages found." : "No messages match your search."}</p>
            {messages.length > 0 && (
              <button onClick={() => t.setSearch("")} className="text-primary text-sm font-bold uppercase tracking-wider hover:underline mt-4">Clear Search</button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-outline-variant/10">
            {t.rows.map((msg) => (
              <div key={msg.id} className="p-8 hover:bg-surface-container-low/30 transition-colors flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                        {msg.sender?.name?.[0]}
                     </div>
                     <div>
                        <div className="text-on-surface font-semibold">{msg.sender?.name}</div>
                        <div className="text-xs text-secondary">{msg.sender?.email}</div>
                     </div>
                  </div>
                  <p className="text-on-surface-variant leading-relaxed text-sm bg-surface-container-low p-5 rounded-2xl border border-outline-variant/10">
                    {msg.content}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-[10px] font-bold text-secondary uppercase tracking-[0.1em] mb-2">Submitted</div>
                  <div className="text-on-surface font-medium text-xs">
                    {new Date(msg.createdAt).toLocaleDateString("en-US", { 
                      month: 'short', day: 'numeric', year: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            ))}
            <TablePager 
              page={t.page} 
              totalPages={t.totalPages} 
              total={t.total} 
              pageSize={t.pageSize} 
              onChange={t.setPage} 
            />
          </div>
        )}
      </div>
    </div>
  );
}
