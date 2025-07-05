
"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password");

  return (
    <>
      {!isAuthPage && <Header />}
      <main className="min-h-screen mx-auto px-4 py-8 bg-[#1B1B1B] text-white">
        {children}
      </main>
      {!isAuthPage && <Footer />}
    </>
  );
}
