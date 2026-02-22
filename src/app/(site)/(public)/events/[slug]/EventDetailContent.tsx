"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, MapPin, Clock, Users } from "lucide-react";
import { PageTransition } from "@/components/ui/MotionWrapper";

export function EventDetailContent() {
  return (
    <PageTransition>
      <div className="py-12 md:py-20">
        <div className="container-custom">
          <div className="mx-auto max-w-4xl">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Link href="/events" className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-navy-800 transition-colors">
                <ArrowLeft className="h-4 w-4" /> Back to Events
              </Link>
            </motion.div>

            {/* Cover */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-[21/9] overflow-hidden rounded-xl bg-gradient-to-br from-navy-800 to-blue-600"
            >
              <div className="flex h-full items-center justify-center text-white/30 text-2xl font-bold">RUNACOS EVENT</div>
            </motion.div>

            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <h1 className="font-serif text-3xl font-extrabold text-gray-900 sm:text-4xl">Event Title</h1>
                <div className="prose-custom mt-6">
                  <p>Event description and details would appear here, fetched from the database.</p>
                  <p>This would include the full event information, agenda, speaker bios, and any other relevant details.</p>
                </div>
              </motion.div>

              <motion.aside
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                {[
                  { icon: Calendar, label: "Date", value: "March 15, 2025" },
                  { icon: Clock, label: "Time", value: "9:00 AM - 5:00 PM" },
                  { icon: MapPin, label: "Location", value: "Main Auditorium, RUN" },
                  { icon: Users, label: "Capacity", value: "200 seats" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3 rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy-50">
                      <item.icon className="h-4 w-4 text-navy-800" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">{item.label}</p>
                      <p className="text-sm font-medium text-gray-900">{item.value}</p>
                    </div>
                  </div>
                ))}
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-primary w-full py-3">
                  Register for Event
                </motion.button>
              </motion.aside>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
