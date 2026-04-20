import React from "react";

interface SectionTitleProps {
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function SectionTitle({ children, action, className = "" }: SectionTitleProps) {
  return (
    <div className={`flex items-baseline justify-between mb-8 ${className}`}>
      <h2 className="text-[24px] font-semibold text-foreground tracking-[-0.02em] m-0 font-tight leading-tight">
        {children}
      </h2>
      {action && (
        <div className="flex items-center">
          {action}
        </div>
      )}
    </div>
  );
}
