"use client";

import { motion } from "framer-motion";
import { Vote, Bell, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PageTransition } from "@/components/ui/MotionWrapper";
import { PageHero } from "@/components/ui/PageHero";

export default function VotingPage() {
  return (
    <PageTransition>
      <PageHero
        slug="voting"
        defaultHeading="RUNACOS Voting"
        defaultSubheading="The official platform for RUNACOS elections and polls."
        breadcrumb="Home / Voting"
      />

      <section className="py-16 md:py-24 bg-surface-1">
        <div className="container-custom">
          <div className="mx-auto max-w-lg text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="flex flex-col items-center gap-6"
            >
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="relative"
              >
                <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-electric/10">
                  <Vote className="h-12 w-12 text-electric" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400"
                >
                  <Bell className="h-3 w-3 text-white" />
                </motion.div>
              </motion.div>

              {/* Text */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="font-heading text-3xl font-bold text-gray-900">
                  Coming Soon
                </h2>
                <p className="mt-3 text-gray-500 max-w-sm mx-auto">
                  We&apos;re building a secure and transparent voting platform for
                  RUNACOS elections. Stay tuned for updates!
                </p>
              </motion.div>

              {/* Feature preview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="w-full rounded-xl border border-surface-3 bg-surface-0 p-6 text-left"
              >
                <p className="text-xs font-mono font-semibold uppercase tracking-widest text-gray-400 mb-4">
                  What to expect
                </p>
                <ul className="space-y-3">
                  {[
                    "Secure online voting for executive elections",
                    "Real-time results and live tallying",
                    "Member-only access with verification",
                    "Transparent and auditable process",
                  ].map((feature, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="flex items-center gap-3 text-sm text-gray-600"
                    >
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-electric/10">
                        <div className="h-1.5 w-1.5 rounded-full bg-electric" />
                      </div>
                      {feature}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <Link
                  href="/"
                  className="btn-secondary gap-2 inline-flex"
                >
                  <ArrowLeft className="h-4 w-4" /> Back to Home
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
