"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Loader2,
  Search,
  Wand2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { toast } from "sonner";

interface MemberWithEligibility {
  id: string;
  memberId: string;
  firstName: string;
  lastName: string;
  email: string;
  matricNumber: string;
  department: string | null;
  admissionYear: number | null;
  isAlumni: boolean;
  eligible: boolean;
}

export default function AdminAlumniPage() {
  const [members, setMembers] = useState<MemberWithEligibility[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "alumni" | "eligible">("all");
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const fetchData = () => {
    setLoading(true);
    fetch("/api/alumni")
      .then((res) => res.json())
      .then((data) => setMembers(data.data || []))
      .catch(() => toast.error("Failed to load data"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleAlumni = async (memberId: string, makeAlumni: boolean) => {
    setTogglingId(memberId);
    try {
      const res = await fetch("/api/alumni", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId, isAlumni: makeAlumni }),
      });
      if (res.ok) {
        setMembers((prev) =>
          prev.map((m) =>
            m.id === memberId ? { ...m, isAlumni: makeAlumni } : m
          )
        );
        toast.success(makeAlumni ? "Added to alumni" : "Removed from alumni");
      } else {
        toast.error("Failed to update");
      }
    } catch {
      toast.error("Failed to update");
    } finally {
      setTogglingId(null);
    }
  };

  const autoDetect = async () => {
    const eligible = members.filter((m) => m.eligible && !m.isAlumni);
    if (eligible.length === 0) {
      toast.info("No new eligible alumni found");
      return;
    }
    if (!confirm(`Mark ${eligible.length} eligible member(s) as alumni?`)) return;

    for (const m of eligible) {
      await toggleAlumni(m.id, true);
    }
    toast.success(`${eligible.length} members marked as alumni`);
  };

  const filtered = members.filter((m) => {
    const matchesSearch =
      !search ||
      `${m.firstName} ${m.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      m.matricNumber.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "alumni" && m.isAlumni) ||
      (filter === "eligible" && m.eligible && !m.isAlumni);

    return matchesSearch && matchesFilter;
  });

  const alumniCount = members.filter((m) => m.isAlumni).length;
  const eligibleCount = members.filter((m) => m.eligible && !m.isAlumni).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-gray-900">Alumni Management</h1>
          <p className="text-sm text-gray-500">
            {alumniCount} alumni &middot; {eligibleCount} eligible non-alumni
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={autoDetect}
          className="btn-primary gap-2 text-sm"
        >
          <Wand2 className="h-4 w-4" /> Auto-Detect Alumni
        </motion.button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, matric number, or email..."
            className="input-field pl-10"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "alumni", "eligible"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={filter === f ? "pill-tab-active" : "pill-tab-inactive"}
            >
              {f === "all" ? "All" : f === "alumni" ? "Alumni" : "Eligible"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-surface-3 bg-surface-0">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-navy-600" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <GraduationCap className="h-12 w-12 mb-3" />
            <p className="font-medium">No members found</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-3 bg-surface-1 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3 hidden md:table-cell">Matric No</th>
                <th className="px-4 py-3 hidden sm:table-cell">Department</th>
                <th className="px-4 py-3">Admission Year</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-3">
              {filtered.map((m, i) => (
                <motion.tr
                  key={m.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="hover:bg-surface-1"
                >
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {m.firstName} {m.lastName}
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{m.matricNumber}</td>
                  <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{m.department || "N/A"}</td>
                  <td className="px-4 py-3 font-mono text-gray-600">{m.admissionYear || "N/A"}</td>
                  <td className="px-4 py-3">
                    {m.isAlumni ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
                        <GraduationCap className="h-3 w-3" /> Alumni
                      </span>
                    ) : m.eligible ? (
                      <span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                        Eligible
                      </span>
                    ) : (
                      <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleAlumni(m.id, !m.isAlumni)}
                      disabled={togglingId === m.id}
                      className="p-1.5 rounded hover:bg-surface-1 text-gray-400 hover:text-electric transition-colors"
                      title={m.isAlumni ? "Remove from alumni" : "Add to alumni"}
                    >
                      {togglingId === m.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : m.isAlumni ? (
                        <ToggleRight className="h-5 w-5 text-purple-500" />
                      ) : (
                        <ToggleLeft className="h-5 w-5" />
                      )}
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
