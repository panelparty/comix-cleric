// Utility imports
import { checkStatus, sanitizeUserRelations } from "$lib/utils/api/auth.js";
import { addFilter } from "$lib/utils/api/query.js";
import { checkNull, notFound } from "$lib/utils/detectTypes.js";

// Standard SvelteKit load function
export const load = async ({ locals, url, parent }) => {
  // See if the current url slug exists in the app pages array.
  const { currentPage } = await parent();

  // Bail early if the page is not found
  notFound(currentPage);

  // Get query parameters
  let page = checkNull(url.searchParams.get("page") ?? 1);
  let limit = checkNull(url.searchParams.get("limit")) ?? locals?.settings?.page_limit ?? 15;
  let sort = url.searchParams.get("sort") ?? "-date_published";
  let category = url.searchParams.get("category") ?? "*";
  let tab = url.searchParams.get("tab") ?? "*";

  // Setup for fetching
  let blogs = [];
  let blogCategories = [];
  let blogsCount = 0;
  let blogsFilteredCount = 0;
  let years = [];
  let months = [];

  // Build filter object conditionally
  const filter = {...checkStatus(locals)};

  // Add each filter type
  if (category && category != "*") {
    addFilter(filter, "category", category, { slug: { _eq: category } });
  }

  // Attempt to fetch data
  try {
    // Get all (visible) Blogs
    const resBlogs = await locals.comixCleric.db.find("blogs", {
      sort: [`${sort}`],
      filter: filter,
      populate: {
        cover: true,
        type: true,
        user_created: true,
        user_created: {
          avatar: true
        }
      },
      limit: Number(limit),
      page: Number(page),
    });

    blogs = resBlogs;

    // Get all (visible) Categories
    const resCategories = await locals.comixCleric.db.find("blog_types", {
      filter: {
        ...checkStatus(locals)
      }
    });

    blogCategories = resCategories;

    // Get a count of blogs based on the query params
    const resBlogsFilteredCount = await locals.comixCleric.db.count(
      "blogs",
      filter,
    );

    blogsFilteredCount = resBlogsFilteredCount;

    // Get a count of all (visible) blog posts
    const resBlogsCount = await locals.comixCleric.db.count("blogs", {
      filter: {
        ...checkStatus(locals),
      }
    });

    blogsCount = resBlogsCount;

    // TODO: Implement year/month grouping in comixCleric
    // For now, return empty arrays
    years = [];
    months = [];
  } catch (e) {
    // ...
  }

  // Return what we have
  return {
    currentPage,
    blogs: sanitizeUserRelations(blogs),
    blogCategories,
    blogs_filtered_count: blogsFilteredCount,
    blogs_count: blogsCount,
    years,
    months,
    customMeta: true,
  };
};
