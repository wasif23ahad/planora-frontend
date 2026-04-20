import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("planora_token")?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/register");
  const isProtectedPage = request.nextUrl.pathname.startsWith("/dashboard") || request.nextUrl.pathname.startsWith("/admin");

  // Redirect unauthenticated users trying to access protected routes to login
  if (isProtectedPage && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect authenticated users trying to access auth pages back to dashboard
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Config to specify which routes this middleware should run on
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/register"],
};
