"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

function LoginSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      // 1. Fetch user data using the token
      // We set the token in a temporary way or pass it to login
      const fetchUser = async () => {
        try {
          // Temporarily set token for this request
          const response = await api.get("/auth/me", {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          // 2. Call login context to save token and user
          login(token, response.data);
          
          // 3. Redirect to dashboard
          router.push("/dashboard");
        } catch (error) {
          console.error("Failed to fetch user after Google login:", error);
          router.push("/login?error=social_login_failed");
        }
      };

      fetchUser();
    } else {
      router.push("/login");
    }
  }, [searchParams, login, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-secondary font-medium animate-pulse">Completing secure login...</p>
    </div>
  );
}

export default function LoginSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginSuccessContent />
    </Suspense>
  );
}
