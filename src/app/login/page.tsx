"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const DEMO_ACCOUNTS = [
  { role: "User",    email: "john@example.com",    password: "password123" },
  { role: "Manager", email: "owner@planora.com",   password: "password123" },
  { role: "Admin",   email: "admin@planora.com",   password: "password123" },
];

type FormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { login } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/login", data);
      login(response.data.token, response.data.user);
      router.push("/dashboard");
    } catch (err: any) {
      const message = err.response?.data?.message || "Login failed. Please check your credentials.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (email: string) => {
    const d = DEMO_ACCOUNTS.find(acc => acc.email === email);
    if (!d) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/login", { email: d.email, password: d.password });
      login(response.data.token, response.data.user);
      router.push("/dashboard");
    } catch (err: any) {
      setError("Demo login failed. Please ensure the backend is running and seeded.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] bg-surface-container-lowest rounded-xl border border-outline-variant/20 ambient-shadow p-8 flex flex-col items-center">
        {/* Brand / Header */}
        <div className="text-center mb-8">
          <h1 className="font-headline text-3xl font-semibold text-on-surface mb-2">Planora</h1>
          <p className="font-body text-secondary text-sm">Manage your community with confidence.</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="w-full bg-error/5 text-error border border-error/10 rounded-lg p-3 text-xs text-center mb-6 font-medium animate-slide-up">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
          <div className="space-y-4">
            <Input
              label="Email Address"
              placeholder="hello@planora.com"
              {...register("email")}
              error={errors.email?.message}
            />
            
            <div className="space-y-1.5">
               <div className="flex justify-between items-center">
                  <label className="block font-label text-xs font-semibold text-on-surface uppercase tracking-widest">Password</label>
                  <Link href="#" className="font-body text-xs text-primary hover:text-primary-container transition-colors duration-200">Forgot?</Link>
               </div>
               <Input
                 label="" // Label handled above
                 type="password"
                 placeholder="••••••••"
                 {...register("password")}
                 error={errors.password?.message}
               />
            </div>
          </div>

          {/* Demo accounts */}
          <div className="space-y-3 pt-2">
            <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">Demo accounts (Instant Login)</p>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_ACCOUNTS.map((d) => (
                <button
                  key={d.email}
                  type="button"
                  onClick={() => handleDemoLogin(d.email)}
                  className="px-2 py-2 text-[11px] font-semibold uppercase tracking-wider rounded-lg border border-outline-variant bg-surface-container-low text-on-surface hover:border-primary hover:text-primary transition-colors"
                >
                  {d.role}
                </button>
              ))}
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Please wait…" : "Log In"}
          </Button>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/30"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-surface-container-lowest px-2 text-secondary font-medium tracking-widest">Or continue with</span>
            </div>
          </div>

          <Button
            type="button"
            variant="secondary"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => {
              window.location.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/auth/google`;
            }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
              />
            </svg>
            Google
          </Button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 text-center">
          <p className="font-body text-sm text-secondary">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary hover:text-primary-container font-medium transition-colors duration-200 underline decoration-primary underline-offset-4 hover:opacity-80">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}