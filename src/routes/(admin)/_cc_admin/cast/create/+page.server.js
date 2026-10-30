// Utility imports
import { sortBySlugOrder, CAST_TYPE_ORDER } from "$lib/utils/data/sort";
import { uploadFilesAction } from "$lib/utils/uploadActions.js";

// SvelteKit load function
export const load = async ({ locals }) => {
  // Setup for fetching
  let types = [];

  // Attempt to fetch data
  try {
    // Get all cast types
    const resTypes = await locals.comixCleric.db.find("cast_types");

    types = sortBySlugOrder(resTypes, CAST_TYPE_ORDER);
  } catch (e) {
    // ..
  }

  // Return what we have
  return {
    types,
  };
};

// Form actions
export const actions = {
  uploadFiles: uploadFilesAction,
};
