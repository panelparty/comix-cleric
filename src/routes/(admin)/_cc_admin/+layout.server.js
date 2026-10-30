import { sanitizeAdminUser } from "$lib/utils/api/auth.js";

// Standard SvelteKit load function
export const load = async (event) => {
  // If a user is authenticated, return their (sanitized) data as well.
  if (event.locals.user) {
    const res = await event.locals.comixCleric.db.findOne(
      "user",
      event.locals.user?.id,
      {
        populate: {
          avatar: true,
        },
      },
    );

    return {
      user: sanitizeAdminUser(res),
    };
  }

  // Otherwise, return what we have.
  return {
    user: null,
  };
};
