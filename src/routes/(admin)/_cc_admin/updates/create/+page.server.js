// Utility imports
import { sortBySlugOrder, UPDATE_TYPE_ORDER } from "$lib/utils/data/sort.js";
import { consoleError } from "$lib/utils/debug.js";
import { uploadFilesAction } from "$lib/utils/uploadActions.js";
import { find } from "lodash-es";

// SvelteKit load function
export const load = async ({ locals }) => {
  // Prepare to fetch data
  let prevUpdate = {};
  let types = [];
  let chapters = [];
  let volumes = [];

  // Attempt to fetch data
  try {
    const resTypes = await locals.comixCleric.db.find("update_types");

    types = sortBySlugOrder(resTypes, UPDATE_TYPE_ORDER);

    // Get reference to previous update (for numbering, etc.)
    // TODO: Limit to active series
    const resPrevUpdate = await locals.comixCleric.db.find("updates", {
      filter: {
        type: find(types, { slug: "main-story" })?.id,
        number: {
          _nnull: true
        },
      },
      sort: "-date_published",
      populate: {
        type: true,
        cover: true,
        chapter: true,
        volume: true,
        audio: true,
      },
      limit: 1,
    });

    prevUpdate = resPrevUpdate[0];

    // Get all chapters
    // TODO: Limit to active series
    const resChapters = await locals.comixCleric.db.find("chapters", {
      sort: "-date_published",
    });

    chapters = resChapters;

    // Get all volumes
    // TODO: Limit to active series
    const resVolumes = await locals.comixCleric.db.find("volumes", {
      sort: "-date_published",
    });

    volumes = resVolumes;
  } catch (e) {
    consoleError(e);
  }

  // Return what we have
  return {
    prevUpdate,
    types,
    chapters,
    volumes,
  };
};

// Form actions
export const actions = {
  uploadFiles: uploadFilesAction,
};
