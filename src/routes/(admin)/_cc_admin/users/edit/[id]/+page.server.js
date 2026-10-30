// Utility imports
import { consoleError, consoleLog } from "$lib/utils/debug.js";
import { uploadFilesAction } from "$lib/utils/uploadActions.js";
import { error, redirect } from "@sveltejs/kit";

// SvelteKit load function
export const load = async ({ params, locals }) => {
  // Get user ID from request params
  let id = params.id;

  // Setup for data fetching
  let userData = {};
  let ownerCount = 0;
  let isStaff = null;

  // Attempt to fetch data
  try {
    // Get user account matching ID using comixCleric auth namespace
    userData = await locals.comixCleric.db.findOne("user", id, {
      populate: {
        avatar: true,
      },
    });

    if (!userData) {
      throw error(404, "User not found");
    }

    // Check if user is staff/admin or reader
    isStaff = userData?.role === "admin";

    // Get a count of all users marked as "owner" using comixCleric auth namespace
    const ownerUsersResponse = await locals.comixCleric.db.count("user", {
      filter: {
        owner: {
          _eq: true
        }
      }
    });

    ownerCount = ownerUsersResponse ?? 0;
    consoleLog(ownerCount);
  } catch (e) {
    consoleError("Failed to fetch user data:", e);
    if (e?.status === 404) {
      throw redirect(303, "/_cc_admin/users");
    }
  }

  // Return what we have
  return {
    userData,
    ownerCount,
    isStaff,
  };
};

// Form actions
export const actions = {
  uploadFiles: uploadFilesAction,
};
