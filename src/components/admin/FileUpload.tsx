"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, FileText } from "lucide-react";
import { toast } from "sonner";

interface FileUploadProps {
  value: { url: string; name: string; size: number; type: string };
  onChange: (file: { url: string; name: string; size: number; type: string }) => void;
  folder?: string;
  accept?: string;
  label?: string;
  maxSize?: number;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function FileUpload({
  value,
  onChange,
  folder = "documents",
  accept = ".pdf,.doc,.docx,.pptx",
  label = "File",
  maxSize = 10 * 1024 * 1024,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSize) {
      toast.error(`File must be under ${formatBytes(maxSize)}`);
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

      onChange({
        url: data.data.url,
        name: file.name,
        size: file.size,
        type: file.type,
      });
      toast.success("File uploaded");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const clear = () => {
    onChange({ url: "", name: "", size: 0, type: "" });
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {value.url ? (
        <div className="flex items-center gap-3 p-3 border border-surface-3 rounded-lg bg-surface-1">
          <FileText className="w-5 h-5 text-electric flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{value.name}</p>
            <p className="text-xs text-gray-500">{formatBytes(value.size)}</p>
          </div>
          <button
            type="button"
            onClick={clear}
            className="p-1 text-gray-400 hover:text-rose-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-surface-3 rounded-lg cursor-pointer hover:border-electric/40 transition-colors">
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />
          {uploading ? (
            <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
          ) : (
            <>
              <Upload className="w-5 h-5 text-gray-400 mb-1" />
              <span className="text-xs text-gray-400">Click to upload file (PDF, DOCX, PPTX)</span>
              <span className="text-xs text-gray-300 mt-0.5">Max {formatBytes(maxSize)}</span>
            </>
          )}
        </label>
      )}
    </div>
  );
}
