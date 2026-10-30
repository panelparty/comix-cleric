/**
 * Database-agnostic population service for resolving relations.
 */
export class PopulationService {
  #provider;

  constructor(provider, schemaRegistryInstance) {
    this.#provider = provider;
    this.schemaRegistry = schemaRegistryInstance;
  }

  /**
   * Determine the relation type for a given collection + field
   */
  getRelationType(collection, field) {
    const schema = this.schemaRegistry.get(collection);

    if (schema?.relations && field in schema.relations) {
      return schema.relations[field].type || "belongsTo";
    }

    return "belongsTo";
  }

  /**
   * Apply nested population to an array of docs
   */
  async applyNestedPopulate(docs, foreignCollection, nestedPopulate) {
    if (!nestedPopulate || typeof nestedPopulate !== "object") return docs;
    return Promise.all(
      docs.map((doc) =>
        doc && typeof doc === "object"
          ? this.populateRelations(doc, foreignCollection, nestedPopulate)
          : doc,
      ),
    );
  }

  /**
   * Populate relations for documents
   */
  async populateRelations(items, collectionName, populateOptions) {
    const isArray = Array.isArray(items);
    const itemsArray = isArray ? items : [items];

    if (itemsArray.length === 0) return isArray ? [] : null;

    let result = itemsArray;

    for (const [field, nestedPopulate] of Object.entries(populateOptions)) {
      if (
        nestedPopulate === true ||
        nestedPopulate === 1 ||
        (nestedPopulate && typeof nestedPopulate === "object")
      ) {
        const nested =
          nestedPopulate === true || nestedPopulate === 1
            ? null
            : nestedPopulate;
        const relationType = this.getRelationType(collectionName, field);

        switch (relationType) {
          case "hasManyArray":
            result = await this.populateHasManyArray(
              result,
              collectionName,
              field,
              nested,
            );
            break;
          case "hasMany":
            result = await this.populateHasMany(
              result,
              collectionName,
              field,
              nested,
            );
            break;
          case "hasManyThrough":
            result = await this.populateHasManyThrough(
              result,
              collectionName,
              field,
              nested,
            );
            break;
          case "hasManyPolymorphic":
            result = await this.populateHasManyPolymorphic(
              result,
              collectionName,
              field,
              nested,
            );
            break;
          default:
            result = await this.populateBelongsTo(
              result,
              collectionName,
              field,
              nested,
            );
            break;
        }
      }
    }

    return isArray ? result : result[0];
  }

  /**
   * Populate belongs-to relations
   */
  async populateBelongsTo(items, collectionName, field, nestedPopulate = null) {
    let localKey = field;
    let foreignCollection = field.endsWith("s") ? field.slice(0, -1) : field;
    const schema = this.schemaRegistry.get(collectionName);

    if (schema?.relations && field in schema.relations) {
      const relation = schema.relations[field];
      if (relation.localKey) localKey = relation.localKey;
      if (relation.foreignKey && relation.foreignKey.includes(".")) {
        foreignCollection = relation.foreignKey.split(".")[0];
      }
    }

    const foreignKeys = items
      .map((item) => item[localKey]?.toString())
      .filter((key) => key != null);

    if (foreignKeys.length === 0) return items;

    const uniqueKeys = [...new Set(foreignKeys)];

    const relatedDocs = await this.#provider.findByIds(
      foreignCollection,
      uniqueKeys,
    );
    const docMap = new Map(relatedDocs.map((doc) => [doc.id, doc]));

