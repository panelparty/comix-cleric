// Utility imports
import { checkStatus } from "$lib/utils/api/auth";
import { addFilter } from "$lib/utils/api/query.js";
import { checkNull } from "$lib/utils/detectTypes.js";
import { find } from "lodash-es";

// Standard SvelteKit load function
export const load = async ({ locals, url }) => {
  // See if the current url slug exists in the app pages array.
  let currentPage = find(locals.pages, (p) => p?.url === url?.pathname);

  // Bail early if the page is not found
  // if (!locals.current_page) throw error(404, "Page not found");

  // Get search parameters from the request url
  let page = checkNull(url.searchParams.get("page") ?? 1);
  let limit = checkNull(url.searchParams.get("limit")) ?? locals?.settings?.page_limit ?? 15;
  let sort = url.searchParams.get("sort") ?? "-date_published";
  let type = url.searchParams.get("type") ?? "*";
  let tab = url.searchParams.get("tab") ?? "*";

  // Build filter object conditionally
  const filter = { ...checkStatus(locals) };

  // Setup for data fetching
  let updates = [];
  let chapters = [];
  let volumes = [];
  let updateCount = 0;
  let updateCountTotal = 0;
  let chapterCount = 0;
  let volumeCount = 0;
  let years = [];

  try {
    const resTypes = await locals.comixCleric.db.find("update_types");

    const typeMain = find(resTypes, (item) => item?.slug === type);

    // Add each filter type
    if (type && type != "*") {
      addFilter(filter, "type", type, { _eq: typeMain?.id });
    }

    // Get the paginated, filtered (visible) Updates in the series
    const resUpdates = await locals.comixCleric.db.find("updates", {
      sort: sort,
      filter: filter,
      populate: {
        type: true,
        cover: true,
        series: true,
        series: {
          cover: true,
        },
        chapter: true,
        chapter: {
          cover: true,
        },
        volume: true,
        volume: {
          cover: true,
        },
      },
      limit: Number(limit),
      page: Number(page),
    });

    updates = resUpdates;

    // Get all (visible) Chapters in the series
    const resChapters = await locals.comixCleric.db.find("chapters", {
      filter: {
        ...checkStatus(locals),
      },
      sort: sort,
      populate: {
        cover: true,
        series: true,
        series: {
          cover: true,
        },
        volume: true,
        volume: {
          cover: true,
        },
        updates: true,
      },
    });

    chapters = resChapters;

    // Get all (visible) Volumes in the series
    const resVolumes = await locals.comixCleric.db.find("volumes", {
      filter: {
        ...checkStatus(locals),
      },
      sort: sort,
      populate: {
        cover: true,
        series: true,
        series: {
          cover: true,
        },
        chapters: true,
        updates: true,
      },
    });

    volumes = resVolumes;

    // Get filtered count of all (visible) Updates
    const resUpdateCount = await locals.comixCleric.db.count("updates", filter);

    updateCount = resUpdateCount;

    // Get count of all (visible) Updates
    const resUpdateCountTotal = await locals.comixCleric.db.count("updates", {
      filter: {
        ...checkStatus(locals),
      },
    });

    updateCountTotal = resUpdateCountTotal;

    // Get count of all (visible) Chapters
    const resChapterCount = await locals.comixCleric.db.count("chapters", {
      filter: {
        ...checkStatus(locals),
      },
    });

    chapterCount = resChapterCount;

    // Get count of all (visible) Volumes
    const resVolumeCount = await locals.comixCleric.db.count("volumes", {
      filter: {
        ...checkStatus(locals),
      },
    });

    volumeCount = resVolumeCount;

    // Get all unique years from all Updates
    const resYears = await locals.comixCleric.db.find("updates", {
      filter: {
        ...checkStatus(locals),
      },
      fields: ["date_published"],
    });

    // Extract unique years from the updates
    const yearSet = new Set();
    resYears.forEach((update) => {
      if (update.date_published) {
        const year = new Date(update.date_published).getFullYear();
        yearSet.add(year);
      }
    });

    years = Array.from(yearSet).sort((a, b) => b - a);
  } catch (e) {
    // ...
  }

  // Return all data
  return {
    updates,
    chapters,
    volumes,
    updateCount,
    updateCountTotal,
    chapterCount,
    volumeCount,
    years,
  };
};
