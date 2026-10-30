// -- This file contains miscellaneous methods, utilities, and helpers for scanning malicious files. -- //
// TODO: Move to a better method.

// File type detection

// DOM Sanitizer (for SVGs)
import DOMPurify from "isomorphic-dompurify";

// Image processing
import sharp from "sharp";
import { isArray } from "lodash-es";

// Allowed file extensions
const extWhitelist = [
  // image
  "png",
  "jpg",
  "jpeg",
  "svg",
  "webp",
  "gif",
  // video
  "mov",
  "mp4",
  "webm",
  // audio
  "ogg",
  "mp3",
  "wav",
];

// Allowed file types
const typeWhitelist = ["image", "video", "audio"];

// Basic Steganography detection
// TODO: See if we still need this. Sharp re-builds provided image files already.
function detectLSBSteganography(imageData) {
  const data = imageData?.data;
  let evenCount = 0,
    oddCount = 0;

  // Analyze LSB distribution in red channel
  for (let i = 0; i < data?.length; i += 4) {
    if (data[i] % 2 === 0) evenCount++;
    else oddCount++;
  }

  const ratio = evenCount / oddCount;
  // Suspicious if ratio deviates significantly from ~1.0
  return Math.abs(ratio - 1.0) > 0.1;
}

// SVG sanitizer
export async function sanitizeSVG(svgString) {
  const cleanSVG = DOMPurify.sanitize(svgString, {
    USE_PROFILES: { svg: true, svgFilters: true },
    FORBID_TAGS: ['script', 'use'],
    FORBID_ATTR: ['href', 'xlink:href', 'onclick', 'onload', 'onmouseover'],
  })

  return cleanSVG;
}

// Validation function
export async function fileValidation(
  file,
  allowedTypes,
  maxSize = 256 /*in MB*/,
) {
  const maxFileSize = maxSize * 1024 * 1024; // Converted to MB.

  // Size check.
  if (file.size > maxFileSize) {
    return { safe: false, error: `File \`${file?.name}\` is too large.` };
  }

  let detectedExt;
  let detectedType;

  // File type detection.
  const fileName = file?.name;
  const nameParts = fileName.split(".");
  if (isArray(nameParts) && nameParts?.length > 1) detectedExt = nameParts[nameParts.length -1];
  detectedType = file?.type.split("/")[0];

  // If we can't get the file type:
  if (!detectedExt) {
    return { safe: false, error: `File \`${file?.name}\` cannot be read.` };
  }

  // Check if detected MIME type is in the whitelist.
  const isTypeAllowed =
    !!typeWhitelist?.some((prefix) => detectedType.startsWith(prefix)) &&
    !!extWhitelist?.some((suffix) => detectedExt.endsWith(suffix));

  // If we don't allow the file type:
  if (!isTypeAllowed) {
    return {
      safe: false,
      error: `File type \`.${detectedType?.ext}\` is not allowed.`,
    };
  }

  // Check for additional files via LSB ratio
  if (detectLSBSteganography(file)) {
    return { safe: false, error: `Error reading file \`${file?.name}\`.` };
  }
  
  // Content-specific validation
  if (detectedType.startsWith("image")) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const metadata = await sharp(buffer).metadata();
    if (metadata.width > 10000 || metadata.height > 10000) {
      return {
        safe: false,
        error: `Image \`${file?.name}\` exceeds width/height limit of 10,000 pixels.`,
      };
    }
  }

  return { safe: true, file };
}
