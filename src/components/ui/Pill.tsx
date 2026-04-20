import React from "react";

type CategoryType = "public" | "private";

interface CategoryPillProps {
  type: CategoryType;
  feePercent: number; // Changed to match domain logic if needed, or fee in sub-units
}

export function CategoryPill({ type, feePercent }: { type: string, fee: number }) {
  const isFree = feePercent === 0;
  
  const map = {
    "public-free":  { bg: "bg-[#EAF4EC]", text: "text-[#1F5F3E]", label: "Public Free" },
    "public-paid":  { bg: "bg-[#F0E9F7]", text: "text-[#3B2BFF]", label: "Public Paid" },
    "private-free": { bg: "bg-[#F5F1E8]", text: "text-[#6B5719]", label: "Private Free" },
    "private-paid": { bg: "bg-[#F7E9EA]", text: "text-[#8B2624]", label: "Private Paid" },
  };

  const key = `${type.toLowerCase()}-${feePercent === 0 ? "free" : "paid"}` as keyof typeof map;
  const config = map[key] || map["public-free"];

  return (
    <span className={`${config.bg} ${config.text} text-[12px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full whitespace-nowrap`}>
      {config.label}
    </span>
  );
}

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, { bg: string; text: string }> = {
    pending:   { bg: "bg-[#FEF3C7]", text: "text-[#B4600E]" },
    approved:  { bg: "bg-[#DCFCE7]", text: "text-[#0F7B5A]" },
    featured:  { bg: "bg-[#EDE9FF]", text: "text-[#3B2BFF]" },
    banned:    { bg: "bg-[#FEE2E2]", text: "text-[#B4302E]" },
    active:    { bg: "bg-[#DCFCE7]", text: "text-[#0F7B5A]" },
    suspended: { bg: "bg-[#FEE2E2]", text: "text-[#B4302E]" },
  };

  const config = map[status.toLowerCase()] || map.pending;

  return (
    <span className={`${config.bg} ${config.text} text-[12px] font-semibold tracking-wide uppercase px-2.5 py-0.5 rounded-full`}>
      {status}
    </span>
  );
}
