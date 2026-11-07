import { BaseDatabaseAdapter, ValidationError } from "./BaseDatabaseAdapter.js";
import Database from "better-sqlite3";
import { randomUUID } from "crypto";
import { mkdirSync } from "fs";
import { dirname } from "path";
import { env } from "$env/dynamic/private";
import { consoleError, consoleLog, consoleSuccess } from "$lib/utils/debug.js";

const TYPE_MAP = {
  string: "TEXT",
  number: "REAL",
  boolean: "INTEGER",
  date: "TEXT",
  array: "TEXT",
};

function toBindable(value) {
  if (value === undefined) return null;
  if (typeof value === "boolean") return value ? 1 : 0;
  if (value instanceof Date) return value.toISOString();
  return value;
}

export class SQLiteAdapter extends BaseDatabaseAdapter {
  #db = null;

  static requiredEnvVars = ["DB_PATH"];

  constructor(config) {
    super(config);
    this.dbPath = env.DB_PATH || "./data/comix-cleric.db";
    this.connect();
  }

  async connect() {
    try {
      consoleLog(`Connecting to SQLite database: ${this.dbPath}`);
      mkdirSync(dirname(this.dbPath), { recursive: true });
      this.#db = new Database(this.dbPath);
      this.#db.pragma("journal_mode = WAL");
      this.#db.pragma("foreign_keys = ON");
      this.#db.pragma("busy_timeout = 5000");
      this.#syncSchema();
      consoleSuccess(`Connected to SQLite database: ${this.dbPath}`);
    } catch (error) {
      consoleError("Failed to connect to SQLite:", error);
      throw error;
    }
  }

  async disconnect() {
    if (this.#db) {
      this.#db.close();
      this.#db = null;
      consoleLog("Disconnected from SQLite");
    }
  }

  async ping() {
    this.#db.exec("SELECT 1");
    return { ok: 1 };
  }

  // Schema synchronization, since we are dealing with a database that needs to create table schema ahead of time.

  #syncSchema() {
    const schemas = this.schemaRegistry.getAll();

    for (const [collection, schema] of Object.entries(schemas)) {
      const fields = schema.fields;
      if (!fields) continue;

      const colDefs = [];
      for (const [name, def] of Object.entries(fields)) {
        if (def.primary) {
          colDefs.push(`"${name}" TEXT PRIMARY KEY`);
        } else {
          const sqlType = TYPE_MAP[def.type] || "TEXT";
          colDefs.push(`"${name}" ${sqlType}`);
        }
      }

      this.#db.exec(
        `CREATE TABLE IF NOT EXISTS "${collection}" (${colDefs.join(", ")})`,
      );

      // Additive column migration
      const existing = this.#db.pragma(`table_info("${collection}")`);
      const existingCols = new Set(existing.map((c) => c.name));

