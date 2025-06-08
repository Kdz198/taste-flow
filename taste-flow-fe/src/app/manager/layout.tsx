'use client';

import Link from 'next/link';

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    { href: '/manager/category', label: 'Categories' },
    { href: '/manager/user', label: 'Users' },
    { href: '/manager/dish', label: 'Dishes' },
    // Add more items here in the future
  ];

  return (
    <div className="flex min-h-screen bg-[#1B1B1B] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#2A2A2A] p-4">
        <h2 className="text-xl font-bold mb-4">Management Dashboard</h2>
        <nav>
          <ul>
            {navItems.map((item) => (
              <li key={item.href} className="mb-2">
                <Link href={item.href} className="block p-2 hover:bg-[#3A3A3A] rounded">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}