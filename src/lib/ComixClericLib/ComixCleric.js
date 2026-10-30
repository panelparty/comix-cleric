/**
 * comixCleric - Main Interface
 */

import { createAuth } from "./auth.js";
import config from "./comixCleric.config.js";
import { requestBackup as requestBackupReq } from "./backupClient.js";

export class ComixClericData {
  constructor(db) {
    this.db = db;
  }

  async request(query, ...args) {
    const result = await query(this, ...args);
    return result;
  }

  async find(collection, options = {}) {
    return await this.db.find(collection, options);
  }

  async findOne(collection, id, options = {}) {
    return await this.db.findOne(collection, id, options);
  }

  async findOneBy(collection, filter, options = {}) {
    return await this.db.findOneBy(collection, filter, options);
  }

  async create(collection, data) {
    const result = await this.db.create(collection, data);
    return result;
  }

  async update(collection, id, data) {
    const result = await this.db.update(collection, id, data);
    return result;
  }

  async delete(collection, id) {
    const result = await this.db.delete(collection, id);
    return result;
  }

  async count(collection, options = {}) {
    const filter = options.filter || options;
    return await this.db.count(collection, filter);
  }

  async batch(queries) {
    return await this.db.batch(queries);
  }
}

export class ComixClericBackup {
  async request(body) {
    return await requestBackupReq(body, this.authToken);
  }
}

export class ComixClericAuth {
  constructor(auth, headers) {
    this.auth = auth;
    this.headers = headers;
    this.api = auth?.api;
  }

  async listUsers(query = {}) {
    if (!this.auth) throw new Error("Auth not initialized");
    return await this.auth.api.listUsers({ query, headers: this.headers });
  }

  async getUser(id) {
    if (!this.auth) throw new Error("Auth not initialized");
    return await this.auth.api.getUser({
      query: { id },
      headers: this.headers,
    });
  }

  async createUser(userData) {
    if (!this.auth) throw new Error("Auth not initialized");
    return await this.auth.api.createUser({
      body: userData,
      headers: this.headers,
    });
  }

  async updateUser(id, userData) {
    if (!this.auth) throw new Error("Auth not initialized");
    return await this.auth.api.updateUser({
      body: userData,
      query: { id },
      headers: this.headers,
    });
  }

  async deleteUser(id) {
    if (!this.auth) throw new Error("Auth not initialized");
    const result = await this.auth.api.removeUser({
      body: { userId: id },
      headers: this.headers,
    });

    return result;
  }

  async signUpEmail(userData) {
    if (!this.auth) throw new Error("Auth not initialized");
    return await this.auth.api.signUpEmail({
      body: userData,
      headers: this.headers,
    });
  }

  async signInEmail(credentials, requestHeaders) {
    if (!this.auth) throw new Error("Auth not initialized");

    const reqHeaders = requestHeaders || this.headers;

    const result = await this.auth.api.signInEmail({
      body: credentials,
      headers: reqHeaders,
    });

    return result;
  }

  async resetPassword({ token, newPassword }) {
    if (!this.auth) throw new Error("Auth not initialized");
    return await this.auth.api.resetPassword({
      body: { token, newPassword },
      headers: this.headers,
    });
  }

  async getSession() {
    if (!this.auth) throw new Error("Auth not initialized");
    return await this.auth.api.getSession({ headers: this.headers });
  }

  handler(request) {
    if (!this.auth) throw new Error("Auth not initialized");
    return this.auth.handler(request);
  }
}

export class ComixClericStorage {
  constructor(storage, db) {
    this.storage = storage;
    this.db = db;
  }

  isLocalStorage() {
    return this.storage.constructor.name === "LocalStorageAdapter";
  }

  async upload(file, options = {}) {
    const result = await this.storage.upload(file, options);

    const dbResult = await this.db.create("files", result);

    return dbResult;
  }

  async uploadMultiple(files, options = {}) {
    const results = [];
    for (const file of files) {
      const result = await this.upload(file, options);
      results.push(result);
    }
    return results;
  }

  async delete(fileId) {
    const deleted = await this.storage.delete(fileId);

    if (deleted) {
      await this.db.delete("files", fileId);
    }

    return deleted;
  }

  async getMetadata(fileId) {
    const dbMetadata = await this.db.findOne("files", fileId);
    return dbMetadata;
  }

  async findFiles(options = {}) {
    return await this.db.find("files", options);
  }

  async findFileByName(filename) {
    return await this.db.findOneBy("files", {
      filename_disk: { _eq: filename },
    });
  }

  async updateFile(fileId, updates) {
    return await this.db.update("files", fileId, updates);
  }

  async countFiles(filter = {}) {
    return await this.db.count("files", filter);
  }

  async serveFile(fileNameOrId) {
    return await this.storage.serveFile(fileNameOrId);
  }

  async backup(file, options = {}) {
    const { title, ...rest } = await this.storage.upload(file, options);

    const dbResult = await this.db.create("backups", rest);

    return dbResult;
  }
}

export class ComixClericCore {
  constructor({ db, storage, headers, emailAdapter, origin }) {
    this.db = new ComixClericData(db);
    this.storage = new ComixClericStorage(storage, this.db);
    this.backup = new ComixClericBackup();

    const authInstance = createAuth(db, emailAdapter, origin);
    this.auth = new ComixClericAuth(authInstance, headers);
  }
}

let comixClericInstance = null;
let instanceHeaders = null;
let instanceOrigin = null;

export function ComixCleric(headers, origin) {
  if (
    !comixClericInstance ||
    JSON.stringify(headers) !== JSON.stringify(instanceHeaders) ||
    origin !== instanceOrigin
  ) {
    const DbAdapter = config.database.adapter;
    const db = new DbAdapter(config.database.config);

    const StorageAdapter = config.storage.adapter;
    const storage = new StorageAdapter(config.storage.config);

    const EmailAdapter = config.email.adapter;
    const emailAdapter = new EmailAdapter(config.email.config);

    comixClericInstance = new ComixClericCore({
      db,
      storage,
      headers,
      emailAdapter,
      origin,
    });
    instanceHeaders = headers;
    instanceOrigin = origin;
  }

  return comixClericInstance;
}
