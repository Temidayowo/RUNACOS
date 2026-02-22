"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Bug,
  Newspaper,
  Calendar,
  FileText,
  FileQuestion,
  Users,
  Settings,
  Menu,
  X,
  LogOut,
  Bell,
  Search,
  ChevronDown,
  MessageSquare,
  IdCard,
  SlidersHorizontal,
  Crown,
} from "lucide-react";
import { cn, getInitials } from "@/lib/utils";

const sidebarLinks = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Carousel", href: "/admin/carousel", icon: SlidersHorizontal },
  { label: "Executives", href: "/admin/executives", icon: Crown },
  { label: "FRMS", href: "/admin/frms", icon: Bug },
  { label: "News", href: "/admin/news", icon: Newspaper },
  { label: "Events", href: "/admin/events", icon: Calendar },
  { label: "Articles", href: "/admin/articles", icon: FileText },
  { label: "Past Questions", href: "/admin/past-questions", icon: FileQuestion },
  { label: "Members", href: "/admin/members", icon: IdCard },
  { label: "Contact Messages", href: "/admin/contact", icon: MessageSquare },
  { label: "Users", href: "/admin/users", icon: Users },
];

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-navy-900 text-white transform transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-navy-700">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-navy-800 text-lg font-bold font-merriweather">R</span>
            </div>
            <div>
              <h1 className="font-bold font-merriweather text-sm">RUNACOS</h1>
              <p className="text-xs text-gray-400">Admin Panel</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden ml-auto text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            {sidebarLinks.map((link, i) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sm font-medium transition-colors",
                      active
                        ? "bg-navy-700 text-white border-l-3 border-blue-500"
                        : "text-gray-300 hover:bg-navy-800 hover:text-white"
                    )}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {link.label}
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Settings at bottom */}
          <div className="px-3 py-4 border-t border-navy-700">
            <Link
              href="/admin/settings"
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                pathname.startsWith("/admin/settings")
                  ? "bg-navy-700 text-white"
                  : "text-gray-300 hover:bg-navy-800 hover:text-white"
              )}
            >
              <Settings className="w-5 h-5" />
              Settings
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
        {/* Topbar */}
        <header className="bg-white h-16 shadow-sm flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden md:flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 w-64">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent outline-none text-sm text-gray-600 w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative text-gray-500 hover:text-gray-700 p-2">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-2 py-1.5 transition-colors"
              >
                <div className="w-8 h-8 bg-navy-800 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-medium">
                    {session?.user?.name ? getInitials(session.user.name) : "AD"}
                  </span>
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  {session?.user?.name || "Admin"}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50"
                  >
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{session?.user?.name}</p>
                      <p className="text-xs text-gray-500">{session?.user?.email}</p>
                    </div>
                    <button
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
