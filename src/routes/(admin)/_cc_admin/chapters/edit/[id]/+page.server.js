// Utility imports
import { uploadFilesAction } from "$lib/utils/uploadActions.js";

// SvelteKit load function
export const load = async ({ params, locals }) => {
  // Get original chapter ID from request params
  let id = params.id;

  // Setup for fetching
  let chapter = {};
  let volumes = [];

  try {
    const resChapter = await locals.comixCleric.db.findOne("chapters", id, {
      populate: {
        volume: true,
        cover: true,
      },
    });

    chapter = resChapter;

    // Get all volumes
    const resVolumes = await locals.comixCleric.db.find("volumes", {
      sort: [`id`],
    });

    volumes = resVolumes;
  } catch (e) {
    // ...
  }

  // Return what we have
  return {
    chapter,
    volumes,
  };
};

// Form actions
export const actions = {
  uploadFiles: uploadFilesAction,
};
