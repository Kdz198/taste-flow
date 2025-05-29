// src/components/ClientLayoutWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
 const isPulicPage = pathname.startsWith('/auth') 
  const isAuthPage = pathname.startsWith('/auth') || pathname.startsWith('/profile')
  
  return (
    <>
      {!isAuthPage && <Header />}
      <main className="min-h-screen mx-auto px-4 py-8 bg-[#1B1B1B] text-white">
        {children}
      </main>
      {!isPulicPage && <Footer />}
    </>
  );
}
