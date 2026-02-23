"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Calendar, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import {
  StaggerContainer,
  StaggerItem,
  PageTransition,
} from "@/components/ui/MotionWrapper";
import { PageHero } from "@/components/ui/PageHero";

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
      <PageHero
        slug="events"
        defaultHeading="Events & Activities"
        defaultSubheading="Discover workshops, seminars, hackathons, and social activities organized by RUNACOS."
        breadcrumb="Home / Events"
      />

      {/* Tabs */}
      <section className="bg-surface-0 border-b border-surface-3 sticky top-[72px] z-30 backdrop-blur-xl bg-white/90">
        <div className="container-custom">
          <div className="flex gap-2 py-4">
            {(["upcoming", "past"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={tab === t ? "pill-tab-active" : "pill-tab-inactive"}
              >
                {t === "upcoming" ? "Upcoming" : "Past Events"}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events List */}
      <section className="py-12 md:py-16 bg-surface-1">
        <div className="container-custom">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {filtered.length === 0 ? (
                <div className="py-20 text-center">
                  <Calendar className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                  <p className="text-lg font-heading font-semibold text-gray-400">No {tab} events</p>
                  <p className="mt-1 text-sm text-gray-400">Check back soon for updates.</p>
                </div>
              ) : (
                <StaggerContainer className="space-y-4">
                  {filtered.map((event) => (
                    <StaggerItem key={event.id}>
                      <Link href={`/events/${event.slug}`}>
                        <motion.div
                          whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(59,130,246,0.08)" }}
                          className="group flex overflow-hidden rounded-xl border border-surface-3 bg-surface-0 transition-all"
                        >
                          {/* Date Block */}
                          <div className="flex w-20 shrink-0 flex-col items-center justify-center bg-navy-800 text-white sm:w-24">
                            <span className="font-mono text-xs uppercase tracking-wider text-navy-300">
                              {format(new Date(event.eventDate), "MMM")}
                            </span>
                            <span className="font-heading text-2xl font-bold sm:text-3xl">
                              {format(new Date(event.eventDate), "dd")}
                            </span>
                            <span className="font-mono text-[10px] text-navy-400">
                              {format(new Date(event.eventDate), "yyyy")}
                            </span>
                          </div>

                          {/* Content */}
                          <div className="flex flex-1 items-center justify-between p-4 sm:p-5">
                            <div className="flex-1">
                              <h3 className="font-heading text-base font-semibold text-gray-900 group-hover:text-navy-800 transition-colors sm:text-lg">
                                {event.title}
                              </h3>
                              <p className="mt-1 text-sm text-gray-500 line-clamp-1">{event.description}</p>
                              <div className="mt-2 flex flex-wrap gap-4">
                                <span className="flex items-center gap-1.5 text-xs text-gray-400">
                                  <MapPin className="h-3 w-3" /> {event.location}
                                </span>
                                <span className="flex items-center gap-1.5 text-xs text-gray-400">
                                  <Clock className="h-3 w-3" />
                                  <span className="font-mono">{format(new Date(event.eventDate), "h:mm a")}</span>
                                </span>
                              </div>
                            </div>
                            <ArrowRight className="hidden sm:block h-4 w-4 text-gray-300 transition-all group-hover:text-electric group-hover:translate-x-1" />
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
