// -- Server-side auth checks and user data helpers -- //

// Imports
import { error } from "@sveltejs/kit";
import { cloneDeepWith, findIndex, isPlainObject } from "lodash-es";
import { toastSuccess, toastError } from "$lib/utils/toast.js";

// Returns a status filter for published-only content, or nothing if the user is an admin.
// Used when querying posts admins see everything, public users see only published items.
export function checkStatus(req) {
  if (req?.isAdmin) {
    return;
  }

  return {
    status: {
      _eq: "published",
    },
  };
}

// Throws a 400 error if the current user is not an admin.
export function checkAdmin(req) {
  if (!req?.isAdmin) {
    throw error(400, "You are not authorized to use this functionality or it does not exist.");
  }
}

// Throws a 400 error if the current user is not an admin.
export function checkUser(req) {
  if (!req?.user) {
    throw error(400, "You are not authorized to use this functionality or it does not exist.");
  }
}

// Returns true if a user has a role matching the target name.
export function checkRole(roles, target) {
  return (
    findIndex(roles, function (val) {
      return val.name === target;
    }) != -1
  );
}

// A set of keys used to match potential userdata.
const USER_RELATION_KEYS = new Set([
  "user_created",
  "user_updated",
  "user_id",
  "user",
]);

// Returns a safe set of user data for admin-only responses.
// Includes fields like email and role that are not shown publicly.
export function sanitizeAdminUser(userData) {
  if (userData) {
    return {
      id: userData?.id,
      displayname: userData?.displayname,
      name: userData?.username ?? userData?.name,
      avatar: userData?.avatar,
      email: userData?.email,
      role: userData?.role,
      project_role: userData?.project_role,
      owner: userData?.owner,
    };
  }

  return null;
}

// Returns a minimal set of user data safe to expose publicly.
export function sanitizePublicUser(userData) {
  if (userData) {
    return {
      id: userData?.id,
      displayname: userData?.displayname,
      name: userData?.username ?? userData?.name,
      avatar: userData?.avatar,
      project_role: userData?.project_role,
      description: userData?.description,
    };
  }

  return null;
}

// Removes sensitive user data from an object
export function sanitizeUserRelations(data, isAdmin = false) {
  const select = isAdmin ? sanitizeAdminUser : sanitizePublicUser;

  return cloneDeepWith(data, (value, key) => {
    if (USER_RELATION_KEYS.has(key) && isPlainObject(value)) {
      return select(value);
    }
  });
}

// Triggers a logout from the client side without needing a button.
// Optionally shows a toast message after the request completes.
export async function clientLogout(type, title, msg) {
  try {
    // Trigger logout action
    await fetch("/auth?/logout", {
      method: "POST",
      headers: {
        "content-type": "multipart/form-data",
      },
    });

    // Optional toast messages
    if (title || msg) {
      if (type === "success") {
        toastSuccess(title, msg);
      } else if (type === "error") {
        toastError(title, msg);
      }
    }
  } catch (e) {
    console.error("Error logging out!", e);
  }
}
