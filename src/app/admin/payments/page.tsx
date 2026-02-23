"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Download,
  Loader2,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

interface Payment {
  id: string;
  memberId: string;
  academicSession: string;
  amount: number;
  paymentRef: string;
  paymentStatus: string;
  paymentMethod: string;
  verifiedAt: string | null;
  createdAt: string;
  member: {
    firstName: string;
    lastName: string;
    matricNumber: string;
    memberId: string;
    email: string;
  };
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [sessionFilter, setSessionFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  // Manual payment state
  const [showManual, setShowManual] = useState(false);
  const [manualEmail, setManualEmail] = useState("");
  const [submittingManual, setSubmittingManual] = useState(false);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (sessionFilter) params.set("session", sessionFilter);
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(`/api/dues?${params}`);
      const data = await res.json();
      if (res.ok) {
        setPayments(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotal(data.pagination?.total || 0);
      }
    } catch {
      toast.error("Failed to load payments");
    } finally {
      setLoading(false);
    }
  }, [page, sessionFilter, statusFilter]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleVerify = async (id: string) => {
    setVerifyingId(id);
    try {
      const res = await fetch(`/api/dues/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: "VERIFIED" }),
      });
      if (res.ok) {
        toast.success("Payment verified");
        fetchPayments();
      } else {
        toast.error("Failed to verify payment");
      }
    } catch {
      toast.error("Failed to verify");
    } finally {
      setVerifyingId(null);
    }
  };

  const handleManualPayment = async () => {
    if (!manualEmail.trim()) {
      toast.error("Enter member email");
      return;
    }
    setSubmittingManual(true);
    try {
      // First initiate a payment (this creates the record)
      const res = await fetch("/api/dues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: manualEmail }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to create payment");
        return;
      }
      // Then immediately verify it
      const paymentId = data.data?.payment?.id;
      if (paymentId) {
        await fetch(`/api/dues/${paymentId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paymentStatus: "VERIFIED" }),
        });
      }
      toast.success("Payment mapped successfully");
      setShowManual(false);
      setManualEmail("");
      fetchPayments();
    } catch {
      toast.error("Failed to map payment");
    } finally {
      setSubmittingManual(false);
    }
  };

  const exportCSV = () => {
    const headers = ["Name", "Matric No", "Member ID", "Session", "Amount", "Status", "Method", "Reference", "Date"];
    const rows = payments.map((p) => [
      `${p.member.firstName} ${p.member.lastName}`,
      p.member.matricNumber,
      p.member.memberId,
      p.academicSession,
      p.amount,
      p.paymentStatus,
      p.paymentMethod,
      p.paymentRef,
      new Date(p.createdAt).toLocaleDateString(),
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "runacos-payments.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-gray-900">Payments</h1>
          <p className="text-sm text-gray-500">{total} total payment{total !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowManual(true)} className="btn-primary gap-2 text-sm">
            <Plus className="h-4 w-4" /> Map Payment
          </button>
          <button onClick={exportCSV} className="btn-secondary gap-2 text-sm">
            <Download className="h-4 w-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={sessionFilter}
          onChange={(e) => { setSessionFilter(e.target.value); setPage(1); }}
          className="input-field max-w-xs"
        >
          <option value="">All Sessions</option>
          <option value="2025/2026">2025/2026</option>
          <option value="2024/2025">2024/2025</option>
          <option value="2023/2024">2023/2024</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="input-field max-w-xs"
        >
          <option value="">All Statuses</option>
          <option value="VERIFIED">Verified</option>
          <option value="PENDING">Pending</option>
          <option value="FAILED">Failed</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-surface-3 bg-surface-0">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-navy-600" />
          </div>
        ) : payments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <CreditCard className="h-12 w-12 mb-3" />
            <p className="font-medium">No payments found</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-3 bg-surface-1 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3 hidden md:table-cell">Matric No</th>
                <th className="px-4 py-3">Session</th>
                <th className="px-4 py-3 hidden sm:table-cell">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 hidden lg:table-cell">Method</th>
                <th className="px-4 py-3 hidden md:table-cell">Date</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-3">
              {payments.map((p, i) => (
                <motion.tr
                  key={p.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="hover:bg-surface-1"
                >
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {p.member.firstName} {p.member.lastName}
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{p.member.matricNumber}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{p.academicSession}</td>
                  <td className="px-4 py-3 font-mono text-gray-900 hidden sm:table-cell">
                    {"\u20A6"}{p.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-md font-mono px-2 py-0.5 text-xs font-medium ${
                      p.paymentStatus === "VERIFIED" ? "bg-green-100 text-green-700" :
                      p.paymentStatus === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {p.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 hidden lg:table-cell">{p.paymentMethod}</td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    {p.paymentStatus !== "VERIFIED" && (
                      <button
                        onClick={() => handleVerify(p.id)}
                        disabled={verifyingId === p.id}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-green-50 hover:text-green-600"
                        title="Verify Payment"
                      >
                        {verifyingId === p.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                      </button>
                    )}
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
          <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
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

      {/* Manual Payment Modal */}
      {showManual && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowManual(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-surface-0 rounded-xl shadow-xl w-full max-w-sm p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-heading font-bold text-gray-900 mb-4">Map Manual Payment</h3>
            <p className="text-sm text-gray-500 mb-4">
              Mark a member as paid for the current session (manual/cash payment).
            </p>
            <input
              type="email"
              value={manualEmail}
              onChange={(e) => setManualEmail(e.target.value)}
              placeholder="Member email address"
              className="input-field mb-4"
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowManual(false)} className="btn-secondary text-sm">Cancel</button>
              <button
                onClick={handleManualPayment}
                disabled={submittingManual}
                className="btn-primary text-sm gap-2"
              >
                {submittingManual ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                {submittingManual ? "Processing..." : "Map Payment"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
