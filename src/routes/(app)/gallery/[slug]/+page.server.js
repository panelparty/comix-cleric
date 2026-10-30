// Utilities
import { checkStatus, sanitizeUserRelations } from "$lib/utils/api/auth";
import { consoleError } from "$lib/utils/debug.js";
import { notFound } from "$lib/utils/detectTypes.js";

// SvelteKit load function
export const load = async ({ locals, params }) => {
  // Get slug from request params
  const slug = params?.slug;

  // Setup for data fetching
  let gallery = {};
  let contributors = [];

  // Attempt to fetch data
  try {
    // Get gallery item matching the slug
    const resGallery = await locals.comixCleric.db.find("gallery", {
      filter: { slug: { _eq: slug }, ...checkStatus(locals) },
      populate: {
        user_created: true,
        user_created: {
          avatar: true
        },
        cover: true,
        type: true,
      }
    });
    gallery = resGallery?.[0];

    const resContributors = await locals.comixCleric.db.find("contributors", {
      filter: {
        post_type: {
          _eq: "gallery",
        },
        post_id: {
          _eq: gallery?.id,
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
    consoleError(e);
  }

  // If the response is empty, throw a 404 (not found) error
  notFound(gallery);

  // Return what we have
  return {
    gallery: sanitizeUserRelations(gallery),
    contributors: sanitizeUserRelations(contributors),
    customMeta: true,
  };
};
