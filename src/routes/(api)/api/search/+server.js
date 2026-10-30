// Searches for a list of database entries in a set of whitelisted collections

// SvelteKit utility imports
import { checkAdmin, checkStatus } from "$lib/utils/api/auth.js";
import { checkNull } from "$lib/utils/detectTypes.js";

// SvelteKit GET function
export async function GET({ locals, url }) {
  // Check admin status
  // TODO: Remove this when finalizing the search functionality.
  checkAdmin(locals);

  // Get query parameters
  const collection = url?.searchParams.get("collection");
  const terms = url?.searchParams.get("terms");
  const limit = url?.searchParams.get("limit");

  // Explicit collection allow-list
  const allowedCollections = ["chapters", "pages", "blogs", "updates", "gallery", "cast"];
  if (!allowedCollections.includes(collection)) {
    return new Response(JSON.stringify([]), { status: 400 });
  }

  // Apply status filter for non-admins
  const filter = {
    ...checkStatus(locals),
    _or: [
      { title: { _contains: terms } },
      { slug: { _contains: terms } },
      { page_number: { _eq: terms } },
      { transcript: { _contains: terms } },
      { blurb: { _contains: terms } },
      { authors_note: { _contains: terms } },
    ],
  };

  // Attempt to get data
  try {
    // Await search query
    // TODO: Make the filter modular
    const res = await locals.comixCleric.db.find(collection, {
      filter,
      limit: checkNull(limit) ?? locals?.settings?.page_limit ?? 25,
    });

    // If the response is empty
    if (res.length < 1) {
      // Return an empty JSON response
      return new Response(JSON.stringify([]));
    }

    // Return a new JSON response with the data
    return new Response(JSON.stringify(res));
  } catch (e) {
    // Return an empty JSON response
    return new Response(JSON.stringify([]));
  }
}
