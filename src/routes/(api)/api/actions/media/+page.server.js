// Handles form actions for creating/updating/deleting volumes

// Utilities
import { formAction } from '$lib/utils/api/handler';
import { sanitizeFields } from "$lib/utils/sanitize/output.js";
import { uploadFilesAction } from '$lib/utils/uploadActions.js';

export const actions = {
  // -- Upload actions -- //
  // Handles uploading any and all files provided to it.
  upload: uploadFilesAction,


  // Update media file
  update: formAction(async ({ data, storage }) => {
    const id = data.get("id");
    const action = data.get("action");
    const status = data.get("status");
    const title = data.get("title");
    const filename_download = data.get("filename_download");
    const desc = data.get("desc");


    const sanitized = sanitizeFields({
			title,
			filename_download
		});


    // Update file metadata
    const res = await storage.updateFile(id, {
      title: sanitized?.title,
      filename_download: sanitized?.filename_download,
      description: desc != "" ? desc : "No description provided...",
    });


    return {};
  }),

  
  // Delete media item from server
  delete: formAction(async ({ data, db, storage }) => {
    const id = data.get("id");


    // Submit delete request and await response
    await storage.delete(id);
    await db.delete("files", id);


    return { action: "delete" };
  }),
}