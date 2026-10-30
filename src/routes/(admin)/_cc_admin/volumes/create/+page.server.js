import { uploadFilesAction } from "$lib/utils/uploadActions.js";

export const load = async ({ params, locals }) => {
  let id = params.id;

  const volumes = await locals.comixCleric.db.find("volumes", {
    sort: ["-date_published"],
    fields: ["*", "cover.*", "series.*", "chapters.*", "updates.*"],
  });

  return {
    volumes: volumes,
  };
};

// Form actions
export const actions = {
  uploadFiles: uploadFilesAction,
};
