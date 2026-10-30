import { Tier1Scanner } from "../helpers/tier1Scanner.js";

/**
 * Base class for all storage adapters
 * Provides a common interface that all adapters must implement
 */
export class BaseStorageAdapter {
  constructor(config) {
    this.config = config;
    this.enableTier1Scan = config.enableTier1Scan ?? true;
    this._tier1Scanner = new Tier1Scanner();

    if (this.constructor === BaseStorageAdapter) {
      throw new Error("BaseStorageAdapter is abstract and must be extended");
    }
  }

  /**
   * Upload a single file runs Tier 1 scan/re-encode before delegating to _upload()
   * @param {File} file - File to upload
   * @param {Object} options - Upload options
   * @returns {Promise<Object>} File metadata
   */
  async upload(file, options = {}) {
    let uploadBuffer = Buffer.isBuffer(file)
      ? file
      : Buffer.from(await file.arrayBuffer());
    let finalContentType = file.type;
    let fileHash = null;

    if (this.enableTier1Scan) {
      const scanResult = await this._tier1Scanner.scan(
        uploadBuffer,
        file.type,
        file.name,
      );
      uploadBuffer = scanResult.buffer;
      finalContentType = scanResult.contentType;
      fileHash = scanResult.fileHash;
    }

    return this._upload(
      file,
      uploadBuffer,
      finalContentType,
      fileHash,
      options,
    );
  }

  /**
   * Adapter-specific upload implementation
   * Receives the pre-scanned buffer and resolved contentType
   * @param {File} file - Original file (for name/metadata)
   * @param {Buffer} buffer - Pre-scanned (and possibly re-encoded) buffer
   * @param {string} contentType - Resolved MIME type
   * @param {string|null} fileHash - SHA-256 of buffer, or null if scan disabled
   * @param {Object} options - Upload options
   */
  async _upload(file, buffer, contentType, fileHash, options = {}) {
    throw new Error(
      `Adapter ${this.constructor.name} must implement _upload()`,
    );
  }

  /**
   * Upload multiple files
   * @param {File[]} files - Array of files to upload
   * @param {Object} options - Upload options
   * @returns {Promise<Object[]>} Array of file metadata
   */
  async uploadMultiple(files, options = {}) {
    const results = [];
    for (const file of files) {
      const result = await this.upload(file, options);
      results.push(result);
    }
    return results;
  }

  async delete(fileId) {
    throw new Error(`Adapter ${this.constructor.name} must implement delete()`);
  }

  async getUrl(fileId, options = {}) {
    throw new Error(`Adapter ${this.constructor.name} must implement getUrl()`);
  }

  async exists(fileId) {
    throw new Error(`Adapter ${this.constructor.name} must implement exists()`);
  }

  async getMetadata(fileId) {
    throw new Error(
      `Adapter ${this.constructor.name} must implement getMetadata()`,
    );
  }

  async updateMetadata(fileId, updates) {
    throw new Error(
      `Adapter ${this.constructor.name} does not support updateMetadata()`,
    );
  }

  async serveFile(fileNameOrId) {
    throw new Error(
      `Adapter ${this.constructor.name} must implement serveFile()`,
    );
  }

  async getUploadStatus(fileIdOrJobId) {
    throw new Error(
      `Adapter ${this.constructor.name} must implement getUploadStatus()`,
    );
  }

  validateImplementation() {
    const requiredMethods = [
      "_upload",
      "delete",
      "getUrl",
      "exists",
      "getMetadata",
      "serveFile",
      "getUploadStatus",
    ];

    for (const method of requiredMethods) {
      if (typeof this[method] !== "function") {
        throw new Error(
          `Adapter ${this.constructor.name} must implement ${method}()`,
        );
      }
    }
  }
}
