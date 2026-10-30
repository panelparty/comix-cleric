import { error, redirect } from "@sveltejs/kit";

import { consoleError } from "$lib/utils/debug";

export async function serveFile(storage, filename) {
  try {
    if (!filename || filename === "undefined") {
      throw error(404, "File not found");
    }

    const result = await storage.serveFile(filename);

    if (result.redirectUrl) {
      throw redirect(302, result.redirectUrl);
    }

    return new Response(result.buffer, {
      headers: {
        "Content-Type": result.contentType,
        "Content-Length": result.filesize.toString(),
        "Cache-Control": "private, max-age=3600",
        "Content-Disposition": `inline; filename="${result.filename}"`,
      },
    });
  } catch (err) {
    if (err?.status === 302) {
      throw err;
    }
    consoleError("Error serving file: ", err);
    throw error(404, "File not found");
  }
}
