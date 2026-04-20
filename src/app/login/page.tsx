"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: FormData) => {
    setIsLoading(true);
    console.log("Login data:", data);
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
          <div className="text-[22px] font-bold tracking-tight mb-1.5 font-tight">Planora</div>
          <p className="text-[13px] text-muted font-medium italic">Welcome back.</p>
        </div>

        {success ? (
          <div className="text-center py-5">
            <div className="text-[28px] mb-3 text-success">✓</div>
            <div className="text-[15px] font-bold text-success">Logged in!</div>
            <p className="text-[13px] text-muted mt-1.5">Redirecting to dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

            <Button type="submit" className="w-full h-[42px] mt-2 font-semibold" disabled={isLoading}>
              {isLoading ? "Please wait..." : "Log in"}
            </Button>

            <div className="text-center mt-5 text-[13px] text-muted">
              Don't have an account?{" "}
              <Link href="/register" className="text-accent font-bold hover:underline">
                Sign up
              </Link>
            </div>

            <div className="text-center mt-3 text-[13px]">
              <span className="text-muted cursor-pointer hover:underline underline-offset-2">
                Forgot password?
              </span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
