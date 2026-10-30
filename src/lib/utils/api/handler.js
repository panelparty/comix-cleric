// -- Handlers, helpers, and utilities for server-side actions -- //
// WARNING: Do NOT import these into any client files or functions.

// SvelteKit Utilities
import { isHttpError, isRedirect } from "@sveltejs/kit";

// Utilities
import { checkAdmin, checkUser, sanitizeUserRelations } from "$lib/utils/api/auth.js";
import { consoleError } from "../debug";

// Make sure error messages are displayed
function normalizeError(e) {
  return e?.message || e?.errors?.[0]?.message || "Something went wrong.";
}

// Form action wrapper (handles common configs)
export function formAction(handler, options = {}) {
  // Set default options
  const {
    admin = true,
    user = true,
    sanitizeUser = true,
    logs = true
  } = options;

  // Setup request response
  return async (event) => {
    // Get data from the event
    const { request, locals } = event;

    // Optionally check for admin status (default: true)
    if (admin) checkAdmin(locals);
    
    // Optionally check for authenticated user (default: true)
    if (user) checkUser(locals);

    // Prepare to destructure form data (don't consume it automatically, that is unsafe)
    const data = await request.formData();
    const action = data.get("action");

    // Prepare to send the request
    try {
      // Build submission handler
      const result = await handler({
        event, // Provide original event object
        ...event, // Get the parameters provided by the event object
        data, // Provide form data
        db: locals?.comixCleric?.db, // Shorten the database chain
        auth: locals?.comixCleric?.auth, // Shorten the auth chain
        storage: locals?.comixCleric?.storage, // Shorten the storage chain
        email: locals?.comixCleric?.email, // Shorten the email chain
        user: locals?.user, // Provide user data from locals
        isAdmin: locals?.isAdmin, // Provide admin status from locals
      });

      // If we get a result and it is a failure
      if (result && result.success === false) {
        // Return the action used and the result, or just the result
        return action != null ? { action, ...result } : result;
      }

      // Sanitize all user data in the resulting data
      const payload = sanitizeUser
        ? sanitizeUserRelations(result ?? {}, locals?.isAdmin)
        : (result ?? {});

      // Return the expected form action structure (expects at least: { success: <boolean> })
      // Include the action and/or payload by default
      return action != null
        ? { success: true, action, ...payload }
        : { success: true, ...payload };
    } catch (e) {
      // Handle HTTP errors and redirects
      if (isHttpError(e) || isRedirect(e)) throw e;

      // Log the error to the server console
      if (logs) consoleError(e);
      
      // Return the expected form action structure with errors
      return action != null
        ? { success: false, action, error: normalizeError(e) }
        : { success: false, error: normalizeError(e) };
    }
  };
}


// Load function wrapper (handles common configs)
// TODO: NOT FINISHED YET
// WARNING: This might not even be possible with how SvelteKit load functions work.
export function loadData(handler, options = {}) {
  // Set default options
  const { admin = true, sanitizeUser = true, logs = false } = options;

  // Setup request response
  return async (event) => {
    // Get data from the event
    const { locals } = event;

    // Optionally check for admin status (default: true)
    if (admin) checkAdmin(locals);

    // Prepare to send the request
    try {
      // Build submission handler
      const result = await handler({
        ...event, // Get the event data
        data, // Provide form data
        db: locals?.comixCleric?.db, // Shorten the database chain
        auth: locals?.comixCleric?.auth, // Shorten the auth chain
        storage: locals?.comixCleric?.storage, // Shorten the storage chain
        user: locals?.user, // Provide user data from locals
      });

      // Sanitize all user data in the resulting data
      const payload = sanitizeUser
        ? sanitizeUserRelations(result ?? {}, locals?.isAdmin)
        : (result ?? {});

      // Return the expected form action structure (expects at least: { success: <boolean> })
      // Include the action and/or payload by default
      return { ...payload };
    } catch (e) {
      // Handle HTTP errors and redirects
      if (isHttpError(e) || isRedirect(e)) throw e;

      // Log the error to the server console
      if (logs) consoleError(e);
      
      // Return the expected form action structure with errors
      return { error: normalizeError(e) };
    }
  };
}
