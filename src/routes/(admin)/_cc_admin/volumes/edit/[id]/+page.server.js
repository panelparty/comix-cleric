import { uploadFilesAction } from "$lib/utils/uploadActions.js";

export const load = async ({ params, locals }) => {
  let id = params.id;
  const volume = await locals.comixCleric.db.findOne("volumes", id, {
    populate: {
      cover: true,
    },
  });

  return {
    volume: volume,
  };
};

// Form actions
export const actions = {
  uploadFiles: uploadFilesAction,
};
