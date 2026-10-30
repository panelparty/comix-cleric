// Utility imports
import { uploadFilesAction } from "$lib/utils/uploadActions.js";

// SvelteKit load function
export const load = async ({ locals }) => {
  // Setup for fetching
  let volumes = [];

  try {
    // Get all volumes
    const resVolumes = await locals.comixCleric.db.find("volumes", {
      sort: "-date_published",
    });

    volumes = resVolumes;
  } catch (e) {
    // ...
  }

  // Return what we have
  return {
    volumes,
  };
};

// Form actions
export const actions = {
  uploadFiles: uploadFilesAction,
};
