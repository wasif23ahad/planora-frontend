import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-inter-tight",
});

export const metadata: Metadata = {
  title: "Planora — Create, discover & join events",
  description: "A full-stack events platform for creating, discovering, and joining public or private events.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${interTight.variable} font-sans bg-background text-foreground flex flex-col min-h-screen`}>
        <AuthProvider>
          <Navbar />
          <main className="grow animate-fade-in">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
