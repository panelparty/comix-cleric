// Handles email change requests

// SvelteKit utilities
import { fail, redirect } from "@sveltejs/kit";

// Utilities
import { formAction } from "$lib/utils/api/handler.js";
import { emailSchema, serverValidate } from "$lib/utils/validation/schema.js";

// Form actions
export const actions = {
  default: formAction(async ({data, auth, locals}) => {
    if (!locals.user)
      throw redirect(302, "/auth");

    // Get form data
    let new_email = data.get("new_email");

    // Check data that must match a strict schema
    const invalid = serverValidate(
      [emailSchema, new_email],
    );
    if (invalid) return invalid;
    
    // Convert email to lowercase
    new_email = new_email.toLowerCase();

    try {
      await auth.api.changeEmail({
        body: { new_email, callbackURL: "/api/emailcallback" },
        headers: request.headers,
      });
      return { message: "Check your current inbox to confirm the change." };
    } catch (e) {
      return fail(400, { error: e.message || "Email change failed." });
    }
  }),
};
