"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Loader2,
  Upload,
  X,
  Edit2,
  Eye,
  EyeOff,
  Save,
  UserPlus,
  Linkedin,
  Twitter,
  Instagram,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Executive {
  id: string;
  name: string;
  position: string;
  image: string | null;
  email: string | null;
  phone: string | null;
  bio: string | null;
  linkedin: string | null;
  twitter: string | null;
  instagram: string | null;
  order: number;
  active: boolean;
}

const POSITIONS = [
  "President",
  "Vice President",
  "General Secretary",
  "Assistant General Secretary",
  "Financial Secretary",
  "Treasurer",
  "Director of Socials",
  "Public Relations Officer",
  "Director of Sports",
  "Welfare Director",
  "Director of Academics",
];

const emptyForm = {
  name: "",
  position: "",
  image: "",
  email: "",
  phone: "",
  bio: "",
  linkedin: "",
  twitter: "",
  instagram: "",
};

export default function ExecutivesAdmin() {
  const [executives, setExecutives] = useState<Executive[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);

  const fetchExecs = () => {
    fetch("/api/executives?all=true")
      .then((res) => res.json())
      .then((res) => setExecutives(res.data || []))
      .catch(() => toast.error("Failed to load executives"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchExecs();
  }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (exec: Executive) => {
    setForm({
      name: exec.name,
      position: exec.position,
      image: exec.image || "",
      email: exec.email || "",
      phone: exec.phone || "",
      bio: exec.bio || "",
      linkedin: exec.linkedin || "",
      twitter: exec.twitter || "",
      instagram: exec.instagram || "",
    });
    setEditingId(exec.id);
    setShowModal(true);
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "executives");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.data?.url) {
        setForm((prev) => ({ ...prev, image: data.data.url }));
        toast.success("Photo uploaded");
      } else {
        toast.error(data.error || "Upload failed");
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.position) {
      toast.error("Name and position are required");
      return;
    }
    setSaving(true);
    try {
      const url = editingId
        ? `/api/executives/${editingId}`
        : "/api/executives";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          position: form.position,
          image: form.image || null,
          email: form.email || null,
          phone: form.phone || null,
          bio: form.bio || null,
          linkedin: form.linkedin || null,
          twitter: form.twitter || null,
          instagram: form.instagram || null,
        }),
      });

      if (res.ok) {
        toast.success(editingId ? "Executive updated" : "Executive added");
        setShowModal(false);
        fetchExecs();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to save");
      }
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete ${name}? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/executives/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Executive removed");
        setExecutives((prev) => prev.filter((e) => e.id !== id));
      } else {
        toast.error("Failed to delete");
      }
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleToggle = async (id: string, active: boolean) => {
    try {
      const res = await fetch(`/api/executives/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !active }),
      });
      if (res.ok) {
        setExecutives((prev) =>
          prev.map((e) => (e.id === id ? { ...e, active: !active } : e))
        );
      }
    } catch {
      toast.error("Failed to update");
    }
  };

  const handleReorder = async (id: string, direction: "up" | "down") => {
    const idx = executives.findIndex((e) => e.id === id);
    if (
      (direction === "up" && idx === 0) ||
      (direction === "down" && idx === executives.length - 1)
    )
      return;

    const newList = [...executives];
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    [newList[idx], newList[swapIdx]] = [newList[swapIdx], newList[idx]];

    setExecutives(newList);

    // Save new order to DB
    try {
      await Promise.all(
        newList.map((e, i) =>
          fetch(`/api/executives/${e.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ order: i }),
          })
        )
      );
    } catch {
      toast.error("Failed to reorder");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-surface-0 rounded-xl border border-surface-3 p-6 animate-pulse">
              <div className="h-20 w-20 bg-gray-200 rounded-full mx-auto mb-4" />
              <div className="h-4 bg-gray-200 rounded w-24 mx-auto mb-2" />
              <div className="h-3 bg-gray-200 rounded w-16 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-gray-900">
            Executive Council
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage the association&apos;s executive members displayed on the public page.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openCreate}
          className="btn-primary gap-2 text-sm"
        >
          <UserPlus className="w-4 h-4" /> Add Executive
        </motion.button>
      </div>

      {/* Executive Cards */}
      {executives.length === 0 ? (
        <div className="bg-surface-0 rounded-xl border border-surface-3 p-12 text-center">
          <UserPlus className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No executives added yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Click &ldquo;Add Executive&rdquo; to add your first council member.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {executives.map((exec, idx) => (
            <motion.div
              key={exec.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "bg-surface-0 rounded-xl border border-surface-3 overflow-hidden",
                !exec.active && "opacity-50"
              )}
            >
              {/* Photo */}
              <div className="relative h-48 bg-gradient-to-br from-navy-800 to-navy-600">
                {exec.image ? (
                  <Image
                    src={exec.image}
                    alt={exec.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 300px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="text-5xl font-bold text-white/30">
                      {exec.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                )}
                {/* Status badge */}
                <div className="absolute top-2 right-2">
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-md font-mono font-medium",
                      exec.active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    )}
                  >
                    {exec.active ? "Active" : "Hidden"}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">{exec.name}</h3>
                <p className="text-sm text-electric">{exec.position}</p>
                {exec.email && (
                  <p className="text-xs text-gray-400 mt-1 truncate">{exec.email}</p>
                )}
              </div>

              {/* Social Links */}
              {(exec.linkedin || exec.twitter || exec.instagram) && (
                <div className="flex gap-1.5 px-4 pb-3">
                  {exec.linkedin && (
                    <a href={exec.linkedin} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg bg-surface-1 text-gray-400 hover:text-blue-700 hover:bg-blue-50 transition-colors" title="LinkedIn">
                      <Linkedin className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {exec.twitter && (
                    <a href={exec.twitter} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg bg-surface-1 text-gray-400 hover:text-sky-500 hover:bg-sky-50 transition-colors" title="Twitter / X">
                      <Twitter className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {exec.instagram && (
                    <a href={exec.instagram} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg bg-surface-1 text-gray-400 hover:text-pink-500 hover:bg-pink-50 transition-colors" title="Instagram">
                      <Instagram className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between border-t border-surface-3 px-3 py-2">
                <div className="flex gap-1">
                  <button
                    onClick={() => handleReorder(exec.id, "up")}
                    disabled={idx === 0}
                    className="p-1.5 rounded hover:bg-surface-1 text-gray-400 disabled:opacity-30"
                    title="Move up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleReorder(exec.id, "down")}
                    disabled={idx === executives.length - 1}
                    className="p-1.5 rounded hover:bg-surface-1 text-gray-400 disabled:opacity-30"
                    title="Move down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleToggle(exec.id, exec.active)}
                    className={cn(
                      "p-1.5 rounded hover:bg-surface-1",
                      exec.active ? "text-green-500" : "text-gray-300"
                    )}
                    title={exec.active ? "Hide" : "Show"}
                  >
                    {exec.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => openEdit(exec)}
                    className="p-1.5 rounded hover:bg-surface-1 text-electric"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(exec.id, exec.name)}
                    className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface-0 rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-surface-3">
                <h2 className="text-lg font-semibold font-heading text-gray-900">
                  {editingId ? "Edit Executive" : "Add Executive"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5">
                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Profile Photo
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="relative h-20 w-20 rounded-full overflow-hidden bg-gradient-to-br from-navy-800 to-navy-600 shrink-0">
                      {form.image ? (
                        <Image
                          src={form.image}
                          alt="Preview"
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="text-2xl font-bold text-white/40">
                            {form.name
                              ? form.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                              : "?"}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-200 p-3 text-center hover:border-blue-300 transition-colors cursor-pointer">
                        {uploading ? (
                          <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4 text-gray-400" />
                        )}
                        <span className="text-sm text-gray-500">
                          {uploading ? "Uploading..." : "Upload photo"}
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          disabled={uploading}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUpload(file);
                          }}
                        />
                      </label>
                      {form.image && (
                        <button
                          onClick={() => setForm((p) => ({ ...p, image: "" }))}
                          className="mt-1 text-xs text-red-500 hover:underline"
                        >
                          Remove photo
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                    placeholder="e.g. Adebayo Olamide"
                    className="input-field"
                  />
                </div>

                {/* Position */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Position *
                  </label>
                  <select
                    value={form.position}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, position: e.target.value }))
                    }
                    className="input-field"
                  >
                    <option value="">Select position</option>
                    {POSITIONS.map((pos) => (
                      <option key={pos} value={pos}>
                        {pos}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={
                      POSITIONS.includes(form.position) ? "" : form.position
                    }
                    onChange={(e) =>
                      setForm((p) => ({ ...p, position: e.target.value }))
                    }
                    placeholder="Or type a custom position"
                    className="input-field mt-2 text-sm"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, email: e.target.value }))
                    }
                    placeholder="Optional"
                    className="input-field"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, phone: e.target.value }))
                    }
                    placeholder="Optional"
                    className="input-field"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Short Bio
                  </label>
                  <textarea
                    value={form.bio}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, bio: e.target.value }))
                    }
                    placeholder="Optional short bio"
                    rows={3}
                    className="input-field resize-none"
                  />
                </div>

                {/* Social Links */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Social Links
                  </label>
                  <div className="space-y-3">
                    <div className="relative">
                      <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="url"
                        value={form.linkedin}
                        onChange={(e) => setForm((p) => ({ ...p, linkedin: e.target.value }))}
                        placeholder="LinkedIn profile URL"
                        className="input-field pl-10"
                      />
                    </div>
                    <div className="relative">
                      <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="url"
                        value={form.twitter}
                        onChange={(e) => setForm((p) => ({ ...p, twitter: e.target.value }))}
                        placeholder="Twitter / X profile URL"
                        className="input-field pl-10"
                      />
                    </div>
                    <div className="relative">
                      <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="url"
                        value={form.instagram}
                        onChange={(e) => setForm((p) => ({ ...p, instagram: e.target.value }))}
                        placeholder="Instagram profile URL"
                        className="input-field pl-10"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 px-6 py-4 border-t border-surface-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="btn-secondary text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !form.name || !form.position}
                  className="btn-primary gap-2 text-sm"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update"
                    : "Add Executive"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
