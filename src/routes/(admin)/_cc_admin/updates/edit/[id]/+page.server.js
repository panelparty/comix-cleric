// Utility imports
import { uploadFilesAction } from "$lib/utils/uploadActions.js";
import { find } from "lodash-es";
import { sortBySlugOrder, UPDATE_TYPE_ORDER } from "$lib/utils/data/sort";
import { consoleError } from "$lib/utils/debug.js";

// SvelteKit load function
export const load = async ({ params, locals }) => {
  // Get update ID from request params
  let id = params.id;

  // Setup for data fetching
  let prevUpdate = {};
  let update = {};
  let types = {};
  let chapters = [];
  let volumes = [];
  let contributors = [];

  // Attept to fetch data
  try {
    const resTypes = await locals.comixCleric.db.find("update_types");

    types = sortBySlugOrder(resTypes, UPDATE_TYPE_ORDER);

    // Get previous update
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

    // Get update matching ID from request
    const resUpdate = await locals.comixCleric.db.findOne("updates", id, {
      populate: {
        cover: true,
        chapter: true,
        volume: true,
        audio: true,
      },
    });

    update = resUpdate;

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

    const resContributors = await locals.comixCleric.db.find("contributors", {
      filter: {
        post_type: "updates",
        post_id: update?.id,
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

    contributors = resContributors;

  } catch (e) {
    consoleError(e);
  }

  // Return what we have
  return {
    prevUpdate,
    update,
    types,
    chapters,
    volumes,
    contributors,
  };
};

// Form actions
export const actions = {
  uploadFiles: uploadFilesAction,
};
