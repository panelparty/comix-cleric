import { createAdapterFactory } from "better-auth/adapters";
import { betterAuth } from "better-auth";
import { env } from "$env/dynamic/private";
import { admin, username } from "better-auth/plugins";
import { usernameSchema } from "$lib/utils/validation/schema";

function convertWhere(where) {
  if (!where || !where.length) return {};

  const filter = {};

  for (const condition of where) {
    const { field, value, operator } = condition;
    const op = operator || "eq";

    switch (op) {
      case "eq":
        filter[field] = { _eq: value };
        break;
      case "ne":
        filter[field] = { _neq: value };
        break;
      case "gt":
        filter[field] = { _gt: value };
        break;
      case "gte":
        filter[field] = { _gte: value };
        break;
      case "lt":
        filter[field] = { _lt: value };
        break;
      case "lte":
        filter[field] = { _lte: value };
        break;
      case "in":
        filter[field] = { _in: value };
        break;
      case "contains":
        filter[field] = { _contains: value };
        break;
      case "starts_with":
        filter[field] = { _starts_with: value };
        break;
      case "ends_with":
        filter[field] = { _ends_with: value };
        break;
      default:
        filter[field] = { _eq: value };
    }
  }

  return filter;
}

function normalizeDoc(doc) {
  if (!doc) return null;
  if (doc._id) {
    doc.id = doc._id.toString();
  }
  return doc;
}

const comixClericAuthAdapter = (db) =>
  createAdapterFactory({
    adapter: ({}) => {
      return {
        findOne: async ({ model, where, select }) => {
          const filter = convertWhere(where);
          const fields = select || ["*"];
          const result = await db.findOneBy(model, filter, { fields });
          return normalizeDoc(result);
        },

        findMany: async ({ model, where, limit, sortBy, offset }) => {
          const filter = convertWhere(where);

          const page =
            offset && limit ? Math.floor(offset / limit) + 1 : undefined;

          const options = {
            filter,
            limit,
            page,
            sort: sortBy
              ? `${sortBy.direction === "desc" ? "-" : ""}${sortBy.field}`
              : undefined,
          };

          const results = await db.find(model, options);
          return (results || []).map(normalizeDoc);
        },

        create: async ({ data, model, select }) => {
          const { id, ...rest } = data;
          const result = await db.create(model, rest);
          return normalizeDoc(result);
        },

        update: async ({ model, where, update }) => {
          const filter = convertWhere(where);
          const existing = await db.findOneBy(model, filter);

          if (!existing) return null;

          const id = existing._id?.toString() || existing.id;
          const result = await db.update(model, id, update);
          return normalizeDoc(result);
        },

        updateMany: async ({ model, where, update }) => {
          const filter = convertWhere(where);
          const items = await db.find(model, { filter });

          let count = 0;
          for (const item of items) {
            const id = item._id?.toString() || item.id;
            await db.update(model, id, update);
            count++;
          }

          return count;
        },

        delete: async ({ model, where }) => {
          const filter = convertWhere(where);
          const existing = await db.findOneBy(model, filter);

          if (!existing) return;

          const id = existing._id?.toString() || existing.id;
          await db.delete(model, id);
        },

        deleteMany: async ({ model, where }) => {
          const filter = convertWhere(where);
          const items = await db.find(model, { filter });

          let count = 0;
          for (const item of items) {
            const id = item._id?.toString() || item.id;
            await db.delete(model, id);
            count++;
          }

          return count;
        },

        count: async ({ model, where }) => {
          const filter = convertWhere(where);
          return await db.count(model, filter);
        },
        
        consumeOne: async ({ model, where }) => {
          const filter = convertWhere(where);
          const result = await db.consumeOne(model, filter);
          return normalizeDoc(result);
        },

        incrementOne: async ({ model, where, increment, set }) => {
          const filter = convertWhere(where);
          const result = await db.incrementOne(
            model,
            filter,
            increment,
            set || {},
          );
          return normalizeDoc(result);
        },
      };
    },
    config: {
      adapterId: "comix-cleric-adapter",
      adapterName: "Comix Cleric Adapter",
      usePlural: false,
      debugLogs: false,
      supportsJSON: false,
      supportsDates: true,
      supportsBooleans: true,
      supportsNumericIds: false,
    },
  });

export { comixClericAuthAdapter };

export function createAuth(db, emailAdapter, origin = "http://localhost:3366") {
  return betterAuth({
    database: comixClericAuthAdapter(db),
    plugins: [
      admin(),
      username({
        minUsernameLength: 3,
        maxUsernameLength: 24,
        usernameValidator: (u) => usernameSchema.safeParse(u).success,
        displayUsername: false,
      }),
    ],
    baseURL: origin,
    basePath: "/api/auth",
    secret: env.COMIX_CLERIC_SECRET,

    emailAndPassword: {
      enabled: true,
      requireEmailVerification: env.EMAIL_API_KEY ?? false,
      resetPasswordTokenExpiresIn: 60 * 60, // 1 hour
      ...(emailAdapter && {
        sendResetPassword: async ({ user, url, token }) => {
          await emailAdapter.sender({
            type: "password-reset",
            to: user.email,
            url,
            token,
          });
        },
      }),
    },

    emailVerification: {
      ...(emailAdapter && {
        sendVerificationEmail: async ({ user, url, token }) => {
          await emailAdapter.sender({
            type: "verification",
            to: user.email,
            url,
            token,
          });
        },
      }),
      sendOnSignUp: env.EMAIL_API_KEY ?? false,
    },

    session: {
      expiresIn: 60 * 60 * 24,
      updateAge: 60 * 60,
      cookieCache: {
        enabled: true,
        maxAge: 60 * 60 * 24,
      },
    },

    rateLimit: {
      enabled: true,
      window: 60,
      max: 100,
      customRules: {
        "/sign-in/email": { window: 60, max: 10 },
        "/sign-up/email": { window: 60, max: 5 },
        "/request-password-reset": { window: 60, max: 5 },
      },
    },

    user: {
      additionalFields: {
        displayname: {
          type: "string",
          required: false,
          input: true,
        },
        avatar: {
          type: "string",
          required: false,
          input: true,
        }
      },
      changeEmail: {
        enabled: true,
        sendChangeEmailVerification: async (
          { user, newEmail, url, token },
          request,
        ) => {
          await emailAdapter.sender({
            type: "verification",
            to: user.email,
            url,
            token,
          });
        },
      },
      deleteUser: {
        enabled: true,
      },
    },

    trustedOrigins: [
      origin,
      "http://localhost:3366",
      "http://localhost:5173",
    ],

    advanced: {
      cookiePrefix: "cc_auth",
    },
  });
}
