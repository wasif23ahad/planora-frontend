"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";

export default function CheckoutInfoPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get(`/events/${id}`);
        setEvent(data);
        if (user) {
          setFormData({
            name: user.name || "",
            email: user.email || "",
            phoneNumber: user.phoneNumber || ""
          });
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // 1. Update user profile if info changed or missing
      await api.patch("/auth/profile", {
        name: formData.name,
        phoneNumber: formData.phoneNumber
      });
      await refreshUser();

      // 2. Proceed with registration
      const displayFee = event.fee ?? (event.feeCents ? event.feeCents / 100 : 0);
      if (displayFee > 0) {
        const { data } = await api.post("/payments/checkout", { 
          eventId: event.id, 
          phoneNumber: formData.phoneNumber 
        });
        window.location.href = data.url;
      } else {
        await api.post(`/events/${event.id}/join`, { 
          phoneNumber: formData.phoneNumber 
        });
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      console.error("Error response data:", err.response?.data);
      const message = err.response?.data?.error?.message || err.response?.data?.message || "Something went wrong. Please try again.";
      alert(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-headline animate-pulse">Preparing your registration...</div>;

  if (!event) return <div className="min-h-screen flex items-center justify-center">Event not found.</div>;

  return (
    <div className="min-h-screen bg-surface-container-lowest py-12 px-4 md:py-20">
      <div className="max-w-xl mx-auto space-y-8">
        
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-headline font-bold text-on-surface tracking-tight">Complete Your Info</h1>
          <p className="text-secondary">We need a few details to generate your official e-ticket for <span className="font-semibold text-primary">{event.title}</span>.</p>
        </header>

        <div className="bg-surface rounded-3xl border border-outline-variant/20 p-8 md:p-12 shadow-xl ambient-shadow">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-2">
               <label className="text-xs font-bold text-secondary uppercase tracking-widest ml-1">Full Name</label>
               <input 
                 type="text"
                 required
                 className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-body text-on-surface"
                 placeholder="Enter your full name"
                 value={formData.name}
                 onChange={(e) => setFormData({...formData, name: e.target.value})}
               />
            </div>

            <div className="space-y-2">
               <label className="text-xs font-bold text-secondary uppercase tracking-widest ml-1">Email Address</label>
               <input 
                 type="email"
                 readOnly
                 className="w-full bg-surface-container-low/50 border border-outline-variant/10 rounded-xl px-4 py-4 font-body text-secondary cursor-not-allowed"
                 value={formData.email}
               />
               <p className="text-[10px] text-secondary/50 ml-1 italic">Email is managed via your account settings.</p>
            </div>

            <div className="space-y-2">
               <label className="text-xs font-bold text-secondary uppercase tracking-widest ml-1">Phone Number</label>
               <input 
                 type="tel"
                 required
                 className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-body text-on-surface"
                 placeholder="+880 1XXX-XXXXXX"
                 value={formData.phoneNumber}
                 onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
               />
               <p className="text-[10px] text-secondary/50 ml-1">Your number will be printed on the e-ticket for venue verification.</p>
            </div>

            <div className="pt-8 space-y-4">
              <Button 
                type="submit" 
                className="w-full py-6" 
                size="lg" 
                disabled={submitting}
                icon={submitting ? undefined : (event.feeCents > 0 ? "payments" : "how_to_reg")}
              >
                {submitting ? "Processing..." : (event.feeCents > 0 ? `Pay ৳${(event.feeCents/100).toLocaleString()} & Register` : "Confirm Registration")}
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                className="w-full"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>

        <div className="flex items-center justify-center gap-6 text-secondary opacity-30 grayscale">
           <img src="/sslcommerz-logo.png" alt="SSLCommerz" className="h-6" />
           <span className="material-symbols-outlined text-4xl">verified_user</span>
        </div>

      </div>
    </div>
  );
}
