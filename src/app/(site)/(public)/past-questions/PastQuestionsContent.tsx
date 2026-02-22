"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, FileText, Download, Calendar, BookOpen } from "lucide-react";
import { cn, formatFileSize } from "@/lib/utils";
import { PQ_DEPARTMENTS, ITEMS_PER_PAGE } from "@/lib/constants";

interface PastQuestion {
  id: string;
  title: string;
  description?: string;
  department: string;
  course: string;
  year: number;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  downloads: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function PastQuestionsContent() {
  const [questions, setQuestions] = useState<PastQuestion[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [page, setPage] = useState(1);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1999 }, (_, i) => currentYear - i);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(ITEMS_PER_PAGE));
      if (search) params.set("search", search);
      if (department) params.set("department", department);
      if (year) params.set("year", year);

      const res = await fetch(`/api/past-questions?${params}`);
      const json = await res.json();
      setQuestions(json.data || []);
      setPagination(json.pagination);
    } catch {
      console.error("Failed to fetch past questions");
    } finally {
      setLoading(false);
    }
  }, [page, search, department, year]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleDownload = async (pq: PastQuestion) => {
    try {
      await fetch(`/api/past-questions/${pq.id}/download`, { method: "POST" });
      window.open(pq.fileUrl, "_blank");
    } catch {
      window.open(pq.fileUrl, "_blank");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes("pdf")) return "PDF";
    if (fileType.includes("word") || fileType.includes("document")) return "DOC";
    if (fileType.includes("presentation")) return "PPT";
    return "FILE";
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-blue-500 text-xs font-semibold tracking-[3px] uppercase">
              Academic Resources
            </span>
            <h1 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-extrabold font-merriweather text-gray-900">
              Past Questions
            </h1>
            <p className="mt-4 text-gray-500 text-lg max-w-2xl mx-auto">
              Access previous exam questions and study materials to help you prepare.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="pb-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gray-50 rounded-lg p-4 md:p-6"
          >
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by title, course, or department..."
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <select
                  value={department}
                  onChange={(e) => {
                    setDepartment(e.target.value);
                    setPage(1);
                  }}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none"
                >
                  <option value="">All Departments</option>
                  {PQ_DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                <select
                  value={year}
                  onChange={(e) => {
                    setYear(e.target.value);
                    setPage(1);
                  }}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none"
                >
                  <option value="">All Years</option>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Results */}
      <section className="pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-lg p-6 animate-pulse">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4" />
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No past questions found</h3>
              <p className="text-gray-500">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {questions.map((pq, i) => (
                  <motion.div
                    key={pq.id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-1 transition-all p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-red-500" />
                      </div>
                      <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        {getFileIcon(pq.fileType)}
                      </span>
                    </div>

                    <h3 className="font-bold font-merriweather text-navy-800 mb-1 line-clamp-2">
                      {pq.title}
                    </h3>

                    <div className="space-y-1 text-sm text-gray-500 mb-4">
                      <p className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" />
                        {pq.course}
                      </p>
                      <p>{pq.department}</p>
                      <p className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {pq.year}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Download className="w-3.5 h-3.5" />
                        {pq.downloads} downloads &middot; {formatFileSize(pq.fileSize)}
                      </div>
                      <button
                        onClick={() => handleDownload(pq)}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-500 hover:text-blue-600 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={cn(
                        "w-9 h-9 rounded-lg text-sm font-medium transition-colors",
                        p === page
                          ? "bg-navy-800 text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      )}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                    disabled={page === pagination.totalPages}
                    className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
