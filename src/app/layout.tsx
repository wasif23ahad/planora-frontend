import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";

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
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('planora_theme');var s=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(!t&&s))document.documentElement.classList.add('dark');}catch(e){}`,
          }}
        />
      </head>
      <body className={`${inter.variable} ${interTight.variable} font-body bg-surface text-on-surface antialiased flex flex-col min-h-screen selection:bg-primary-container selection:text-on-primary`}>
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main className="grow animate-fade-in">
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
