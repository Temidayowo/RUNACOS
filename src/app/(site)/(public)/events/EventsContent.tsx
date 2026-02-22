"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Calendar } from "lucide-react";
import { format } from "date-fns";
import {
  AnimateOnScroll,
  StaggerContainer,
  StaggerItem,
  PageTransition,
} from "@/components/ui/MotionWrapper";

const events = [
  { id: "1", title: "RUNACOS Tech Summit 2024", slug: "tech-summit-2024", location: "Main Auditorium, RUN", eventDate: "2025-03-15T09:00:00Z", description: "Annual technology summit featuring keynote speakers from top tech companies." },
  { id: "2", title: "Workshop: Introduction to AI & ML", slug: "ai-ml-workshop", location: "CS Lab 2, Block B", eventDate: "2025-03-20T14:00:00Z", description: "Hands-on workshop covering the fundamentals of artificial intelligence and machine learning." },
  { id: "3", title: "Career Fair: Meet Tech Companies", slug: "career-fair-2024", location: "University Hall", eventDate: "2025-04-05T10:00:00Z", description: "Connect with leading tech companies and explore internship and job opportunities." },
  { id: "4", title: "Coding Bootcamp: Web Development", slug: "web-dev-bootcamp", location: "CS Lab 1", eventDate: "2024-12-10T09:00:00Z", description: "Intensive 3-day bootcamp covering modern web development with React and Next.js." },
  { id: "5", title: "RUNACOS Game Night", slug: "game-night", location: "Student Center", eventDate: "2024-11-25T18:00:00Z", description: "Relax and unwind with board games, video games, and fun activities." },
];

export function EventsContent() {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const now = new Date();
  const filtered = events.filter((e) =>
    tab === "upcoming" ? new Date(e.eventDate) >= now : new Date(e.eventDate) < now
  );

  return (
    <PageTransition>
      <section className="bg-white py-16 md:py-20 text-center">
        <div className="container-custom">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="section-label mb-3">
            What&apos;s Happening
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-serif text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-5xl"
          >
            Events &amp; Activities
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-gray-500"
          >
            Discover workshops, seminars, hackathons, and social activities organized by RUNACOS.
          </motion.p>
        </div>
      </section>

      <section className="border-b border-gray-100">
        <div className="container-custom">
          <div className="flex gap-2 py-4">
            {(["upcoming", "past"] as const).map((t) => (
              <motion.button
                key={t}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTab(t)}
                className={tab === t ? "pill-tab-active" : "pill-tab-inactive"}
              >
                {t === "upcoming" ? "Upcoming Events" : "Past Events"}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container-custom">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {filtered.length === 0 ? (
                <div className="py-16 text-center text-gray-400">
                  <Calendar className="mx-auto mb-3 h-12 w-12" />
                  <p className="text-lg font-medium">No {tab} events</p>
                </div>
              ) : (
                <StaggerContainer className="space-y-4">
                  {filtered.map((event) => (
                    <StaggerItem key={event.id}>
                      <Link href={`/events/${event.slug}`}>
                        <motion.div
                          whileHover={{ x: 4, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                          className="flex overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition-all"
                        >
                          <div className="flex w-24 shrink-0 flex-col items-center justify-center bg-navy-800 text-white sm:w-28">
                            <span className="text-3xl font-bold">{format(new Date(event.eventDate), "dd")}</span>
                            <span className="text-xs uppercase tracking-wider">{format(new Date(event.eventDate), "MMM yyyy")}</span>
                          </div>
                          <div className="flex-1 p-5">
                            <h3 className="font-serif text-lg font-bold text-gray-900">{event.title}</h3>
                            <p className="mt-1 text-sm text-gray-500 line-clamp-1">{event.description}</p>
                            <div className="mt-3 flex flex-wrap gap-4">
                              <span className="flex items-center gap-1.5 text-xs text-gray-400">
                                <MapPin className="h-3 w-3" /> {event.location}
                              </span>
                              <span className="flex items-center gap-1.5 text-xs text-gray-400">
                                <Clock className="h-3 w-3" /> {format(new Date(event.eventDate), "h:mm a")}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      </Link>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </PageTransition>
  );
}
