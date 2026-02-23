"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Loader2, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageTransition } from "@/components/ui/MotionWrapper";
import { PageHero } from "@/components/ui/PageHero";

export default function ReceiptLookupPage() {
  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLookup = async () => {
    if (!reference.trim()) {
      toast.error("Enter a payment reference");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/dues/receipt/${reference.trim()}`);
      if (res.ok) {
        router.push(`/dues/receipt/${reference.trim()}`);
      } else {
        toast.error("Receipt not found. Check your reference and try again.");
      }
    } catch {
      toast.error("Lookup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <PageHero
        slug="dues-pay"
        defaultHeading="Generate Receipt"
        defaultSubheading="Look up your dues payment receipt by reference number."
        breadcrumb="Home / Generate Receipt"
      />

      <section className="py-12 md:py-16 bg-surface-1">
        <div className="container-custom">
          <div className="mx-auto max-w-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-surface-3 bg-surface-0 p-6 sm:p-8"
            >
              <div className="text-center mb-6">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-electric/10">
                  <FileText className="h-6 w-6 text-electric" />
                </div>
                <h3 className="font-heading text-lg font-bold text-gray-900">
                  Find Your Receipt
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Enter your payment reference to view and download your receipt.
                </p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLookup()}
                    placeholder="e.g. RUNACOS-20252026-ABCD1234"
                    className="input-field pl-10 font-mono text-sm"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLookup}
                  disabled={loading}
                  className="btn-primary w-full gap-2"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  {loading ? "Looking up..." : "Find Receipt"}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
