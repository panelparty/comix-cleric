// SvelteKit utility imports

// Utility imports
import { uploadFilesAction } from "$lib/utils/uploadActions.js";

// SvelteKit load function
export const load = async ({ locals, params }) => {
  // Get series ID from request params
  const seriesId = params.id;

  // Setup for fetching
  let series = {};
  let allSeries = [];
  let contributors = [];

  // Attempt to fetch data
  try {
    // Get series matching ID
    const resSeries = await locals.comixCleric.db.findOne("series", seriesId, {
      limit: 1,
      populate: {
        logo: true,
        cover: true,
        favicon: true,
      },
    });

    series = resSeries;


    // Get series matching ID
    const resAllSeries = await locals.comixCleric.db.find("series");

    allSeries = resAllSeries;

    const resContributors = await locals.comixCleric.db.find("contributors", {
      sort: "order_id",
      filter: {
        post_type: "series",
        post_id: seriesId,
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
  return { series, seriesCount: allSeries?.length, contributors };
};

// Form actions
export const actions = {
  uploadFiles: uploadFilesAction,
};
