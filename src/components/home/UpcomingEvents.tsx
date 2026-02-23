"use client";

import Link from "next/link";
import useSWR from "swr";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Clock, Loader2, CalendarX } from "lucide-react";
import { format } from "date-fns";
import {
  AnimateOnScroll,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/MotionWrapper";
import { fetcher } from "@/lib/fetcher";

interface EventItem {
  id: string;
  title: string;
  slug: string;
  location: string;
  eventDate: string;
  coverImage: string | null;
}

export function UpcomingEvents() {
  const { data, isLoading } = useSWR("/api/events?type=upcoming&status=PUBLISHED&limit=3", fetcher);
  const events: EventItem[] = data?.data || [];
  const loading = isLoading;

  return (
    <section className="relative bg-surface-1 py-16 md:py-24">
      <div className="absolute inset-0 bg-grid-dots pointer-events-none" />
      <div className="relative container-custom">
        <AnimateOnScroll className="mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="section-label mb-2">Upcoming Events</p>
            <div className="section-accent-line" />
            <h2 className="section-heading">Don&apos;t Miss Out</h2>
            <p className="mt-2 text-gray-500">
              Workshops, seminars, and activities coming up
            </p>
          </div>
          <Link
            href="/events"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-navy-800 hover:text-electric transition-colors"
          >
            See All Events
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </AnimateOnScroll>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CalendarX className="h-10 w-10 text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">No upcoming events at the moment.</p>
            <Link href="/events" className="text-sm text-electric hover:underline mt-2">
              View past events
            </Link>
          </div>
        ) : (
          <StaggerContainer className="space-y-4">
            {events.map((event) => (
              <StaggerItem key={event.id}>
                <Link href={`/events/${event.slug}`}>
                  <motion.div
                    whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(59,130,246,0.08)" }}
                    className="group flex overflow-hidden rounded-xl border border-surface-3 bg-surface-0 transition-all duration-300"
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
                        <h3 className="font-heading text-base font-semibold text-gray-900 line-clamp-1 group-hover:text-navy-800 transition-colors sm:text-lg">
                          {event.title}
                        </h3>
                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                          <span className="flex items-center gap-1.5 text-xs text-gray-500">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            {event.location}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <span className="font-mono">
                              {format(new Date(event.eventDate), "h:mm a")}
                            </span>
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
      </div>
    </section>
  );
}
