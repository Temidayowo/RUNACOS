"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
}

export function ImageUpload({ value, onChange, folder = "images", label = "Cover Image" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [mode, setMode] = useState<"upload" | "url">(value && !value.startsWith("/uploads/") ? "url" : "upload");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Upload failed");

      onChange(data.data.url);
      toast.success("Image uploaded");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <button
          type="button"
          onClick={() => setMode(mode === "upload" ? "url" : "upload")}
          className="text-xs text-electric hover:underline flex items-center gap-1"
        >
          {mode === "upload" ? <><LinkIcon className="w-3 h-3" /> Use URL</> : <><Upload className="w-3 h-3" /> Upload file</>}
        </button>
      </div>

      {mode === "url" ? (
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="w-full px-4 py-2 border border-surface-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-800/20 focus:border-navy-800"
        />
      ) : (
        <div className="space-y-2">
          {value ? (
            <div className="relative inline-block">
              <img src={value} alt="Preview" className="h-24 rounded-lg border border-surface-3 object-cover" />
              <button
                type="button"
                onClick={() => onChange("")}
                className="absolute -top-2 -right-2 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center hover:bg-rose-600"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-surface-3 rounded-lg cursor-pointer hover:border-electric/40 transition-colors">
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              {uploading ? (
                <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
              ) : (
                <>
                  <Upload className="w-5 h-5 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-400">Click to upload image</span>
                </>
              )}
            </label>
          )}
        </div>
      )}
    </div>
  );
}
