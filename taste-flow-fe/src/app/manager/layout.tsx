"use client";

import { BarChart3, ChevronRight, FolderOpen, LogOut, Settings, Users, UtensilsCrossed, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    {
      href: "/manager/dashboard",
      label: "Dashboard",
      icon: BarChart3,
      description: "Overview & Analytics",
    },
    {
      href: "/manager/category",
      label: "Categories",
      icon: FolderOpen,
      description: "Manage food categories",
    },
    {
      href: "/manager/user",
      label: "Users",
      icon: Users,
      description: "Manage user accounts",
    },
    {
      href: "/manager/dish",
      label: "Dishes",
      icon: UtensilsCrossed,
      description: "Manage menu items",
    },
  ];

  const bottomNavItems = [
    {
      href: "/manager/settings",
      label: "Settings",
      icon: Settings,
      description: "System settings",
    },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="flex min-h-screen bg-[#0F0F0F] text-white">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-50
        ${isSidebarCollapsed ? "w-20" : "w-80"}
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        bg-gradient-to-b from-[#1A1A1A] to-[#141414]
        border-r border-[#2A2A2A]
        transition-all duration-300 ease-in-out
        flex flex-col
      `}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#2A2A2A]">
          <div className="flex items-center justify-between">
            {!isSidebarCollapsed && (
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">TasteFlow</h1>
                <p className="text-sm text-gray-400 mt-1">Management Dashboard</p>
              </div>
            )}

            {/* Desktop Toggle */}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg bg-[#2A2A2A] hover:bg-[#3A3A3A] transition-colors"
            >
              <ChevronRight className={`w-4 h-4 transition-transform ${isSidebarCollapsed ? "" : "rotate-180"}`} />
            </button>

            {/* Mobile Close */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg bg-[#2A2A2A] hover:bg-[#3A3A3A] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 pl-0">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    group flex items-center p-3 rounded-xl transition-all duration-200
                    ${
                      active
                        ? "bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 text-orange-400"
                        : "hover:bg-[#2A2A2A] text-gray-300 hover:text-white"
                    }
                  `}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div
                    className={`
                    flex items-center justify-center w-10 h-10 rounded-lg transition-colors
                    ${active ? "bg-gradient-to-r from-orange-500 to-red-500 text-white" : "bg-[#2A2A2A] group-hover:bg-[#3A3A3A]"}
                  `}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  {!isSidebarCollapsed && (
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{item.label}</span>
                        {active}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-[#2A2A2A] space-y-2">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  group flex items-center p-3 rounded-xl transition-all duration-200
                  ${
                    active
                      ? "bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 text-orange-400"
                      : "hover:bg-[#2A2A2A] text-gray-300 hover:text-white"
                  }
                `}
              >
                <div
                  className={`
                  flex items-center justify-center w-10 h-10 rounded-lg transition-colors
                  ${active ? "bg-gradient-to-r from-orange-500 to-red-500 text-white" : "bg-[#2A2A2A] group-hover:bg-[#3A3A3A]"}
                `}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {!isSidebarCollapsed && (
                  <div className="ml-3 flex-1">
                    <span className="font-medium">{item.label}</span>
                    <p className="text-xs text-gray-400 mt-0.5">{item.description}</p>
                  </div>
                )}
              </Link>
            );
          })}

          {/* User Profile */}
          {!isSidebarCollapsed && (
            <div className="pt-4">
              <div className="flex items-center p-3 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A]">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white font-semibold">
                  A
                </div>
                <div className="ml-3 flex-1">
                  <div className="font-medium">Admin User</div>
                  <div className="text-xs text-gray-400">admin@tasteflow.com</div>
                </div>
                <button className="p-1 hover:bg-[#2A2A2A] rounded-lg transition-colors">
                  <LogOut className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 bg-[#0F0F0F]">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