    return Promise.all(
      items.map(async (item) => {
        const foreignKeyValue = item[localKey]?.toString();
        if (!foreignKeyValue || !docMap.has(foreignKeyValue)) return item;
        const populatedDoc = nestedPopulate
          ? await this.populateRelations(
              docMap.get(foreignKeyValue),
              foreignCollection,
              nestedPopulate,
            )
          : docMap.get(foreignKeyValue);
        return { ...item, [field]: populatedDoc };
      }),
    );
  }

  /**
   * Populate has-many relations (reverse lookup)
   */
  async populateHasMany(items, collectionName, field, nestedPopulate = null) {
    const schema = this.schemaRegistry.get(collectionName);
    const relation = schema?.relations?.[field];
    if (!relation) return items;

    const foreignKey = relation.foreignKey;
    let foreignCollection;
    let foreignField;
    if (foreignKey.includes(".")) {
      [foreignCollection, foreignField] = foreignKey.split(".");
    } else {
      foreignCollection = field.endsWith("s") ? field.slice(0, -1) : field;
      foreignField = collectionName;
    }

    const localKey = relation.localKey || "id";
    const localIds = items
      .map((item) => item[localKey])
      .filter((id) => id != null);
    if (localIds.length === 0) return items;

    const localStringIds = localIds.map((id) => id?.toString()).filter(Boolean);

    const foreignDocs = await this.#provider.findByField(
      foreignCollection,
      foreignField,
      localStringIds,
    );

    const foreignDocMap = new Map();
    foreignDocs.forEach((doc) => {
      const referenceId = doc[foreignField]?.toString();
      if (referenceId) {
        if (!foreignDocMap.has(referenceId)) foreignDocMap.set(referenceId, []);
        foreignDocMap.get(referenceId).push(doc);
      }
    });

    return Promise.all(
      items.map(async (item) => {
        const localId = item[localKey]?.toString();
        const relatedDocs = foreignDocMap.get(localId) || [];
        const resolved = await this.applyNestedPopulate(
          relatedDocs,
          foreignCollection,
          nestedPopulate,
        );
        return { ...item, [field]: resolved };
      }),
    );
  }

  /**
   * Populate has-many-array relations (local field is an array of IDs)
   */
  async populateHasManyArray(
    items,
    collectionName,
    field,
    nestedPopulate = null,
  ) {
    const allIds = items
      .flatMap((item) => (Array.isArray(item[field]) ? item[field] : []))
      .filter((id) => id != null);
    if (allIds.length === 0) return items;

    const uniqueIds = [...new Set(allIds)];

    let foreignCollection = field.endsWith("s") ? field.slice(0, -1) : field;
    const schema = this.schemaRegistry.get(collectionName);
    const relation = schema?.relations?.[field];
    if (relation?.foreignKey) {
      foreignCollection = relation.foreignKey.split(".")[0];
    }

    const relatedDocs = await this.#provider.findByIds(
      foreignCollection,
      uniqueIds,
    );
    const docMap = new Map(relatedDocs.map((doc) => [doc.id, doc]));

    return Promise.all(
      items.map(async (item) => {
        if (!Array.isArray(item[field])) return item;
        const populated = item[field].map((id) => docMap.get(id) || id);
        const resolved = await this.applyNestedPopulate(
          populated,
          foreignCollection,
          nestedPopulate,
        );
        return { ...item, [field]: resolved };
      }),
    );
  }

  /**
   * Populate has-many-through relations (junction table)
   */
  async populateHasManyThrough(
    items,
    collectionName,
    field,
    nestedPopulate = null,
  ) {
    const schema = this.schemaRegistry.get(collectionName);
    const relation = schema?.relations?.[field];
    if (!relation || !relation.junction) {
      throw new Error(`Junction table not specified for ${field} relation`);
    }

    const junctionCollection = relation.junction;
    const foreignCollection = field.endsWith("s") ? field.slice(0, -1) : field;
    const localKey = relation.localKey || "id";
    const foreignKey = relation.foreignKey || `${foreignCollection}_id`;

    const localIds = items
      .map((item) => item[localKey])
      .filter((id) => id != null);
    if (localIds.length === 0) return items;

    const localStringIds = localIds.map((id) => id?.toString()).filter(Boolean);

    const junctionRecords = await this.#provider.findJunction(
      junctionCollection,
      `${collectionName}_id`,
      localStringIds,
    );

    const foreignIds = junctionRecords
      .map((record) => record[foreignKey])
      .filter((id) => id != null);
    if (foreignIds.length === 0) return items;

    const foreignUniqueIds = [...new Set(foreignIds)];
    const foreignDocs = await this.#provider.findByIds(
      foreignCollection,
      foreignUniqueIds,
    );
    const foreignDocMap = new Map(foreignDocs.map((doc) => [doc.id, doc]));

    const junctionMap = new Map();
    junctionRecords.forEach((record) => {
      const localId = record[`${collectionName}_id`]?.toString();
      const foreignId = record[foreignKey]?.toString();
      if (localId && foreignId) {
        if (!junctionMap.has(localId)) junctionMap.set(localId, []);
        junctionMap.get(localId).push(foreignId);
      }
    });

    return Promise.all(
      items.map(async (item) => {
        const localId = item[localKey]?.toString();
        const populated = (junctionMap.get(localId) || [])
          .map((id) => foreignDocMap.get(id) || id)
          .filter((doc) => doc !== null);
        const resolved = await this.applyNestedPopulate(
          populated,
          foreignCollection,
          nestedPopulate,
        );
        return { ...item, [field]: resolved };
      }),
    );
  }

  /**
   * Populate has-many-polymorphic relations (junction table with type discriminator)
   */
  async populateHasManyPolymorphic(
    items,
    collectionName,
    field,
    nestedPopulate = null,
  ) {
    const schema = this.schemaRegistry.get(collectionName);
    const relation = schema?.relations?.[field];
    if (!relation || !relation.junction) {
      throw new Error(
        `Junction table not specified for ${field} polymorphic relation`,
      );
    }

    const junctionCollection = relation.junction;
    const polymorphicTypeField = relation.polymorphicType || "post_type";
    const localKey = relation.localKey || "id";
    const foreignKey = relation.foreignKey || "post_id";

    const localIds = items
      .map((item) => item[localKey])
      .filter((id) => id != null);
    if (localIds.length === 0) return items;

    // Fetch junction records with polymorphic type filter
    const junctionRecords = await this.#provider.findJunction(
      junctionCollection,
      foreignKey,
      localIds.map((id) => id?.toString()).filter(Boolean),
    );

    // Filter by polymorphic type at application level (adapter may not support complex filters)
    const filteredRecords = junctionRecords.filter(
      (record) => record[polymorphicTypeField] === collectionName,
    );

    const junctionMap = new Map();
    filteredRecords.forEach((record) => {
      const localId = record[foreignKey]?.toString();
      if (localId) {
        if (!junctionMap.has(localId)) junctionMap.set(localId, []);
        junctionMap.get(localId).push(record);
      }
    });

    const populatedItems = await Promise.all(
      items.map(async (item) => {
        const localId = item[localKey]?.toString();
        const records = junctionMap.get(localId) || [];

        const populatedArray = [];

        for (const junctionRecord of records) {
          const postType = junctionRecord[polymorphicTypeField];
          const userId = junctionRecord.user_id;
          const guestId = junctionRecord.guest_id;

          // The actual collection names in the database are singular (user, guests)
          const contributorCollection = userId ? "user" : "guests";
          const contributorId = userId || guestId;

          if (contributorId && this.#provider.findOneByIdWithFilter) {
            try {
              const contributorDoc = await this.#provider.findOneByIdWithFilter(
                contributorCollection,
                contributorId,
              );

              if (contributorDoc) {
                const populatedDoc = {
                  ...contributorDoc,
                  _junction: {
                    post_type: postType,
                    order_id: junctionRecord.order_id,
                    date_created: junctionRecord.date_created,
                    date_published: junctionRecord.date_published,
                  },
                };

                if (nestedPopulate && typeof nestedPopulate === "object") {
                  const populatedData = await this.populateRelations(
                    contributorDoc,
                    contributorCollection,
                    nestedPopulate,
                  );
                  if (populatedData && typeof populatedData === "object") {
                    const { _populated, ...cleanPopulatedData } = populatedData;
                    Object.assign(populatedDoc, cleanPopulatedData);
                  }
                }

                populatedArray.push(populatedDoc);
              }
            } catch {
              // skip invalid IDs
            }
          }
        }

        populatedArray.sort((a, b) => {
          const aOrder = a._junction?.order_id || 0;
          const bOrder = b._junction?.order_id || 0;
          return aOrder - bOrder;
        });

        return { ...item, [field]: populatedArray };
      }),
    );

    return populatedItems;
  }
}

export default PopulationService;
