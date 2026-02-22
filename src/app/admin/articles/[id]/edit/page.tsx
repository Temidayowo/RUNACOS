"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { CONTENT_STATUSES } from "@/lib/constants";
import { toast } from "sonner";

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "General",
    author: "",
    coverImage: "",
    status: "DRAFT" as "DRAFT" | "PUBLISHED" | "ARCHIVED",
  });

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`/api/articles/${id}`);
        if (!res.ok) throw new Error("Article not found");
        const json = await res.json();
        const article = json.data;
        setForm({
          title: article.title || "",
          excerpt: article.excerpt || "",
          content: article.content || "",
          category: article.category || "General",
          author: article.author || "",
          coverImage: article.coverImage || "",
          status: article.status || "DRAFT",
        });
      } catch {
        toast.error("Failed to load article");
        router.push("/admin/articles");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const body = {
        ...form,
        coverImage: form.coverImage || undefined,
      };

      const res = await fetch(`/api/articles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update article");
      }

      toast.success("Article updated successfully");
      router.push("/admin/articles");
    } catch (error: any) {
      toast.error(error.message || "Failed to update article");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 bg-gray-200 rounded-lg animate-pulse" />
          <div>
            <div className="h-6 bg-gray-200 rounded w-48 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-32 mt-2 animate-pulse" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-2 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24" />
              <div className="h-10 bg-gray-200 rounded w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <Link
          href="/admin/articles"
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold font-merriweather text-gray-900">Edit Article</h1>
          <p className="text-gray-500 text-sm mt-1">Update article details</p>
        </div>
      </motion.div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-sm p-6 space-y-5"
      >
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1.5">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            value={form.title}
            onChange={handleChange}
            placeholder="Enter article title"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-800/20 focus:border-navy-800"
          />
        </div>

        {/* Excerpt */}
        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1.5">
            Excerpt <span className="text-red-500">*</span>
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            required
            rows={2}
            value={form.excerpt}
            onChange={handleChange}
            placeholder="Brief summary of the article"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-800/20 focus:border-navy-800 resize-none"
          />
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1.5">
            Content <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            name="content"
            required
            rows={12}
            value={form.content}
            onChange={handleChange}
            placeholder="Write the full article content here..."
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-800/20 focus:border-navy-800 resize-y"
          />
        </div>

        {/* Category & Author */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1.5">
              Category
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="e.g. Technology, Research"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-800/20 focus:border-navy-800"
            />
          </div>
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1.5">
              Author <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="author"
              name="author"
              required
              value={form.author}
              onChange={handleChange}
              placeholder="Author name"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-800/20 focus:border-navy-800"
            />
          </div>
        </div>

        {/* Cover Image URL */}
        <div>
          <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-1.5">
            Cover Image URL
          </label>
          <input
            type="url"
            id="coverImage"
            name="coverImage"
            value={form.coverImage}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-800/20 focus:border-navy-800"
          />
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1.5">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-800/20 focus:border-navy-800 bg-white"
          >
            {Object.entries(CONTENT_STATUSES).map(([key, val]) => (
              <option key={key} value={key}>
                {val.label}
              </option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <Link
            href="/admin/articles"
            className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className={cn(
              "inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-navy-800 rounded-lg transition-colors",
              submitting ? "opacity-60 cursor-not-allowed" : "hover:bg-navy-700"
            )}
          >
            <FileText className="w-4 h-4" />
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </motion.form>
    </div>
  );
}
