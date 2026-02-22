"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Bug,
  User,
  Mail,
  Phone,
  MapPin,
  Tag,
  FileText,
  Clock,
  Paperclip,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { cn, formatDate, formatDateShort } from "@/lib/utils";
import { FAULT_STATUSES } from "@/lib/constants";

type FaultStatus = keyof typeof FAULT_STATUSES;

interface StatusHistory {
  id: string;
  status: FaultStatus;
  note: string | null;
  createdAt: string;
  user: { name: string } | null;
}

interface StaffUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Fault {
  id: string;
  referenceId: string;
  name: string;
  email: string;
  phone: string | null;
  location: string;
  categoryId: string;
  description: string;
  fileUrl: string | null;
  status: FaultStatus;
  assignedStaffId: string | null;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
  category: { id: string; name: string };
  assignedStaff: { id: string; name: string; email: string } | null;
  statusHistory: StatusHistory[];
}

const statusBadgeClasses: Record<string, string> = {
  red: "bg-red-100 text-red-700",
  yellow: "bg-yellow-100 text-yellow-700",
  green: "bg-green-100 text-green-700",
  gray: "bg-gray-100 text-gray-700",
};

const statusTimelineClasses: Record<string, string> = {
  red: "bg-red-500",
  yellow: "bg-yellow-500",
  green: "bg-green-500",
  gray: "bg-surface-10",
};

