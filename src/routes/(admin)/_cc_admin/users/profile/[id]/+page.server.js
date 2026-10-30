// Better Auth admin imports - now using comixCleric auth namespace
import { uploadFilesAction } from "$lib/utils/uploadActions.js";

// SvelteKit load function
export const load = async (event) => {
  // Get user id from request params
  const id = event.params?.id;

  // Setup for data fetching
  let userData = {};

  const resUser = await event.locals.comixCleric.db.findOne(
    "user",
    id,
    {
      populate: {
        avatar: true,
      },
    },
  );

  const resGuest = await event.locals.comixCleric.db.findOne(
    "guests",
    id,
    {
      populate: {
        avatar: true,
      },
    },
  );

  // Return what have
  return {
    userData: resUser ?? resGuest,
  };
};

// Form actions
export const actions = {
  uploadFiles: uploadFilesAction,
};
