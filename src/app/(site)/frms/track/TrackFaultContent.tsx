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
      <section className="flex min-h-[70vh] items-center justify-center py-16">
        <div className="container-custom">
          <div className="mx-auto max-w-lg text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-navy-100"
            >
              <Search className="h-8 w-8 text-navy-800" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="section-label mb-3"
            >
              Fault Tracking
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-serif text-3xl font-extrabold text-gray-900 sm:text-4xl"
            >
              Track Your Report
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-3 text-gray-500"
            >
              Enter your reference ID to check the current status of your fault report.
            </motion.p>

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
                  className="flex-1 rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 px-4 py-3 font-mono text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  required
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="rounded-r-lg bg-navy-800 px-6 py-3 text-sm font-medium text-white hover:bg-navy-700 transition-colors disabled:opacity-50"
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
              className="mt-4 text-xs text-gray-400"
            >
              Your reference ID was provided when you submitted your report.
            </motion.p>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
