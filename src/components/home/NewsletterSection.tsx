"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle, ArrowRight } from "lucide-react";
import { AnimateOnScroll, fadeUp } from "@/components/ui/MotionWrapper";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSubmitted(true);
        setEmail("");
        setTimeout(() => setSubmitted(false), 3000);
      }
    } catch {} finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-surface-0 py-16 md:py-24">
      <div className="container-custom">
        <AnimateOnScroll variants={fadeUp}>
          <div className="relative mx-auto max-w-2xl overflow-hidden rounded-2xl border border-surface-3 bg-surface-1 p-8 sm:p-12">
            {/* Left accent border */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-electric to-cyan" />

            {/* Dot grid bg */}
            <div className="absolute inset-0 bg-grid-dots pointer-events-none opacity-40" />

            <div className="relative text-center">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", duration: 0.6 }}
                className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-electric/10"
              >
                <Mail className="h-6 w-6 text-electric" />
              </motion.div>

              <p className="section-label mb-2">Stay in the Loop</p>
              <h2 className="font-heading text-2xl font-bold text-gray-900 sm:text-3xl">
                Subscribe to Our Newsletter
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Get the latest news, event reminders, and resources delivered to
                your inbox.
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-6 flex flex-col sm:flex-row gap-3"
              >
                <motion.input
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 rounded-xl border-[1.5px] border-surface-3 bg-surface-0 px-4 py-3 text-sm font-mono placeholder:font-sans placeholder:text-gray-400 focus:border-electric focus:outline-none focus:ring-[3px] focus:ring-electric/10 transition-all"
                />
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-accent px-6 py-3 text-sm font-medium text-white shadow-sm transition-all hover:shadow-glow-blue"
                >
                  {submitted ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Subscribed!
                    </>
                  ) : (
                    <>
                      Subscribe
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </motion.button>
              </form>

              <p className="mt-4 text-xs text-gray-400">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
