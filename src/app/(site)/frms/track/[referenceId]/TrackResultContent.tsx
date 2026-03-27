"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import useSWR from "swr";
import {
  ArrowLeft,
  CheckCircle,
  Circle,
  Clock,
  MapPin,
  Tag,
  User,
  Mail,
  FileText,
  Paperclip,
  Copy,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { PageTransition, AnimateOnScroll, fadeUp } from "@/components/ui/MotionWrapper";
import { fetcher } from "@/lib/fetcher";

const statusColors: Record<string, string> = {
  OPEN: "badge-red",
  IN_PROGRESS: "badge-yellow",
  RESOLVED: "badge-green",
  CLOSED: "badge-gray",
};

const statusLabels: Record<string, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

const statusOrder = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];

export function TrackResultContent() {
  const params = useParams();
  const referenceId = params.referenceId as string;

  const { data, error, isLoading } = useSWR(
    referenceId ? `/api/frms/track/${referenceId}` : null,
    fetcher
  );

  const fault = data?.data;

  const copyRefId = () => {
    navigator.clipboard.writeText(referenceId);
    toast.success("Reference ID copied!");
  };

  if (isLoading) {
    return (
      <PageTransition>
        <section className="flex min-h-[60vh] items-center justify-center bg-surface-1">
          <Loader2 className="h-8 w-8 animate-spin text-navy-800" />
        </section>
      </PageTransition>
    );
  }

  if (error || !fault) {
    return (
      <PageTransition>
        <section className="flex min-h-[60vh] items-center justify-center bg-surface-1">
          <div className="text-center">
            <AlertTriangle className="mx-auto mb-3 h-10 w-10 text-rose-400" />
            <h2 className="font-heading text-xl font-bold text-gray-900">Report Not Found</h2>
            <p className="mt-1 text-sm text-gray-500">
              No fault report found for reference ID <span className="font-mono font-semibold">{referenceId}</span>.
            </p>
            <Link href="/frms/track" className="btn-primary mt-6 inline-flex">
              Try Another ID
            </Link>
          </div>
        </section>
      </PageTransition>
    );
  }

  // Build timeline from status history
  const historyMap: Record<string, { date: string; note: string | null }> = {};
  for (const entry of fault.statusHistory ?? []) {
    const d = new Date(entry.createdAt);
    const pad = (n: number) => String(n).padStart(2, "0");
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const formatted = `${pad(d.getDate())} ${months[d.getMonth()]} ${d.getFullYear()}, ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    historyMap[entry.status] = {
      date: formatted,
      note: entry.note ?? null,
    };
  }

  const currentStatusIndex = statusOrder.indexOf(fault.status);

  const timeline = statusOrder.map((status, i) => {
    const reached = historyMap[status];
    return {
      status,
      label: statusLabels[status],
      date: reached?.date ?? "Pending",
      note: reached?.note ?? null,
      completed: i <= currentStatusIndex,
      current: status === fault.status,
    };
  });

  return (
    <PageTransition>
      <section className="py-12 md:py-20 bg-surface-1">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl">
            {/* Back */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Link
                href="/frms/track"
                className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-navy-800 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> Track Another Report
              </Link>
            </motion.div>

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-mono text-lg font-bold text-navy-800">
                    {referenceId}
                  </h1>
                  <button
                    onClick={copyRefId}
                    className="rounded p-1 hover:bg-gray-100 transition-colors"
                  >
                    <Copy className="h-3.5 w-3.5 text-gray-400" />
                  </button>
                </div>
                <p className="text-sm text-gray-500">Fault Report Status</p>
              </div>
              <span className={`${statusColors[fault.status] ?? "badge-gray"} text-sm px-3 py-1`}>
                {statusLabels[fault.status] ?? fault.status}
              </span>
            </motion.div>

            {/* Timeline */}
            <AnimateOnScroll variants={fadeUp}>
              <div className="mb-10 rounded-xl border border-surface-3 bg-surface-0 p-6 shadow-sm sm:p-8">
                <h3 className="mb-6 font-heading text-lg font-bold text-gray-900">
                  Status Timeline
                </h3>
                <div className="relative ml-4">
                  <div className="absolute left-0 top-2 bottom-2 w-px bg-surface-3" />
                  <div className="space-y-8">
                    {timeline.map((entry, i) => (
                      <motion.div
                        key={entry.status}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.15 }}
                        className="relative pl-8"
                      >
                        <div className="absolute left-0 top-1 -translate-x-1/2">
                          {entry.completed ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.3 + i * 0.15 }}
                            >
                              {entry.current ? (
                                <div className="relative">
                                  <div className="h-4 w-4 rounded-full bg-yellow-400" />
                                  <div className="absolute inset-0 animate-ping rounded-full bg-yellow-400 opacity-50" />
                                </div>
                              ) : (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              )}
                            </motion.div>
                          ) : (
                            <Circle className="h-4 w-4 text-gray-300" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${entry.completed ? "text-gray-900" : "text-gray-400"}`}>
                              {entry.label}
                            </span>
                            <span className="text-xs text-gray-400">{entry.date}</span>
                          </div>
                          {entry.note && (
                            <p className="mt-0.5 text-sm text-gray-500">{entry.note}</p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </AnimateOnScroll>

            {/* Fault Details */}
            <AnimateOnScroll variants={fadeUp} delay={0.1}>
              <div className="rounded-xl border border-surface-3 bg-surface-0 p-6 shadow-sm sm:p-8">
                <h3 className="mb-4 font-heading text-lg font-bold text-gray-900">
                  Fault Details
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { icon: Tag, label: "Category", value: fault.category?.name ?? "—" },
                    { icon: MapPin, label: "Location", value: fault.location },
                    { icon: User, label: "Reported By", value: fault.name },
                    { icon: Mail, label: "Email", value: fault.email },
                    {
                      icon: Clock,
                      label: "Submitted",
                      value: (() => { const d = new Date(fault.createdAt); const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]; return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`; })(),
                    },
                    {
                      icon: Paperclip,
                      label: "Attachment",
                      value: fault.fileUrl ? "View attachment" : "No attachment",
                      href: fault.fileUrl ?? undefined,
                    },
                  ].map((item: any) => (
                    <div key={item.label} className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-surface-1">
                        <item.icon className="h-4 w-4 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">{item.label}</p>
                        {item.href ? (
                          <a href={item.href} target="_blank" rel="noopener noreferrer" className="text-sm text-electric hover:underline">
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-sm text-gray-700">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 border-t border-surface-3 pt-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-surface-1">
                      <FileText className="h-4 w-4 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Description</p>
                      <p className="text-sm text-gray-700">{fault.description}</p>
                    </div>
                  </div>
                </div>

                {fault.adminNotes && (
                  <div className="mt-4 border-t border-surface-3 pt-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                        <FileText className="h-4 w-4 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Admin Notes</p>
                        <p className="text-sm text-gray-700">{fault.adminNotes}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
