// Utility imports
import { checkStatus } from '$lib/utils/api/auth.js';
import { consoleError } from '$lib/utils/debug.js';

// SvelteKit load function
export const load = async ({ locals, url }) => {
  // Setup for fetching
  let globals = {};
  let content_ratings = [];

  // Attempt to fetch data
  try {
    // Fetch all global settings
    const resSettings = await locals.comixCleric.db.find("globals", {
      populate: {
        logo: true,
        favicon: true,
      },
    });

    globals = resSettings[0];

    const resRatings = await locals.comixCleric.db.find("content_ratings", {
      filter: checkStatus()
    });

    content_ratings = resRatings;
  } catch (e) {
    consoleError(e)
  }

  return { globals, content_ratings, siteUrl: url.origin };
};
