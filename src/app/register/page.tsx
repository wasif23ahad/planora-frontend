"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: FormData) => {
    setIsLoading(true);
    console.log("Register data:", data);
    // Mocking API call for F3 verification
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 900);
    }, 1200);
  };

  return (
    <div className="min-h-[calc(100vh-60px)] flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-[400px] bg-white rounded-2xl border border-border-base p-10 sm:p-12 shadow-sm">
        <div className="text-center mb-8">
          <div className="text-[22px] font-bold tracking-tight mb-1.5 font-tight text-foreground">Planora</div>
          <p className="text-[13px] text-muted font-medium italic">Create your account.</p>
        </div>

        {success ? (
          <div className="text-center py-5">
            <div className="text-[28px] mb-3 text-success">✓</div>
            <div className="text-[15px] font-bold text-success">Account created!</div>
            <p className="text-[13px] text-muted mt-1.5">Redirecting to dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full name"
              placeholder="Sadia Islam"
              {...register("name")}
              error={errors.name?.message}
            />
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              error={errors.email?.message}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              error={errors.password?.message}
            />
            <Input
              label="Confirm password"
              type="password"
              placeholder="••••••••"
              {...register("confirmPassword")}
              error={errors.confirmPassword?.message}
            />

            <Button type="submit" className="w-full h-[42px] mt-2 font-semibold" disabled={isLoading}>
              {isLoading ? "Please wait..." : "Create account"}
            </Button>

            <div className="text-center mt-5 text-[13px] text-muted">
              Already have an account?{" "}
              <Link href="/login" className="text-accent font-bold hover:underline">
                Log in
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
