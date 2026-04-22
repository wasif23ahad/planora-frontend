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

const registerSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { login } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      
      login(response.data.token, response.data.user);
      router.push("/dashboard");
    } catch (err: any) {
      const message = err.response?.data?.message || "Registration failed. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-[440px] bg-surface-container-lowest rounded-xl border border-outline-variant/20 ambient-shadow p-8 flex flex-col items-center">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-headline text-3xl font-semibold text-on-surface mb-2">Planora</h1>
          <p className="font-body text-secondary text-sm">Create your account. Join the community.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
            {error && (
              <div className="bg-error/5 text-error border border-error/10 rounded-lg p-3 text-xs text-center mb-4 font-medium animate-slide-up">
                {error}
              </div>
            )}
            
            <Input
              label="Full name"
              placeholder="Jhankar Mahbub"
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

            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Creating account…" : "Create account"}
              </Button>
            </div>

            <div className="relative my-6">
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

            <div className="text-center pt-6 text-sm text-secondary">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-bold hover:underline decoration-primary underline-offset-4">
                Log in
              </Link>
            </div>
          </form>
      </div>
    </div>
  );
}
