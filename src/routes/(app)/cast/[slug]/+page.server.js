// Svelte utility imports
import { checkStatus, sanitizeUserRelations } from "$lib/utils/api/auth.js";
import { notFound } from "$lib/utils/detectTypes.js";
import { error } from "@sveltejs/kit";

// Standard SvelteKit load function
export const load = async ({ locals, params }) => {
  // Get cast slug from request params
  const slug = params?.slug;

  // Edge case
  if (slug === "undefined") {
    throw error(404, "Cast not found.");
  }

  // Setup for fetching
  let cast = {};
  let contributors = [];

  // Attempt to fetch
  try {
    // Get cast matching this slug
    const resCast = await locals.comixCleric.db.find("cast", {
      filter: { slug: { _eq: slug }, ...checkStatus(locals) },
      populate: {
        user_created: true,
        user_created: {
          avatar: true
        },
        cover: true,
        sheet: true,
        type: true,
      },
    });

    cast = resCast?.[0];

    const resContributors = await locals.comixCleric.db.find("contributors", {
      filter: {
        post_type: {
          _eq: "cast",
        },
        post_id: {
          _eq: cast?.id,
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
  } catch {}

  // If the response is empty, throw a 404 (not found) error
  notFound(cast);

  // Return what we have
  return {
    cast: sanitizeUserRelations(cast),
  };
};
