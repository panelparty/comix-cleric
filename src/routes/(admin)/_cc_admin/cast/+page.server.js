// Utility imports
import { addFilter } from "$lib/utils/api/query.js";
import { checkNull } from "$lib/utils/detectTypes.js";
import { find } from "lodash-es";

// SvelteKit load function
export const load = async ({ url, locals }) => {
  // Get query parameters from request
  let page = checkNull(url.searchParams.get("page")) ?? 1;
  let limit = checkNull(url.searchParams.get("limit")) ?? locals?.settings?.page_limit ?? 15;
  let sort = url.searchParams.get("sort") ?? "-date_published";
  let status = url.searchParams.get("status") ?? "*";
  let type = url.searchParams.get("type") ?? "*";

  // Setup for fetching
  let cast = [];
  let castCount = 0;
  let castCountTotal = 0;
  let castTypes = [];

  // Setup for filters
  const filter = {};


  try {
    
    // Get all cast types
    const resCastTypes = await locals.comixCleric.db.find("cast_types");
    
    castTypes = resCastTypes;

    // Build filters
    addFilter(filter, "status", status, { _eq: status });
    addFilter(filter, "type", type, find(castTypes, { slug: type })?.id);

    // Get count of all cast items
    const resCastCount = await locals.comixCleric.db.count("cast", {filter});
    
    castCount = resCastCount;
    
    // Get count of filtered cast items
    const resCastCountTotal = await locals.comixCleric.db.count("cast");
    
    castCountTotal = resCastCountTotal;


    // Get filtere cast
    const resCast = await locals.comixCleric.db.find("cast", {
      sort: [`${sort}`],
      filter: filter,
      populate: {
        type: true,
        cover: true,
      },
      limit: Number(limit),
      page: Number(page),
    });

    cast = resCast;
  } catch (e) {
    // ...
  }

  // Return what we have
  return {
    cast,
    filtered_cast_count: castCount,
    cast_count: castCountTotal,
    castTypes,
  };
};
