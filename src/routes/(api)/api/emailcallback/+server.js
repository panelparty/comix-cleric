// Checks email verification status

// SvelteKit utilities
import { redirect } from "@sveltejs/kit";

// SvelteKit GET function
export function GET({ url }) {
  // Check for errors
  const error = url.searchParams.get("error");

  // Redirect with error
  if (error) {
    throw redirect(302, `/?error=${encodeURIComponent(error)}`);
  }
  
  // Redirect with success
  throw redirect(302, "/?email=verified");
}
