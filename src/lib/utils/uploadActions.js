// Reusable SvelteKit form action for handling file uploads.

// Utilities
import { formAction } from "./api/handler";
import { fileValidation } from "$lib/utils/validation/scan.js";
import { sanitizeFile } from "$lib/utils/validation/files.js";
import { ALLOWED_EXT } from "./validation/schema";


// Validates and uploads one or more files through the storage adapter.
// Requires the user to be authenticated and have admin access.
export const uploadFilesAction = formAction(async ({ data, storage }) => {
  const files = data.getAll("file-uploader");
  const validFiles = [];

  for (let i = 0; i < files.length; i++) {
    const cleanFileName = sanitizeFile(files[i]);
    const isValid = await fileValidation(cleanFileName, ALLOWED_EXT);

    if (isValid?.safe) {
      validFiles.push(cleanFileName);
    } else return {success: false, error: isValid?.error};
  }

  let res;
  if (validFiles?.length > 1) {
    res = await storage.uploadMultiple(validFiles);
  } else {
    res = await storage.upload(validFiles?.[0]);
  }

  return { new_files: res };
});