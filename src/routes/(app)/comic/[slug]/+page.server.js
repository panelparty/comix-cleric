// SvelteKit imports
import { checkStatus, sanitizeUserRelations } from "$lib/utils/api/auth";
import { consoleError } from "$lib/utils/debug.js";
import { error } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";

// Standard SvelteKit load function
export const load = async ({ locals, params }) => {
  // Get slug from request params
  const slug = params?.slug;

  // Setup for fetching
  let update = {};
  let firstUpdate = {};
  let prevUpdate = {};
  let nextUpdate = {};
  let lastUpdate = {};
  let numberedUpdates = 0;
  let contributors = [];

  const seriesId = locals?.series?.id;

  // Attempt to fetch data
  try {
    // Get page matching slug from params
    const resUpdate = await locals.comixCleric.db.find("updates", {
      limit: 1,
      filter: {
        ...checkStatus(locals),
        slug: {
          _eq: slug,
        },
        series: {
          _eq: seriesId,
        },
      },
      populate: {
        type: true,
        cover: true,
        series: {
          cover: true,
        },
        volume: {
          cover: true,
        },
        chapter: {
          cover: true,
        },
        audio: true,
        user_created: {
          avatar: true,
        },
      },
    });

    update = resUpdate?.[0];

    if (!update) throw error(400, "Not found");

    // Get the date of the current update to match against
    const date = update?.date_published ?? update?.date_created;

    // Get the first (visible) page in the series
    const resFirstUpdate = await locals.comixCleric.db.find("updates", {
      limit: 1,
      filter: {
        ...checkStatus(locals),
        series: {
          _eq: seriesId,
        },
      },
      sort: "date_published",
      populate: {
        series: true,
        chapter: true,
        volume: true,
      },
    });

    firstUpdate = resFirstUpdate?.[0];

    // Get the previous update
    const resPrevUpdate = await locals.comixCleric.db.find("updates", {
      limit: 1,
      filter: {
        ...checkStatus(locals),
        date_published: { _lt: date },
        series: {
          _eq: seriesId,
        },
      },
      sort: "-date_published",
      populate: {
        series: true,
        chapter: true,
        volume: true,
      },
    });

    prevUpdate = resPrevUpdate?.[0];

    // Get the next update
    const resNextUpdate = await locals.comixCleric.db.find("updates", {
      limit: 1,
      filter: {
        ...checkStatus(locals),
        date_published: { _gt: date },
        series: {
          _eq: seriesId,
        },
      },
      sort: "date_published",
      populate: {
        series: true,
        chapter: true,
        volume: true,
      },
    });

    nextUpdate = resNextUpdate?.[0];

    // Get most recent update
    const resLastUpdate = await locals.comixCleric.db.find("updates", {
      limit: 1,
      filter: {
        ...checkStatus(locals),
        series: {
          _eq: seriesId,
        },
      },
      sort: "-date_published",
      populate: {
        series: true,
        chapter: true,
        volume: true,
      },
    });

    lastUpdate = resLastUpdate?.[0];

    // Get count of numbered updates (for random)
    const resNumberedUpdates = await locals.comixCleric.db.count("updates", {
      filter: {
        ...checkStatus(locals),
        number: {
          _nnull: true,
        },
      },
    });

    numberedUpdates = resNumberedUpdates;

    const resContributors = await locals.comixCleric.db.find("contributors", {
      filter: {
        post_type: {
          _eq: "updates",
        },
        post_id: {
          _eq: update?.id,
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
    // If no update was found
    if (e.status === 400) {
      // Redirect to the archive
      throw redirect(303, "/archive");
    }
  }

  // Return what we have
  return {
    update: sanitizeUserRelations(update),
    firstUpdate,
    prevUpdate,
    nextUpdate,
    lastUpdate,
    numberedUpdates,
    contributors,
    customMeta: true,
  };
};
