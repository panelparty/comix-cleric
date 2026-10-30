// Avatar-specific file validation and processing.
// For general file uploads, see validation/files.js.

import { fail } from "@sveltejs/kit";
import { fileTypeFromBuffer } from "file-type";
import sharp from "sharp";
import { ALLOWED_TYPES, EXECUTABLE_CHECKS, MAX_BYTES } from "./schema.js";
import { generateString } from "$lib/utils/generate/string.js";

// Validates an avatar file: size, byte signatures, and MIME type (images only).
export async function checkFile(file) {
  if (!file || file.size === 0) return fail(400, { error: "No file provided" });

  if (file.size > MAX_BYTES) return fail(400, { error: "File too large" });

  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  const looksExecutable = EXECUTABLE_CHECKS.some((sig) =>
    sig.every((byte, i) => bytes[i] === byte),
  );

  if (looksExecutable) return fail(400, { error: "Invalid file" });

  const detected = await fileTypeFromBuffer(buffer);

  if (!detected || !detected.mime.startsWith(ALLOWED_TYPES?.[0])) {
    return fail(400, { error: "Avatar invalid: Only images are allowed." });
  }

  const meta = await sharp(Buffer.from(buffer)).metadata();

  if (!meta.width || meta.width > 4000) {
    return fail(400, { error: "Image too large" });
  }
}

// Re-encodes a file through sharp (images) or passes it through unchanged (audio).
// Strips metadata and potential embedded malware from image files.
export async function processFile(
  original,
  { sizeX, sizeY, quality = 100, format = null } = {},
) {
  if (!original || original.size <= 0) return null;

  const mimeCategory = original.type?.split("/")[0];

  if (mimeCategory === "image") {
    const arrayBuffer = await original.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const outputFormat = format ?? (original.type?.split("/")[1] ?? "webp");
    const image = sharp(buffer);
    const { width, height } = await image.metadata();

    const processedBuffer = await image
      .resize(sizeX ?? width ?? 512, sizeY ?? height ?? 512)
      .toFormat(outputFormat, { quality })
      .toBuffer();

    return new File(
      [processedBuffer],
      original?.name ?? generateString("Media", 12),
      { type: `image/${outputFormat}` },
    );
  }

  // TODO: Set up audio transcoding.
  if (mimeCategory === "audio") return original;

  return null;
}
