// ADMIN-ONLY - Pulls a list of all users

// SvelteKit utilities
import { json } from "@sveltejs/kit";

// Utilities
import { checkAdmin } from "$lib/utils/api/auth.js";

// SvelteKit GET function
export async function GET({ url, locals, cookies }) {
  // Check admin status
  checkAdmin(locals);

  // Get query parameters
  let page = Number(url.searchParams.get("page")) ?? 1;
  let limit = Number(url.searchParams.get("limit")) ?? 24;
  let sort = url.searchParams.get("sort") ?? "username";

  // Attempt to fetch data
  try {
    // Get a paginated list of all users
    const users = await locals.comixCleric.db.find("user", {
      sort: [`${sort}`],
      limit: limit,
      page: page,
      populate: {
        avatar: true
      }
    });

    // Get a count of all unique users on the server
    const usersCount = await locals.comixCleric.db.count("user");

    // Create a custom JSON response object
    const res = json({ users: users, user_count: usersCount });

    // Return response data
    return res;
  } catch (error) {
    // Return an error JSON response object
    return json({ error: "Failed to fetch users." });
  }
}
