import { checkStatus, sanitizeUserRelations } from "$lib/utils/api/auth.js";
import { consoleError } from "$lib/utils/debug.js";
import { checkNull, notFound } from "$lib/utils/detectTypes.js";

// Standard SvelteKit load function
export const load = async ({ locals, url, parent }) => {
  // See if the current url slug exists in the app pages array.
  const { currentPage } = await parent();

  // Bail early if the page is not found
  notFound(currentPage);

  // Get query params
  let page = checkNull(url.searchParams.get("page")) ?? 1;
  let limit = checkNull(url.searchParams.get("limit")) ?? locals?.settings?.page_limit ?? 15;
  
  // Setup for fetching
  let cast = [];
  let castFilteredCount = 0;
  let castTotalCount = 0;

  // Build filter object conditionally
  const filter = {...checkStatus(locals)};

  // Attempt to fetch data
  try {
    // Get all Cast based on the query parameters
    const resCast = await locals.comixCleric.db.find("cast", {
      filter,
      populate: {
        user_created: true,
        user_updated: true,
        cover: true,
        type: true,
      },
      limit: Number(limit),
      page: Number(page),
    });

    cast = resCast;

    // Get count of cast based on the query parameters
    const resCastFilteredCount = await locals.comixCleric.db.count(
      "cast",
      filter,
    );

    castFilteredCount = resCastFilteredCount;

    // Get count of cast based on the query parameters
    const resCastTotalCount = await locals.comixCleric.db.count("cast");

    castTotalCount = resCastTotalCount;
  } catch (e) {
    consoleError(e)
  }

  // Return what we have
  return {
    currentPage,
    cast: sanitizeUserRelations(cast),
    castFilteredCount,
    castTotalCount,
    customMeta: true,
  };
};
