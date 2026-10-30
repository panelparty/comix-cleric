// Utility imports
import { addFilter } from "$lib/utils/api/query.js";
import { checkNull } from "$lib/utils/detectTypes.js";
import { find } from "lodash-es";

// SvelteKit load function
export const load = async ({ url, locals }) => {
  // Get query paramters from request
  let page = checkNull(url.searchParams.get("page")) ?? 1;
  let limit = checkNull(url.searchParams.get("limit")) ?? 15;
  let sort = url.searchParams.get("sort") ?? "-date_published";
  let status = url.searchParams.get("status") ?? "*";
  let type = url.searchParams.get("type") ?? "*";

  // Setup for fetching
  let gallery = [];
  let galleryCount = 0;
  let galleryCountTotal = 0;
  let categories = [];

  // Setup for filters
  const filter = {};

  try {
    // Get all gallery categories
    const resCategories = await locals.comixCleric.db.find("gallery_types");

    categories = resCategories;

    // Build filters
    addFilter(filter, "status", status, { _eq: status });
    addFilter(filter, "type", type, find(categories, { slug: type })?.id);

    // Get filtered gallery item count
    const resGalleryCount = await locals.comixCleric.db.count(
      "gallery",
      filter,
    );

    galleryCount = resGalleryCount;

    // Get total gallery item count
    const resGalleryCountTotal = await locals.comixCleric.db.count("gallery");

    galleryCountTotal = resGalleryCountTotal;


    // Get filtered gallery items
    const resGallery = await locals.comixCleric.db.find("gallery", {
      sort: [`${sort}`],
      filter,
      populate: {
        cover: true,
        type: true,
      },
      limit: Number(limit),
      page: Number(page),
    });

    gallery = resGallery;
  } catch (e) {
    // ...
  }

  // Return what we have
  return {
    gallery,
    galleryCount,
    galleryCountTotal,
    categories,
  };
};
