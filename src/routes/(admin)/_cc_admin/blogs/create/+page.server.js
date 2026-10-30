// Utility imports
import { uploadFilesAction } from "$lib/utils/uploadActions.js";
import { consoleError } from "$lib/utils/debug.js";

// SvelteKit load function
export const load = async ({ params, locals }) => {
  // Setup for fetching
  let types = [];

  // Attempt to fetch data
  try {
    // Get all blog categories
    const resTypes = await locals.comixCleric.db.find("blog_types", {
      populate: {
        cover: true,
      },
    });

    types = resTypes;
  } catch (e) {
    consoleError(e);
  }

  // Return what we get
  return {
    types,
  };
};

// Form actions
export const actions = {
  uploadFiles: uploadFilesAction,
};
