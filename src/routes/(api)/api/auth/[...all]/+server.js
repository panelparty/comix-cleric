// Catch-all route for authentication requests.

// SvelteKit GET function
export async function GET({ locals, request }) {
  // Pass GET events into the auth handler
  return locals.comixCleric.auth.handler(request);
}

// SvelteKit GET function
export async function POST({ locals, request }) {
  // Pass GET events into the auth handler
  return locals.comixCleric.auth.handler(request);
}
