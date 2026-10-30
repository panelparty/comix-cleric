// Svelte utilities
import type { Handle } from "@sveltejs/kit";
import { json, text } from "@sveltejs/kit";

// Handle CSRF protections
export function csrf(
  allowedPaths: string[],
  allowedOrigins: string[] = [],
): Handle {
  return async ({ event, resolve }) => {
    const { request, url } = event;

    const requestOrigin = request.headers.get("origin");

    const serverOrigin = url.origin;

    const isSameOrigin = !requestOrigin || requestOrigin === serverOrigin;

    const isAllowedOrigin = allowedOrigins.includes(requestOrigin ?? "");

    const forbidden =
      isFormContentType(request) &&
      ["POST", "PUT", "PATCH", "DELETE"].includes(request.method) &&
      !isSameOrigin &&
      !isAllowedOrigin &&
      !allowedPaths.includes(url.pathname);

    if (forbidden) {
      const message = `Cross-site ${request.method} form submissions are forbidden`;

      if (request.headers.get("accept") === "application/json") {
        return json({ message }, { status: 403 });
      }
      return text(message, { status: 403 });
    }

    return resolve(event);
  };

  function isFormContentType(request: Request) {
    const type =
      request.headers
        .get("content-type")
        ?.split(";", 1)[0]
        .trim()
        .toLowerCase() ?? "";
    return [
      "application/x-www-form-urlencoded",
      "multipart/form-data",
      "text/plain",
    ].includes(type);
  }
}
