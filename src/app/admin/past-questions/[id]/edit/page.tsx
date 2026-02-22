"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, FileQuestion } from "lucide-react";
import { cn } from "@/lib/utils";
import { PQ_DEPARTMENTS } from "@/lib/constants";
import { toast } from "sonner";

export default function EditPastQuestionPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    department: "",
    course: "",
    year: "",
    fileUrl: "",
    fileName: "",
    fileSize: "",
    fileType: "",
  });

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await fetch(`/api/past-questions/${id}`);
        if (!res.ok) throw new Error("Past question not found");
        const json = await res.json();
        const pq = json.data;
        setForm({
          title: pq.title || "",
          description: pq.description || "",
          department: pq.department || "",
          course: pq.course || "",
          year: String(pq.year || ""),
          fileUrl: pq.fileUrl || "",
          fileName: pq.fileName || "",
          fileSize: String(pq.fileSize || ""),
          fileType: pq.fileType || "",
        });
      } catch {
        toast.error("Failed to load past question");
        router.push("/admin/past-questions");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
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
        title: form.title,
        description: form.description || undefined,
        department: form.department,
        course: form.course,
        year: parseInt(form.year),
        fileUrl: form.fileUrl,
        fileName: form.fileName,
        fileSize: parseInt(form.fileSize),
        fileType: form.fileType,
      };

      const res = await fetch(`/api/past-questions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update past question");
      }

      toast.success("Past question updated successfully");
      router.push("/admin/past-questions");
    } catch (error: any) {
      toast.error(error.message || "Failed to update past question");
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
          {[...Array(7)].map((_, i) => (
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
          href="/admin/past-questions"
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold font-merriweather text-gray-900">Edit Past Question</h1>
          <p className="text-gray-500 text-sm mt-1">Update past question details</p>
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
            placeholder="e.g. CSC 201 - Introduction to Computer Science"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-800/20 focus:border-navy-800"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={form.description}
            onChange={handleChange}
            placeholder="Brief description of the past question paper"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-800/20 focus:border-navy-800 resize-none"
          />
        </div>

        {/* Department & Course */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1.5">
              Department <span className="text-red-500">*</span>
            </label>
            <select
              id="department"
              name="department"
              required
              value={form.department}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-800/20 focus:border-navy-800 bg-white"
            >
              <option value="">Select department</option>
              {PQ_DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1.5">
              Course <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="course"
              name="course"
              required
              value={form.course}
              onChange={handleChange}
              placeholder="e.g. CSC 201"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-800/20 focus:border-navy-800"
            />
          </div>
        </div>

        {/* Year */}
        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1.5">
            Year <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="year"
            name="year"
            required
            min={2000}
            max={2030}
            value={form.year}
            onChange={handleChange}
            placeholder="e.g. 2024"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-800/20 focus:border-navy-800"
          />
        </div>

        {/* File URL */}
        <div>
          <label htmlFor="fileUrl" className="block text-sm font-medium text-gray-700 mb-1.5">
            File URL <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            id="fileUrl"
            name="fileUrl"
            required
            value={form.fileUrl}
            onChange={handleChange}
            placeholder="https://example.com/files/past-question.pdf"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-800/20 focus:border-navy-800"
          />
        </div>

        {/* File Name & File Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="fileName" className="block text-sm font-medium text-gray-700 mb-1.5">
              File Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="fileName"
              name="fileName"
              required
              value={form.fileName}
              onChange={handleChange}
              placeholder="e.g. CSC201-2024.pdf"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-800/20 focus:border-navy-800"
            />
          </div>
          <div>
            <label htmlFor="fileType" className="block text-sm font-medium text-gray-700 mb-1.5">
              File Type <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="fileType"
              name="fileType"
              required
              value={form.fileType}
              onChange={handleChange}
              placeholder="e.g. application/pdf"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-800/20 focus:border-navy-800"
            />
          </div>
        </div>

        {/* File Size */}
        <div>
          <label htmlFor="fileSize" className="block text-sm font-medium text-gray-700 mb-1.5">
            File Size (bytes) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="fileSize"
            name="fileSize"
            required
            min={0}
            value={form.fileSize}
            onChange={handleChange}
            placeholder="e.g. 1048576"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-800/20 focus:border-navy-800"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <Link
            href="/admin/past-questions"
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
            <FileQuestion className="w-4 h-4" />
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </motion.form>
    </div>
  );
}
