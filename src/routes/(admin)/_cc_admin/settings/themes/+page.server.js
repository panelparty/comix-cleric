// Utility imports
import { sanitizeFields } from "$lib/utils/sanitize/output.js";
import { uploadFilesAction } from "$lib/utils/uploadActions.js";
import { checkAdmin } from "$lib/utils/api/auth.js";
import { consoleError } from "$lib/utils/debug.js";

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
export const load = async ({ locals }) => {
  // Setup for data fetching
  let themes = [];

  // Attempt to fetch data
  try {
    // Get all themes
    const resThemes = await locals.comixCleric.db.find("themes");

    themes = resThemes;
  } catch (e) {
    // ...
  }

  // Return what we have
  return { themes };
};

// Form actions
// TODO: Move to the (api) directory
export const actions = {
  uploadFiles: uploadFilesAction,

  // Update theme settings
  updateTheme: async ({ request, locals, cookies }) => {
    checkAdmin(locals);

    // Get form data
    const data = await request.formData();
    const theme = data.get("theme");

    // Sanitize
    const sanitized = sanitizeFields({
      theme,
    });

    // Attempt to update data
    try {
      // Update global settings in the database
      // First, get the current globals document
      const currentGlobals = await locals.comixCleric.db.find("globals", {
        limit: 1,
        fields: ["id"],
      });

      if (currentGlobals.length > 0) {
        const resGlobals = await locals.comixCleric.db.update(
          "globals",
          currentGlobals[0].id,
          {
            theme: sanitized?.theme,
          },
        );
      }

      // Return success state
      return { success: true };
    } catch (e) {
      consoleError(e);
      // Return fail state and error message
      // TODO: Get an appropriate error message.
      return { success: false, error: "Could not update settings." };
    }
  },
};
