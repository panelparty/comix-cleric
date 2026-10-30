// Utilities for validating and processing uploaded files on the server.

// Svelte utilities
import { fail } from "@sveltejs/kit";

// Utilities
import { fileTypeFromBuffer } from "file-type";
import sharp from "sharp";

// Maximum file sizes and dimensions
export const MAX_SIZE_MB = 50;
export const MAX_IMG_WIDTH = 6000;
export const MAX_IMG_HEIGHT = 6000;

// File categories allowed for upload
export const ALLOWED_TYPES = ["image/", "audio/"];

// Byte signatures used to detect executable/malware files
export const EXECUTABLE_CHECKS = [
  [0x4d, 0x5a],
  [0x7f, 0x45, 0x4c, 0x46],
  [0xca, 0xfe, 0xba, 0xbe],
  [0x23, 0x21],
];

// Strips unsafe characters from a filename and truncates it to 255 characters.
export function sanitizeFile(file) {
  const sanitizedName = file.name
    .replace(/[<>:"/\\|?*]/g, "")
    .replace(/\s+/g, "_")
    .replace(/_{2,}/g, "_")
    .replace(/^_|_$/g, "")
    .substring(0, 255);

  return new File([file], sanitizedName, {
    type: file.type,
    lastModified: file.lastModified,
  });
}

// Fails the request if the file is missing or exceeds the size limit.
export function validateFileSize(file, sizeMB = MAX_SIZE_MB) {
  if (!file || file.size === 0) return fail(400, { error: "No file provided" });
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return fail(400, { error: `File too large! The limit is ${MAX_SIZE_MB}MB.` });
  }
}

// Reads the file's actual bytes to confirm its type matches the allowed list.
export async function checkFileType(file, allowedTypes) {
  const detected = await fileTypeFromBuffer(file);

  if (!detected || !allowedTypes?.includes(detected?.mime?.split("/")?.[0])) {
    return fail(400, { error: "File invalid: Only images and audio are allowed at this time." });
  }

  return detected?.mime;
}

// Checks for "magic byte" signatures that indicate an executable or malware payload.
export function checkBytes(bytes) {
  const looksExecutable = EXECUTABLE_CHECKS.some((sig) =>
    sig.every((byte, i) => bytes[i] === byte),
  );

  if (looksExecutable) return fail(400, { error: "Invalid file" });
}

// Fails the request if an image exceeds the maximum allowed dimensions.
export function checkImageSize(file, type) {
  if (type?.startsWith("image/")) {
    if (
      !file.width ||
      !file.height ||
      file.width > MAX_IMG_WIDTH ||
      file.height > MAX_IMG_HEIGHT
    ) {
      return fail(400, { error: "Image is too large!" });
    }
  }
}

// Runs all pre-upload checks on a file: size, type, magic bytes, and image dimensions.
export async function checkFile(file, size = MAX_SIZE_MB) {
  validateFileSize(file, size);

  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const fileType = checkFileType(buffer, ALLOWED_TYPES);

  checkBytes(bytes);

  const meta = await sharp(Buffer.from(buffer)).metadata();

  checkImageSize(buffer, fileType);
}

// Re-encodes an image through sharp to strip metadata and potential malware.
// Returns a new File object in the original format (or webp as fallback).
export async function processImage(
  original,
  name,
  { sizeX, sizeY, quality = 80, format = null },
) {
  if (original && original.size > 0) {
    const arrayBuffer = await original.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const outputFormat = format ?? (original.type?.split("/")[1] ?? "webp");

    const processedBuffer = await sharp(buffer)
      .resize(
        sizeX ?? buffer?.width,
        sizeY ?? buffer?.height,
      )
      .toFormat(outputFormat, { quality })
      .toBuffer();

    const newFile = new File([processedBuffer], original?.name ?? "Media", {
      type: `image/${outputFormat}`,
    });

    return { name, newFile };
  }
}
