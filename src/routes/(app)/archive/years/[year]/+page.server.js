// Utilities
import { checkStatus } from '$lib/utils/api/auth.js';
import { consoleError } from '$lib/utils/debug.js';

// Standard SvelteKit load function
export const load = async ({ locals, params }) => {
  // Get year from request params
  const year = params?.year;

  // Setup for fetching
  let updates = [];

  if (year) {
    try {
      // Get all (visible) Updates from this year
      const resUpdates = await locals.comixCleric.db.find("updates", {
        filter: {
          ...checkStatus(locals),
          date_published: {
            _gte: year + "-01-01T00:00:00.000Z",
            _lt: (year + 1) + "-01-01T00:00:00.000Z"
          }
        },
        populate: {
          type: true,
          cover: true,
          series: true,
          series: {
            cover: true
          },
          chapter: true,
          chapter: {
            cover: true
          },
          volume: true,
          volume: {
            cover: true
          },
        }
      });

      updates = resUpdates;
    } catch (e) {
      consoleError(e)
      // ...
    }
  }

  // Return what we have
  return { year, updates };
};
