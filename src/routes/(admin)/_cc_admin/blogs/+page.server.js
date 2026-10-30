import { addFilter } from "$lib/utils/api/query.js";
import { checkNull } from "$lib/utils/detectTypes.js";
import { find } from "lodash-es";

// SvelteKit load function
export const load = async ({ url, locals }) => {
  // Get query parameters
  let page = checkNull(url.searchParams.get("page")) ?? 1;
  let limit = checkNull(url.searchParams.get("limit")) ?? locals?.settings?.page_limit ?? 15;
  let sort = url.searchParams.get("sort") ?? "-date_published";
  let status = url.searchParams.get("status") ?? "*";
  let type = url.searchParams.get("type") ?? "*";

  // Setup for fetching
  let blogs = [];
  let blogsCount = 0;
  let blogsCountTotal = 0;
  let categories = [];

  // Setup filter object
  const filter = {};

  try {
    
    // Get filtered blog post count
    const resBlogsCount = await locals.comixCleric.db.count("blogs", filter);
    
    blogsCount = resBlogsCount;
    
    // Get unfiltered (total) blog post count
    const resBlogsCountTotal = await locals.comixCleric.db.count("blogs");
    
    blogsCountTotal = resBlogsCountTotal;
    
    // Get all blog post categories
    const resCategories = await locals.comixCleric.db.find("blog_types");
    
    categories = resCategories;

    addFilter(filter, "type", type, find(categories, { slug: type })?.id);
    addFilter(filter, "status", status, { _eq: status });


    // Get filtered blog posts
    const resBlogs = await locals.comixCleric.db.find("blogs", {
      sort: [`${sort}`],
      filter: filter,
      populate: {
        type: true,
        cover: true
      },
      limit: Number(limit),
      page: Number(page),
    });

    blogs = resBlogs;
  } catch (e) {
    // ...
  }

  // Return what we have
  return {
    blogs,
    blogsCount,
    blogsCountTotal,
    categories,
  };
};
