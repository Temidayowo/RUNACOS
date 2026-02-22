"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle } from "lucide-react";
import { AnimateOnScroll, fadeUp } from "@/components/ui/MotionWrapper";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <section className="bg-gray-50 py-16 md:py-20">
      <div className="container-custom">
        <AnimateOnScroll variants={fadeUp} className="mx-auto max-w-xl text-center">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", duration: 0.6 }}
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-navy-100"
          >
            <Mail className="h-7 w-7 text-navy-800" />
          </motion.div>

          <h2 className="font-serif text-2xl font-bold text-gray-900 sm:text-3xl">
            Subscribe to RUNACOS Weekly
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Get the latest department news, event reminders, and academic resources
            delivered directly to your inbox.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex gap-0">
            <motion.input
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              type="email"
              placeholder="Enter your student email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 rounded-l-lg border border-r-0 border-gray-200 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="rounded-r-lg bg-navy-800 px-6 py-3 text-sm font-medium text-white hover:bg-navy-700 transition-colors"
            >
              {submitted ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                "Subscribe"
              )}
            </motion.button>
          </form>

          <p className="mt-3 text-xs text-gray-400">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
