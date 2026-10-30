// Fetch a list of guest profiles

// SvelteKit utilities
import { json } from "@sveltejs/kit";

// SvelteKit GET function
export async function GET({ url, locals, cookies }) {
  // Get query parameters
  let page = Number(url.searchParams.get("page")) ?? 1;
  let limit = Number(url.searchParams.get("limit")) ?? 24;
  let sort = url.searchParams.get("sort") ?? "username";

  // Setup filter object
  const filter = {};

  // Add filter function
  const addFilter = (target, key, value, filterConfig) => {
    if (value !== "*") {
      target[key] = filterConfig;
    }
  };

  // If the client exists and the user is an admin
  if (locals.comixCleric && locals.isAdmin) {
    // Attempt to fetch data
    try {
      // Get a paginated list of all users
      const users = await locals.comixCleric.db.find("guests", {
        sort: [`${sort}`],
        limit: limit,
        page: page,
        populate: {
          avatar: true,
        },
      });

      // Get a count of all unique users on the server
      const usersCount = await locals.comixCleric.db.count("guests");

      // Create a custom JSON response object
      const res = json({ users: users, user_count: usersCount });

      // Return response data
      return res;
    } catch (error) {
      // Return an error JSON response object
      return json({ error: "Failed to fetch users." });
    }
  }
}
