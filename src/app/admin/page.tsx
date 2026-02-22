"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bug,
  Newspaper,
  Calendar,
  FileText,
  FileQuestion,
  Users,
  AlertCircle,
  Clock,
  CheckCircle,
  MessageSquare,
} from "lucide-react";
import { cn, formatDateShort } from "@/lib/utils";
import { FAULT_STATUSES } from "@/lib/constants";

interface DashboardData {
  faults: { total: number; open: number; inProgress: number; resolved: number };
  content: { news: number; events: number; articles: number; pastQuestions: number };
  users: number;
  unreadContacts: number;
  recentFaults: any[];
}

function AnimatedCounter({ value, duration = 1.5 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;

    const incrementTime = (duration * 1000) / end;
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) clearInterval(timer);
    }, Math.max(incrementTime, 10));

    return () => clearInterval(timer);
  }, [value, duration]);

  return <>{count}</>;
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
              <div className="h-8 bg-gray-200 rounded w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const faultCards = [
    { label: "Total Faults", value: data.faults.total, icon: Bug, color: "bg-blue-500" },
    { label: "Open", value: data.faults.open, icon: AlertCircle, color: "bg-red-500" },
    { label: "In Progress", value: data.faults.inProgress, icon: Clock, color: "bg-yellow-500" },
    { label: "Resolved", value: data.faults.resolved, icon: CheckCircle, color: "bg-green-500" },
  ];

  const contentCards = [
    { label: "News", value: data.content.news, href: "/admin/news", icon: Newspaper },
    { label: "Events", value: data.content.events, href: "/admin/events", icon: Calendar },
    { label: "Articles", value: data.content.articles, href: "/admin/articles", icon: FileText },
    { label: "Past Questions", value: data.content.pastQuestions, href: "/admin/past-questions", icon: FileQuestion },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-merriweather text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back! Here&apos;s an overview of your system.</p>
      </div>

      {/* FRMS KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {faultCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-lg p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-500">{card.label}</span>
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", card.color)}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                <AnimatedCounter value={card.value} />
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Content + Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content Stats */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Content Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {contentCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  <Link
                    href={card.href}
                    className="block bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <Icon className="w-6 h-6 text-navy-800 mb-2" />
                    <p className="text-2xl font-bold text-gray-900">
                      <AnimatedCounter value={card.value} />
                    </p>
                    <p className="text-sm text-gray-500">{card.label}</p>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Link
              href="/admin/users"
              className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-navy-800" />
                <div>
                  <p className="text-xl font-bold text-gray-900">{data.users}</p>
                  <p className="text-sm text-gray-500">Total Users</p>
                </div>
              </div>
            </Link>
            <Link
              href="/admin/contact"
              className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-navy-800" />
                <div>
                  <p className="text-xl font-bold text-gray-900">{data.unreadContacts}</p>
                  <p className="text-sm text-gray-500">Unread Messages</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Faults */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Faults</h2>
            <Link href="/admin/frms" className="text-sm text-blue-500 hover:underline">
              View All
            </Link>
          </div>
          <div className="bg-white rounded-lg shadow-sm divide-y">
            {data.recentFaults.length === 0 ? (
              <p className="p-4 text-sm text-gray-500">No fault reports yet</p>
            ) : (
              data.recentFaults.map((fault: any) => {
                const statusInfo = FAULT_STATUSES[fault.status as keyof typeof FAULT_STATUSES];
                return (
                  <Link
                    key={fault.id}
                    href={`/admin/frms/${fault.id}`}
                    className="block p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono text-gray-500">{fault.referenceId}</span>
                      <span
                        className={cn(
                          "text-xs px-2 py-0.5 rounded-full font-medium",
                          statusInfo.color === "red" && "bg-red-100 text-red-700",
                          statusInfo.color === "yellow" && "bg-yellow-100 text-yellow-700",
                          statusInfo.color === "green" && "bg-green-100 text-green-700",
                          statusInfo.color === "gray" && "bg-gray-100 text-gray-700"
                        )}
                      >
                        {statusInfo.label}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 truncate">{fault.location}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {fault.category?.name} &middot; {formatDateShort(fault.createdAt)}
                    </p>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
