import { createHash } from "crypto";
import sharp from "sharp";
import { execFile } from "child_process";
import { promisify } from "util";
import { writeFile, unlink, readFile } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";

const execFileAsync = promisify(execFile);

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/svg+xml",
  "audio/mpeg",
  "audio/mp3",
  "audio/ogg",
  "audio/wav",
  "audio/webm",
  "audio/flac",
  "audio/aac",
  "audio/x-m4a",
]);

const MAGIC_BYTES = {
  "image/jpeg": [0xff, 0xd8, 0xff],
  "image/jpg": [0xff, 0xd8, 0xff],
  "image/png": [0x89, 0x50, 0x4e, 0x47],
  "image/gif": [0x47, 0x49, 0x46, 0x38],
  "image/webp": [0x52, 0x49, 0x46, 0x46],
  "video/webm": [0x1a, 0x45, 0xdf, 0xa3],
  "video/ogg": [0x4f, 0x67, 0x67, 0x53],
  "audio/mpeg": [
    [0x49, 0x44, 0x33],
    [0xff, 0xfb],
    [0xff, 0xfa],
    [0xff, 0xf3],
    [0xff, 0xf2],
  ],
  "audio/mp3": [
    [0x49, 0x44, 0x33],
    [0xff, 0xfb],
    [0xff, 0xfa],
    [0xff, 0xf3],
    [0xff, 0xf2],
  ],
  "audio/ogg": [0x4f, 0x67, 0x67, 0x53],
  "audio/wav": [0x52, 0x49, 0x46, 0x46],
  "audio/flac": [0x66, 0x4c, 0x61, 0x43],
};

const EXECUTABLE_SIGNATURES = [
  { bytes: [0x4d, 0x5a], name: "Windows executable (MZ)" },
  { bytes: [0x7f, 0x45, 0x4c, 0x46], name: "ELF executable" },
  { bytes: [0xcf, 0xfa, 0xed, 0xfe], name: "Mach-O executable" },
  { bytes: [0xfe, 0xed, 0xfa, 0xce], name: "Mach-O executable" },
  { bytes: [0xca, 0xfe, 0xba, 0xbe], name: "Java class file" },
];

const DANGEROUS_EXTENSIONS = [
  ".exe",
  ".dll",
  ".bat",
  ".cmd",
  ".com",
  ".msi",
  ".ps1",
  ".psm1",
  ".sh",
  ".bash",
  ".zsh",
  ".fish",
  ".py",
  ".rb",
  ".pl",
  ".php",
  ".asp",
  ".aspx",
  ".jsp",
  ".jar",
  ".class",
  ".vbs",
  ".js",
  ".ts",
];

const SVG_DANGEROUS_PATTERNS = [
  /<script/i,
  /javascript:/i,
  /on\w+\s*=/i,
  /<foreignObject/i,
  /xlink:href\s*=\s*["']\s*javascript/i,
  /href\s*=\s*["']\s*javascript/i,
  /<use[^>]+href\s*=\s*["']\s*data:/i,
  /<!ENTITY/i,
  /<!DOCTYPE[^>]*\[/i,
];

export class Tier1Scanner {
  async scan(buffer, contentType, originalName) {
    const threats = [];

    const isSvg = contentType === "image/svg+xml";
    const isAudio = contentType.startsWith("audio/");
    // We currently do not support video uploads
    //const isVideo = contentType.startsWith("video/");
    const isRasterImage = contentType.startsWith("image/") && !isSvg;

    if (!ALLOWED_MIME_TYPES.has(contentType)) {
      throw new Error(`Rejected: MIME type not allowed: ${contentType}`);
    }

    if (!isSvg && !["video/mp4", "video/quicktime"].includes(contentType)) {
      const expected = MAGIC_BYTES[contentType];
      if (expected) {
        const patterns = Array.isArray(expected[0]) ? expected : [expected];
        const maxLen = Math.max(...patterns.map((p) => p.length));
        const actual = [...buffer.slice(0, maxLen)];
        const match = patterns.some((pattern) =>
          pattern.every((byte, i) => actual[i] === byte),
        );
        if (!match) threats.push(`Magic bytes mismatch for ${contentType}`);
      }
    }

    for (const sig of EXECUTABLE_SIGNATURES) {
      const slice = [...buffer.slice(0, sig.bytes.length)];
      if (sig.bytes.every((b, i) => slice[i] === b)) {
        threats.push(`Executable content detected: ${sig.name}`);
        break;
      }
    }

    const lower = originalName.toLowerCase();
    for (const ext of DANGEROUS_EXTENSIONS) {
      if (lower.endsWith(ext)) {
        threats.push(`Dangerous file extension: ${ext}`);
        break;
      }
    }
    const parts = lower.split(".");
    if (
      parts.length > 2 &&
      DANGEROUS_EXTENSIONS.includes(`.${parts[parts.length - 2]}`)
    ) {
      threats.push(`Double extension detected: ${originalName}`);
    }

    if (threats.length > 0) {
      throw new Error(`Tier 1 scan failed: ${threats.join("; ")}`);
    }

    let finalBuffer = buffer;
    let finalContentType = contentType;

    if (isSvg) {
      finalBuffer = this._stripSvgMetadata(buffer, originalName);
    } else if (isRasterImage) {
      finalBuffer = await this._reencodeImage(buffer);
    } else if (isAudio) {
      const result = await this._reencodeAudio(buffer, originalName);
      finalBuffer = result.buffer;
      finalContentType = "audio/mpeg";
    }

    return {
      buffer: finalBuffer,
      contentType: finalContentType,
      fileHash: createHash("sha256").update(finalBuffer).digest("hex"),
    };
  }

  _stripSvgMetadata(buffer, originalName) {
    const content = buffer.toString("utf-8");
    if (!content.includes("<svg") && !content.includes("<?xml")) {
      throw new Error("File declared as SVG but contains no SVG markup");
    }
    for (const pattern of SVG_DANGEROUS_PATTERNS) {
      if (pattern.test(content)) {
        throw new Error(`Dangerous SVG content: ${pattern.source}`);
      }
    }
    const stripped = content
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/<metadata[\s\S]*?<\/metadata>/gi, "")
      .replace(/<title[\s\S]*?<\/title>/gi, "")
      .replace(/<desc[\s\S]*?<\/desc>/gi, "");
    return Buffer.from(stripped, "utf-8");
  }

  async _reencodeImage(buffer) {
    return sharp(buffer).rotate().toBuffer();
  }

  async _reencodeAudio(buffer, originalName) {
    let ext = originalName.split(".").pop() || "bin";
    ext = ext.replace(/[^a-zA-Z0-9]/g, "").substring(0, 10) || "bin";
    const inPath = join(tmpdir(), `t1scan-in-${Date.now()}.${ext}`);
    const outPath = join(tmpdir(), `t1scan-out-${Date.now()}.mp3`);
    try {
      await writeFile(inPath, buffer);
      await execFileAsync("ffmpeg", [
        "-i",
        inPath,
        "-map_metadata",
        "-1",
        "-vn",
        "-acodec",
        "libmp3lame",
        "-b:a",
        "192k",
        "-ar",
        "44100",
        "-ac",
        "2",
        "-y",
        outPath,
      ]);
      const outBuffer = await readFile(outPath);
      return { buffer: outBuffer };
    } finally {
      await unlink(inPath).catch(() => {});
      await unlink(outPath).catch(() => {});
    }
  }
}
