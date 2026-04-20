import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success";
  small?: boolean;
}

export function Button({
  children,
  variant = "primary",
  small = false,
  className = "",
  ...props
}: ButtonProps) {
  const variants = {
    primary: "bg-accent text-white border-none",
    secondary: "bg-transparent text-foreground border border-border-base",
    ghost: "bg-transparent text-muted underline border-none", // ghost in root has underline
    danger: "bg-danger text-white border-none",
    success: "bg-success text-white border-none",
  };

  return (
    <button
      {...props}
      className={`
        ${variants[variant]}
        ${small ? "px-3.5 py-1.5 text-[13px]" : "px-5 py-2.5 text-[14px]"}
        font-medium rounded-radius-btn cursor-pointer transition-opacity duration-150
        hover:opacity-80 active:opacity-100 disabled:opacity-40 disabled:cursor-not-allowed
        font-inherit
        ${className}
      `}
    >
      {children}
    </button>
  );
}
