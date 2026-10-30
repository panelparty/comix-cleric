// SvelteKit utility imports

// Utility imports
import { consoleError } from "$lib/utils/debug.js";

// SvelteKit load function
export const load = async ({ params, locals }) => {
  // Get file ID from request params
  let id = params.id;

  // Setup for fetching
  let file = {};

  // Attempt to fetch data
  try {
    // Get file with matching ID
    const resFile = await locals.comixCleric.storage.getMetadata(id);

    file = resFile;
  } catch (e) {
    consoleError(e);
  }

  return {
    file,
  };
};
