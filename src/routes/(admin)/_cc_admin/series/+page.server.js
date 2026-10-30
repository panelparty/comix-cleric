// SvelteKit utility imports
import { consoleError } from "$lib/utils/debug.js";

export const load = async ({ locals }) => {
  // Get active series
  let activeSeries = locals?.user?.active_series;

  // Setup for fetching
  let series = {};
  let allSeries = [];
  let updateCount = 0;
  let chapterCount = 0;
  let volumeCount = 0;
  let contributors = [];

  // Attempt to fetch data
  try {
    // If the user has an active series assigned
    if (activeSeries) {
      // Get series matching the active series slug
      const resActiveSeries = await locals.comixCleric.db.findOne(
        "series",
        activeSeries,
        {
          populate: {
            logo: true,
            cover: true,
            favicon: true,
          },
        },
      );

      series = resActiveSeries;
    }

    if (Object.entries(series).length < 1) {
      // If something went wrong, get the first series available
      const resActiveSeries = await locals.comixCleric.db.find("series", {
        limit: 1,
        populate: {
          logo: true,
          cover: true,
          favicon: true,
        },
      });

      series = resActiveSeries[0];

      // TODO: Update user's active series using comixCleric
    }

    // Get all series
    const resSeries = await locals.comixCleric.db.find("series", {
      populate: {
        logo: true,
        cover: true,
        favicon: true,
      },
    });

    allSeries = resSeries;

    // Get count of all updates in this series
    const resUpdateCount = await locals.comixCleric.db.count("updates", {
      filter: {
        series: {
          _eq: series?.id,
        },
      },
    });

    updateCount = resUpdateCount;

    const resChapterCount = await locals.comixCleric.db.count("chapters", {
      filter: {
        series: {
          _eq: series?.id,
        },
      },
    });

    chapterCount = resChapterCount;

    const resVolumeCount = await locals.comixCleric.db.count("volumes", {
      filter: {
        series: {
          _eq: series?.id,
        },
      },
    });

    volumeCount = resVolumeCount;

    const resContributors = await locals.comixCleric.db.find("contributors", {
      filter: {
        post_type: "series",
        post_id: series?.id,
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
      }
    });

    contributors = resContributors;

  } catch (e) {
    consoleError(e);
  }

  // Return what we have
  return {
    series,
    allSeries,
    updateCount,
    chapterCount,
    volumeCount,
    contributors,
  };
};

// Form actions
// TODO: Move to the (api) directory
export const actions = {
  // Update exiting series
  updateSeries: async ({ request, locals, cookies }) => {
    // Get form data
    const data = await request.formData();
    const id = data.get("id"); // number/int
    const title = data.get("title"); // string
    const slug = data.get("slug"); // string/slug (must be URL-safe)
    const logo = data.get("logo"); // string/UUID
    const blurb = data.get("blurb"); // string/Markdown
    const desc = data.get("desc"); // string/Markdown
    const dateReleased = data.get("date_published"); // string/ISO Date

    // Sanitize form data, duh.

    // Attempt to update data
    try {
      // Update existing series item in database
      const res = await locals.comixCleric.db.update("series", id, {
        title: title,
        slug: slug,
        blurb: blurb,
        date_published: new Date(dateReleased).toISOString(),
        series_logo: logo,
        description: desc,
      });

      // Return success state
      return { success: true };
    } catch (e) {
      // Return fail state and error message
      return { success: false, error: e?.errors[0]?.message };
    }
  },
};
