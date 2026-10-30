// Utilities
import { consoleError } from "$lib/utils/debug.js";
import { BaseStorageAdapter } from "./BaseStorageAdapter.js";
import { randomUUID } from "crypto";
import {
  writeFile,
  readFile,
  unlink,
  access,
  stat,
  readdir,
  mkdir,
} from "fs/promises";
import { join, resolve, sep } from "path";

/**
 * Local filesystem storage adapter
 * Stores files in the local filesystem
 */
export class LocalStorageAdapter extends BaseStorageAdapter {
  constructor(config) {
    super(config);
    this.uploadDir = config.uploadDir || join(process.cwd(), "uploads");
    this.baseUrl = "/" + (config.uploadDir || "uploads").replace(/^\.\//, "");
  }

  /**
   * Upload a single file to local filesystem
   * @param {File} file - File to upload
   * @param {Buffer} buffer - File buffer
   * @param {string} contentType - MIME type
   * @param {string|null} fileHash - SHA-256 hash of file
   * @param {Object} options - Upload options
   */
  async _upload(file, buffer, contentType, fileHash, options = {}) {
    await this._ensureUploadDir();

    const filenameUuid = randomUUID();
    const extension = this._getFileExtension(file.name);
    const newFilename = `${filenameUuid}${extension}`;

    const filepath = join(this.uploadDir, newFilename);
    await writeFile(filepath, buffer);

    return {
      filename_disk: newFilename,
      filename_download: file.name,
      title: file.name?.split(".")?.[0],
      type: contentType,
      filesize: buffer.length,
      uploaded_on: new Date().toISOString(),
    };
  }

  async delete(fileId) {
    try {
      const files = await this._findFileById(fileId);

      for (const file of files) {
        const filepath = join(this.uploadDir, file);
        await unlink(filepath);
      }

      return true;
    } catch (error) {
      consoleError(`Failed to delete file ${fileId}:`, error);
      return false;
    }
  }

  async getUrl(fileId, options = {}) {
    const files = await this._findFileById(fileId);

    if (files.length === 0) {
      throw new Error(`File not found: ${fileId}`);
    }

    return `${this.baseUrl}/${files[0]}`;
  }

  async exists(fileId) {
    try {
      const files = await this._findFileById(fileId);
      return files.length > 0;
    } catch (error) {
      return false;
    }
  }

  async getMetadata(fileId) {
    const files = await this._findFileById(fileId);

    if (files.length === 0) {
      throw new Error(`File not found: ${fileId}`);
    }

    const filepath = join(this.uploadDir, files[0]);
    const stats = await stat(filepath);

    return {
      id: fileId,
      filename_disk: files[0],
      filesize: stats.size,
      uploaded_on: stats.birthtime.toISOString(),
      modified_on: stats.mtime.toISOString(),
    };
  }

  async _findFileById(fileId) {
    const files = await readdir(this.uploadDir);

    return files.filter((file) => file.startsWith(fileId));
  }

  async serveFile(filename) {
    const filePath = join(this.uploadDir, filename);

    if (!filePath.startsWith(resolve(this.uploadDir) + sep)) {
      throw new Error("Could not complete request.");
    }

    const buffer = await readFile(filePath);

    const stats = await stat(filePath);

    const contentType = this._getContentType(filename);

    return {
      buffer,
      contentType,
      filename,
      filesize: stats.size,
    };
  }

  async getUploadStatus(fileId) {
    const files = await this._findFileById(fileId);

    if (files.length === 0) {
      return {
        state: "failed",
        progress: 0,
        failedReason: "File not found",
      };
    }

    return {
      state: "completed",
      progress: 100,
      result: {
        filename_disk: files[0],
      },
    };
  }

  _getContentType(filename) {
    const ext = this._getFileExtension(filename).toLowerCase();
    const mimeTypes = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp",
      ".svg": "image/svg+xml",
      ".pdf": "application/pdf",
      ".zip": "application/zip",
      ".json": "application/json",
      ".txt": "text/plain",
    };
    return mimeTypes[ext] || "application/octet-stream";
  }

  async _ensureUploadDir() {
    try {
      await access(this.uploadDir);
    } catch (error) {
      await mkdir(this.uploadDir, { recursive: true });
    }
  }

  _getFileExtension(filename) {
    const lastDot = filename.lastIndexOf(".");
    return lastDot !== -1 ? filename.substring(lastDot) : "";
  }
}

export default LocalStorageAdapter;
