// Handles form actions for creating/updating/deleting volumes

// Utilities
import { formAction } from '$lib/utils/api/handler';
import { sanitizeCSS } from '$lib/utils/validation/css.js';
import { serverValidate } from '$lib/utils/validation/schema';
import { slugSchema } from '$lib/utils/validation/schema';

export const actions = {
	// Creates only a basic user for safety
  create: formAction(async ({ data, db, user }) => {
    const status = data.get("status");
    const action = data.get("action");
    const name = data.get("name");
    const slug = data.get("slug");
    const code = data.get("code");

    const invalid = serverValidate(
      [slugSchema, slug]
    );
    if (invalid) return invalid;

    const cleanCSS = await sanitizeCSS(code);

    // Submit user data and await response
    const res = await db.create("themes", {
      status: status ?? action ?? "published",
      name,
      slug,
      code: cleanCSS,
      user_created: user?.id,
      user_updated: user?.id,
    });

    return { new_item: res };
  }),

  // Creates only a basic user for safety
  update: formAction(async ({ data, db, user }) => {
    const id = data.get("id");
    const status = data.get("status");
    const action = data.get("action");
    const name = data.get("name");
    const slug = data.get("slug");
    const code = data.get("code");

    const invalid = serverValidate(
			[slugSchema, slug]
		);
		if (invalid) return invalid;

    const cleanCSS = await sanitizeCSS(code);

    // Submit user data and await response
    const res = await db.update("themes", id, {
      status: status ?? action ?? "published",
      name,
      slug,
      code: cleanCSS,
      user_updated: user?.id,
    });

    return {};
  }),
  
  // Delete user from server
  delete: formAction(async ({ data, db }) => {
    const id = data.get("id");

    const res = await db.delete("themes", id);

    return { action: "delete" };
  }),
};