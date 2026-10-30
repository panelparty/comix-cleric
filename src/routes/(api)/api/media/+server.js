// Fetches a list of media files

// SvelteKit utilities
import { json } from "@sveltejs/kit";

// Utilities
import { consoleError, consoleLog } from "$lib/utils/debug.js";

// SvelteKit GET function
export async function GET({ url, locals }) {
  // Get query parameters
  let page = Number(url.searchParams.get("page")) ?? 1;
  let limit = Number(url.searchParams.get("limit")) ?? 24;
  let sort = url.searchParams.get("sort") ?? "uploaded_on";
  let type = url.searchParams.get("type") ?? "*";

  // If no query params at all, this is likely an invalid request (e.g., browser looking for an image)
  if (
    !url.searchParams.has("page") &&
    !url.searchParams.has("limit") &&
    !url.searchParams.has("sort") &&
    !url.searchParams.has("type")
  ) {
    return json({ error: "Invalid request" }, { status: 400 });
  }

  // Setup filter object
  let filter = {};
  const mediaTypes = type
    .replaceAll("*", "")
    .split(",")
    .filter((t) => t !== "");

    
  if (mediaTypes?.length === 1) {
    filter.type = { _starts_with: mediaTypes[0]};
  } else if (mediaTypes?.length > 1) {
    filter = {
      _or: [
        mediaTypes.forEach(element => {
          return { type: { _starts_with: element }}
        })
      ]
    }
  }

  // If there is a comixCleric connection and the user is an admin
  if (locals.comixCleric && locals.isAdmin) {
    // Attempt to get data
    try {
      // Get all media files that fit the query
      const mediaFiles = await locals.comixCleric.db.find("files", {
        sort,
        ...(Object.keys(filter).length > 0 && { filter }),
        limit,
        page,
      });

      // Return count of all media files
      const mediaCount = await locals.comixCleric.db.count(
        "files",
        Object.keys(filter).length > 0 ? filter : {},
      );


      return json({
        media_files: mediaFiles,
        media_count: mediaCount,
      });
    } catch (e) {
      consoleError(e);
      return json({ error: "Failed to fetch media files." });
    }
  }
}