      for (const [name, def] of Object.entries(fields)) {
        if (existingCols.has(name)) continue;
        const sqlType = def.primary ? "TEXT" : TYPE_MAP[def.type] || "TEXT";
        this.#db.exec(
          `ALTER TABLE "${collection}" ADD COLUMN "${name}" ${sqlType}`,
        );
      }

      // UNIQUE indexes
      for (const [name, def] of Object.entries(fields)) {
        if (!def.unique || def.primary) continue;
        const idxName = `idx_${collection}_${name}_unique`;
        this.#db.exec(
          `CREATE UNIQUE INDEX IF NOT EXISTS "${idxName}" ON "${collection}" ("${name}")`,
        );
      }
    }
  }

  #getArrayFields(collection) {
    const schema = this.schemaRegistry.get(collection);
    if (!schema?.fields) return new Set();
    const out = new Set();
    for (const [name, def] of Object.entries(schema.fields)) {
      if (def.type === "array") out.add(name);
    }
    return out;
  }

  #getBooleanFields(collection) {
    const schema = this.schemaRegistry.get(collection);
    if (!schema?.fields) return new Set();
    const out = new Set();
    for (const [name, def] of Object.entries(schema.fields)) {
      if (def.type === "boolean") out.add(name);
    }
    return out;
  }

  #getDateFields(collection) {
    const schema = this.schemaRegistry.get(collection);
    if (!schema?.fields) return new Set();
    const out = new Set();
    for (const [name, def] of Object.entries(schema.fields)) {
      if (def.type === "date") out.add(name);
    }
    return out;
  }

  //Reformats data for SQLite storage
  #reformatForWrite(collection, data) {
    const arrayFields = this.#getArrayFields(collection);
    const booleanFields = this.#getBooleanFields(collection);
    const dateFields = this.#getDateFields(collection);
    const out = {};

    for (const [key, value] of Object.entries(data)) {
      if (arrayFields.has(key)) {
        out[key] =
          value != null
            ? JSON.stringify(Array.isArray(value) ? value : [value])
            : null;
      } else if (booleanFields.has(key)) {
        out[key] = value != null ? (value ? 1 : 0) : null;
      } else if (dateFields.has(key)) {
        if (value instanceof Date) {
          out[key] = value.toISOString();
        } else {
          out[key] = value != null ? String(value) : null;
        }
      } else {
        out[key] = toBindable(value);
      }
    }

    return out;
  }

  //Reformats data for back to exiting formats.
  #reformatFromRow(collection, row) {
    if (!row) return null;
    const arrayFields = this.#getArrayFields(collection);
    const booleanFields = this.#getBooleanFields(collection);
    const dateFields = this.#getDateFields(collection);
    const out = {};

    for (const [key, value] of Object.entries(row)) {
      if (arrayFields.has(key)) {
        if (value == null) {
          out[key] = null;
        } else {
          try {
            out[key] = JSON.parse(value);
          } catch {
            out[key] = [];
          }
        }
      } else if (booleanFields.has(key)) {
        out[key] = value != null ? Boolean(value) : null;
      } else if (dateFields.has(key)) {
        out[key] = value != null ? String(value) : null;
      } else {
        out[key] = value;
      }
    }

    return out;
  }

  convertFilters(filter, collection) {
    if (!filter || typeof filter !== "object")
      return { clause: "", params: [] };

    const conditions = [];
    const params = [];
    const arrayFields = this.#getArrayFields(collection);

    for (const [key, value] of Object.entries(filter)) {
      const col = key === "id" ? "id" : key;

      if (col.includes(".")) {
        throw new Error(
          `Dot-notation filter key "${col}" is not supported by SQLiteAdapter`,
        );
      }

      if (
        typeof value === "object" &&
        !Array.isArray(value) &&
        value !== null
      ) {
        const hasOperators = Object.keys(value).some((k) => k.startsWith("_"));

        if (hasOperators) {
          for (const [op, val] of Object.entries(value)) {
            if (arrayFields.has(col)) {
              this.#buildArrayCondition(col, op, val, conditions, params);
            } else {
              this.#buildScalarCondition(col, op, val, conditions, params);
            }
          }
        } else {
          conditions.push(`"${col}" = ?`);
          params.push(value);
        }
      } else {
        conditions.push(`"${col}" = ?`);
        params.push(value);
      }
    }

    return {
      clause: conditions.length ? conditions.join(" AND ") : "",
      params: params.map(toBindable),
    };
  }

  #buildScalarCondition(col, op, val, conditions, params) {
    switch (op) {
      case "_eq":
        conditions.push(`"${col}" = ?`);
        params.push(val);
        break;
      case "_neq":
        conditions.push(`"${col}" != ?`);
        params.push(val);
        break;
      case "_lt":
        conditions.push(`"${col}" < ?`);
        params.push(val);
        break;
      case "_lte":
        conditions.push(`"${col}" <= ?`);
        params.push(val);
        break;
      case "_gt":
        conditions.push(`"${col}" > ?`);
        params.push(val);
        break;
      case "_gte":
        conditions.push(`"${col}" >= ?`);
        params.push(val);
        break;
      case "_in": {
        const arr = Array.isArray(val) ? val : [val];
        const placeholders = arr.map(() => "?").join(", ");
        conditions.push(`"${col}" IN (${placeholders})`);
        params.push(...arr);
        break;
      }
      case "_nin": {
        const arr = Array.isArray(val) ? val : [val];
        const placeholders = arr.map(() => "?").join(", ");
        conditions.push(`"${col}" NOT IN (${placeholders})`);
        params.push(...arr);
        break;
      }
      case "_contains":
        conditions.push(`"${col}" LIKE ? COLLATE NOCASE`);
        params.push(`%${val}%`);
        break;
      case "_starts_with":
        conditions.push(`"${col}" LIKE ? COLLATE NOCASE`);
        params.push(`${val}%`);
        break;
      case "_ends_with":
        conditions.push(`"${col}" LIKE ? COLLATE NOCASE`);
        params.push(`%${val}`);
        break;
      case "_null":
        conditions.push(`"${col}" IS NULL`);
        break;
      case "_nnull":
        conditions.push(`"${col}" IS NOT NULL`);
        break;
      case "_between":
        if (Array.isArray(val) && val.length === 2) {
          conditions.push(`"${col}" >= ? AND "${col}" <= ?`);
          params.push(val[0], val[1]);
        }
        break;
      default:
        throw new Error(
          `Unsupported filter operator "${op}" on field "${col}"`,
        );
    }
  }

  #buildArrayCondition(col, op, val, conditions, params) {
    switch (op) {
      case "_contains":
      case "_eq":
        conditions.push(
          `EXISTS (SELECT 1 FROM json_each("${col}") WHERE json_each.value = ?)`,
        );
        params.push(val);
        break;
      case "_in": {
        const arr = Array.isArray(val) ? val : [val];
        const placeholders = arr.map(() => "?").join(", ");
        conditions.push(
          `EXISTS (SELECT 1 FROM json_each("${col}") WHERE json_each.value IN (${placeholders}))`,
        );
        params.push(...arr);
        break;
      }
      case "_null":
        conditions.push(`"${col}" IS NULL`);
        break;
      case "_nnull":
        conditions.push(`"${col}" IS NOT NULL`);
        break;
      default:
        throw new Error(
          `Unsupported filter operator "${op}" on array field "${col}"`,
        );
    }
  }

  convertSort(sort, collection) {
    if (!sort) return "";

    if (typeof sort === "string") {
      const desc = sort.startsWith("-");
      const field = desc ? sort.substring(1) : sort;
      if (!this.isValidSortField(field, collection)) return "";
      return `"${field.replaceAll('"', '""')}" ${desc ? "DESC" : "ASC"}`;
    }

    if (Array.isArray(sort)) {
      const parts = [];
      for (const entry of sort) {
        if (typeof entry !== "string") return "";
        const desc = entry.startsWith("-");
        const field = desc ? entry.substring(1) : entry;
        if (!this.isValidSortField(field, collection)) return "";
        parts.push(`"${field.replaceAll('"', '""')}" ${desc ? "DESC" : "ASC"}`);
      }
      return parts.length ? parts.join(", ") : "";
    }

    if (typeof sort === "object") {
      const parts = [];
      for (const [field, dir] of Object.entries(sort)) {
        if (!this.isValidSortField(field, collection)) return "";
        parts.push(`"${field.replaceAll('"', '""')}" ${dir === -1 ? "DESC" : "ASC"}`);
      }
      return parts.length ? parts.join(", ") : "";
    }

    return "";
  }

  convertFields(fields) {
    if (!fields) return "*";

    if (Array.isArray(fields)) {
      if (fields.includes("*")) return "*";
      const cols = [];
      for (const f of fields) {
        if (typeof f === "string") {
          cols.push(`"${f}"`);
        } else if (typeof f === "object") {
          for (const key of Object.keys(f)) {
            cols.push(`"${key}"`);
          }
        }
      }
      return cols.length ? cols.join(", ") : "*";
    }

    return "*";
  }

  async find(collection, options = {}) {
    this.assertCollectionExists(collection);

    const { filter = {}, sort, fields, limit, page, populate } = options;
    const orderBy = this.convertSort(sort, collection);
    const skip = page && limit ? (page - 1) * limit : undefined;

    const mergedFilter = this._withDefaultFilter(collection, filter);
    const { clause, params } = this.convertFilters(mergedFilter, collection);
    const selectCols = this.convertFields(fields);

    let sql = `SELECT ${selectCols} FROM "${collection}"`;
    if (clause) sql += ` WHERE ${clause}`;
    if (orderBy) sql += ` ORDER BY ${orderBy}`;
    if (typeof limit === "number") sql += ` LIMIT ${limit}`;
    if (typeof skip === "number") sql += ` OFFSET ${skip}`;

    const rows = this.#db.prepare(sql).all(...params);

    let results = rows.map((row) => this.#reformatFromRow(collection, row));

    if (populate && typeof populate === "object") {
      results = await this.#populateRelations(results, collection, populate);
    }

    return results;
  }

  async findOne(collection, id, options = {}) {
    this.assertCollectionExists(collection);

    const { fields, populate } = options;
    const selectCols = this.convertFields(fields);

    const def = this.schemaRegistry.get(collection)?.defaultFilter;
    let sql;
    let sqlParams;

    if (def && Object.keys(def).length > 0) {
      const { clause, params } = this.convertFilters(def, collection);
      sql = `SELECT ${selectCols} FROM "${collection}" WHERE "id" = ?`;
      sqlParams = [String(id)];
      if (clause) {
        sql += ` AND ${clause}`;
        sqlParams.push(...params);
      }
    } else {
      sql = `SELECT ${selectCols} FROM "${collection}" WHERE "id" = ?`;
      sqlParams = [String(id)];
    }

    const row = this.#db.prepare(sql).get(...sqlParams);
    let doc = this.#reformatFromRow(collection, row);

    if (doc && populate && typeof populate === "object") {
      doc = await this.#populateRelations(doc, collection, populate);
    }

    return doc;
  }

  async findOneBy(collection, filter, options = {}) {
    this.assertCollectionExists(collection);

    const { fields, populate } = options;

    const mergedFilter = this._withDefaultFilter(collection, filter);
    const { clause, params } = this.convertFilters(mergedFilter, collection);
    const selectCols = this.convertFields(fields);

    let sql = `SELECT ${selectCols} FROM "${collection}"`;
    if (clause) sql += ` WHERE ${clause}`;
    sql += ` LIMIT 1`;

    const row = this.#db.prepare(sql).get(...params);
    let doc = this.#reformatFromRow(collection, row);

    if (doc && populate && typeof populate === "object") {
      doc = await this.#populateRelations(doc, collection, populate);
    }

    return doc;
  }

  async create(collection, data) {
    data = this._transformForSave(data);

    this.assertValid(collection, data);

    const { id: _providedId, ...rest } = data;
    const id = _providedId || randomUUID();

    const schemaFields = this.schemaRegistry.get(collection)?.fields || {};
    const doc = { ...rest, id };
    if (collection !== "files") {
      if ("date_created" in schemaFields) doc.date_created = new Date();
      if ("date_updated" in schemaFields) doc.date_updated = new Date();
    }

    const serialized = this.#reformatForWrite(collection, doc);
    const columns = Object.keys(serialized);
    const values = Object.values(serialized);
    const placeholders = columns.map(() => "?").join(", ");

    const sql = `INSERT INTO "${collection}" (${columns.map((c) => `"${c}"`).join(", ")}) VALUES (${placeholders})`;

    try {
      this.#db.prepare(sql).run(...values);
    } catch (err) {
      if (
        err.code === "SQLITE_CONSTRAINT_UNIQUE" ||
        err.message?.includes("UNIQUE constraint failed")
      ) {
        const match = err.message.match(/UNIQUE constraint failed: (\S+)/);
        const field = match ? match[1].split(".").pop() : "unknown";
        throw new ValidationError(collection, [
          `Field '${field}' must be unique; value already exists`,
        ]);
      }
      throw err;
    }

    return doc;
  }

  async update(collection, id, data) {
    data = this._transformForSave(data);

    this.assertValid(collection, data, { partial: true });

    const schemaFields = this.schemaRegistry.get(collection)?.fields || {};
    const updateData = { ...data };
    if ("date_updated" in schemaFields) updateData.date_updated = new Date();
    const serialized = this.#reformatForWrite(collection, updateData);
    const columns = Object.keys(serialized);
    const values = Object.values(serialized);
    const setClause = columns.map((c) => `"${c}" = ?`).join(", ");

    const sql = `UPDATE "${collection}" SET ${setClause} WHERE "id" = ?`;

    try {
      const result = this.#db.prepare(sql).run(...values, String(id));
      if (result.changes === 0) {
        throw new Error(`Document not found in ${collection}`);
      }
    } catch (err) {
      if (
        err.code === "SQLITE_CONSTRAINT_UNIQUE" ||
        err.message?.includes("UNIQUE constraint failed")
      ) {
        const match = err.message.match(/UNIQUE constraint failed: (\S+)/);
        const field = match ? match[1].split(".").pop() : "unknown";
        throw new ValidationError(collection, [
          `Field '${field}' must be unique; value already exists`,
        ]);
      }
      throw err;
    }

    const updatedRow = this.#db
      .prepare(`SELECT * FROM "${collection}" WHERE "id" = ?`)
      .get(String(id));
    return this.#reformatFromRow(collection, updatedRow);
  }

  async delete(collection, id) {
    this.assertCollectionExists(collection);
    const result = this.#db
      .prepare(`DELETE FROM "${collection}" WHERE "id" = ?`)
      .run(String(id));
    return result.changes > 0;
  }

  async count(collection, filter = {}) {
    this.assertCollectionExists(collection);

    const mergedFilter = this._withDefaultFilter(collection, filter);
    const { clause, params } = this.convertFilters(mergedFilter, collection);

    let sql = `SELECT COUNT(*) AS cnt FROM "${collection}"`;
    if (clause) sql += ` WHERE ${clause}`;

    const row = this.#db.prepare(sql).get(...params);
    return row?.cnt ?? 0;
  }

  async consumeOne(collection, filter) {
    this.assertCollectionExists(collection);

    const mergedFilter = this._withDefaultFilter(collection, filter);
    const { clause, params } = this.convertFilters(mergedFilter, collection);

    if (!clause) {
      throw new Error("consumeOne requires a non-empty filter");
    }

    const sql = `
      DELETE FROM "${collection}"
      WHERE rowid = (
        SELECT rowid
        FROM "${collection}"
        WHERE ${clause}
        LIMIT 1
      )
      RETURNING *
    `;

    const row = this.#db.prepare(sql).get(...params);
    return this.#reformatFromRow(collection, row);
  }

  async incrementOne(collection, filter, increment, set = {}) {
    this.assertCollectionExists(collection);

    if (
      (!increment || Object.keys(increment).length === 0) &&
      Object.keys(set).length === 0
    ) {
      throw new Error("incrementOne requires increment or set values");
    }

    const schema = this.schemaRegistry.get(collection);
    const setParts = [];
    const updateParams = [];

    for (const [field, delta] of Object.entries(increment || {})) {
      const definition = schema?.fields?.[field];

      if (!definition) {
        throw new Error(`Field '${field}' is not allowed`);
      }

      if (definition.primary || definition.type !== "number") {
        throw new Error(`Field '${field}' cannot be incremented`);
      }

      if (typeof delta !== "number" || !Number.isFinite(delta)) {
        throw new Error(`Increment for '${field}' must be finite`);
      }

      if (Object.hasOwn(set, field)) {
        throw new Error(
          `Field '${field}' cannot be incremented and set simultaneously`,
        );
      }

      setParts.push(`"${field}" = COALESCE("${field}", 0) + ?`);
      updateParams.push(delta);
    }

    const transformedSet = this._transformForSave(set);
    this.assertValid(collection, transformedSet, { partial: true });

    if (Object.hasOwn(transformedSet, "id")) {
      throw new Error("The primary key cannot be updated");
    }

    const setValues = { ...transformedSet };

    if (schema?.fields?.date_updated) {
      setValues.date_updated = new Date();
    }

    const serializedSet = this.#reformatForWrite(collection, setValues);

    for (const [field, value] of Object.entries(serializedSet)) {
      setParts.push(`"${field}" = ?`);
      updateParams.push(value);
    }

    const mergedFilter = this._withDefaultFilter(collection, filter);
    const { clause, params: filterParams } = this.convertFilters(
      mergedFilter,
      collection,
    );

    if (!clause) {
      throw new Error("incrementOne requires a non-empty filter");
    }

    const sql = `
      UPDATE "${collection}"
      SET ${setParts.join(", ")}
      WHERE rowid = (
        SELECT rowid
        FROM "${collection}"
        WHERE ${clause}
        LIMIT 1
      )
      RETURNING *
    `;

    const row = this.#db.prepare(sql).get(...updateParams, ...filterParams);

    return this.#reformatFromRow(collection, row);
  }

  async batch(queries) {
    if (!Array.isArray(queries)) {
      throw new Error("batch() expects an array of query descriptors");
    }

    return await Promise.all(
      queries.map(async (q) => {
        const {
          collection,
          op = "find",
          id,
          filter,
          sort,
          fields,
          limit,
          page,
          populate,
          as,
        } = q || {};
        const base = { collection, op };
        if (as !== undefined) base.as = as;

        if (!collection || typeof collection !== "string") {
          return {
            ...base,
            error: { status: 400, message: "collection is required" },
          };
        }
        if (
          op !== "find" &&
          op !== "findOne" &&
          op !== "count" &&
          op !== "delete"
        ) {
          return {
            ...base,
            error: { status: 400, message: `Unsupported op '${op}'` },
          };
        }

        try {
          if (op === "find") {
            const items = await this.find(collection, {
              filter,
              sort,
              fields,
              limit,
              page,
              populate,
            });
            return { ...base, items };
          }
          if (op === "findOne") {
            if (!filter || Object.keys(filter).length === 0) {
              return {
                ...base,
                error: {
                  status: 400,
                  message: "filter is required for findOne",
                },
              };
            }
            const item = await this.findOneBy(collection, filter, {
              fields,
              populate,
            });
            return { ...base, item };
          }
          if (op === "delete") {
            if (!id) {
              return {
                ...base,
                error: { status: 400, message: "id is required for delete" },
              };
            }
            const deleted = await this.delete(collection, id);
            return { ...base, deleted };
          }
          const count = await this.count(collection, filter || {});
          return { ...base, count };
        } catch (err) {
          return {
            ...base,
            error: { status: 500, message: err?.message || "Query failed" },
          };
        }
      }),
    );
  }

  async #populateRelations(items, collectionName, populateOptions) {
    return this.populationService.populateRelations(
      items,
      collectionName,
      populateOptions,
    );
  }

  supportsPopulation() {
    return true;
  }

  async findByIds(collection, ids) {
    if (!ids.length) return [];
    const placeholders = ids.map(() => "?").join(", ");
    const rows = this.#db
      .prepare(`SELECT * FROM "${collection}" WHERE "id" IN (${placeholders})`)
      .all(...ids.map(String));
    return rows
      .map((row) => this.#reformatFromRow(collection, row))
      .filter(Boolean);
  }

  async findByField(collection, field, values) {
    if (!values.length) return [];
    const placeholders = values.map(() => "?").join(", ");
    const rows = this.#db
      .prepare(
        `SELECT * FROM "${collection}" WHERE "${field}" IN (${placeholders})`,
      )
      .all(...values.map(String));
    return rows
      .map((row) => this.#reformatFromRow(collection, row))
      .filter(Boolean);
  }

  async findJunction(junction, localField, localIds) {
    if (!localIds.length) return [];
    const placeholders = localIds.map(() => "?").join(", ");
    const rows = this.#db
      .prepare(
        `SELECT * FROM "${junction}" WHERE "${localField}" IN (${placeholders})`,
      )
      .all(...localIds.map(String));
    return rows
      .map((row) => this.#reformatFromRow(junction, row))
      .filter(Boolean);
  }

  async findOneByIdWithFilter(collection, id, filter = {}) {
    const { clause, params } = this.convertFilters(filter, collection);
    let sql = `SELECT * FROM "${collection}" WHERE "id" = ?`;
    const sqlParams = [String(id)];
    if (clause) {
      sql += ` AND ${clause}`;
      sqlParams.push(...params);
    }
    const row = this.#db.prepare(sql).get(...sqlParams);
    return this.#reformatFromRow(collection, row);
  }
}

export default SQLiteAdapter;
