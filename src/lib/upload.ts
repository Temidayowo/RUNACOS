import { put, del } from "@vercel/blob";
import {
  ACCEPTED_IMAGE_TYPES,
  ACCEPTED_VIDEO_TYPES,
  ACCEPTED_JSON_TYPES,
  ACCEPTED_DOC_TYPES,
  MAX_IMAGE_SIZE,
  MAX_VIDEO_SIZE,
  MAX_DOC_SIZE,
} from "./constants";

export async function uploadFile(
  file: File,
  folder: string = "uploads"
): Promise<{ url: string; error?: string }> {
  const isImage = ACCEPTED_IMAGE_TYPES.includes(file.type);
  const isVideo = ACCEPTED_VIDEO_TYPES.includes(file.type);
  const isJson = ACCEPTED_JSON_TYPES.includes(file.type) || file.name.endsWith(".json");
  const isDoc = ACCEPTED_DOC_TYPES.includes(file.type);

  if (!isImage && !isVideo && !isJson && !isDoc) {
    return { url: "", error: "File type not supported" };
  }

  const maxSize = isVideo ? MAX_VIDEO_SIZE : isImage ? MAX_IMAGE_SIZE : MAX_DOC_SIZE;
  if (file.size > maxSize) {
    return {
      url: "",
      error: `File too large. Max size: ${maxSize / (1024 * 1024)}MB`,
    };
  }

  try {
    const blob = await put(`${folder}/${Date.now()}-${file.name}`, file, {
      access: "public",
    });

    return { url: blob.url };
  } catch (error) {
    console.error("Blob storage error:", error);
    return { url: "", error: "Upload failed — storage service unavailable" };
  }
}

export async function deleteFile(url: string): Promise<void> {
  try {
    await del(url);
  } catch (error) {
    console.error("Failed to delete file:", error);
  }
}
