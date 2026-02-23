"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Save,
  Loader2,
  Upload,
  ImageIcon,
  X,
  SlidersHorizontal,
  FileText,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  GripVertical,
  Video,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { PAGE_REGISTRY, type PageEntry } from "@/lib/page-registry";

// ─── Types ───
interface PageHeroConfig {
  heading: string;
  subheading: string;
  backgroundImage: string;
}

interface Slide {
  id: string;
  type: "image" | "video" | "lottie";
  mediaUrl: string;
  title: string;
  highlight: string;
  subtitle: string;
  duration: number;
  order: number;
  active: boolean;
}

type View = "list" | "page-editor" | "carousel-editor";

export default function PagesAdmin() {
  const [view, setView] = useState<View>("list");
  const [heroesMap, setHeroesMap] = useState<Record<string, PageHeroConfig>>({});
  const [loading, setLoading] = useState(true);
  // Page editor state
  const [editingPage, setEditingPage] = useState<PageEntry | null>(null);
  const [editForm, setEditForm] = useState<PageHeroConfig>({ heading: "", subheading: "", backgroundImage: "" });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch("/api/pages")
      .then((res) => res.json())
      .then((res) => setHeroesMap(res.data || {}))
      .catch(() => toast.error("Failed to load page heroes"))
      .finally(() => setLoading(false));
  }, []);

  const openPageEditor = (page: PageEntry) => {
    setEditingPage(page);
    const existing = heroesMap[page.slug];
    setEditForm({
      heading: existing?.heading || page.defaultHeading,
      subheading: existing?.subheading || page.defaultSubheading,
      backgroundImage: existing?.backgroundImage || "",
    });
    setView("page-editor");
  };

  const savePage = async () => {
    if (!editingPage) return;
    setSaving(true);
    try {
      const res = await fetch("/api/pages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: editingPage.slug, config: editForm }),
      });
      if (res.ok) {
        setHeroesMap((prev) => ({ ...prev, [editingPage.slug]: { ...editForm } }));
        toast.success("Page hero updated");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to save");
      }
    } catch {
      toast.error("Failed to save page hero");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "page-heroes");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.data?.url) {
        setEditForm((prev) => ({ ...prev, backgroundImage: data.data.url }));
        toast.success("Image uploaded");
      } else {
        toast.error(data.error || "Upload failed");
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const goToList = () => {
    setView("list");
    setEditingPage(null);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-surface-0 rounded-xl border border-surface-3 p-6 animate-pulse">
              <div className="h-24 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─── Page Editor View ───
  if (view === "page-editor" && editingPage) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={goToList} className="p-2 rounded-xl hover:bg-surface-1 text-gray-500">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold font-heading text-gray-900">
              Edit: {editingPage.label}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Customize the hero section for <code className="font-mono text-xs bg-surface-1 px-1.5 py-0.5 rounded">{editingPage.route}</code>
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={savePage}
            disabled={saving}
            className="btn-primary gap-2 text-sm"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving..." : "Save Changes"}
          </motion.button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          {/* Form */}
          <div className="bg-surface-0 rounded-xl border border-surface-3 p-6 space-y-5">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                Heading
              </label>
              <input
                type="text"
                value={editForm.heading}
                onChange={(e) => setEditForm((p) => ({ ...p, heading: e.target.value }))}
                placeholder={editingPage.defaultHeading}
                className="input-field text-sm"
              />
              <p className="mt-1 text-xs text-gray-400">
                Use {"{highlight}"}text{"{/highlight}"} for gradient-colored text.
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                Subheading
              </label>
              <textarea
                value={editForm.subheading}
                onChange={(e) => setEditForm((p) => ({ ...p, subheading: e.target.value }))}
                placeholder={editingPage.defaultSubheading}
                rows={3}
                className="input-field text-sm resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                Background Image
              </label>
              {editForm.backgroundImage ? (
                <div className="relative rounded-lg overflow-hidden border border-surface-3">
                  <div className="relative h-48">
                    <Image
                      src={editForm.backgroundImage}
                      alt="Background preview"
                      fill
                      className="object-cover"
                      sizes="600px"
                    />
                  </div>
                  <button
                    onClick={() => setEditForm((p) => ({ ...p, backgroundImage: "" }))}
                    className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-lg text-white hover:bg-black/70 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-200 p-8 text-center hover:border-blue-300 transition-colors cursor-pointer">
                  {uploading ? (
                    <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />
                  ) : (
                    <Upload className="h-5 w-5 text-gray-400" />
                  )}
                  <span className="text-sm text-gray-500">
                    {uploading ? "Uploading..." : "Click to upload background image"}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    disabled={uploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                  />
                </label>
              )}
              <p className="mt-1.5 text-xs text-gray-400">
                Recommended: 1920x600px. If no image is set, the default gradient is used.
              </p>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-surface-0 rounded-xl border border-surface-3 overflow-hidden">
            <div className="px-4 py-3 border-b border-surface-3 bg-surface-1/50">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Preview</p>
            </div>
            <div className={cn(
              "relative overflow-hidden py-12 text-center",
              !editForm.backgroundImage && "bg-gradient-hero"
            )}>
              {editForm.backgroundImage && (
                <>
                  <Image
                    src={editForm.backgroundImage}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="400px"
                  />
                  <div className="absolute inset-0 bg-midnight/80" />
                </>
              )}
              {!editForm.backgroundImage && <div className="absolute inset-0 bg-grid-dots-light pointer-events-none" />}
              <div className="relative px-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-electric mb-1">
                  {editingPage.breadcrumb}
                </p>
                <h2 className="font-heading text-lg font-bold text-white">
                  {editForm.heading || editingPage.defaultHeading}
                </h2>
                <p className="mt-2 text-xs text-navy-200">
                  {editForm.subheading || editingPage.defaultSubheading}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <p className="text-sm text-blue-700">
            Changes are saved when you click &ldquo;Save Changes&rdquo;. Leave fields empty to use the default values.
          </p>
        </div>
      </div>
    );
  }

  // ─── Carousel Editor View ───
  if (view === "carousel-editor") {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={goToList} className="p-2 rounded-xl hover:bg-surface-1 text-gray-500">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold font-heading text-gray-900">
              Landing Page Carousel
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage the homepage hero carousel slides.
            </p>
          </div>
        </div>
        <CarouselEditor />
      </div>
    );
  }

  // ─── List View ───
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-gray-900">Pages</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage the hero section for every page — change headings, subheadings, and background images.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Landing Page / Carousel Card */}
        <motion.button
          whileHover={{ y: -2 }}
          onClick={() => setView("carousel-editor")}
          className="text-left bg-surface-0 rounded-xl border border-surface-3 overflow-hidden hover:shadow-md transition-shadow"
        >
          <div className="relative h-28 bg-gradient-hero">
            <div className="absolute inset-0 bg-grid-dots-light pointer-events-none" />
            <div className="absolute top-2 right-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-electric/20 text-electric text-[10px] font-mono font-semibold">
                <SlidersHorizontal className="w-3 h-3" /> Carousel
              </span>
            </div>
          </div>
          <div className="p-4">
            <p className="font-medium text-gray-900 text-sm">Landing Page</p>
            <p className="text-xs text-gray-400 font-mono mt-0.5">/</p>
          </div>
        </motion.button>

        {/* Page Cards */}
        {PAGE_REGISTRY.map((page) => {
          const config = heroesMap[page.slug];
          return (
            <motion.button
              key={page.slug}
              whileHover={{ y: -2 }}
              onClick={() => openPageEditor(page)}
              className="text-left bg-surface-0 rounded-xl border border-surface-3 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className={cn("relative h-28 overflow-hidden", !config?.backgroundImage && "bg-gradient-hero")}>
                {config?.backgroundImage ? (
                  <>
                    <Image
                      src={config.backgroundImage}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="400px"
                    />
                    <div className="absolute inset-0 bg-midnight/60" />
                  </>
                ) : (
                  <div className="absolute inset-0 bg-grid-dots-light pointer-events-none" />
                )}
                <div className="absolute bottom-2 left-3 right-3">
                  <p className="text-xs font-medium text-white truncate drop-shadow-sm">
                    {config?.heading || page.defaultHeading}
                  </p>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-gray-400" />
                  <p className="font-medium text-gray-900 text-sm">{page.label}</p>
                </div>
                <p className="text-xs text-gray-400 font-mono mt-0.5">{page.route}</p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Carousel Editor (extracted from old carousel/page.tsx) ───

function CarouselEditor() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/carousel")
      .then((res) => res.json())
      .then((res) => {
        setSlides(
          (res.data || []).map((s: any, i: number) => ({
            ...s,
            order: s.order ?? i,
            active: s.active ?? true,
          }))
        );
      })
      .catch(() => toast.error("Failed to load carousel"))
      .finally(() => setLoading(false));
  }, []);

  const saveSlides = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/carousel", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slides }),
      });
      if (res.ok) {
        toast.success("Carousel saved successfully");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to save");
      }
    } catch {
      toast.error("Failed to save carousel");
    } finally {
      setSaving(false);
    }
  };

  const addSlide = () => {
    const newSlide: Slide = {
      id: `slide-${Date.now()}`,
      type: "image",
      mediaUrl: "",
      title: "New Slide Title",
      highlight: "Highlighted Text",
      subtitle: "Slide description goes here.",
      duration: 4,
      order: slides.length,
      active: true,
    };
    setSlides([...slides, newSlide]);
    setEditingId(newSlide.id);
  };

  const updateSlide = (id: string, updates: Partial<Slide>) => {
    setSlides((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const removeSlide = (id: string) => {
    setSlides((prev) => prev.filter((s) => s.id !== id));
    if (editingId === id) setEditingId(null);
  };

  const moveSlide = (id: string, direction: "up" | "down") => {
    const idx = slides.findIndex((s) => s.id === id);
    if ((direction === "up" && idx === 0) || (direction === "down" && idx === slides.length - 1)) return;
    const newSlides = [...slides];
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    [newSlides[idx], newSlides[swapIdx]] = [newSlides[swapIdx], newSlides[idx]];
    newSlides.forEach((s, i) => (s.order = i));
    setSlides(newSlides);
  };

  const handleUpload = async (slideId: string, file: File) => {
    setUploading(slideId);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "carousel");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.data?.url) {
        const isVideo = file.type.startsWith("video/");
        const isLottie = file.name.endsWith(".json") || file.type === "application/json";
        updateSlide(slideId, {
          mediaUrl: data.data.url,
          type: isLottie ? "lottie" : isVideo ? "video" : "image",
        });
        toast.success("File uploaded");
      } else {
        toast.error(data.error || "Upload failed");
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-surface-0 rounded-xl border border-surface-3 p-6 animate-pulse">
            <div className="h-24 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex gap-2 justify-end">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={addSlide} className="btn-secondary gap-2 text-sm">
          <Plus className="w-4 h-4" /> Add Slide
        </motion.button>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={saveSlides} disabled={saving} className="btn-primary gap-2 text-sm">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving..." : "Save Changes"}
        </motion.button>
      </div>

      {/* Slides List */}
      {slides.length === 0 ? (
        <div className="bg-surface-0 rounded-xl border border-surface-3 p-12 text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No carousel slides yet</p>
          <p className="text-sm text-gray-400 mt-1">Click &ldquo;Add Slide&rdquo; to create your first hero slide.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {slides.map((slide, idx) => (
            <motion.div
              key={slide.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={cn(
                "bg-surface-0 rounded-xl border overflow-hidden",
                !slide.active && "opacity-60",
                editingId === slide.id ? "border-blue-300 ring-1 ring-blue-200" : "border-surface-3"
              )}
            >
              {/* Slide Header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 bg-surface-1/50">
                <GripVertical className="w-4 h-4 text-gray-300" />
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className={cn(
                    "flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md font-mono",
                    slide.type === "video" ? "bg-purple-100 text-purple-700" : slide.type === "lottie" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                  )}>
                    {slide.type === "video" ? <Video className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                    {slide.type === "video" ? "Video" : slide.type === "lottie" ? "Lottie" : "Image"}
                  </span>
                  <span className="text-sm font-medium text-gray-700 truncate">{slide.title} {slide.highlight}</span>
                  <span className="text-xs text-gray-400">{slide.duration}s</span>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => moveSlide(slide.id, "up")} disabled={idx === 0} className="p-1.5 rounded hover:bg-surface-1 text-gray-400 disabled:opacity-30" title="Move up">
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button onClick={() => moveSlide(slide.id, "down")} disabled={idx === slides.length - 1} className="p-1.5 rounded hover:bg-surface-1 text-gray-400 disabled:opacity-30" title="Move down">
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button onClick={() => updateSlide(slide.id, { active: !slide.active })} className={cn("p-1.5 rounded hover:bg-surface-1", slide.active ? "text-green-500" : "text-gray-300")} title={slide.active ? "Disable slide" : "Enable slide"}>
                    {slide.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button onClick={() => setEditingId(editingId === slide.id ? null : slide.id)} className="px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded">
                    {editingId === slide.id ? "Close" : "Edit"}
                  </button>
                  <button onClick={() => removeSlide(slide.id)} className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500" title="Remove slide">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Slide Preview Row */}
              <div className="flex items-center gap-4 p-4">
                <div className="relative w-40 h-24 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  {slide.mediaUrl ? (
                    slide.type === "video" ? (
                      <video src={slide.mediaUrl} muted className="w-full h-full object-cover" />
                    ) : (
                      <Image src={slide.mediaUrl} alt={slide.title} fill className="object-cover" sizes="160px" />
                    )
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-300">
                      <Upload className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {slide.title} <span className="text-blue-600">{slide.highlight}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{slide.subtitle}</p>
                </div>
              </div>

              {/* Edit Panel */}
              <AnimatePresence>
                {editingId === slide.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-surface-3 p-4 space-y-4 bg-surface-1/30">
                      {/* Media Upload */}
                      <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                          Media (Image or Video)
                        </label>
                        <div className="flex gap-3">
                          <label className="flex-1 flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-200 p-4 text-center hover:border-blue-300 transition-colors cursor-pointer">
                            {uploading === slide.id ? (
                              <Loader2 className="h-5 w-5 text-blue-400 animate-spin" />
                            ) : (
                              <Upload className="h-5 w-5 text-gray-400" />
                            )}
                            <span className="text-sm text-gray-500">
                              {uploading === slide.id ? "Uploading..." : "Click to upload image, video, or Lottie JSON"}
                            </span>
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*,video/mp4,video/webm,application/json,.json"
                              disabled={uploading === slide.id}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleUpload(slide.id, file);
                              }}
                            />
                          </label>
                        </div>
                        {slide.mediaUrl && (
                          <p className="mt-1.5 text-xs text-gray-400 truncate">Current: {slide.mediaUrl}</p>
                        )}
                        <div className="mt-2">
                          <label className="block text-xs text-gray-400 mb-1">Or paste a URL directly</label>
                          <input
                            type="url"
                            value={slide.mediaUrl}
                            onChange={(e) => updateSlide(slide.id, { mediaUrl: e.target.value })}
                            placeholder="https://..."
                            className="input-field text-sm"
                          />
                        </div>
                      </div>

                      {/* Type & Duration */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Type</label>
                          <select
                            value={slide.type}
                            onChange={(e) => updateSlide(slide.id, { type: e.target.value as "image" | "video" | "lottie" })}
                            className="input-field text-sm"
                          >
                            <option value="image">Image</option>
                            <option value="video">Video</option>
                            <option value="lottie">Lottie Animation</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Duration (seconds)</label>
                          <input
                            type="number"
                            value={slide.duration}
                            onChange={(e) => updateSlide(slide.id, { duration: parseInt(e.target.value) || 4 })}
                            min={2}
                            max={30}
                            className="input-field text-sm"
                          />
                        </div>
                      </div>

                      {/* Text Fields */}
                      <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Title (before highlight)</label>
                        <input
                          type="text"
                          value={slide.title}
                          onChange={(e) => updateSlide(slide.id, { title: e.target.value })}
                          placeholder="e.g. Empowering the Future of"
                          className="input-field text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Highlight Text (colored)</label>
                        <input
                          type="text"
                          value={slide.highlight}
                          onChange={(e) => updateSlide(slide.id, { highlight: e.target.value })}
                          placeholder="e.g. Technology & Innovation"
                          className="input-field text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Subtitle</label>
                        <textarea
                          value={slide.subtitle}
                          onChange={(e) => updateSlide(slide.id, { subtitle: e.target.value })}
                          rows={2}
                          placeholder="Short description for this slide"
                          className="input-field text-sm resize-none"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
        <p className="text-sm text-blue-700">
          Changes are only saved when you click &ldquo;Save Changes&rdquo;.
          Slides can be images, videos (MP4/WebM), or Lottie animations (.json).
          Recommended image size: 1920x1080px.
        </p>
      </div>
    </div>
  );
}
