// Handles the "direct" route for always finding numbered comic pages

// SvelteKit imports
import { redirect } from "@sveltejs/kit";

// Utilities
import { checkStatus } from "$lib/utils/api/auth";
import { consoleError } from "$lib/utils/debug.js";
import { error } from "@sveltejs/kit";

// Standard SvelteKit load function
export const GET = async ({ locals, url, params }) => {
  if(
    url?.pathname?.startsWith('/_cc_api') ||
    url?.pathname?.startsWith('/api')
  ) {
    return;
  }

  // Prepare to locate update
  let update = null;

  // If we are using the matching direct link string and id parameters
  if (
    params?.direct === (locals?.settings?.locator_url ?? "rd") &&
    params?.id
  ) {
    // Attempt to fetch the update by page number
    try {
      const resUpdate = await locals.comixCleric.db.find("updates", {
        filter: {
          ...checkStatus(locals),
          number: {
            _eq: Number(params?.id),
          },
        },
        limit: 1,
        fields: [
          "slug",
        ]
      });
      
      // If we get a response, assign the first result in the array
      update = resUpdate[0];

      // Redirect to the update
    } catch (e) {
      // Check if it's a redirect error (which is expected behavior)
      consoleError(e)
      throw error(404, "Not found");
    }
  }
  
  // Redirect to the located page
  throw redirect(303, `/comic/${update?.slug}`);
};
