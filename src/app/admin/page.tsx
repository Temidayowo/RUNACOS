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
  UserCheck,
  CreditCard,
  GraduationCap,
  AlertCircle,
  Clock,
  CheckCircle,
  MessageSquare,
  Shield,
} from "lucide-react";
import { cn, formatDateShort } from "@/lib/utils";
import { FAULT_STATUSES } from "@/lib/constants";

interface DashboardData {
  faults: { total: number; open: number; inProgress: number; resolved: number };
  content: { news: number; events: number; articles: number; pastQuestions: number; executives: number };
  users: number;
  unreadContacts: number;
  recentFaults: any[];
  members: { total: number; alumni: number };
  payments: { total: number; verified: number; thisSession: number; totalRevenue: number };
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
            <div key={i} className="bg-surface-0 rounded-xl p-6 border border-surface-3 animate-pulse">
              <div className="h-4 bg-surface-2 rounded w-24 mb-3" />
              <div className="h-8 bg-surface-2 rounded w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const faultCards = [
    { label: "Total Faults", value: data.faults.total, icon: Bug, color: "bg-electric" },
    { label: "Open", value: data.faults.open, icon: AlertCircle, color: "bg-rose-500" },
    { label: "In Progress", value: data.faults.inProgress, icon: Clock, color: "bg-amber-500" },
    { label: "Resolved", value: data.faults.resolved, icon: CheckCircle, color: "bg-emerald-500" },
  ];

  const contentCards = [
    { label: "News", value: data.content.news, href: "/admin/news", icon: Newspaper },
    { label: "Events", value: data.content.events, href: "/admin/events", icon: Calendar },
    { label: "Articles", value: data.content.articles, href: "/admin/articles", icon: FileText },
    { label: "Past Questions", value: data.content.pastQuestions, href: "/admin/past-questions", icon: FileQuestion },
    { label: "Executives", value: data.content.executives, href: "/admin/executives", icon: Shield },
  ];

  const quickStats = [
    { label: "Total Users", value: data.users, icon: Users, href: "/admin/users", iconBg: "bg-electric/10", iconColor: "text-electric" },
    { label: "Members", value: data.members.total, icon: UserCheck, href: "/admin/members", iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
    { label: "Unread Messages", value: data.unreadContacts, icon: MessageSquare, href: "/admin/contact", iconBg: "bg-rose-50", iconColor: "text-rose-500" },
    { label: "Alumni", value: data.members?.alumni || 0, icon: GraduationCap, href: "/admin/alumni", iconBg: "bg-purple-50", iconColor: "text-purple-600" },
  ];

  const paymentCards = [
    { label: "Total Revenue", value: `\u20A6${(data.payments?.totalRevenue || 0).toLocaleString()}`, raw: false, icon: CreditCard, iconBg: "bg-electric/10", iconColor: "text-electric" },
    { label: "Total Payments", value: data.payments?.total || 0, raw: true, icon: CreditCard, iconBg: "bg-navy-50", iconColor: "text-navy-800" },
    { label: "Verified", value: data.payments?.verified || 0, raw: true, icon: CheckCircle, iconBg: "bg-emerald-50", iconColor: "text-emerald-600" },
    { label: "Paid This Session", value: data.payments?.thisSession || 0, raw: true, icon: Clock, iconBg: "bg-amber-50", iconColor: "text-amber-600" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back! Here&apos;s an overview of your system.</p>
      </div>

      {/* Row 1: FRMS KPI Cards */}
      <div>
        <h2 className="text-sm font-medium font-mono uppercase tracking-wider text-gray-400 mb-3">Fault Reports</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {faultCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  href="/admin/frms"
                  className="block bg-surface-0 rounded-xl p-5 border border-surface-3 hover:shadow-card-hover transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-500">{card.label}</span>
                    <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", card.color)}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold font-mono text-gray-900">
                    <AnimatedCounter value={card.value} />
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Row 2: Quick Stats (Users, Members, Messages, Alumni) */}
      <div>
        <h2 className="text-sm font-medium font-mono uppercase tracking-wider text-gray-400 mb-3">Community</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {quickStats.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
              >
                <Link
                  href={card.href}
                  className="block bg-surface-0 rounded-xl p-5 border border-surface-3 hover:shadow-card-hover transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", card.iconBg)}>
                      <Icon className={cn("w-5 h-5", card.iconColor)} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold font-mono text-gray-900">
                        <AnimatedCounter value={card.value} />
                      </p>
                      <p className="text-xs text-gray-500">{card.label}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Row 3: Payments */}
      <div>
        <h2 className="text-sm font-medium font-mono uppercase tracking-wider text-gray-400 mb-3">Payments</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {paymentCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.08 }}
              >
                <Link
                  href="/admin/payments"
                  className="block bg-surface-0 rounded-xl p-5 border border-surface-3 hover:shadow-card-hover transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", card.iconBg)}>
                      <Icon className={cn("w-5 h-5", card.iconColor)} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold font-mono text-gray-900">
                        {card.raw ? <AnimatedCounter value={card.value as number} /> : card.value}
                      </p>
                      <p className="text-xs text-gray-500">{card.label}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Row 4: Content Overview + Recent Faults (2/3 + 1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content Stats */}
        <div className="lg:col-span-2">
          <h2 className="text-sm font-medium font-mono uppercase tracking-wider text-gray-400 mb-3">Content</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {contentCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + i * 0.08 }}
                >
                  <Link
                    href={card.href}
                    className="block bg-surface-0 rounded-xl p-4 border border-surface-3 hover:shadow-card-hover transition-all text-center"
                  >
                    <div className="w-10 h-10 rounded-xl bg-electric/10 flex items-center justify-center mx-auto mb-2">
                      <Icon className="w-5 h-5 text-electric" />
                    </div>
                    <p className="text-2xl font-bold font-mono text-gray-900">
                      <AnimatedCounter value={card.value} />
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{card.label}</p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Recent Faults */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium font-mono uppercase tracking-wider text-gray-400">Recent Faults</h2>
            <Link href="/admin/frms" className="text-xs text-electric hover:underline font-medium">
              View All
            </Link>
          </div>
          <div className="bg-surface-0 rounded-xl border border-surface-3 divide-y divide-surface-3">
            {data.recentFaults.length === 0 ? (
              <div className="p-6 text-center">
                <Bug className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No fault reports yet</p>
              </div>
            ) : (
              data.recentFaults.map((fault: any) => {
                const statusInfo = FAULT_STATUSES[fault.status as keyof typeof FAULT_STATUSES];
                return (
                  <Link
                    key={fault.id}
                    href={`/admin/frms/${fault.id}`}
                    className="block p-4 hover:bg-surface-1 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono text-gray-400">{fault.referenceId}</span>
                      <span
                        className={cn(
                          "text-[10px] px-2 py-0.5 rounded-md font-mono font-medium",
                          statusInfo.color === "red" && "bg-rose-50 text-rose-700",
                          statusInfo.color === "yellow" && "bg-amber-50 text-amber-700",
                          statusInfo.color === "green" && "bg-emerald-50 text-emerald-700",
                          statusInfo.color === "gray" && "bg-gray-100 text-gray-700"
                        )}
                      >
                        {statusInfo.label}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 truncate">{fault.location}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {fault.category?.name} &middot; <span className="font-mono">{formatDateShort(fault.createdAt)}</span>
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
