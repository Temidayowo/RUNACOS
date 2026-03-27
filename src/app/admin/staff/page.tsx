"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
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
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface StaffMember {
  id: string;
  name: string;
  title: string;
  specialty: string | null;
  department: string | null;
  image: string | null;
  email: string | null;
  phone: string | null;
  bio: string | null;
  order: number;
  active: boolean;
}

const TITLES = [
  "Head of Department",
  "Professor",
  "Senior Lecturer",
  "Lecturer I",
  "Lecturer II",
  "Assistant Lecturer",
  "Graduate Assistant",
];

const emptyForm = {
  name: "",
  title: "",
  specialty: "",
  department: "",
  image: "",
  email: "",
  phone: "",
  bio: "",
};

export default function StaffAdmin() {
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);

  const fetchStaff = () => {
    fetch("/api/staff?all=true")
      .then((res) => res.json())
      .then((res) => setStaffList(res.data || []))
      .catch(() => toast.error("Failed to load staff"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (staff: StaffMember) => {
    setForm({
      name: staff.name,
      title: staff.title,
      specialty: staff.specialty || "",
      department: staff.department || "",
      image: staff.image || "",
      email: staff.email || "",
      phone: staff.phone || "",
      bio: staff.bio || "",
    });
    setEditingId(staff.id);
    setShowModal(true);
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "staff");
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
    if (!form.name || !form.title) {
      toast.error("Name and title are required");
      return;
    }
    setSaving(true);
    try {
      const url = editingId ? `/api/staff/${editingId}` : "/api/staff";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          title: form.title,
          specialty: form.specialty || null,
          department: form.department || null,
          image: form.image || null,
          email: form.email || null,
          phone: form.phone || null,
          bio: form.bio || null,
        }),
      });

      if (res.ok) {
        toast.success(editingId ? "Staff member updated" : "Staff member added");
        setShowModal(false);
        fetchStaff();
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
      const res = await fetch(`/api/staff/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Staff member removed");
        setStaffList((prev) => prev.filter((s) => s.id !== id));
      } else {
        toast.error("Failed to delete");
      }
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleToggle = async (id: string, active: boolean) => {
    try {
      const res = await fetch(`/api/staff/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !active }),
      });
      if (res.ok) {
        setStaffList((prev) =>
          prev.map((s) => (s.id === id ? { ...s, active: !active } : s))
        );
      }
    } catch {
      toast.error("Failed to update");
    }
  };

  const handleReorder = async (id: string, direction: "up" | "down") => {
    const idx = staffList.findIndex((s) => s.id === id);
    if (
      (direction === "up" && idx === 0) ||
      (direction === "down" && idx === staffList.length - 1)
    )
      return;

    const newList = [...staffList];
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    [newList[idx], newList[swapIdx]] = [newList[swapIdx], newList[idx]];

    setStaffList(newList);

    try {
      await Promise.all(
        newList.map((s, i) =>
          fetch(`/api/staff/${s.id}`, {
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
            Department Staff
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage academic staff displayed on the public staff page.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openCreate}
          className="btn-primary gap-2 text-sm"
        >
          <UserPlus className="w-4 h-4" /> Add Staff
        </motion.button>
      </div>

      {/* Staff Cards */}
      {staffList.length === 0 ? (
        <div className="bg-surface-0 rounded-xl border border-surface-3 p-12 text-center">
          <UserPlus className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No staff members added yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Click &ldquo;Add Staff&rdquo; to add your first staff member.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {staffList.map((staff, idx) => (
            <motion.div
              key={staff.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "bg-surface-0 rounded-xl border border-surface-3 overflow-hidden",
                !staff.active && "opacity-50"
              )}
            >
              {/* Photo */}
              <div className="relative h-48 bg-gradient-to-br from-navy-800 to-navy-600">
                {staff.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={staff.image}
                    alt={staff.name}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="text-5xl font-bold text-white/30">
                      {staff.name
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
                      staff.active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    )}
                  >
                    {staff.active ? "Active" : "Hidden"}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">{staff.name}</h3>
                <p className="text-sm text-electric">{staff.title}</p>
                {staff.specialty && (
                  <p className="text-xs text-gray-400 mt-1">{staff.specialty}</p>
                )}
                {staff.email && (
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{staff.email}</p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between border-t border-surface-3 px-3 py-2">
                <div className="flex gap-1">
                  <button
                    onClick={() => handleReorder(staff.id, "up")}
                    disabled={idx === 0}
                    className="p-1.5 rounded hover:bg-surface-1 text-gray-400 disabled:opacity-30"
                    title="Move up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleReorder(staff.id, "down")}
                    disabled={idx === staffList.length - 1}
                    className="p-1.5 rounded hover:bg-surface-1 text-gray-400 disabled:opacity-30"
                    title="Move down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleToggle(staff.id, staff.active)}
                    className={cn(
                      "p-1.5 rounded hover:bg-surface-1",
                      staff.active ? "text-green-500" : "text-gray-300"
                    )}
                    title={staff.active ? "Hide" : "Show"}
                  >
                    {staff.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => openEdit(staff)}
                    className="p-1.5 rounded hover:bg-surface-1 text-electric"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(staff.id, staff.name)}
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
                  {editingId ? "Edit Staff Member" : "Add Staff Member"}
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
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={form.image}
                          alt="Preview"
                          className="absolute inset-0 h-full w-full object-cover"
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
                    placeholder="e.g. Prof. Adebayo Johnson"
                    className="input-field"
                  />
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Title / Position *
                  </label>
                  <select
                    value={TITLES.includes(form.title) ? form.title : ""}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, title: e.target.value }))
                    }
                    className="input-field"
                  >
                    <option value="">Select title</option>
                    {TITLES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={TITLES.includes(form.title) ? "" : form.title}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, title: e.target.value }))
                    }
                    placeholder="Or type a custom title"
                    className="input-field mt-2 text-sm"
                  />
                </div>

                {/* Specialty */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Specialty / Research Area
                  </label>
                  <input
                    type="text"
                    value={form.specialty}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, specialty: e.target.value }))
                    }
                    placeholder="e.g. Artificial Intelligence"
                    className="input-field"
                  />
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Department
                  </label>
                  <input
                    type="text"
                    value={form.department}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, department: e.target.value }))
                    }
                    placeholder="e.g. Computer Science"
                    className="input-field"
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
                  disabled={saving || !form.name || !form.title}
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
                    : "Add Staff"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
