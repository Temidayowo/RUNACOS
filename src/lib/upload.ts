import path from "path";
import fs from "fs/promises";
import {
  ACCEPTED_IMAGE_TYPES,
  ACCEPTED_VIDEO_TYPES,
  ACCEPTED_JSON_TYPES,
  ACCEPTED_DOC_TYPES,
  MAX_IMAGE_SIZE,
  MAX_VIDEO_SIZE,
  MAX_DOC_SIZE,
} from "./constants";

// ---------------------------------------------------------------------------
// Storage provider abstraction — swap to S3 by changing STORAGE_PROVIDER
// ---------------------------------------------------------------------------

const STORAGE_PROVIDER = process.env.STORAGE_PROVIDER || "local"; // "local" | "s3"

// --- Local storage ---

async function localPut(
  filePath: string,
  buffer: Buffer
): Promise<{ url: string }> {
  const uploadDir = path.join(process.cwd(), "public", "uploads", path.dirname(filePath));
  await fs.mkdir(uploadDir, { recursive: true });

  const fullPath = path.join(process.cwd(), "public", "uploads", filePath);
  await fs.writeFile(fullPath, buffer);

  return { url: `/uploads/${filePath}` };
}

async function localDel(url: string): Promise<void> {
  // url looks like /uploads/folder/timestamp-file.jpg
  const filePath = path.join(process.cwd(), "public", url);
  try {
    await fs.unlink(filePath);
  } catch {
    // file may already be deleted
  }
}

// --- S3-compatible storage (Tigris) ---

function getS3Client() {
  const { S3Client } = require("@aws-sdk/client-s3") as typeof import("@aws-sdk/client-s3");
  return new S3Client({
    region: "auto",
    endpoint: process.env.S3_ENDPOINT || "https://fly.storage.tigris.dev",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
  });
}

async function s3Put(
  filePath: string,
  buffer: Buffer,
  contentType: string
): Promise<{ url: string }> {
  const { PutObjectCommand } = require("@aws-sdk/client-s3") as typeof import("@aws-sdk/client-s3");
  const client = getS3Client();
  const bucket = process.env.S3_BUCKET!;

  await client.send(new PutObjectCommand({
    Bucket: bucket,
    Key: filePath,
    Body: buffer,
    ContentType: contentType,
  }));

  const endpoint = process.env.S3_ENDPOINT || "https://fly.storage.tigris.dev";
  return { url: `${endpoint}/${bucket}/${filePath}` };
}

async function s3Del(url: string): Promise<void> {
  const { DeleteObjectCommand } = require("@aws-sdk/client-s3") as typeof import("@aws-sdk/client-s3");
  const client = getS3Client();
  const bucket = process.env.S3_BUCKET!;

  // Extract key from full URL
  const urlObj = new URL(url);
  const key = urlObj.pathname.replace(`/${bucket}/`, "").replace(/^\//, "");

  await client.send(new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  }));
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

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
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filePath = `${folder}/${Date.now()}-${sanitizedName}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    if (STORAGE_PROVIDER === "s3") {
      const result = await s3Put(filePath, buffer, file.type);
      return { url: result.url };
    }

    // Default: local storage
    const result = await localPut(filePath, buffer);
    return { url: result.url };
  } catch (error) {
    console.error("Upload error:", error);
    return { url: "", error: "Upload failed — storage service unavailable" };
  }
}

export async function deleteFile(url: string): Promise<void> {
  try {
    if (STORAGE_PROVIDER === "s3") {
      await s3Del(url);
      return;
    }

    // Default: local storage
    await localDel(url);
  } catch (error) {
    console.error("Failed to delete file:", error);
  }
}
