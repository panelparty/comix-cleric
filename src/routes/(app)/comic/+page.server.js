// SvelteKit utilities
import { redirect } from "@sveltejs/kit";

// Standard SvelteKit load function
export const load = async () => {
  // No one should be here, return to the archive page.
  throw redirect(303, "/archive");
};
