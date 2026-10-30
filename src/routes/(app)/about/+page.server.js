// Utilities
import { checkStatus, sanitizeUserRelations } from "$lib/utils/api/auth";
import { consoleError } from "$lib/utils/debug.js";

// Standard SvelteKit load function
export const load = async ({ locals, url }) => {
  // Prepare to capture data
  let series;
  let contributors = [];

  try {
    // Fetch series
    const resSeries = await locals.comixCleric.db.find("series", {
      filter: {...checkStatus(locals)},
      populate: {
        logo: true
      }
    });
    // Capture current series
    series = resSeries[0];
    
    // Fetch contributors
    const resContributors = await locals.comixCleric.db.find("contributors", {
      sort: "order_id",
      filter: {
        post_type: "series",
        post_id: series?.id,
      },
      populate: {
        user_id: true,
        user_id: {
          avatar: true,
        },
        guest_id: true,
        guest_id: {
          avatar: true,
        },
      },
    });
    // Capture contributors
    contributors = resContributors;
  } catch (e) {
    // Return errors to console
    consoleError(e);
  }

  // Return data
  return {
    series,
    contributors: sanitizeUserRelations(contributors),
  };
};
