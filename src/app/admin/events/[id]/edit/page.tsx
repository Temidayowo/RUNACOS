"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { CONTENT_STATUSES } from "@/lib/constants";
import { toast } from "sonner";

interface EventData {
  id: string;
  title: string;
  description: string;
  location: string;
  eventDate: string;
  endDate?: string;
  coverImage: string;
  status: string;
}

function toDatetimeLocal(isoString: string): string {
  if (!isoString) return "";
  const date = new Date(isoString);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    eventDate: "",
    endDate: "",
    coverImage: "",
    status: "DRAFT",
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/${id}`);
        if (!res.ok) throw new Error("Failed to fetch event");
        const json = await res.json();
        const data: EventData = json.data || json;
        setForm({
          title: data.title || "",
          description: data.description || "",
          location: data.location || "",
          eventDate: toDatetimeLocal(data.eventDate || ""),
          endDate: toDatetimeLocal(data.endDate || ""),
          coverImage: data.coverImage || "",
          status: data.status || "DRAFT",
        });
      } catch {
        toast.error("Failed to load event");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        ...form,
        eventDate: new Date(form.eventDate).toISOString(),
        endDate: form.endDate ? new Date(form.endDate).toISOString() : undefined,
      };

      const res = await fetch(`/api/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to update event");
      }

      toast.success("Event updated successfully");
      router.push("/admin/events");
    } catch (err: any) {
      toast.error(err.message || "Failed to update event");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse" />
          <div>
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mt-2" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
              <div className="h-10 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/events"
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold font-merriweather text-gray-900">Edit Event</h1>
          <p className="text-sm text-gray-500 mt-1">Update this event</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            value={form.title}
            onChange={handleChange}
            placeholder="Enter event title"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-800/20 focus:border-navy-800"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={6}
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the event"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-800/20 focus:border-navy-800 resize-vertical"
          />
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location <span className="text-red-500">*</span>
          </label>
          <input
            id="location"
            name="location"
            type="text"
            required
            value={form.location}
            onChange={handleChange}
            placeholder="Event venue or location"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-800/20 focus:border-navy-800"
          />
        </div>

        {/* Event Date & End Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-1">
              Event Date <span className="text-red-500">*</span>
            </label>
            <input
              id="eventDate"
              name="eventDate"
              type="datetime-local"
              required
              value={form.eventDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-800/20 focus:border-navy-800"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              id="endDate"
              name="endDate"
              type="datetime-local"
              value={form.endDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-800/20 focus:border-navy-800"
            />
          </div>
        </div>

        {/* Cover Image & Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-1">
              Cover Image URL
            </label>
            <input
              id="coverImage"
              name="coverImage"
              type="url"
              value={form.coverImage}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-800/20 focus:border-navy-800"
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-800/20 focus:border-navy-800 bg-white"
            >
              {Object.entries(CONTENT_STATUSES).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <Link
            href="/admin/events"
            className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className={cn(
              "inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-navy-800 rounded-lg transition-colors",
              submitting ? "opacity-50 cursor-not-allowed" : "hover:bg-navy-900"
            )}
          >
            <Calendar className="w-4 h-4" />
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
