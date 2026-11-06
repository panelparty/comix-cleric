// Utilities
import { checkStatus, sanitizeUserRelations } from "$lib/utils/api/auth.js";
import { consoleError } from "$lib/utils/debug.js";
import { error } from "@sveltejs/kit";

// SvelteKit load function
export const load = async ({ parent, locals }) => {
  // Prepare for required data
  let resUpdates = [];
  let resUpdateCount = 0;
  let resChapterCount = 0;
  let resVolumeCount = 0;
  let resBlogs = [];
  let resBlogCount = 0;
  let mainSection = ()=>{};

  const seriesId = locals?.series?.id;

  // Attempt to fetch required page data
  // TODO: Fix this so one failed request won't prevent requests that don't rely on the series ID
  try {
    // Fetch all updates created within the series
    resUpdates = await locals.comixCleric.db.find("updates", {
      sort: "-date_published",
      filter: {
        ...checkStatus(locals)
      },
      limit: 6,
      populate: {
        type: true,
        cover: true,
        series: true,
        series: {
          cover: true
        },
        chapter: true,
        chapter: {
          cover: true
        },
        volume: true,
        volume: {
          cover: true
        },
      },
    });
    
    // Fetch the count of all (visible) updates in the series
    resUpdateCount = await locals.comixCleric.db.count("updates", {
      filter: {
        ...checkStatus(locals),
      }
    });

    // Fetch the count of all (visible) chapters in the series
    resChapterCount = await locals.comixCleric.db.count("chapters", {
      filter: {
        ...checkStatus(locals),
      }
    });

    // Fetch the count of all (visible) volumes in the series
    resVolumeCount = await locals.comixCleric.db.count("volumes", {
      filter: {
        ...checkStatus(locals),
      }
    });

    // Fetch all (visible) blog posts
    resBlogs = await locals.comixCleric.db.find("blogs", {
      filter: {
        ...checkStatus(locals),
      },
      sort: "-date_published",
      limit: 4,
      populate: {
        cover: true,
        user_created: true,
        user_created: {
          avatar: true
        },
        type: true,
      },
    });

    // Fetch the count of all (visible) blogs
    resBlogCount = await locals.comixCleric.db.count("blogs");

    // Get details for homepage setting
    mainSection = async () => {
      if (locals.settings?.main_section === "hero") return {};

      let update = {};
      let firstUpdate = {};
      let prevUpdate = {};
      let nextUpdate = {};
      let lastUpdate = {};

      // Get page matching slug from params
      const resUpdate = await locals.comixCleric.db.find("updates", {
        limit: 1,
        filter: {
          ...checkStatus(locals),
          series: {
            _eq: seriesId,
          },
        },
        sort: `${locals.settings?.main_section === "first" ? '' : '-'}date_published`,
        populate: {
          type: true,
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

      return {
        update,
        firstUpdate,
        prevUpdate,
        nextUpdate,
        lastUpdate
      }
    };
  } catch (e) {
    // Log error to server console
    consoleError(e);
  }

  // Regardless of errors, return what we have
  return {
    updates: sanitizeUserRelations(resUpdates),
    update_count: resUpdateCount,
    chapter_count: resChapterCount,
    volume_count: resVolumeCount,
    blogs: sanitizeUserRelations(resBlogs),
    blog_count: resBlogCount,
    main_section: await mainSection(),
  };
};
