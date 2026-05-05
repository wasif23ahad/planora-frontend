"use client";

import React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

const POST_CONTENT: Record<string, any> = {
  "hosting-your-first-event": {
    title: "Hosting your first event on Planora",
    tag: "Guide",
    date: "2026-04-22",
    minutes: 5,
    content: (
      <>
        <p>Creating an event on Planora is designed to be as seamless as possible. Whether you're planning a small community meetup or a large-scale tech conference, our platform provides the tools you need to reach your audience effectively.</p>
        
        <h3>Step 1: The Basics</h3>
        <p>Start by heading to your <strong>Dashboard</strong> and clicking on the <strong>"Create Event"</strong> button. You'll need to provide a clear, catchy title and a high-quality cover image. Remember, the cover image is the first thing potential attendees see, so make it count!</p>
        
        <h3>Step 2: Visibility & Access</h3>
        <p>One of Planora's key features is the choice between <strong>Public</strong> and <strong>Private</strong> visibility. Public events are listed on our homepage and can be discovered by anyone. Private events are hidden and require a direct invitation or a secret link to join.</p>
        
        <h3>Step 3: Setting the Fee</h3>
        <p>Decide if your event is free or paid. For paid events, we integrate with <strong>SSLCommerz</strong> to handle transactions securely. You set the price, and we handle the ticket issuance once the payment is confirmed.</p>
        
        <p>Once you hit publish, your event is live! You can track registrations and manage participants directly from your event management panel.</p>
      </>
    )
  },
  "moderation-playbook": {
    title: "How we moderate paid events",
    tag: "Trust & Safety",
    date: "2026-04-08",
    minutes: 4,
    content: (
      <>
        <p>Trust is the foundation of Planora. To ensure the safety of our community, especially when money is involved, we implement a rigorous moderation process for all paid events.</p>
        
        <h3>Automated Checks</h3>
        <p>Every event listing goes through an initial automated scan for prohibited content or suspicious patterns. If an event is flagged, it is immediately moved to a manual review queue.</p>
        
        <h3>Manual Verification</h3>
        <p>Our team of Managers manually reviews every paid event. We verify the identity of the host, the legitimacy of the venue, and the clarity of the refund policy. Events that don't meet our community standards are pulled from the platform.</p>
        
        <h3>Reporting System</h3>
        <p>We empower our users to act as moderators. Every event page has a <strong>"Report"</strong> button. If you spot something that doesn't feel right, flag it, and a Manager will review it within 24 hours.</p>
      </>
    )
  },
  "private-vs-public": {
    title: "Private vs public — what's the right call?",
    tag: "Playbook",
    date: "2026-03-29",
    minutes: 3,
    content: (
      <>
        <p>Choosing the right visibility setting is crucial for the success of your event. Here's a quick guide to help you decide.</p>
        
        <h3>When to go Public</h3>
        <ul>
          <li>You want to reach as many people as possible.</li>
          <li>Your event is open to the general community.</li>
          <li>You're hosting a workshop, conference, or public performance.</li>
        </ul>
        
        <h3>When to stay Private</h3>
        <ul>
          <li>The event is for a specific group of friends or colleagues.</li>
          <li>You want to control exactly who receives an invite.</li>
          <li>You're hosting a private dinner, a closed-door meeting, or a surprise party.</li>
        </ul>
        
        <p>Remember, you can always change the visibility of an event before registrations start. Once people have signed up, we recommend keeping the settings consistent to avoid confusion.</p>
      </>
    )
  },
  "ssl-commerz-flow": {
    title: "What happens when someone pays for your ticket",
    tag: "Engineering",
    date: "2026-03-15",
    minutes: 6,
    content: (
      <>
        <p>Understanding the payment lifecycle is important for both hosts and attendees. At Planora, we use <strong>SSLCommerz</strong>, Bangladesh's leading payment gateway, to ensure every transaction is secure.</p>
        
        <h3>1. The Checkout Initiation</h3>
        <p>When an attendee clicks "Join" on a paid event, they are redirected to our secure checkout page. We collect the necessary details and prepare the transaction payload for SSLCommerz.</p>
        
        <h3>2. The Secure Gateway</h3>
        <p>The user is redirected to the SSLCommerz platform where they can choose from 30+ payment methods, including bKash, Nagad, and local bank cards. Planora never sees or stores your card details.</p>
        
        <h3>3. Handshake & Confirmation</h3>
        <p>Once the payment is successful, SSLCommerz sends a post-back notification to our server. We verify the transaction hash, mark the ticket as paid, and instantly generate a digital ticket for the attendee.</p>
        
        <p>This end-to-end flow typically takes less than 60 seconds, providing a smooth experience for the user and peace of mind for the host.</p>
      </>
    )
  }
};

export default function BlogPostDetail() {
  const { slug } = useParams();
  const router = useRouter();
  const post = POST_CONTENT[slug as string];

  if (!post) {
    return (
      <div className="py-24 text-center">
        <h1 className="text-2xl font-headline font-bold text-on-surface">Post not found</h1>
        <Button variant="primary" className="mt-4" onClick={() => router.push("/blog")}>Back to blog</Button>
      </div>
    );
  }

  return (
    <article className="max-w-[800px] mx-auto px-4 md:px-8 py-24 animate-fade-in">
      <Link href="/blog" className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-12 group">
        <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
        Back to blog
      </Link>

      <header className="mb-16">
        <div className="flex items-center gap-3 mb-6 text-sm font-bold">
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary uppercase tracking-widest text-[10px]">{post.tag}</span>
          <span className="text-secondary">{new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
          <span className="text-secondary">·</span>
          <span className="text-secondary">{post.minutes} min read</span>
        </div>
        <h1 className="font-headline text-4xl md:text-6xl font-semibold tracking-[-0.04em] leading-[1.1] text-on-surface">
          {post.title}
        </h1>
      </header>

      <div className="prose prose-lg dark:prose-invert max-w-none 
        prose-headings:font-headline prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-on-surface
        prose-p:text-on-surface-variant prose-p:leading-relaxed
        prose-strong:text-on-surface
        prose-li:text-on-surface-variant">
        {post.content}
      </div>

      <footer className="mt-24 pt-12 border-t border-outline-variant/20 flex flex-col items-center text-center">
        <h4 className="font-headline font-bold text-on-surface mb-2">Thanks for reading</h4>
        <p className="text-secondary text-sm mb-8">Stay tuned for more updates from the Planora team.</p>
        <div className="flex gap-4">
           <Button variant="outline" onClick={() => router.push("/blog")}>All posts</Button>
           <Button variant="primary" onClick={() => router.push("/register")}>Get started with Planora</Button>
        </div>
      </footer>
    </article>
  );
}
