
import { ReactNode } from 'react';

interface MenuLayoutProps {
  children: ReactNode;
}

export default function MenuLayout({ children }: MenuLayoutProps) {
  return (
    <div className="min-h-screen bg-[#1B1B1B] text-white">
      {children}
    </div>
  );
}