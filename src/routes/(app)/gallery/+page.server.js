// Utilities
import { checkStatus, sanitizeUserRelations } from "$lib/utils/api/auth.js";
import { consoleError } from "$lib/utils/debug.js";
import { checkNull, notFound } from "$lib/utils/detectTypes";

// SvelteKit load function
export const load = async ({ locals, url, parent }) => {
  // See if the current url slug exists in the app pages array.
  const { currentPage } = await parent();
  // Bail early if the page is not found
  notFound(currentPage);

  let page = checkNull(url.searchParams.get("page")) ?? 1;
  let limit =
    checkNull(url.searchParams.get("limit")) ??
    locals?.settings?.page_limit ??
    15;

  // Setup for fetching
  let gallery = [];
  let galleryCount = 0;
  let galleryTotalCount = 0;

  // Attempt to fetch data
  try {
    // Get all gallery items
    const resGallery = await locals.comixCleric.db.find("gallery", {
      filter: {
        ...checkStatus(locals),
      },
      sort: ["-date_published", "-date_created"],
      populate: {
        cover: true,
        type: true,
      },
      limit: Number(limit),
      page: Number(page),
    });
    gallery = resGallery;

    // Get a count of all gallery items
    const resGalleryCount = await locals.comixCleric.db.count("gallery", {
      filter: {
        ...checkStatus(locals),
      },
    });
    galleryCount = resGalleryCount;

    // Get a count of all gallery items
    const resGalleryTotalCount = await locals.comixCleric.db.count("gallery", {
      filter: {
        ...checkStatus(locals),
      },
    });
    galleryTotalCount = resGalleryTotalCount;
  } catch (e) {
    consoleError(e);
  }

  // Return what we have
  return {
    currentPage,
    gallery: sanitizeUserRelations(gallery),
    galleryCount,
    galleryTotalCount,
  };
};
