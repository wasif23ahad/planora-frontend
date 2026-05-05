import React from "react";

interface CategoryPillProps {
  type: string;
  fee: number; // in BDT/base units
}

interface StatusPillProps {
  status: string;
}

export const CategoryPill = ({ type, fee }: CategoryPillProps) => {
  const isPaid = fee > 0;
  const key = `${type.toLowerCase()}-${isPaid ? "paid" : "free"}`;
  
  const map: Record<string, { className: string, label: string }> = {
    "public-free":  { className: "bg-primary-container text-on-primary-container border-primary/20", label: "Public Free" },
    "public-paid":  { className: "bg-accent-container text-on-accent-container border-accent/20", label: "Public Paid" },
    "private-free": { className: "bg-warn-container text-on-warn-container border-warn/20", label: "Private Free" },
    "private-paid": { className: "bg-secondary-container text-on-secondary-container border-outline-variant", label: "Private Paid" },
  };

  const s = map[key] || map["public-free"];

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-label font-semibold tracking-widest uppercase border ${s.className}`}>
      {s.label}
    </span>
  );
};

export const StatusPill = ({ status }: StatusPillProps) => {
  const map: Record<string, { className: string }> = {
    pending:   { className: "bg-warn-container text-on-warn-container border-warn/20" },
    approved:  { className: "bg-primary-container text-on-primary-container border-primary/20" },
    featured:  { className: "bg-accent-container text-on-accent-container border-accent/20" },
    banned:    { className: "bg-error-container text-on-error-container border-error/20" },
    active:    { className: "bg-primary-container text-on-primary-container border-primary/20" },
    suspended: { className: "bg-error-container text-on-error-container border-error/20" },
  };

  const s = map[status.toLowerCase()] || map.pending;

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-label font-semibold tracking-wider uppercase border ${s.className}`}>
      {status}
    </span>
  );
};
