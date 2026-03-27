"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Calendar, Search, ChevronLeft, ChevronRight, Users, X, Download, Loader2, ScanLine } from "lucide-react";
import { cn, formatDateShort } from "@/lib/utils";
import { CONTENT_STATUSES } from "@/lib/constants";
import { toast } from "sonner";

interface Registrant {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  checkedIn: boolean;
  checkedInAt: string | null;
  createdAt: string;
}

interface EventItem {
  id: string;
  title: string;
  location: string;
  eventDate: string;
  endDate?: string;
  status: keyof typeof CONTENT_STATUSES;
  createdAt: string;
  _count?: { registrations: number };
}

interface EventsResponse {
  data: EventItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function AdminEventsPage() {

  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [registrantsModal, setRegistrantsModal] = useState<{ eventId: string; title: string } | null>(null);
  const [registrants, setRegistrants] = useState<Registrant[]>([]);
  const [registrantsLoading, setRegistrantsLoading] = useState(false);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      if (search) params.set("search", search);
      params.set("page", page.toString());
      params.set("limit", "10");

      const res = await fetch(`/api/events?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch events");
      const json: EventsResponse = await res.json();
      setEvents(json.data);
      setTotalPages(json.pagination.totalPages);
      setTotal(json.pagination.total);
    } catch {
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search, page]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const openRegistrants = async (eventId: string, title: string) => {
    setRegistrantsModal({ eventId, title });
    setRegistrantsLoading(true);
    try {
      const res = await fetch(`/api/events/${eventId}/register`);
      const data = await res.json();
      setRegistrants(data.data || []);
    } catch {
      toast.error("Failed to load registrants");
    } finally {
      setRegistrantsLoading(false);
    }
  };

  const exportRegistrantsCSV = () => {
    if (!registrantsModal || registrants.length === 0) return;
    const headers = ["Name", "Email", "Phone", "Status", "Checked In At", "Registered At"];
    const escape = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
    const rows = registrants.map((r) => [
      escape(r.name),
      escape(r.email),
      escape(r.phone || ""),
      escape(r.checkedIn ? "Verified" : "Pending"),
      escape(r.checkedInAt ? new Date(r.checkedInAt).toLocaleString() : ""),
      escape(new Date(r.createdAt).toLocaleString()),
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `registrants-${registrantsModal.title.replace(/\s+/g, "-").toLowerCase()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Event deleted successfully");
      fetchEvents();
    } catch {
      toast.error("Failed to delete event");
    }
  };

  const getStatusBadge = (status: keyof typeof CONTENT_STATUSES) => {
    const statusInfo = CONTENT_STATUSES[status];
    return (
      <span
        className={cn(
          "inline-flex items-center px-2.5 py-0.5 rounded-md font-mono text-xs font-medium",
          statusInfo.color === "green" && "bg-green-100 text-green-700",
          statusInfo.color === "yellow" && "bg-yellow-100 text-yellow-700",
          statusInfo.color === "gray" && "bg-gray-100 text-gray-700"
        )}
      >
        {statusInfo.label}
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-gray-900">Events</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage upcoming and past events
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/events/check-in"
            className="inline-flex items-center gap-2 border border-surface-3 bg-surface-0 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-surface-1 transition-colors"
          >
            <ScanLine className="w-4 h-4" />
            Check-In
          </Link>
          <Link
            href="/admin/events/new"
            className="inline-flex items-center gap-2 bg-navy-800 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-navy-900 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Event
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-surface-0 rounded-xl border border-surface-3 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-surface-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-800/20 focus:border-navy-800"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 border border-surface-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-800/20 focus:border-navy-800 bg-white"
          >
            <option value="">All Statuses</option>
            {Object.entries(CONTENT_STATUSES).map(([key, value]) => (
              <option key={key} value={key}>
                {value.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-0 rounded-xl border border-surface-3 overflow-hidden min-w-0">
        {loading ? (
          <div className="p-8 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-4 bg-gray-200 rounded w-1/5" />
                <div className="h-4 bg-gray-200 rounded w-1/5" />
                <div className="h-4 bg-gray-200 rounded w-1/6" />
                <div className="h-4 bg-gray-200 rounded w-1/12" />
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No events found</h3>
            <p className="text-sm text-gray-500">
              {search || statusFilter
                ? "Try adjusting your filters."
                : "Get started by creating your first event."}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="border-b border-surface-3 bg-surface-1">
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                      Title
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3 hidden sm:table-cell">
                      Location
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3 hidden md:table-cell">
                      Event Date
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                      Status
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3 hidden sm:table-cell">
                      Registrations
                    </th>
                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-3">
                  {events.map((item, i) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-surface-1 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                          {item.title}
                        </p>
                      </td>
                      <td className="px-4 py-4 hidden sm:table-cell">
                        <span className="text-sm text-gray-600">{item.location}</span>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <span className="text-sm text-gray-500">
                          {formatDateShort(item.eventDate)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {getStatusBadge(item.status)}
                      </td>
                      <td className="px-4 py-4 hidden sm:table-cell">
                        <button
                          onClick={() => openRegistrants(item.id, item.title)}
                          className="inline-flex items-center gap-1.5 text-sm text-navy-800 hover:underline"
                        >
                          <Users className="w-3.5 h-3.5" />
                          {item._count?.registrations ?? 0}
                        </button>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/events/${item.id}/edit`}
                            className="p-1.5 text-gray-400 hover:text-navy-800 hover:bg-surface-1 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(item.id, item.title)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-surface-3">
                <p className="text-sm text-gray-500">
                  Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, total)} of {total} results
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className={cn(
                      "p-2 rounded-lg text-sm transition-colors",
                      page === 1
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-600 hover:bg-surface-1"
                    )}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={cn(
                        "w-8 h-8 rounded-lg text-sm font-medium transition-colors",
                        p === page
                          ? "bg-navy-800 text-white"
                          : "text-gray-600 hover:bg-surface-1"
                      )}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className={cn(
                      "p-2 rounded-lg text-sm transition-colors",
                      page === totalPages
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-600 hover:bg-surface-1"
                    )}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Registrants Modal */}
      <AnimatePresence>
        {registrantsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setRegistrantsModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-4xl max-h-[80vh] flex flex-col rounded-2xl bg-surface-0 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-surface-3">
                <div>
                  <h2 className="font-bold text-gray-900">Registrants</h2>
                  <p className="text-xs text-gray-500 truncate max-w-xs">{registrantsModal.title}</p>
                </div>
                <div className="flex items-center gap-2">
                  {registrants.length > 0 && (
                    <button onClick={exportRegistrantsCSV} className="btn-secondary text-xs gap-1.5">
                      <Download className="w-3.5 h-3.5" /> Export CSV
                    </button>
                  )}
                  <button onClick={() => setRegistrantsModal(null)} className="p-1 rounded-lg hover:bg-surface-1">
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Modal body */}
              <div className="overflow-y-auto flex-1">
                {registrantsLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 className="w-6 h-6 animate-spin text-navy-600" />
                  </div>
                ) : registrants.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                    <Users className="w-10 h-10 mb-2" />
                    <p className="text-sm">No registrations yet</p>
                  </div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-surface-3 bg-surface-1 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3 hidden sm:table-cell">Phone</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 hidden sm:table-cell">Registered</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-3">
                      {registrants.map((r) => (
                        <tr key={r.id} className="hover:bg-surface-1">
                          <td className="px-4 py-3 font-medium text-gray-900">{r.name}</td>
                          <td className="px-4 py-3 text-gray-600">{r.email}</td>
                          <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{r.phone || "—"}</td>
                          <td className="px-4 py-3">
                            {r.checkedIn ? (
                              <span className="inline-flex items-center gap-1 rounded-md bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                                ✓ Verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                                Pending
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{new Date(r.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Count footer */}
              {!registrantsLoading && registrants.length > 0 && (
                <div className="px-6 py-3 border-t border-surface-3 text-xs text-gray-500">
                  {registrants.length} registrant{registrants.length !== 1 ? "s" : ""}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