export default function FaultDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [fault, setFault] = useState<Fault | null>(null);
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Update form state
  const [newStatus, setNewStatus] = useState<FaultStatus | "">("");
  const [assignedStaffId, setAssignedStaffId] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [statusNote, setStatusNote] = useState("");

  const fetchFault = useCallback(async () => {
    try {
      const res = await fetch(`/api/frms/${id}`);
      if (!res.ok) {
        if (res.status === 404) {
          router.push("/admin/frms");
          return;
        }
        throw new Error("Failed to fetch fault");
      }
      const json = await res.json();
      const data = json.data as Fault;
      setFault(data);
      setNewStatus(data.status);
      setAssignedStaffId(data.assignedStaffId || "");
      setAdminNotes(data.adminNotes || "");
    } catch (error) {
      console.error("Failed to fetch fault:", error);
      setErrorMessage("Failed to load fault details.");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/users");
      const json = await res.json();
      setUsers(json.data || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  }, []);

  useEffect(() => {
    fetchFault();
    fetchUsers();
  }, [fetchFault, fetchUsers]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const body: Record<string, string | undefined> = {};
      if (newStatus && newStatus !== fault?.status) {
        body.status = newStatus;
        body.note = statusNote || `Status changed to ${FAULT_STATUSES[newStatus].label}`;
      }
      if (assignedStaffId !== (fault?.assignedStaffId || "")) {
        body.assignedStaffId = assignedStaffId || undefined;
      }
      if (adminNotes !== (fault?.adminNotes || "")) {
        body.adminNotes = adminNotes;
      }

      if (Object.keys(body).length === 0) {
        setErrorMessage("No changes to save.");
        setSaving(false);
        return;
      }

      const res = await fetch(`/api/frms/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Failed to update fault");
      }

      setSuccessMessage("Fault updated successfully.");
      setStatusNote("");
      // Refresh fault data
      await fetchFault();
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to update fault.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Skeleton header */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse" />
          <div className="h-6 bg-gray-200 rounded w-48 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-surface-0 rounded-xl border border-surface-3 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-32 mb-4" />
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded w-full" />
                ))}
              </div>
            </div>
          </div>
          <div className="bg-surface-0 rounded-xl border border-surface-3 p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-32 mb-4" />
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 rounded w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!fault) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Bug className="w-12 h-12 text-gray-300 mb-4" />
        <p className="text-gray-500">Fault report not found</p>
        <Link href="/admin/frms" className="mt-3 text-sm text-electric hover:underline">
          Back to all faults
        </Link>
      </div>
    );
  }

  const currentStatusInfo = FAULT_STATUSES[fault.status];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <Link
            href="/admin/frms"
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-surface-0 border border-surface-3 hover:bg-surface-1 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold font-heading text-gray-900">
              {fault.referenceId}
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              Reported on {formatDate(fault.createdAt)}
            </p>
          </div>
        </div>
        <span
          className={cn(
            "inline-flex items-center self-start text-sm px-3 py-1.5 rounded-md font-mono font-medium",
            statusBadgeClasses[currentStatusInfo.color]
          )}
        >
          {currentStatusInfo.label}
        </span>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Fault Details & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Fault Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-surface-0 rounded-xl border border-surface-3"
          >
            <div className="px-6 py-4 border-b border-surface-3">
              <h2 className="text-lg font-semibold text-gray-900">Fault Details</h2>
            </div>
            <div className="p-6 space-y-5">
              {/* Reporter Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                      Reporter Name
                    </p>
                    <p className="text-sm font-medium text-gray-900 mt-0.5">{fault.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                      Email
                    </p>
                    <a
                      href={`mailto:${fault.email}`}
                      className="text-sm text-electric hover:underline mt-0.5 block"
                    >
                      {fault.email}
                    </a>
                  </div>
                </div>
                {fault.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                        Phone
                      </p>
                      <p className="text-sm text-gray-900 mt-0.5">{fault.phone}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <Tag className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                      Category
                    </p>
                    <p className="text-sm text-gray-900 mt-0.5">
                      {fault.category?.name || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                    Location
                  </p>
                  <p className="text-sm text-gray-900 mt-0.5">{fault.location}</p>
                </div>
              </div>

              {/* Description */}
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                    Description
                  </p>
                  <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap leading-relaxed">
                    {fault.description}
                  </p>
                </div>
              </div>

              {/* Attachment */}
              {fault.fileUrl && (
                <div className="flex items-start gap-3">
                  <Paperclip className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                      Attachment
                    </p>
                    <a
                      href={fault.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-electric hover:underline mt-1"
                    >
                      View Attachment
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}

              {/* Assigned Staff */}
              {fault.assignedStaff && (
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                      Assigned Staff
                    </p>
                    <p className="text-sm text-gray-900 mt-0.5">
                      {fault.assignedStaff.name}{" "}
                      <span className="text-gray-500">({fault.assignedStaff.email})</span>
                    </p>
                  </div>
                </div>
              )}

              {/* Admin Notes (read-only display) */}
              {fault.adminNotes && (
                <div className="bg-surface-1 rounded-lg p-4 border border-surface-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">
                    Admin Notes
                  </p>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {fault.adminNotes}
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Status Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-surface-0 rounded-xl border border-surface-3"
          >
            <div className="px-6 py-4 border-b border-surface-3">
              <h2 className="text-lg font-semibold text-gray-900">Status Timeline</h2>
            </div>
            <div className="p-6">
              {fault.statusHistory.length === 0 ? (
                <div className="flex items-center gap-3 text-gray-500">
                  <Clock className="w-5 h-5" />
                  <p className="text-sm">
                    No status changes yet. Fault was created with status{" "}
                    <span className="font-medium">Open</span>.
                  </p>
                </div>
              ) : (
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-200" />

                  <div className="space-y-6">
                    {fault.statusHistory.map((entry, index) => {
                      const entryStatusInfo = FAULT_STATUSES[entry.status];
                      return (
                        <motion.div
                          key={entry.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex gap-4 relative"
                        >
                          {/* Dot */}
                          <div
                            className={cn(
                              "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 z-10 ring-4 ring-white",
                              statusTimelineClasses[entryStatusInfo.color]
                            )}
                          >
                            <CheckCircle className="w-3.5 h-3.5 text-white" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 pb-1">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                              <p className="text-sm font-medium text-gray-900">
                                Status changed to{" "}
                                <span
                                  className={cn(
                                    "inline-flex items-center text-xs px-2 py-0.5 rounded-md font-mono font-medium",
                                    statusBadgeClasses[entryStatusInfo.color]
                                  )}
                                >
                                  {entryStatusInfo.label}
                                </span>
                              </p>
                              <span className="text-xs text-gray-400">
                                {formatDateShort(entry.createdAt)}
                              </span>
                            </div>
                            {entry.note && (
                              <p className="text-sm text-gray-600 mt-1">{entry.note}</p>
                            )}
                            {entry.user && (
                              <p className="text-xs text-gray-400 mt-1">
                                by {entry.user.name}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Column - Update Form */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-surface-0 rounded-xl border border-surface-3 sticky top-24"
          >
            <div className="px-6 py-4 border-b border-surface-3">
              <h2 className="text-lg font-semibold text-gray-900">Update Fault</h2>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-5">
              {/* Success / Error Messages */}
              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 bg-green-50 text-green-700 text-sm px-4 py-3 rounded-lg border border-green-200"
                >
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  {successMessage}
                </motion.div>
              )}
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg border border-red-200"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {errorMessage}
                </motion.div>
              )}

              {/* Status */}
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Status
                </label>
                <select
                  id="status"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as FaultStatus)}
                  className="w-full border border-surface-3 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-800 focus:border-transparent bg-white"
                >
                  {(Object.keys(FAULT_STATUSES) as FaultStatus[]).map((key) => (
                    <option key={key} value={key}>
                      {FAULT_STATUSES[key].label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Change Note */}
              {newStatus && newStatus !== fault.status && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                >
                  <label
                    htmlFor="statusNote"
                    className="block text-sm font-medium text-gray-700 mb-1.5"
                  >
                    Status Change Note
                  </label>
                  <input
                    id="statusNote"
                    type="text"
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder="Optional note about this status change..."
                    className="w-full border border-surface-3 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-800 focus:border-transparent"
                  />
                </motion.div>
              )}

              {/* Assign Staff */}
              <div>
                <label
                  htmlFor="assignedStaff"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Assign Staff
                </label>
                <select
                  id="assignedStaff"
                  value={assignedStaffId}
                  onChange={(e) => setAssignedStaffId(e.target.value)}
                  className="w-full border border-surface-3 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-800 focus:border-transparent bg-white"
                >
                  <option value="">Unassigned</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.role})
                    </option>
                  ))}
                </select>
              </div>

              {/* Admin Notes */}
              <div>
                <label
                  htmlFor="adminNotes"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  Admin Notes
                </label>
                <textarea
                  id="adminNotes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={4}
                  placeholder="Internal notes about this fault..."
                  className="w-full border border-surface-3 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-800 focus:border-transparent resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={saving}
                className={cn(
                  "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-colors",
                  saving
                    ? "bg-navy-800/70 cursor-not-allowed"
                    : "bg-navy-800 hover:bg-navy-900"
                )}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
