// SvelteKit utility functions

// Utility imports
import { addFilter } from "$lib/utils/api/query.js";
import { consoleError } from "$lib/utils/debug.js";
import { sortBySlugOrder } from "$lib/utils/data/sort";
import { UPDATE_TYPE_ORDER } from "$lib/utils/data/sort";
import { find } from "lodash-es";
import { checkNull } from "$lib/utils/detectTypes.js";

// SvelteKit load function
export const load = async ({ url, locals }) => {
  // Get query parameters from url
  let page = checkNull(url.searchParams.get("page")) ?? 1;
  let limit = checkNull(url.searchParams.get("limit")) ?? locals?.settings?.page_limit ?? 15;
  let sort = url.searchParams.get("sort") ?? "-date_published";
  let status = url.searchParams.get("status") ?? "*";
  let chapter = url.searchParams.get("chapter") ?? "*";
  let volume = url.searchParams.get("volume") ?? "*";
  let type = url.searchParams.get("type") ?? "*";

  // Setup for fetching
  let updates = [];
  let updateTypes = [];
  let chapters = [];
  let volumes = [];
  let updateCountTotal = 0;
  let updateCount = 0;

  // Setup for filtering
  const filter = {};
  const chapterFilter = {};

  try {
    // Get all volumes
    const resVolumes = await locals.comixCleric.db.find("volumes");
    volumes = resVolumes;

    // Get filtered chapters
    addFilter(
      chapterFilter,
      "volume",
      volume,
      find(volumes, { slug: volume })?.id,
    );
    const resChapters = await locals.comixCleric.db.find("chapters", {
      filter: chapterFilter,
    });
    chapters = resChapters;

    // Get all update types
    const resUpdateTypes = await locals.comixCleric.db.find("update_types");
    updateTypes = sortBySlugOrder(resUpdateTypes, UPDATE_TYPE_ORDER);

    // Build filters
    addFilter(filter, "type", type, find(updateTypes, { slug: type })?.id);
    addFilter(filter, "chapter", chapter, find(chapters, { slug: chapter })?.id,);
    addFilter(filter, "volume", volume, find(volumes, { slug: volume })?.id);
    addFilter(filter, "status", status, { _eq: status });

    // Get filtered updates from database
    const resUpdates = await locals.comixCleric.db.find("updates", {
      sort: [`${sort}`],
      filter: filter,
      populate: {
        type: true,
        cover: true,
        chapter: true,
        volume: true,
        audio: true,
      },
      limit: Number(limit),
      page: Number(page),
    });

    updates = resUpdates;

    // Get filtered update count
    const resUpdateCount = await locals.comixCleric.db.count("updates", filter);

    updateCount = resUpdateCount;

    // Get total update count
    const resUpdateCountTotal = await locals.comixCleric.db.count("updates");

    updateCountTotal = resUpdateCountTotal;
  } catch (e) {
    consoleError(e);
  }

  // Return what we have
  return {
    updates,
    updateTypes,
    chapters,
    volumes,
    updateCountTotal,
    updateCount,
  };
};
