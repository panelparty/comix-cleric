// Allows users to enter their new password after requesting a reset

// SvelteKit utilities
import { fail } from "@sveltejs/kit";

// Utilities
import { passSchema, serverValidate } from "$lib/utils/validation/schema.js";
import { checkNull } from "$lib/utils/detectTypes.js";
import { formAction } from "$lib/utils/api/handler.js";

// SvelteKit load function
export const load = async ({ url, setHeaders }) => {
  // Set request headers
  setHeaders({ 'referrer-policy': 'no-referrer' })

  // Return the token and/or error from the URL params
  return {
    token: url.searchParams.get("token"),
    error: url.searchParams.get("error"),
  };
}

// Form actions
export const actions = {
  // Request reset
  request: formAction(async ({ data, db, auth, user, locals }) => {
    // Send reset email
    await auth.api.requestPasswordReset({
      body: { email: user.email, redirectTo: "/api/auth/resetPassword" },
    });

    // Always return a success
    return { success: true };
  }, {
    admin: false,
    user: false
  }),

  // Reset password
  reset: formAction(async ({ data, locals, request, url }) => {
    // Get form data
    const token = data.get("token");
    const password = data.get("password");
    const password_confirm = data.get("passwordConfirm");

    // Reject if token is missing
    if (!token || !checkNull(token)) return fail(400, { error: "Missing reset token." });

    // Passwords must match
    if (password !== password_confirm) return fail(400, { error: "Passwords do not match." });

    // Check data that must match a strict schema
    const invalid = serverValidate(
      [passSchema, password],
      [passSchema, password_confirm],
    );
    if (invalid) return invalid;

    try {
      // Submit new password
      await auth.api.resetPassword({
        body: { token, newPassword: password },
      });
    } catch (e) {
      // Return an fail state
      return fail(400, { error: e.message || "Reset request failed." });
    }
    
    // Return nothing
    return {};
  }, {
    admin: false,
    user: false
  }),
};
