// SvelteKit utility imports
import { formAction } from "$lib/utils/api/handler";
import { consoleLog } from "$lib/utils/debug.js";

// Standard SvelteKit actions
export const actions = {
  // Admin-only Test endpoint
  // Use this to make sure you are able to hit the endpoint from a form.
  test: formAction(async () => {
    consoleLog("Test endpoint hit!");
    return {};
  }),
};
