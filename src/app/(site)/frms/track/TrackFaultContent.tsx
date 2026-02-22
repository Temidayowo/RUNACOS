"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageTransition } from "@/components/ui/MotionWrapper";

export function TrackFaultContent() {
  const [refId, setRefId] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refId.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/frms/track/${refId.trim()}`);
      if (res.ok) {
        router.push(`/frms/track/${refId.trim()}`);
      } else {
        toast.error("Report not found. Please check your reference ID.");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      {/* Page Hero */}
      <section className="page-hero text-center">
        <div className="relative container-custom">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-mono text-xs uppercase tracking-widest text-electric mb-1"
          >
            Home / FRMS / Track
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-heading text-3xl font-bold text-white sm:text-4xl md:text-5xl"
          >
            Track Your Report
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-lg text-navy-200"
          >
            Enter your reference ID to check the current status of your fault report.
          </motion.p>
        </div>
      </section>

      {/* Search */}
      <section className="py-16 md:py-24 bg-surface-1">
        <div className="container-custom">
          <div className="mx-auto max-w-lg text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-electric/10"
            >
              <Search className="h-8 w-8 text-electric" />
            </motion.div>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onSubmit={handleTrack}
              className="mt-8"
            >
              <div className="flex gap-0">
                <input
                  type="text"
                  value={refId}
                  onChange={(e) => setRefId(e.target.value.toUpperCase())}
                  placeholder="e.g., FRMS-2024-ABC123"
                  className="flex-1 rounded-l-xl border-[1.5px] border-r-0 border-surface-3 bg-surface-0 px-4 py-3 font-mono text-sm focus:border-electric focus:outline-none focus:ring-[3px] focus:ring-electric/10"
                  required
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="rounded-r-xl bg-navy-800 px-6 py-3 text-sm font-medium text-white hover:bg-navy-700 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "Track Report"
                  )}
                </motion.button>
              </div>
            </motion.form>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-4 text-xs font-mono text-gray-400"
            >
              Your reference ID was provided when you submitted your report.
            </motion.p>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
