"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
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
} from "lucide-react";
import { toast } from "sonner";
import { PageTransition, AnimateOnScroll, fadeUp } from "@/components/ui/MotionWrapper";

// Placeholder timeline - in production this comes from API
const timeline = [
  {
    status: "OPEN",
    label: "Submitted",
    date: "Oct 1, 2024 - 9:00 AM",
    note: "Initial fault report filed",
    completed: true,
  },
  {
    status: "IN_PROGRESS",
    label: "Assigned",
    date: "Oct 2, 2024 - 11:30 AM",
    note: "Assigned to maintenance staff",
    completed: true,
  },
  {
    status: "IN_PROGRESS",
    label: "In Progress",
    date: "Oct 3, 2024 - 2:00 PM",
    note: "Technician dispatched to location",
    completed: true,
    current: true,
  },
  {
    status: "RESOLVED",
    label: "Resolved",
    date: "Pending",
    note: null,
    completed: false,
  },
];

const statusColors: Record<string, string> = {
  OPEN: "badge-red",
  IN_PROGRESS: "badge-yellow",
  RESOLVED: "badge-green",
  CLOSED: "badge-gray",
};

export function TrackResultContent() {
  const params = useParams();
  const referenceId = params.referenceId as string;

  const copyRefId = () => {
    navigator.clipboard.writeText(referenceId);
    toast.success("Reference ID copied!");
  };

  return (
    <PageTransition>
      <section className="py-12 md:py-20 bg-surface-1">
        <div className="container-custom">
          <div className="mx-auto max-w-3xl">
            {/* Back */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
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
              <span className={`${statusColors["IN_PROGRESS"]} text-sm px-3 py-1`}>
                In Progress
              </span>
            </motion.div>

            {/* Timeline */}
            <AnimateOnScroll variants={fadeUp}>
              <div className="mb-10 rounded-xl border border-surface-3 bg-surface-0 p-6 shadow-sm sm:p-8">
                <h3 className="mb-6 font-heading text-lg font-bold text-gray-900">
                  Status Timeline
                </h3>
                <div className="relative ml-4">
                  {/* Vertical line */}
                  <div className="absolute left-0 top-2 bottom-2 w-px bg-surface-3" />

                  <div className="space-y-8">
                    {timeline.map((entry, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.15 }}
                        className="relative pl-8"
                      >
                        {/* Dot */}
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

                        {/* Content */}
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-sm font-medium ${
                                entry.completed
                                  ? "text-gray-900"
                                  : "text-gray-400"
                              }`}
                            >
                              {entry.label}
                            </span>
                            <span className="text-xs text-gray-400">
                              {entry.date}
                            </span>
                          </div>
                          {entry.note && (
                            <p className="mt-0.5 text-sm text-gray-500">
                              {entry.note}
                            </p>
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
                    { icon: Tag, label: "Category", value: "Electrical" },
                    { icon: MapPin, label: "Location", value: "CS Lab 1, Block B" },
                    { icon: User, label: "Reported By", value: "John Doe" },
                    { icon: Mail, label: "Email", value: "john@run.edu.ng" },
                    { icon: Clock, label: "Submitted", value: "Oct 1, 2024" },
                    {
                      icon: Paperclip,
                      label: "Attachment",
                      value: "No attachment",
                    },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-surface-1">
                        <item.icon className="h-4 w-4 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">{item.label}</p>
                        <p className="text-sm text-gray-700">{item.value}</p>
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
                      <p className="text-sm text-gray-700">
                        Power outlet in CS Lab 1 is not working. The outlet near
                        workstation 5 has no power and shows signs of damage.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
