// Utility imports
import { consoleError } from '$lib/utils/debug.js';

// SvelteKit load function
export const load = async ({ params, locals }) => {
  // Get user ID from request params
  let id = params.id;

  // Setup for data fetching
  let guest = {};

  // Attempt to fetch data
  try {
    // Get user account matching ID from request
    const resGuest = await locals.comixCleric.db.findOne("guests", id, {
      populate: {
        avatar: true,
      },
    });

    guest = resGuest;

  } catch (e) {
    consoleError(e);
  }

  // Return what we have
  return {
    guest,
  };
};
