// Safely return media files from storage

// Utilities
import { serveFile } from "$lib/ComixClericLib/serveFile.js";

// SvelteKit GET function
export async function GET({ locals, params }) {
  // Fetch media from storage
  return await serveFile(locals.comixCleric.storage, params.file_name);
}
