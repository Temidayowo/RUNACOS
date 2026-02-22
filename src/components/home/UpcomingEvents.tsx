"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Clock } from "lucide-react";
import { format } from "date-fns";
import { AnimateOnScroll, StaggerContainer, StaggerItem } from "@/components/ui/MotionWrapper";

const placeholderEvents = [
  {
    id: "1",
    title: "RUNACOS Tech Summit 2024",
    slug: "tech-summit-2024",
    location: "Main Auditorium, RUN",
    eventDate: "2024-11-15T09:00:00Z",
    coverImage: null,
  },
  {
    id: "2",
    title: "Workshop: Introduction to AI & ML",
    slug: "ai-ml-workshop",
    location: "CS Lab 2, Block B",
    eventDate: "2024-11-20T14:00:00Z",
    coverImage: null,
  },
  {
    id: "3",
    title: "Career Fair: Meet Tech Companies",
    slug: "career-fair-2024",
    location: "University Hall",
    eventDate: "2024-12-05T10:00:00Z",
    coverImage: null,
  },
];

export function UpcomingEvents() {
  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="container-custom">
        <AnimateOnScroll className="mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="section-label mb-2">&mdash; Upcoming Events</p>
            <h2 className="section-heading">Don&apos;t Miss Out</h2>
            <p className="mt-2 text-gray-500">Workshops, seminars, and social activities coming up</p>
          </div>
          <Link
            href="/events"
            className="group inline-flex items-center gap-1 text-sm font-medium text-navy-800 hover:text-blue-600 transition-colors"
          >
            View All Events
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </AnimateOnScroll>

        <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {placeholderEvents.map((event) => (
            <StaggerItem key={event.id}>
              <Link href={`/events/${event.slug}`}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="group flex overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  {/* Date Block */}
                  <div className="flex w-20 shrink-0 flex-col items-center justify-center bg-navy-800 text-white">
                    <span className="text-2xl font-bold">
                      {format(new Date(event.eventDate), "dd")}
                    </span>
                    <span className="text-xs uppercase tracking-wider">
                      {format(new Date(event.eventDate), "MMM")}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4">
                    <h3 className="mb-2 font-serif text-base font-bold text-gray-900 line-clamp-2 group-hover:text-navy-800 transition-colors">
                      {event.title}
                    </h3>
                    <div className="space-y-1">
                      <p className="flex items-center gap-1.5 text-xs text-gray-500">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </p>
                      <p className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        {format(new Date(event.eventDate), "h:mm a")}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
