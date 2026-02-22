"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Eye,
  Bug,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
} from "lucide-react";
import { cn, formatDateShort } from "@/lib/utils";
import { FAULT_STATUSES, ITEMS_PER_PAGE } from "@/lib/constants";

type FaultStatus = keyof typeof FAULT_STATUSES;

interface Category {
  id: string;
  name: string;
}

interface Fault {
  id: string;
  referenceId: string;
  name: string;
  email: string;
  location: string;
  description: string;
  status: FaultStatus;
  categoryId: string;
  createdAt: string;
  category: { id: string; name: string };
  assignedStaff: { id: string; name: string } | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const statusBadgeClasses: Record<string, string> = {
  red: "bg-red-100 text-red-700",
  yellow: "bg-yellow-100 text-yellow-700",
  green: "bg-green-100 text-green-700",
  gray: "bg-gray-100 text-gray-700",
};

export default function FRMSListingPage() {
  const [faults, setFaults] = useState<Fault[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchFaults = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(currentPage));
      params.set("limit", String(ITEMS_PER_PAGE));
      if (statusFilter) params.set("status", statusFilter);
      if (categoryFilter) params.set("categoryId", categoryFilter);
      if (search) params.set("search", search);

      const res = await fetch(`/api/frms?${params.toString()}`);
      const json = await res.json();
      setFaults(json.data || []);
      setPagination(json.pagination || null);
    } catch (error) {
      console.error("Failed to fetch faults:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter, categoryFilter, search]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/frms/categories");
      const json = await res.json();
      setCategories(json.data || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchFaults();
  }, [fetchFaults]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    setSearch(searchInput);
  };

  const clearFilters = () => {
    setStatusFilter("");
    setCategoryFilter("");
    setSearch("");
    setSearchInput("");
    setCurrentPage(1);
  };

  const hasActiveFilters = statusFilter || categoryFilter || search;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold font-heading text-gray-900">
            Fault Reports (FRMS)
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage and track all reported faults
          </p>
        </div>
        {pagination && (
          <span className="text-sm text-gray-500">
            {pagination.total} total report{pagination.total !== 1 ? "s" : ""}
          </span>
        )}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-surface-0 rounded-xl border border-surface-3 p-4"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by reference ID, name, or location..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-surface-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-800 focus:border-transparent"
              />
            </div>
          </form>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-surface-3 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-800 focus:border-transparent bg-white"
            >
              <option value="">All Statuses</option>
              {(Object.keys(FAULT_STATUSES) as FaultStatus[]).map((key) => (
                <option key={key} value={key}>
                  {FAULT_STATUSES[key].label}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-surface-3 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy-800 focus:border-transparent bg-white"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-surface-0 rounded-xl border border-surface-3 overflow-hidden"
      >
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-navy-800 animate-spin" />
            <span className="ml-2 text-sm text-gray-500">Loading faults...</span>
          </div>
        ) : faults.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <Bug className="w-12 h-12 text-gray-300 mb-4" />
            <p className="text-gray-500 text-sm">No fault reports found</p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-2 text-sm text-electric hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-surface-1 border-b border-surface-3">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Reference ID
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Reporter
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Category
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Location
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Date
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-3">
                {faults.map((fault, index) => {
                  const statusInfo = FAULT_STATUSES[fault.status];
                  return (
                    <motion.tr
                      key={fault.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="hover:bg-surface-1 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="text-sm font-mono font-medium text-navy-800">
                          {fault.referenceId}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900">{fault.name}</p>
                        <p className="text-xs text-gray-500">{fault.email}</p>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-sm text-gray-600">
                          {fault.category?.name || "N/A"}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-sm text-gray-600 truncate max-w-[200px] block">
                          {fault.location}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "inline-flex items-center text-xs px-2.5 py-1 rounded-md font-mono font-medium",
                            statusBadgeClasses[statusInfo.color]
                          )}
                        >
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-sm text-gray-500">
                          {formatDateShort(fault.createdAt)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/frms/${fault.id}`}
                          className="inline-flex items-center gap-1.5 text-sm text-navy-800 hover:text-blue-600 font-medium transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="hidden sm:inline">View</span>
                        </Link>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-surface-3 bg-surface-1">
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-medium">
                {(pagination.page - 1) * pagination.limit + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </span>{" "}
              of <span className="font-medium">{pagination.total}</span> results
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={cn(
                  "flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border transition-colors",
                  currentPage === 1
                    ? "border-surface-3 text-gray-300 cursor-not-allowed"
                    : "border-gray-300 text-gray-700 hover:bg-white"
                )}
              >
                <ChevronLeft className="w-4 h-4" />
                Prev
              </button>

              {/* Page Numbers */}
              <div className="hidden sm:flex items-center gap-1">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    if (pagination.totalPages <= 7) return true;
                    if (page === 1 || page === pagination.totalPages) return true;
                    if (Math.abs(page - currentPage) <= 1) return true;
                    return false;
                  })
                  .map((page, idx, arr) => {
                    const showEllipsis = idx > 0 && page - arr[idx - 1] > 1;
                    return (
                      <span key={page} className="flex items-center">
                        {showEllipsis && (
                          <span className="px-1 text-gray-400 text-sm">...</span>
                        )}
                        <button
                          onClick={() => setCurrentPage(page)}
                          className={cn(
                            "w-8 h-8 rounded-lg text-sm font-medium transition-colors",
                            page === currentPage
                              ? "bg-navy-800 text-white"
                              : "text-gray-600 hover:bg-surface-1"
                          )}
                        >
                          {page}
                        </button>
                      </span>
                    );
                  })}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={currentPage === pagination.totalPages}
                className={cn(
                  "flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border transition-colors",
                  currentPage === pagination.totalPages
                    ? "border-surface-3 text-gray-300 cursor-not-allowed"
                    : "border-gray-300 text-gray-700 hover:bg-white"
                )}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
