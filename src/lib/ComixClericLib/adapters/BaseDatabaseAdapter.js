import { collectionSchemas } from "../schemas/collections";
import { PopulationService } from "../services/PopulationService";
import { ObjectId } from "mongodb";

//Base class for all database adapters
export class BaseDatabaseAdapter {
  #schemas = {};

  constructor(config) {
    this.config = config;

    this.#schemas = { ...collectionSchemas };

    this.schemaRegistry = {
      register: this.#schemaRegister.bind(this),
      get: this.#schemaGet.bind(this),
      has: this.#schemaHas.bind(this),
      getAll: this.#schemaGetAll.bind(this),
    };

    this.populationService = new PopulationService(
      this,
      this.schemaRegistry,
    );

    if (this.constructor === BaseDatabaseAdapter) {
      throw new Error("BaseDatabaseAdapter is abstract and must be extended");
    }
  }

  // Apply the collection's schema-defined `defaultFilter` as a fallback.
  _withDefaultFilter(collection, userFilter) {
    const def = this.schemaRegistry.get(collection)?.defaultFilter;
    // User filter wins if present; default is a fallback only.
    if (userFilter && Object.keys(userFilter).length > 0) return userFilter;
    if (!def || Object.keys(def).length === 0) return {};
    return def;
  }

  //Transform populated relation objects back to their ID references before writing.
  _transformForSave(data) {
    if (data instanceof FormData) {
      const transformed = new FormData();

      for (const [key, value] of data.entries()) {
        if (value && typeof value === "object") {
          if (value instanceof File) {
            transformed.append(key, value);
          } else if ("id" in value || "_id" in value) {
            const id = value.id || value._id;
            transformed.append(key, id.toString());
          } else {
            try {
              transformed.append(key, JSON.stringify(value));
            } catch (e) {
              transformed.append(key, String(value));
            }
          }
        } else {
          transformed.append(key, value);
        }
      }

      return transformed;
    }

    if (!data || typeof data !== "object") {
      return data;
    }

    // Dates (and other non-plain objects) must pass through untouched.
    // Goodness was this an anoying bug to track down.
    if (data instanceof Date) {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map((item) => this._transformForSave(item));
    }

    const transformed = {};

    for (const [key, value] of Object.entries(data)) {
      if (value && typeof value === "object" && !Array.isArray(value)) {
        if ("id" in value || "_id" in value) {
          transformed[key] = value.id || value._id;
        } else {
          transformed[key] = this._transformForSave(value);
        }
      } else if (Array.isArray(value)) {
        transformed[key] = value.map((item) => {
          if (
            item &&
            typeof item === "object" &&
            ("id" in item || "_id" in item)
          ) {
            return item.id || item._id;
          }
          return item;
        });
      } else {
        transformed[key] = value;
      }
    }

    return transformed;
  }

  async connect() {
    throw new Error(
      `Adapter ${this.constructor.name} must implement connect()`,
    );
  }

  async disconnect() {
    throw new Error(
      `Adapter ${this.constructor.name} must implement disconnect()`,
    );
  }

  async ping() {
    throw new Error(`Adapter ${this.constructor.name} must implement ping()`);
  }

  async find(collection, options = {}) {
    throw new Error(`Adapter ${this.constructor.name} must implement find()`);
  }

  async findOne(collection, id, options = {}) {
    throw new Error(
      `Adapter ${this.constructor.name} must implement findOne()`,
    );
  }

  async findOneBy(collection, filter, options = {}) {
    throw new Error(
      `Adapter ${this.constructor.name} must implement findOneBy()`,
    );
  }

  async create(collection, data) {
    throw new Error(`Adapter ${this.constructor.name} must implement create()`);
  }

  async update(collection, id, data) {
    throw new Error(`Adapter ${this.constructor.name} must implement update()`);
  }

  async delete(collection, id) {
    throw new Error(`Adapter ${this.constructor.name} must implement delete()`);
  }

  // Additional utility methods
  async count(collection, filter = {}) {
    throw new Error(`Adapter ${this.constructor.name} must implement count()`);
  }

  async consumeOne(collection, filter, options = {}) {
    throw new Error(
      `Adapter ${this.constructor.name} must implement consumeOne()`,
    );
  }

  async incrementOne(collection, filter, increment, set = {}) {
    throw new Error(
      `Adapter ${this.constructor.name} must implement incrementOne()`,
    );
  }

  async batch(queries) {
    throw new Error(`Adapter ${this.constructor.name} must implement batch()`);
  }

  async exists(collection, filter) {
    const count = await this.count(collection, filter);
    return count > 0;
  }

  // PopulationDataProvider Interface (Optional)
  // If you want to use the populate function withing the above functions.
  // You will probably need to implement these methods.

  // Check if this adapter supports local population of relations.
  // If you want to support population set this to true and implement the required methods.
  supportsPopulation() {
    return false;
  }

  async findByIds(collection, ids) {
    throw new Error(
      `Adapter ${this.constructor.name} must implement findByIds() for population support`,
    );
  }

