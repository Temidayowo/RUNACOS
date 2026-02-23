"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, FileText, Search } from "lucide-react";
import { cn, formatDateShort } from "@/lib/utils";
import { CONTENT_STATUSES } from "@/lib/constants";
import { toast } from "sonner";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  author: string;
  status: keyof typeof CONTENT_STATUSES;
  publishedAt: string | null;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AdminArticlesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", "10");
      if (status) params.set("status", status);
      if (search) params.set("search", search);

      const res = await fetch(`/api/articles?${params.toString()}`);
      const json = await res.json();
      setArticles(json.data || []);
      setPagination(json.pagination || null);
    } catch {
      toast.error("Failed to fetch articles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status, search]);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Article deleted successfully");
      fetchArticles();
    } catch {
      toast.error("Failed to delete article");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const getStatusBadge = (articleStatus: keyof typeof CONTENT_STATUSES) => {
    const info = CONTENT_STATUSES[articleStatus];
    return (
      <span
        className={cn(
          "inline-flex items-center px-2.5 py-0.5 rounded-md font-mono text-xs font-medium",
          info.color === "green" && "bg-green-100 text-green-700",
          info.color === "gray" && "bg-gray-100 text-gray-700",
          info.color === "yellow" && "bg-yellow-100 text-yellow-700"
        )}
      >
        {info.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold font-heading text-gray-900">Articles</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all articles and blog posts</p>
        </div>
        <Link
          href="/admin/articles/new"
          className="inline-flex items-center gap-2 bg-navy-800 text-white px-4 py-2.5 rounded-lg hover:bg-navy-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Create Article
        </Link>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-surface-0 rounded-xl border border-surface-3 p-4"
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-surface-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-800/20 focus:border-navy-800"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              Search
            </button>
          </form>
          <select
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value);
            }}
            className="px-3 py-2 border border-surface-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-800/20 focus:border-navy-800 bg-white"
          >
            <option value="">All Statuses</option>
            {Object.entries(CONTENT_STATUSES).map(([key, val]) => (
              <option key={key} value={key}>
                {val.label}
              </option>
            ))}
          </select>
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
          <div className="p-8">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded w-1/6" />
                  <div className="h-4 bg-gray-200 rounded w-1/6" />
                  <div className="h-4 bg-gray-200 rounded w-1/6" />
                  <div className="h-4 bg-gray-200 rounded w-1/6" />
                </div>
              ))}
            </div>
          </div>
        ) : articles.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No articles found</p>
            <Link
              href="/admin/articles/new"
              className="inline-flex items-center gap-2 mt-4 text-sm text-navy-800 hover:underline font-medium"
            >
              <Plus className="w-4 h-4" />
              Create your first article
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-surface-3">
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-3">
                {articles.map((article, i) => (
                  <motion.tr
                    key={article.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-surface-1 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-navy-800/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4 text-navy-800" />
                        </div>
                        <span className="text-sm font-medium text-gray-900 truncate max-w-[250px]">
                          {article.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{article.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(article.status)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{article.author}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">
                        {formatDateShort(article.createdAt)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => router.push(`/admin/articles/${article.id}/edit`)}
                          className="p-2 text-gray-400 hover:text-navy-800 hover:bg-surface-1 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(article.id, article.title)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-surface-3">
            <p className="text-sm text-gray-500">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
              {pagination.total} articles
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  page === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                Previous
              </button>
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 ||
                    p === pagination.totalPages ||
                    Math.abs(p - page) <= 1
                )
                .map((p, i, arr) => (
                  <span key={p} className="flex items-center">
                    {i > 0 && arr[i - 1] !== p - 1 && (
                      <span className="px-1 text-gray-400">...</span>
                    )}
                    <button
                      onClick={() => setPage(p)}
                      className={cn(
                        "w-8 h-8 rounded-lg text-sm font-medium transition-colors",
                        p === page
                          ? "bg-navy-800 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      )}
                    >
                      {p}
                    </button>
                  </span>
                ))}
              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  page === pagination.totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
