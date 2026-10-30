import { checkStatus, sanitizeUserRelations } from "$lib/utils/api/auth";
import { consoleLog } from "$lib/utils/debug.js";
import { notFound } from "$lib/utils/detectTypes.js";

// Standard SvelteKit load function
export const load = async ({ locals, params }) => {
  // Get the slug from the request URL params
  const slug = params?.slug;

  // Setup for fetching
  let blog = {};
  let blog_prev = {};
  let blog_next = {};

  // Attempt to fetch data
  try {
    // Fetch current blog
    const resBlog = await locals.comixCleric.db.find("blogs", {
      filter: { slug: slug, ...checkStatus(locals) },
      populate: {
        cover: true,
        type: true,
        user_created: true,
        user_created: {
          avatar: true
        }
      },
    });
    blog = resBlog?.[0];

    const resBlogPrev = await locals.comixCleric.db.find("blogs", {
      limit: 1,
      filter: {
        date_published: {
          _lt: blog?.date_published
        }
      },
      fields: [
        "type",
        "name",
        "slug",
        "cover",
        "date_published",
      ],
      populate: {
        cover: true,
        type: true,
      },
    });
    blog_prev = resBlogPrev?.[0];

    const resBlogNext = await locals.comixCleric.db.find("blogs", {
      limit: 1,
      filter: {
        date_published: {
          _gt: blog?.date_published
        }
      },
      fields: [
        "type",
        "name",
        "slug",
        "cover",
        "date_published",
      ],
      populate: {
        cover: true,
        type: true,
      },
    });
    blog_next = resBlogNext?.[0];
  } catch {}

  consoleLog(
    "Blog:", blog,
    "\n\nPrevious Blog:", blog_prev,
    "\n\nNext Blog:", blog_next,
  );

  // If the response is empty, throw a 404 (not found) error
  notFound(blog);

  // Return what we have
  return {
    blog: sanitizeUserRelations(blog),
    blog_prev: sanitizeUserRelations(blog_prev),
    blog_next: sanitizeUserRelations(blog_next),
    customMeta: true,
  };
};