  async findByField(collection, field, values) {
    throw new Error(
      `Adapter ${this.constructor.name} must implement findByField() for population support`,
    );
  }

  async findJunction(junction, localField, localIds) {
    throw new Error(
      `Adapter ${this.constructor.name} must implement findJunction() for population support`,
    );
  }

  async findOneByIdWithFilter(collection, id, filter = {}) {
    throw new Error(
      `Adapter ${this.constructor.name} must implement findOneByIdWithFilter() for polymorphic population support`,
    );
  }

  // Schema management methods
  #schemaRegister(collectionName, schema) {
    this.#schemas[collectionName] = schema;
  }

  #schemaGet(collectionName) {
    return this.#schemas[collectionName];
  }

  #schemaHas(collectionName) {
    return collectionName in this.#schemas;
  }

  #schemaGetAll() {
    return { ...this.#schemas };
  }

  assertCollectionExists(collection, schemas) {
    const has = schemas ? collection in schemas : this.#schemaHas(collection);
    if (!has) {
      throw new UnknownCollectionError(collection);
    }
  }

  validateDocument(collection, document, options = {}) {
    this.assertCollectionExists(collection);

    const schema = this.#schemaGet(collection);
    const { partial = false } = options;
    const errors = [];

    for (const [fieldName, fieldDef] of Object.entries(schema.fields)) {
      const present = fieldName in document;
      const value = document[fieldName];

      if (
        !partial &&
        fieldDef.required &&
        (value === undefined || value === null)
      ) {
        errors.push(`Field '${fieldName}' is required`);
        continue;
      }

      if (!present || value === undefined || value === null) continue;
      if (fieldDef.primary) continue;

      const actualType = Array.isArray(value) ? "array" : typeof value;

      if (fieldDef.type === "date") {
        const ok =
          value instanceof Date ||
          (typeof value === "string" && !isNaN(Date.parse(value)));
        if (!ok) {
          errors.push(
            `Field '${fieldName}' must be of type date, got ${actualType}`,
          );
        }
        continue;
      }

      if (actualType !== fieldDef.type) {
        errors.push(
          `Field '${fieldName}' must be of type ${fieldDef.type}, got ${actualType}`,
        );
        continue;
      }

      // Enum: restrict string values to allowed set
      if (
        fieldDef.enum &&
        Array.isArray(fieldDef.enum) &&
        fieldDef.enum.length > 0
      ) {
        if (!fieldDef.enum.includes(value)) {
          errors.push(
            `Field '${fieldName}' must be one of ${fieldDef.enum.join(", ")}, got '${value}'`,
          );
        }
      }
    }

    for (const fieldName of Object.keys(document)) {
      if (!(fieldName in schema.fields)) {
        errors.push(`Field '${fieldName}' is not allowed`);
      }
    }

    return errors;
  }

  assertValid(collection, document, options = {}) {
    const errors = this.validateDocument(collection, document, options);
    if (errors.length > 0) {
      throw new ValidationError(collection, errors);
    }
  }

  async validateUnique(collection, database, document, excludeId) {
    this.assertCollectionExists(collection);

    const schema = this.#schemaGet(collection);
    const errors = [];

    const uniqueFields = Object.entries(schema.fields).filter(
      ([, def]) => def.unique && !def.primary,
    );
    if (uniqueFields.length === 0) return errors;

    let excludeObjectId;
    if (excludeId) {
      try {
        excludeObjectId = new ObjectId(excludeId);
      } catch {
        /* not an ObjectId */
      }
    }

    for (const [fieldName] of uniqueFields) {
      if (!(fieldName in document)) continue;
      const value = document[fieldName];
      if (value === undefined || value === null) continue;

      const query = { [fieldName]: value };
      if (excludeObjectId) {
        query._id = { $ne: excludeObjectId };
      } else if (excludeId) {
        query._id = { $ne: excludeId };
      }

      const existing = await database
        .collection(collection)
        .findOne(query, { projection: { _id: 1 } });

      if (existing) {
        errors.push(
          `Field '${fieldName}' must be unique; value already exists`,
        );
      }
    }

    return errors;
  }

  async assertUnique(collection, database, document, excludeId) {
    const errors = await this.validateUnique(
      collection,
      database,
      document,
      excludeId,
    );
    if (errors.length > 0) {
      throw new ValidationError(collection, errors);
    }
  }

  // Helper method to validate required methods are implemented
  validateImplementation() {
    const requiredMethods = [
      "connect",
      "disconnect",
      "find",
      "findOne",
      "create",
      "update",
      "delete",
      "count",
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

export class ValidationError extends Error {
  errors;
  collection;

  constructor(collection, errors) {
    super(`Validation failed for ${collection}: ${errors.join(", ")}`);
    this.name = "ValidationError";
    this.collection = collection;
    this.errors = errors;
  }
}

export class UnknownCollectionError extends Error {
  collection;

  constructor(collection) {
    super(`Unknown collection: '${collection}'`);
    this.name = "UnknownCollectionError";
    this.collection = collection;
  }
}
