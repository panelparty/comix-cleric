// SvelteKit utility imports

// Utility imports
import { consoleError } from "$lib/utils/debug";
import { checkNull } from "$lib/utils/detectTypes.js";
import { uploadFilesAction } from "$lib/utils/uploadActions.js";

// Custom sanitizer function
// TODO: Move to utility file
function sanitizeFile(file) {
  // Strip unwanted characters and tags
  const sanitizedName = file.name
    .replace(/[<>:"/\\|?*]/g, "")
    .replace(/\s+/g, "_")
    .replace(/_{2,}/g, "_")
    .replace(/^_|_$/g, "")
    .substring(0, 255);

  // Return file object with new name
  return new File([file], sanitizedName, {
    type: file.type,
    lastModified: file.lastModified,
  });
}

// SvelteKit load function
export const load = async ({ url, params, locals }) => {
  // Get query parameters from request
  let page = checkNull(url.searchParams.get("page")) ?? 1;
  let limit = checkNull(url.searchParams.get("limit")) ?? 15;
  let sort = url.searchParams.get("sort") ?? "-uploaded_on";
  let type = url.searchParams.get("type") ?? "*";

  // Setup for fetching
  let files = [];
  let fileCount = 0;

  // Setup for filtering
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

  // Attempt to fetch data
  try {
    // Get paginated files
    const resFiles = await locals.comixCleric.storage.findFiles({
      sort: sort,
      ...(Object.keys(filter).length > 0 && { filter }),
      limit: Number(limit),
      page: Number(page),
    });

    files = resFiles;

    // Get count of all files
    fileCount = await locals.comixCleric.storage.countFiles();
  } catch (e) {
    consoleError(e);
  }

  return {
    files,
    fileCount,
  };
};

// Upload action for media files
export const actions = {
  uploadFiles: uploadFilesAction,
};
