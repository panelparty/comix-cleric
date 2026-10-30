// Utility imports
import { uploadFilesAction } from "$lib/utils/uploadActions.js";
import { consoleError } from "$lib/utils/debug";
import { CAST_TYPE_ORDER, sortBySlugOrder } from "$lib/utils/data/sort";

// SvelteKit load function
export const load = async ({ params, locals }) => {
  // Get edited post id from request params
  let id = params.id;

  // Setup for fetching
  let cast = {};
  let types = [];

  // Attempt to fetch data
  try {
    // Get original cast data
    const resCast = await locals.comixCleric.db.findOne("cast", id, {
      populate: {
        type: true,
        cover: true,
        sheet: true,
      },
    });

    cast = resCast;

    // Get all cast types
    const resTypes = await locals.comixCleric.db.find("cast_types");

    types = sortBySlugOrder(resTypes, CAST_TYPE_ORDER);
  } catch (e) {
    consoleError(e);
  }

  // Return what we have
  return {
    cast,
    types,
  };
};

// Form actions
export const actions = {
  uploadFiles: uploadFilesAction,
};
