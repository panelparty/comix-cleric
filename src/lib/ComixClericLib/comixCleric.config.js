// Environment variables
import { env } from "$env/dynamic/private";

// Database Adapters
import MongoAdapter from "./adapters/MongoAdapter.js";
import SQLiteAdapter from "./adapters/SQLiteAdapter.js";

// Storage adapters
import LocalStorageAdapter from "./adapters/LocalStorageAdapter.js";

// Email adapters
import ResendEmailAdapter from "./adapters/ResendEmailAdapter.js";

// Adapter registries
const dbAdapters = {
  mongodb: MongoAdapter,
  sqlite: SQLiteAdapter,
  // Custom database adapters here
};
const storageAdapters = {
  local: LocalStorageAdapter,
  // Custom storage adapters here
};
const emailAdapters = {
  resend: ResendEmailAdapter,
  // Custom email adapters here
};

// Export adapter config
export default {
  database: {
    adapter: dbAdapters[env.DB_ADAPTER ?? "sqlite"],
    config: {},
  },
  storage: {
    adapter: storageAdapters[env.STORAGE_ADAPTER ?? "local"],
    config: {},
  },
  email: {
    adapter: emailAdapters[env.EMAIL_ADAPTER ?? "resend"],
    config: {},
  },
};