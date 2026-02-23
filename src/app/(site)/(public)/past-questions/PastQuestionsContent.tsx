"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, FileText, Download, Calendar, BookOpen } from "lucide-react";
import { cn, formatFileSize } from "@/lib/utils";
import { PQ_DEPARTMENTS, ITEMS_PER_PAGE } from "@/lib/constants";
import { PageTransition } from "@/components/ui/MotionWrapper";
import { PageHero } from "@/components/ui/PageHero";

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
    <PageTransition>
      <PageHero
        slug="past-questions"
        defaultHeading="Past Questions Repository"
        defaultSubheading="Access previous exam questions to prepare better."
        breadcrumb="Home / Past Questions"
      />

      {/* Filters */}
      <section className="bg-surface-0 border-b border-surface-3 sticky top-[72px] z-30 backdrop-blur-xl bg-white/90">
        <div className="container-custom py-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <form onSubmit={handleSearch} className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by title, course, or department..."
                  className="input-field pl-10"
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <select
                  value={department}
                  onChange={(e) => { setDepartment(e.target.value); setPage(1); }}
                  className="rounded-xl border-[1.5px] border-surface-3 bg-surface-0 px-4 py-2.5 text-sm focus:border-electric focus:outline-none focus:ring-[3px] focus:ring-electric/10 transition-all"
                >
                  <option value="">All Departments</option>
                  {PQ_DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                <select
                  value={year}
                  onChange={(e) => { setYear(e.target.value); setPage(1); }}
                  className="rounded-xl border-[1.5px] border-surface-3 bg-surface-0 px-4 py-2.5 text-sm font-mono focus:border-electric focus:outline-none focus:ring-[3px] focus:ring-electric/10 transition-all"
                >
                  <option value="">All Years</option>
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12 md:py-16 bg-surface-1">
        <div className="container-custom">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-xl border border-surface-3 bg-surface-0 p-6">
                  <div className="w-12 h-12 skeleton rounded-xl mb-4" />
                  <div className="h-5 skeleton w-3/4 mb-2" />
                  <div className="h-4 skeleton w-1/2 mb-4" />
                  <div className="h-4 skeleton w-1/3" />
                </div>
              ))}
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="font-heading text-lg font-semibold text-gray-400 mb-1">No past questions found</h3>
              <p className="text-sm text-gray-400">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {questions.map((pq, i) => (
                  <motion.div
                    key={pq.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="group rounded-xl border border-surface-3 bg-surface-0 p-6 transition-all hover:-translate-y-1 hover:shadow-card-hover"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-11 h-11 bg-rose-50 rounded-xl flex items-center justify-center">
                        <FileText className="w-5 h-5 text-rose-500" />
                      </div>
                      <span className="badge-keyword font-mono">
                        {getFileIcon(pq.fileType)}
                      </span>
                    </div>

                    <h3 className="font-heading font-semibold text-navy-800 mb-1.5 line-clamp-2 text-sm">
                      {pq.title}
                    </h3>

                    <div className="space-y-1 text-xs text-gray-500 mb-4">
                      <p className="flex items-center gap-1.5">
                        <BookOpen className="w-3 h-3 text-gray-400" />
                        <span className="font-mono">{pq.course}</span>
                      </p>
                      <p>{pq.department}</p>
                      <p className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span className="font-mono">{pq.year}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-surface-3">
                      <div className="flex items-center gap-1 text-[10px] font-mono text-gray-400">
                        <Download className="w-3 h-3" />
                        {pq.downloads} &middot; {formatFileSize(pq.fileSize)}
                      </div>
                      <button
                        onClick={() => handleDownload(pq)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-electric hover:text-blue-700 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
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
                    className="px-4 py-2 text-sm text-gray-600 hover:bg-surface-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={cn(
                        "w-9 h-9 rounded-lg font-mono text-sm font-medium transition-colors",
                        p === page ? "bg-navy-800 text-white" : "text-gray-600 hover:bg-surface-2"
                      )}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                    disabled={page === pagination.totalPages}
                    className="px-4 py-2 text-sm text-gray-600 hover:bg-surface-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </PageTransition>
  );
}
