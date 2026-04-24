"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Button } from "@/components/ui/Button";

export default function TicketPage() {
  const { id } = useParams();
  const router = useRouter();
  const [participation, setParticipation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const { data } = await api.get(`/events/participations/${id}`);
        setParticipation(data);
      } catch (err) {
        console.error("Failed to fetch ticket:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchTicket();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
       <div className="animate-pulse text-secondary font-headline text-lg">Generating your e-ticket...</div>
    </div>
  );

  if (!participation) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-surface">
       <span className="material-symbols-outlined text-[64px] text-error opacity-30 mb-4">block</span>
       <h2 className="text-2xl font-headline font-bold text-on-surface">Ticket Not Found</h2>
       <p className="text-secondary mt-2 mb-8">We couldn't locate this participation record.</p>
       <Button onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
    </div>
  );

  if (participation.status === "PENDING") return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-surface">
       <span className="material-symbols-outlined text-[64px] text-primary opacity-50 mb-4">pending_actions</span>
       <h2 className="text-2xl font-headline font-bold text-on-surface">Ticket Pending Approval</h2>
       <p className="text-secondary mt-2 mb-8">The host has not yet approved your request to join.</p>
       <Button onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
    </div>
  );

  const event = participation.event;
  const user = participation.user;
  const payment = participation.payment;

  return (
    <div className="min-h-screen bg-surface-container-lowest py-12 md:py-20 px-4">
      <div className="max-w-2xl mx-auto" id="ticket-container">
        
        {/* Ticket Wrapper */}
        <div className="bg-surface rounded-3xl overflow-hidden shadow-2xl border border-outline-variant/20 relative">
          
          {/* Top Notch / Header */}
          <div className="bg-primary p-8 text-on-primary flex justify-between items-center">
             <div>
                <h1 className="text-3xl font-headline font-bold tracking-tighter uppercase">Planora Ticket</h1>
                <p className="text-xs font-bold opacity-80 tracking-widest uppercase mt-1">Official Entry Pass</p>
             </div>
             <span className="material-symbols-outlined text-5xl opacity-30">confirmation_number</span>
          </div>

          {/* Ticket Content */}
          <div className="p-8 md:p-12 space-y-12">
             
             {/* Event Section */}
             <div className="space-y-4">
                <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">Event Details</p>
                <h2 className="text-4xl font-headline font-bold text-on-surface leading-tight">{event.title}</h2>
                <div className="flex flex-wrap gap-6 mt-4">
                   <div className="flex items-center gap-2 text-secondary">
                      <span className="material-symbols-outlined text-base text-primary">calendar_today</span>
                      <span className="font-medium">{new Date(event.date).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                   </div>
                   <div className="flex items-center gap-2 text-secondary">
                      <span className="material-symbols-outlined text-base text-primary">location_on</span>
                      <span className="font-medium">{event.venue}</span>
                   </div>
                </div>
             </div>

             {/* Divider with holes */}
             <div className="relative h-px bg-outline-variant/30 my-8">
                <div className="absolute -left-16 -top-3 w-6 h-6 rounded-full bg-surface-container-lowest"></div>
                <div className="absolute -right-16 -top-3 w-6 h-6 rounded-full bg-surface-container-lowest"></div>
             </div>

             {/* User & Payment Section */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                
                <div className="space-y-6">
                   <div>
                      <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-2">Participant</p>
                      <p className="text-xl font-headline font-semibold text-on-surface">{user.name}</p>
                      <p className="text-sm text-secondary">{user.email}</p>
                   </div>
                   <div>
                      <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-2">Phone Number</p>
                      <p className="text-xl font-headline font-semibold text-on-surface">{participation.phoneNumber || "Not provided"}</p>
                   </div>
                </div>

                <div className="space-y-6">
                   <div>
                      <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-2">Payment Info</p>
                      <p className="text-2xl font-headline font-bold text-primary">
                         {payment ? `৳${(payment.amountCents / 100).toLocaleString()}` : "Free"}
                      </p>
                      <p className="text-xs text-secondary mt-1">Status: <span className="text-success font-bold uppercase">{participation.status}</span></p>
                   </div>
                   <div>
                      <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-2">Date of Payment</p>
                      <p className="text-sm font-medium text-on-surface">
                         {new Date(participation.createdAt).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                   </div>
                </div>
             </div>

             {/* Footer / ID */}
             <div className="pt-12 flex flex-col items-center gap-6 border-t border-outline-variant/10 text-center">
                <div className="bg-surface-container-low px-8 py-4 rounded-xl font-mono text-sm tracking-widest text-secondary border border-outline-variant/20">
                   ID: {participation.id.toUpperCase()}
                </div>
                <p className="text-[10px] text-secondary/50 max-w-xs leading-relaxed">
                   This is a digitally generated ticket. Please present this screen or a printout at the venue for verification.
                </p>
             </div>

          </div>

          {/* Decorative side stripes */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col gap-2">
             {[...Array(12)].map((_, i) => <div key={i} className="w-1 h-4 bg-outline-variant/10 rounded-full"></div>)}
          </div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-2">
             {[...Array(12)].map((_, i) => <div key={i} className="w-1 h-4 bg-outline-variant/10 rounded-full"></div>)}
          </div>

        </div>

        {/* Actions */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center print:hidden">
           <Button variant="outline" icon="print" onClick={() => window.print()}>Print Ticket</Button>
           <Button variant="ghost" icon="arrow_back" onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
        </div>

      </div>

      <style jsx global>{`
        @media print {
          @page {
            margin: 0.5cm;
            size: portrait;
          }
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            -webkit-print-color-adjust: exact;
          }
          .min-h-screen {
            min-height: 0 !important;
            height: auto !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          #ticket-container {
            position: relative !important;
            margin: 0 auto !important;
            padding: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            box-shadow: none !important;
            border: none !important;
            page-break-inside: avoid;
          }
          /* Shrink spacing for print */
          #ticket-container .p-8, #ticket-container .p-12 {
            padding: 1.5rem !important;
          }
          #ticket-container .space-y-12 > * + * {
            margin-top: 1.5rem !important;
          }
          #ticket-container h1 { font-size: 1.5rem !important; }
          #ticket-container h2 { font-size: 1.5rem !important; }
          #ticket-container .text-4xl { font-size: 1.5rem !important; }
          #ticket-container .py-12, #ticket-container .py-20 {
            padding-top: 0 !important;
            padding-bottom: 0 !important;
          }
          .print\\:hidden, nav, footer, .mt-12 {
            display: none !important;
          }
          body * {
            visibility: hidden;
          }
          #ticket-container, #ticket-container * {
            visibility: visible;
          }
        }
      `}</style>
    </div>
  );
}
