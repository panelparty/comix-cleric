// Public endpoint that takes the user to the most recent comic update

// SvelteKit utilities
import { redirect } from "@sveltejs/kit";

// Utilities
import { checkStatus } from "$lib/utils/api/auth.js";
import { consoleError } from "$lib/utils/debug.js";

// SvelteKit GET function
export async function GET({ locals }) {

  let page = {};

  // Attempt to find the latest update on the server
  try {
    const res = await locals.comixCleric.db.find("updates", {
      sort: "date_published",
      filter: {
        ...checkStatus(locals),
      },
      fields: [
        'slug'
      ]
    });
    page = res[0];
  } catch (e) {
    consoleError(e)
  }

  // Reassign the first object in the array to something we can keep track of more easily

  // Redirect to the reader path with the latest page slug appended.
  // TODO: Add fail state and error handling
  throw redirect(303, `/comic/${page?.slug}`);
}
