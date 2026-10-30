// Handles forgot password reset requests

// Utilities
import { formAction } from "$lib/utils/api/handler.js";
import { consoleError } from "$lib/utils/debug.js";
import { emailSchema, serverValidate } from "$lib/utils/validation/schema.js";

// Form actions
export const actions = {
  request: formAction(async ({data, db, auth, locals}) => {
    // Get form data
    const email = data.get("email");

    // Check data that must match a strict schema
    const invalid = serverValidate(
      [emailSchema, email],
    );
    if (invalid) return invalid;
    
    // Convert email to lowercase
    const emailNormalized = email.toLowerCase();

    // Send reset
    try {
      await auth.api.requestPasswordReset({
        body: { email: emailNormalized, redirectTo: "/api/auth/resetPassword" },
      });
    } catch (e) {
      consoleError(e);
    }

    return { success: true };
  }, {
    admin: false,
    user: false
  }),
};
