// Utility imports
import { uploadFilesAction } from "$lib/utils/uploadActions.js";

// SvelteKit load function
export const load = async ({ locals }) => {
  // Setup for fetching
  let categories = [];

  // Attempt to fetch data
  try {
    // Get all gallery categories
    const resCategories = await locals.comixCleric.db.find("gallery_types");

    categories = resCategories;
  } catch (e) {
    // ...
  }

  // Return what we have
  return {
    categories,
  };
};

// Form actions
export const actions = {
  uploadFiles: uploadFilesAction,
};
