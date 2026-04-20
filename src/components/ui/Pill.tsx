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
    "public-free":  { className:"bg-[#EAF4EC] text-[#1F5F3E] border-[#1F5F3E]/20", label:"Public Free" },
    "public-paid":  { className:"bg-[#F0E9F7] text-[#3B2BFF] border-[#3B2BFF]/20", label:"Public Paid" },
    "private-free": { className:"bg-[#F5F1E8] text-[#6B5719] border-[#6B5719]/20", label:"Private Free" },
    "private-paid": { className:"bg-[#F7E9EA] text-[#8B2624] border-[#8B2624]/20", label:"Private Paid" },
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
    pending:   { className: "bg-[#F5F1E8] text-[#6B5719] border-[#6B5719]/20" },
    approved:  { className: "bg-[#EAF4EC] text-[#1F5F3E] border-[#1F5F3E]/20" },
    featured:  { className: "bg-[#F0E9F7] text-[#3B2BFF] border-[#3B2BFF]/20" },
    banned:    { className: "bg-[#F7E9EA] text-[#8B2624] border-[#8B2624]/20" },
    active:    { className: "bg-[#EAF4EC] text-[#1F5F3E] border-[#1F5F3E]/20" },
    suspended: { className: "bg-[#F7E9EA] text-[#8B2624] border-[#8B2624]/20" },
  };

  const s = map[status.toLowerCase()] || map.pending;

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-label font-semibold tracking-wider uppercase border ${s.className}`}>
      {status}
    </span>
  );
};
