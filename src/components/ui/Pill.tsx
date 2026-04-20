import React from "react";

interface CategoryPillProps {
  type: string;
  feePercent: number; // fee in cents
}

interface StatusPillProps {
  status: string;
}

export const CategoryPill = ({ type, feePercent }: CategoryPillProps) => {
  const isPaid = feePercent > 0;
  const key = `${type.toLowerCase()}-${isPaid ? "paid" : "free"}`;
  
  const map: Record<string, { bg: string, fg: string, label: string }> = {
    "public-free":  { bg:"#EAF4EC", fg:"#1F5F3E", label:"Public Free" },
    "public-paid":  { bg:"#F0E9F7", fg:"#3B2BFF", label:"Public Paid" },
    "private-free": { bg:"#F5F1E8", fg:"#6B5719", label:"Private Free" },
    "private-paid": { bg:"#F7E9EA", fg:"#8B2624", label:"Private Paid" },
  };

  const s = map[key] || map["public-free"];

  return (
    <span 
      style={{ backgroundColor: s.bg, color: s.fg }}
      className="inline-block px-2 py-0.5 rounded-[20px] text-[12px] font-semibold uppercase tracking-[0.06em] whitespace-nowrap"
    >
      {s.label}
    </span>
  );
};

export const StatusPill = ({ status }: StatusPillProps) => {
  const map: Record<string, { bg: string, fg: string }> = {
    pending:   { bg:"#FEF3C7", fg:"#B4600E" },
    approved:  { bg:"#DCFCE7", fg:"#0F7B5A" },
    featured:  { bg:"#EDE9FF", fg:"#3B2BFF" },
    banned:    { bg:"#FEE2E2", fg:"#B4302E" },
    active:    { bg:"#DCFCE7", fg:"#0F7B5A" },
    suspended: { bg:"#FEE2E2", fg:"#B4302E" },
  };

  const s = map[status.toLowerCase()] || map.pending;

  return (
    <span 
      style={{ backgroundColor: s.bg, color: s.fg }}
      className="inline-block px-2.5 py-0.5 rounded-[20px] text-[12px] font-semibold uppercase tracking-[0.05em] whitespace-nowrap"
    >
      {status}
    </span>
  );
};
