import { BaseDatabaseAdapter } from "./BaseDatabaseAdapter.js";
import { MongoClient, ObjectId } from "mongodb";
import { env } from "$env/dynamic/private";
import { consoleError, consoleLog } from "$lib/utils/debug.js";

/**
 * MongoDB adapter implementation
 */
export class MongoAdapter extends BaseDatabaseAdapter {
  #connectionPromise = null;

  static requiredEnvVars = ["MONGODB_URI", "MONGODB_DATABASE"];

  constructor(config) {
    super(config);
    this.client = null;
    this.db = null;
    this.uri = env.MONGODB_URI;
    this.databaseName = env.MONGODB_DATABASE;
    this.#connectionPromise = this.connect();
  }

  async connect() {
    try {
      this.client = new MongoClient(this.uri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      await this.client.connect();
      this.db = this.client.db(this.databaseName);
      await this.db.admin().ping();
      consoleLog(`Connected to MongoDB database: ${this.databaseName}`);
    } catch (error) {
      consoleError("Failed to connect to MongoDB: ", error);
      throw error;
    }
  }

  async #ensureConnected() {
    if (!this.db) {
      await this.#connectionPromise;
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
      consoleLog("Disconnected from MongoDB");
    }
  }

  async ping() {
    await this.#ensureConnected();
    return await this.db.admin().ping();
  }

  /**
   * Find multiple documents
   */
  async find(collection, options = {}) {
    await this.#ensureConnected();
    this.assertCollectionExists(collection);

    const { filter = {}, sort, fields, limit, page, populate } = options;
    const skip = page && limit ? (page - 1) * limit : undefined;

    const mongoFilter = this.convertFilters(
      this._withDefaultFilter(collection, filter),
      collection,
    );
    const mongoSort = this.convertSort(sort);
    const mongoProjection = this.convertFields(fields);

    let cursor = this.db.collection(collection).find(mongoFilter);

    if (mongoSort) cursor = cursor.sort(mongoSort);
    if (typeof limit === "number") cursor = cursor.limit(limit);
    if (typeof skip === "number") cursor = cursor.skip(skip);
    if (mongoProjection) cursor = cursor.project(mongoProjection);

    const results = await cursor.toArray();

    let processedResults = results.map((doc) => {
      const { _id, ...rest } = doc;
      return {
        ...rest,
        id: _id.toString(),
      };
    });

    if (populate && typeof populate === "object") {
      processedResults = await this.#populateRelations(
        processedResults,
        collection,
        populate,
      );
    }

