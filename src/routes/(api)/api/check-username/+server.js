// Checks if a username is already in-use in the database

// Utilities
import { consoleError } from "$lib/utils/debug.js";
import { json } from "@sveltejs/kit";

// SvelteKit GET function
export async function GET({ url, locals }) {
  // Get search params
  const username = url.searchParams.get("username");

  // If no username, or query is too short
  if (!username || username.length < 3) {
    // Return false
    return json({ exists: false });
  }

  // Attempt to check username
  try {
    // Fetch user based on query (exact matches only)
    const user = await locals.comixCleric.db.findOneBy("user", {
      name: { _eq: username }
    });

    // If results exist, return true
    return json({ exists: !!user });
  } catch (e) {
    // Log errors
    consoleError(e);

    // Return false
    return json({ exists: false });
  }
}
