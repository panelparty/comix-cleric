import { addFilter } from "$lib/utils/api/query.js";
import { consoleError } from "$lib/utils/debug.js";
import { checkNull } from "$lib/utils/detectTypes";
import { find } from "lodash-es";

// SvelteKit load function
export const load = async ({ url, locals }) => {
  // Get pagination options
  let page = checkNull(url.searchParams.get("page")) ?? 1;
  let limit = checkNull(url.searchParams.get("limit")) ?? locals?.settings?.page_limit ?? 15;
  let sort = url.searchParams.get("sort") ?? "-date_published";
  let status = url.searchParams.get("status") ?? "*";
  let volume = url.searchParams.get("volume") ?? "*";

  // Setup for fetching
  let chapters = [];
  let volumes = [];
  let chapterCount = 0;
  let chapterCountTotal = 0;

  // Setup for filters
  const filter = {};

  try {
    // Get all volumes (for filtering options)
    const resVolumes = await locals.comixCleric.db.find("volumes");

    volumes = resVolumes;

    
    // Build filters
    addFilter(filter, "volume", volume, find(volumes, { slug: volume })?.id);
    addFilter(filter, "status", status, { _eq: status });

    // Get total chapter count
    chapterCount = await locals.comixCleric.db.count("chapters", {filter});

    // Get total chapter count
    chapterCountTotal = await locals.comixCleric.db.count("chapters");

    // Get chapters matching the query parameters
    const resChapters = await locals.comixCleric.db.find("chapters", {
      sort: [`${sort}`],
      filter: filter,
      populate: {
        cover: true,
        volume: true,
        updates: true,
      },
      limit: Number(limit),
      page: Number(page),
    });

    chapters = resChapters;

  } catch (e) {
    consoleError("Error fetching chapters:", e);
  }

  // Return what we have
  return {
    chapters,
    volumes,
    chapterCount,
    chapterCountTotal,
  };
};