    return processedResults;
  }

  /**
   * Find a single document by ID
   */
  async findOne(collection, id, options = {}) {
    await this.#ensureConnected();
    this.assertCollectionExists(collection);

    const { fields, populate } = options;
    const mongoProjection = this.convertFields(fields);

    const objectId = typeof id === "string" ? this.#toObjectId(id) : id;
    if (typeof objectId === "string") {
      return null;
    }

    const def = this.schemaRegistry.get(collection)?.defaultFilter;
    const idCondition = { _id: objectId };
    const mongoFilter =
      def && Object.keys(def).length > 0
        ? { $and: [idCondition, this.convertFilters(def, collection)] }
        : idCondition;

    let doc = await this.db
      .collection(collection)
      .findOne(mongoFilter, { projection: mongoProjection });

    if (doc) {
      const { _id, ...rest } = doc;
      doc = {
        ...rest,
        id: _id.toString(),
      };

      if (populate && typeof populate === "object") {
        doc = await this.#populateRelations(doc, collection, populate);
      }
    }

    return doc;
  }

  /**
   * Find a single document by filter
   */
  async findOneBy(collection, filter, options = {}) {
    await this.#ensureConnected();
    this.assertCollectionExists(collection);

    const { fields, populate } = options;
    const mongoFilter = this.convertFilters(
      this._withDefaultFilter(collection, filter),
      collection,
    );
    const mongoProjection = this.convertFields(fields);

    let doc = await this.db
      .collection(collection)
      .findOne(mongoFilter, { projection: mongoProjection });

    if (doc) {
      const { _id, ...rest } = doc;
      doc = {
        ...rest,
        id: _id.toString(),
      };

      if (populate && typeof populate === "object") {
        doc = await this.#populateRelations(doc, collection, populate);
      }
    }

    return doc;
  }

  /**
   * Create a new document
   */
  async create(collection, data) {
    await this.#ensureConnected();

    data = this._transformForSave(data);

    await this.assertValid(collection, data);

    await this.assertUnique(collection, this.db, data);

    const { id: _providedId, ...dataWithoutId } = data;
    const coerced = this.#coerceReferenceFields(collection, dataWithoutId);

    const schemaFields = this.schemaRegistry.get(collection)?.fields || {};
    const doc = { ...coerced };
    if (collection !== "files") {
      if ("date_created" in schemaFields) doc.date_created = new Date();
      if ("date_updated" in schemaFields) doc.date_updated = new Date();
    }

    const result = await this.db.collection(collection).insertOne(doc);

    const { _id: _insertedId, ...rest } = doc;
    return {
      ...rest,
      id: result.insertedId.toString(),
    };
  }

  /**
   * Update a document
   */
  async update(collection, id, data) {
    await this.#ensureConnected();

    data = this._transformForSave(data);

    await this.assertValid(collection, data, { partial: true });

    await this.assertUnique(collection, this.db, data, String(id));

    const objectId = typeof id === "string" ? this.#toObjectId(id) : id;
    if (typeof objectId === "string") {
      throw new Error(`Document not found in ${collection}`);
    }
    const coerced = this.#coerceReferenceFields(collection, data);

    const updateDoc = {
      $set: {
        ...coerced,
        date_updated: new Date(),
      },
    };

    const result = await this.db
      .collection(collection)
      .findOneAndUpdate({ _id: objectId }, updateDoc, {
        returnDocument: "after",
      });

    const updated = result.value || result;

    if (!updated || !updated._id) {
      throw new Error(`Document not found in ${collection}`);
    }

    const { _id, ...rest } = updated;
    return {
      ...rest,
      id: _id.toString(),
    };
  }

  /**
   * Delete a document
   */
  async delete(collection, id) {
    await this.#ensureConnected();
    this.assertCollectionExists(collection);

    const objectId = typeof id === "string" ? this.#toObjectId(id) : id;
    if (typeof objectId === "string") {
      return false;
    }

    const result = await this.db
      .collection(collection)
      .deleteOne({ _id: objectId });

    return result.deletedCount > 0;
  }

  /**
   * Count documents matching filter
   */
  async count(collection, filter = {}) {
    await this.#ensureConnected();
    this.assertCollectionExists(collection);

    const mongoFilter = this.convertFilters(
      this._withDefaultFilter(collection, filter),
      collection,
    );

    return await this.db.collection(collection).countDocuments(mongoFilter);
  }

  async consumeOne(collection, filter) {
    await this.#ensureConnected();
    this.assertCollectionExists(collection);

    const mongoFilter = this.convertFilters(
      this._withDefaultFilter(collection, filter),
      collection,
    );

    if (!mongoFilter || Object.keys(mongoFilter).length === 0) {
      throw new Error("consumeOne requires a non-empty filter");
    }

    const deleted = await this.db
      .collection(collection)
      .findOneAndDelete(mongoFilter);

    if (!deleted) return null;

    const { _id, ...rest } = deleted;
    return {
      ...rest,
      id: _id.toString(),
    };
  }

  async incrementOne(collection, filter, increment, set = {}) {
    await this.#ensureConnected();
    this.assertCollectionExists(collection);

    if (
      (!increment || Object.keys(increment).length === 0) &&
      Object.keys(set).length === 0
    ) {
      throw new Error("incrementOne requires increment or set values");
    }

    const schema = this.schemaRegistry.get(collection);

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
    }

    const transformedSet = this.#coerceReferenceFields(
      collection,
      this._transformForSave(set),
    );

    await this.assertValid(collection, transformedSet, { partial: true });

    const mongoFilter = this.convertFilters(
      this._withDefaultFilter(collection, filter),
      collection,
    );

    if (!mongoFilter || Object.keys(mongoFilter).length === 0) {
      throw new Error("incrementOne requires a non-empty filter");
    }

    const updateDocument = {};

    if (Object.keys(increment).length > 0) {
      updateDocument.$inc = increment;
    }

    const setValues = { ...transformedSet };

    if (schema?.fields?.date_updated) {
      setValues.date_updated = new Date();
    }

    if (Object.keys(setValues).length > 0) {
      updateDocument.$set = setValues;
    }

    const updated = await this.db
      .collection(collection)
      .findOneAndUpdate(mongoFilter, updateDocument, {
        returnDocument: "after",
      });

    if (!updated) return null;

    const { _id, ...rest } = updated;
    return {
      ...rest,
      id: _id.toString(),
    };
  }

  /**
   * Execute multiple independent read queries in parallel against the local MongoDB.
   */
  async batch(queries) {
    await this.#ensureConnected();
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

  #coerceReferenceFields(collection, data) {
    if (!data || typeof data !== "object") return data;
    const schema = this.schemaRegistry.get(collection);
    if (!schema?.fields) return data;

    const out = { ...data };
    for (const [field, def] of Object.entries(schema.fields)) {
      if (!def?.reference) continue;
      const v = out[field];
      if (typeof v === "string") {
        try {
          out[field] = new ObjectId(v);
        } catch {}
      } else if (Array.isArray(v)) {
        out[field] = v.map((x) => {
          if (typeof x !== "string") return x;
          try {
            return new ObjectId(x);
          } catch {
            return x;
          }
        });
      }
    }
    return out;
  }

  /**
   * Convert Directus-style filters to MongoDB filters.
   */
  convertFilters(filter, collection) {
    if (!filter || typeof filter !== "object") return {};

    const schema = collection ? this.schemaRegistry.get(collection) : null;
    const isReferenceField = (key) => !!schema?.fields?.[key]?.reference;
    const toObjectId = (v) => {
      if (typeof v !== "string") return v;
      try {
        return new ObjectId(v);
      } catch {
        return v;
      }
    };

    const mongoFilter = {};

    for (const [key, value] of Object.entries(filter)) {
      if (key === "id" && !filter.hasOwnProperty("_id")) {
        if (
          typeof value === "object" &&
          !Array.isArray(value) &&
          value !== null
        ) {
          const hasOperators = Object.keys(value).some((k) =>
            k.startsWith("_"),
          );

          if (hasOperators) {
            const mongoOps = {};
            for (const [op, val] of Object.entries(value)) {
              switch (op) {
                case "_eq":
                  mongoOps.$eq =
                    typeof val === "string" ? new ObjectId(val) : val;
                  break;
                case "_neq":
                  mongoOps.$ne =
                    typeof val === "string" ? new ObjectId(val) : val;
                  break;
                case "_in":
                  mongoOps.$in = Array.isArray(val)
                    ? val.map((id) =>
                        typeof id === "string" ? new ObjectId(id) : id,
                      )
                    : [typeof val === "string" ? new ObjectId(val) : val];
                  break;
                case "_nin":
                  mongoOps.$nin = Array.isArray(val)
                    ? val.map((id) =>
                        typeof id === "string" ? new ObjectId(id) : id,
                      )
                    : [typeof val === "string" ? new ObjectId(val) : val];
                  break;
                default:
                  mongoOps[op.replace("_", "$")] = val;
              }
            }
            mongoFilter._id = mongoOps;
          } else {
            mongoFilter._id = value;
          }
        } else {
          mongoFilter._id =
            typeof value === "string" ? new ObjectId(value) : value;
        }
      } else if (
        typeof value === "object" &&
        !Array.isArray(value) &&
        value !== null
      ) {
        const hasOperators = Object.keys(value).some((k) => k.startsWith("_"));

        if (hasOperators) {
          const mongoOps = {};
          const coerce = isReferenceField(key) ? toObjectId : (v) => v;
          for (const [op, val] of Object.entries(value)) {
            switch (op) {
              case "_eq":
                mongoOps.$eq = coerce(val);
                break;
              case "_neq":
                mongoOps.$ne = coerce(val);
                break;
              case "_lt":
                mongoOps.$lt = val;
                break;
              case "_lte":
                mongoOps.$lte = val;
                break;
              case "_gt":
                mongoOps.$gt = val;
                break;
              case "_gte":
                mongoOps.$gte = val;
                break;
              case "_in":
                mongoOps.$in = (Array.isArray(val) ? val : [val]).map(coerce);
                break;
              case "_nin":
                mongoOps.$nin = (Array.isArray(val) ? val : [val]).map(coerce);
                break;
              case "_contains":
                mongoOps.$regex = val;
                mongoOps.$options = "i";
                break;
              case "_starts_with":
                mongoOps.$regex = `^${val}`;
                mongoOps.$options = "i";
                break;
              case "_ends_with":
                mongoOps.$regex = `${val}$`;
                mongoOps.$options = "i";
                break;
              case "_null":
                mongoOps.$exists = false;
                break;
              case "_nnull":
                mongoOps.$exists = true;
                break;
              case "_between":
                if (Array.isArray(val) && val.length === 2) {
                  mongoOps.$gte = val[0];
                  mongoOps.$lte = val[1];
                }
                break;
            }
          }
          mongoFilter[key] = mongoOps;
        } else {
          mongoFilter[key] = value;
        }
      } else if (isReferenceField(key) && typeof value === "string") {
        mongoFilter[key] = toObjectId(value);
      } else if (key.includes(".")) {
        const keys = key.split(".");
        let current = mongoFilter;

        for (let i = 0; i < keys.length - 1; i++) {
          if (!current[keys[i]]) current[keys[i]] = {};
          current = current[keys[i]];
        }

        current[keys[keys.length - 1]] = value;
      } else {
        mongoFilter[key] = value;
      }
    }

    return mongoFilter;
  }

  /**
   * Convert Directus sort to MongoDB sort
   */
  convertSort(sort) {
    if (!sort) return null;

    if (typeof sort === "string") {
      const direction = sort.startsWith("-") ? -1 : 1;
      const field = sort.startsWith("-") ? sort.substring(1) : sort;
      return { [field]: direction };
    }

    if (Array.isArray(sort)) {
      // Handle Directus-style array sort like ["-date_created", "name"]
      const result = {};
      for (const entry of sort) {
        if (typeof entry !== "string") continue;
        const direction = entry.startsWith("-") ? -1 : 1;
        const field = entry.startsWith("-") ? entry.substring(1) : entry;
        result[field] = direction;
      }
      return Object.keys(result).length ? result : null;
    }

    if (typeof sort === "object") {
      return sort;
    }

    return null;
  }

  /**
   * Convert Directus fields to MongoDB projection
   */
  convertFields(fields) {
    if (!fields) return null;

    if (Array.isArray(fields)) {
      if (fields.includes("*")) {
        return null;
      }

      const projection = {};
      for (const field of fields) {
        if (typeof field === "string") {
          projection[field] = 1;
        } else if (typeof field === "object") {
          for (const [key, value] of Object.entries(field)) {
            if (Array.isArray(value)) {
              projection[key] = 1;
              for (const subField of value) {
                projection[`${key}.${subField}`] = 1;
              }
            }
          }
        }
      }
      return projection;
    }

    return fields;
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

  #toObjectId(id) {
    try {
      return new ObjectId(id);
    } catch {
      return id;
    }
  }

  #normalizeDoc(doc) {
    if (!doc) return null;
    const { _id, ...rest } = doc;
    return { ...rest, id: _id?.toString() };
  }

  async findByIds(collection, ids) {
    await this.#ensureConnected();
    const objectIds = ids.map((id) => this.#toObjectId(id));
    const docs = await this.db
      .collection(collection)
      .find({ _id: { $in: objectIds } })
      .toArray();
    return docs.map((doc) => this.#normalizeDoc(doc)).filter(Boolean);
  }

  async findByField(collection, field, values) {
    await this.#ensureConnected();
    const docs = await this.db
      .collection(collection)
      .find({ [field]: { $in: values } })
      .toArray();
    return docs.map((doc) => this.#normalizeDoc(doc)).filter(Boolean);
  }

  async findJunction(junction, localField, localIds) {
    await this.#ensureConnected();
    const docs = await this.db
      .collection(junction)
      .find({ [localField]: { $in: localIds } })
      .toArray();
    return docs.map((doc) => {
      const normalized = this.#normalizeDoc(doc);
      // Also normalize common foreign key fields that might be ObjectIds
      for (const key of Object.keys(doc)) {
        if (key.endsWith("_id") && doc[key] instanceof ObjectId) {
          normalized[key] = doc[key].toString();
        }
      }
      return normalized;
    });
  }

  async findOneByIdWithFilter(collection, id, filter = {}) {
    await this.#ensureConnected();
    const objectId = this.#toObjectId(id);
    const mongoFilter = { _id: objectId, ...filter };
    const doc = await this.db.collection(collection).findOne(mongoFilter);
    return this.#normalizeDoc(doc);
  }
}

export default MongoAdapter;
