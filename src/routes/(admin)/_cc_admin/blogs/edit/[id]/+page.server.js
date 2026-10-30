// Utility imports
import { uploadFilesAction } from "$lib/utils/uploadActions.js";
import { consoleError } from "$lib/utils/debug";

// SvelteKit load function
export const load = async ({ params, locals }) => {
  // Get original blog ID from request params
  let id = params.id;

  // Setup for fetching
  let blog = {};
  let types = [];

  // Attempt to fetch data
  try {
    // Get original blog post data
    const resBlog = await locals.comixCleric.db.findOne("blogs", id, {
      populate: {
        type: true,
        cover: true,
      },
    });

    blog = resBlog;

    // Get all categories
    const resTypes = await locals.comixCleric.db.find("blog_types", {
      populate: {
        cover: true,
      },
    });

    types = resTypes;
  } catch (e) {
    consoleError(e);
  }

  // Return what we have
  return {
    blog,
    types,
  };
};

// Form actions
export const actions = {
  uploadFiles: uploadFilesAction,
};
