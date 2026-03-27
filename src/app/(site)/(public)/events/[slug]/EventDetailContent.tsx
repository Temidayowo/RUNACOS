"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Calendar, MapPin, Clock, Users, Loader2, X } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import { PageTransition } from "@/components/ui/MotionWrapper";
import { fetcher } from "@/lib/fetcher";

interface EventData {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage: string | null;
  location: string;
  eventDate: string;
  endDate: string | null;
  _count?: { registrations: number };
}

export function EventDetailContent() {
  const params = useParams();
  const slug = params.slug as string;
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;
    setSubmitting(true);
    setFormError(null);
    try {
      const res = await fetch(`/api/events/${event.id}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Successfully registered for this event!");
        setShowModal(false);
        setForm({ name: "", email: "", phone: "" });
        setAlreadyRegistered(true);
      } else if (res.status === 409) {
        setFormError("This email is already registered for this event.");
        setAlreadyRegistered(true);
      } else {
        setFormError(data.error || "Registration failed");
      }
    } catch {
      setFormError("Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  const { data, isLoading: loading, error: swrError } = useSWR(
    slug ? `/api/events/${slug}` : null,
    fetcher
  );
  const event: EventData | null = data?.data || null;
  const error = swrError || (data && !data.data);

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-electric" />
        </div>
      </PageTransition>
    );
  }

  if (error || !event) {
    return (
      <PageTransition>
        <div className="py-20 text-center">
          <p className="text-gray-500">Event not found</p>
          <Link href="/events" className="mt-4 inline-flex btn-primary text-sm">
            Back to Events
          </Link>
        </div>
      </PageTransition>
    );
  }

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
              className="relative aspect-[21/9] overflow-hidden rounded-xl bg-gradient-to-br from-navy-800 to-blue-600"
            >
              {event.coverImage ? (
                <Image src={event.coverImage} alt={event.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 896px" />
              ) : (
                <div className="flex h-full items-center justify-center text-white/30 text-2xl font-bold">RUNACOS EVENT</div>
              )}
            </motion.div>

            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <h1 className="font-heading text-3xl font-extrabold text-gray-900 sm:text-4xl">{event.title}</h1>
                <div className="prose-custom mt-6">
                  {event.description.split("\n").map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </motion.div>

              <motion.aside
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                {[
                  { icon: Calendar, label: "Date", value: format(new Date(event.eventDate), "MMMM dd, yyyy") },
                  {
                    icon: Clock,
                    label: "Time",
                    value: event.endDate
                      ? `${format(new Date(event.eventDate), "h:mm a")} - ${format(new Date(event.endDate), "h:mm a")}`
                      : format(new Date(event.eventDate), "h:mm a"),
                  },
                  { icon: MapPin, label: "Location", value: event.location },
                  ...(event._count ? [{ icon: Users, label: "Registered", value: `${event._count.registrations} attendees` }] : []),
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3 rounded-xl border border-surface-3 bg-surface-0 p-4 shadow-sm">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-navy-50">
                      <item.icon className="h-4 w-4 text-navy-800" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">{item.label}</p>
                      <p className="text-sm font-mono font-medium text-gray-900">{item.value}</p>
                    </div>
                  </div>
                ))}

                {(() => {
                  const isPast = new Date(event.endDate ?? event.eventDate) < new Date();
                  return (
                    <button
                      onClick={() => { setFormError(null); setShowModal(true); }}
                      disabled={alreadyRegistered || isPast}
                      className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isPast ? "Registration Closed" : alreadyRegistered ? "Already Registered" : "Register for Event"}
                    </button>
                  );
                })()}
              </motion.aside>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md rounded-2xl bg-surface-0 p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute right-4 top-4 rounded-lg p-1 hover:bg-surface-1"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>

              <h2 className="text-lg font-bold text-gray-900">Register for Event</h2>
              <p className="mt-1 text-sm text-gray-500">{event.title}</p>

              <form onSubmit={handleRegister} className="mt-5 space-y-4">
                {formError && (
                  <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                    {formError}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    className="input-field"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    className="input-field"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone <span className="text-gray-400">(optional)</span></label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                    className="input-field"
                    placeholder="+234..."
                  />
                </div>
                <button type="submit" disabled={submitting} className="btn-primary w-full">
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : "Confirm Registration"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
