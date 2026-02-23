"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
  CreditCard,
  GraduationCap,
} from "lucide-react";
import { cn, getInitials } from "@/lib/utils";

const sidebarLinks = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Pages", href: "/admin/pages", icon: SlidersHorizontal },
  { label: "Executives", href: "/admin/executives", icon: Crown },
  { label: "FRMS", href: "/admin/frms", icon: Bug },
  { label: "News", href: "/admin/news", icon: Newspaper },
  { label: "Events", href: "/admin/events", icon: Calendar },
  { label: "Articles", href: "/admin/articles", icon: FileText },
  { label: "Past Questions", href: "/admin/past-questions", icon: FileQuestion },
  { label: "Members", href: "/admin/members", icon: IdCard },
  { label: "Payments", href: "/admin/payments", icon: CreditCard },
  { label: "Alumni", href: "/admin/alumni", icon: GraduationCap },
  { label: "Contact Messages", href: "/admin/contact", icon: MessageSquare },
  { label: "Users", href: "/admin/users", icon: Users },
];

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const allSearchLinks = [
    ...sidebarLinks,
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const searchResults = searchQuery.trim()
    ? allSearchLinks.filter((link) =>
        link.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Redirect to login if session is lost (e.g. after signOut)
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-surface-1 flex overflow-x-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-midnight text-white transform transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
            <div className="w-10 h-10 bg-electric rounded-xl flex items-center justify-center flex-shrink-0">
              <Image src="/logo.png" alt="RUNACOS" width={24} height={24} className="object-contain" style={{ filter: "brightness(0) invert(1)" }} />
            </div>
            <div>
              <h1 className="font-bold font-heading text-sm text-white">RUNACOS</h1>
              <p className="text-xs font-mono text-navy-200">Admin Panel</p>
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
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm font-medium transition-all",
                      active
                        ? "bg-electric/10 text-electric"
                        : "text-navy-300 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {link.label}
                    {active && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-electric" />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Settings at bottom */}
          <div className="px-3 py-4 border-t border-white/10">
            <Link
              href="/admin/settings"
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                pathname.startsWith("/admin/settings")
                  ? "bg-electric/10 text-electric"
                  : "text-navy-300 hover:bg-white/5 hover:text-white"
              )}
            >
              <Settings className="w-5 h-5" />
              Settings
            </Link>
            <p className="mt-3 px-3 font-mono text-[10px] text-navy-300">v1.0.0</p>
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
            className="fixed inset-0 bg-midnight/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0 lg:ml-64">
        {/* Topbar */}
        <header className="bg-surface-0 h-16 border-b border-surface-3 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div ref={searchRef} className="hidden md:block relative w-64">
              <div className="flex items-center gap-2 bg-surface-1 rounded-xl px-3 py-2 border border-surface-3">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search pages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setSearchFocused(false);
                      setSearchQuery("");
                    }
                    if (e.key === "Enter" && searchResults.length > 0) {
                      router.push(searchResults[0].href);
                      setSearchQuery("");
                      setSearchFocused(false);
                    }
                  }}
                  className="bg-transparent outline-none text-sm text-gray-600 w-full font-mono"
                />
              </div>
              {searchFocused && searchResults.length > 0 && (
                <div className="absolute top-full mt-1 w-full bg-surface-0 rounded-xl shadow-lg border border-surface-3 py-1 z-50">
                  {searchResults.map((result) => {
                    const Icon = result.icon;
                    return (
                      <button
                        key={result.href}
                        onClick={() => {
                          router.push(result.href);
                          setSearchQuery("");
                          setSearchFocused(false);
                        }}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-surface-1 transition-colors"
                      >
                        <Icon className="w-4 h-4 text-gray-400" />
                        {result.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative text-gray-500 hover:text-gray-700 p-2 rounded-xl hover:bg-surface-1 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
            </button>

            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 hover:bg-surface-1 rounded-xl px-2 py-1.5 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-electric to-cyan rounded-xl flex items-center justify-center">
                  <span className="text-white text-xs font-medium font-mono">
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
                    className="absolute right-0 top-full mt-2 w-48 bg-surface-0 rounded-xl shadow-lg border border-surface-3 py-1 z-50"
                  >
                    <div className="px-4 py-2 border-b border-surface-3">
                      <p className="text-sm font-medium text-gray-900">{session?.user?.name}</p>
                      <p className="text-xs font-mono text-gray-500">{session?.user?.email}</p>
                    </div>
                    <button
                      onClick={async () => {
                        await signOut({ redirect: false });
                        window.location.href = "/login";
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
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
        <main className="flex-1 min-w-0 overflow-x-hidden p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
