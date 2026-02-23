"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Download,
  Trash2,
  Eye,
  X,
  Users,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

interface Member {
  id: string;
  memberId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  matricNumber: string;
  level: string;
  gender: string | null;
  department: string | null;
  faculty: string | null;
  stateOfOrigin: string | null;
  academicSession: string | null;
  semester: string | null;
  passportUrl: string;
  paymentStatus: string;
  amountPaid: number;
  paidAt: string | null;
  createdAt: string;
}

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (search) params.set("search", search);
      const res = await fetch(`/api/members?${params}`);
      const data = await res.json();
      if (res.ok) {
        setMembers(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotal(data.pagination?.total || 0);
      }
    } catch {
      toast.error("Failed to load members");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this member?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/members/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Member deleted");
        fetchMembers();
        if (selectedMember?.id === id) setSelectedMember(null);
      } else {
        toast.error("Failed to delete member");
      }
    } catch {
      toast.error("Failed to delete member");
    } finally {
      setDeleting(null);
    }
  };

  const exportCSV = () => {
    const headers = [
      "Name", "Matric No", "Email", "Phone", "Level", "Gender",
      "Department", "Faculty", "State of Origin", "Session", "Semester",
      "Member ID", "Status", "Amount", "Date",
    ];
    const rows = members.map((m) => [
      `${m.firstName} ${m.lastName}`,
      m.matricNumber,
      m.email,
      m.phone,
      m.level,
      m.gender || "",
      m.department || "",
      m.faculty || "",
      m.stateOfOrigin || "",
      m.academicSession || "",
      m.semester || "",
      m.memberId,
      m.paymentStatus,
      m.amountPaid,
      m.createdAt ? new Date(m.createdAt).toLocaleDateString() : "",
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "runacos-members.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return "bg-green-100 text-green-700";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "FAILED":
        return "bg-red-100 text-red-700";
      case "UNPAID":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Members</h1>
          <p className="text-sm text-gray-500">
            {total} total member{total !== 1 ? "s" : ""} registered
          </p>
        </div>
        <button onClick={exportCSV} className="btn-secondary gap-2 text-sm">
          <Download className="h-4 w-4" /> Export CSV
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, matric number, email, or member ID..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="input-field pl-10"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-surface-3 bg-surface-0">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-navy-600" />
          </div>
        ) : members.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Users className="h-12 w-12 mb-3" />
            <p className="font-medium">No members found</p>
            <p className="text-sm">
              {search ? "Try a different search term" : "Members will appear here after registration"}
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-3 bg-surface-1 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Matric No</th>
                <th className="px-4 py-3 hidden md:table-cell">Email</th>
                <th className="px-4 py-3 hidden sm:table-cell">Level</th>
                <th className="px-4 py-3 hidden lg:table-cell">Member ID</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 hidden md:table-cell">Date</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-3">
              {members.map((member, i) => (
                <motion.tr
                  key={member.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-surface-1"
                >
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {member.firstName} {member.lastName}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{member.matricNumber}</td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{member.email}</td>
                  <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{member.level}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500 hidden lg:table-cell">
                    {member.memberId}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-md font-mono px-2 py-0.5 text-xs font-medium ${statusColor(member.paymentStatus)}`}>
                      {member.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                    {new Date(member.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setSelectedMember(member)}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-blue-50 hover:text-blue-600"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        disabled={deleting === member.id}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                        title="Delete"
                      >
                        {deleting === member.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-ghost text-sm gap-1 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="btn-ghost text-sm gap-1 disabled:opacity-50"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Member Detail Modal */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setSelectedMember(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-surface-0 p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute right-4 top-4 rounded-lg p-1 hover:bg-surface-1"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>

              <div className="flex items-start gap-4">
                <div className="h-20 w-16 flex-shrink-0 overflow-hidden rounded-lg border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedMember.passportUrl}
                    alt="Passport"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {selectedMember.firstName} {selectedMember.lastName}
                  </h2>
                  <p className="text-sm text-gray-500">{selectedMember.memberId}</p>
                  <span className={`mt-1 inline-flex rounded-md font-mono px-2 py-0.5 text-xs font-medium ${statusColor(selectedMember.paymentStatus)}`}>
                    {selectedMember.paymentStatus}
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {[
                  { label: "Email", value: selectedMember.email },
                  { label: "Phone", value: selectedMember.phone },
                  { label: "Matric Number", value: selectedMember.matricNumber },
                  { label: "Level", value: `${selectedMember.level} Level` },
                  { label: "Gender", value: selectedMember.gender || "N/A" },
                  { label: "Department", value: selectedMember.department || "N/A" },
                  { label: "Faculty", value: selectedMember.faculty || "N/A" },
                  { label: "State of Origin", value: selectedMember.stateOfOrigin || "N/A" },
                  { label: "Academic Session", value: selectedMember.academicSession || "N/A" },
                  { label: "Semester", value: selectedMember.semester || "N/A" },
                  { label: "Amount Paid", value: selectedMember.amountPaid ? `\u20A6${selectedMember.amountPaid.toLocaleString()}` : "Not paid" },
                  { label: "Payment Date", value: selectedMember.paidAt ? new Date(selectedMember.paidAt).toLocaleString() : "Not paid" },
                  { label: "Registration Date", value: new Date(selectedMember.createdAt).toLocaleString() },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between border-b border-surface-3 pb-2">
                    <span className="text-sm text-gray-500">{item.label}</span>
                    <span className="text-sm font-medium text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
