// Utility imports
import { uploadFilesAction } from "$lib/utils/uploadActions.js";

// SvelteKit load function
export const load = async ({ params, locals }) => {
  // Get ID of edited gallery item from request params
  let id = params.id;

  // Setup for fetching
  let gallery = {};
  let categories = [];
  let contributors = [];

  try {
    // Get gallery item matching the ID
    const resGallery = await locals.comixCleric.db.findOne("gallery", id, {
      populate: {
        cover: true,
      },
    });

    gallery = resGallery;

    // Get all gallery categories
    const resCategories = await locals.comixCleric.db.find("gallery_types");

    categories = resCategories;

    const resContributors = await locals.comixCleric.db.find("contributors", {
      filter: {
        post_type: {
          _eq: "gallery",
        },
        post_id: {
          _eq: id,
        },
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
    // ...
  }

  // Return what we have
  return {
    gallery,
    categories,
    contributors,
  };
};

// Form actions
export const actions = {
  uploadFiles: uploadFilesAction,
};
