// Utilities
import { normalizeUrl, redirect } from "@sveltejs/kit";
import { isArray } from "lodash-es";
import { sequence } from "@sveltejs/kit/hooks";
import { csrf } from "./hooks/csrf";
import { validateRequest } from "$lib/utils/bots/botProtections";
import { consoleLog, consoleError, consoleWarn, consoleSuccess } from "$lib/utils/debug";
import { rateLimit } from "./hooks/rateLimit";

// ComixCleric client initialization
import { ComixCleric } from "$lib/ComixClericLib/ComixCleric.js";

// CRON Scheduler
import schedule from "node-schedule";

// Schedule a job to run every minute
schedule.scheduleJob("* * * * *", async () => {
  let db = ComixCleric()?.db;

  consoleLog("Checking scheduled posts...");

  try {
    const resScheduled = await db.find("post_schedule", {
      filter: {
        date_published: {
          _lte: new Date(),
        },
      },
    });

    if (isArray(resScheduled) && resScheduled?.length > 0) {
      consoleLog("Scheduled posts:", resScheduled);

      for (const item of resScheduled) {
        consoleLog("Publishing post:", item);
        
        try {
          const resPublished = await db.update(item?.post_type, item?.post_id, {
            status: "published",
          });
          consoleSuccess("Published post:", resPublished);

          const resCleanUp = await db.delete("post_schedule", item?.id);
          consoleLog("Scheduled post removed:", resCleanUp);
        } catch (e) {
          consoleError(
            "Something went wrong with publishing, please investigate.",
            resScheduled,
            e
          );
        }
      }
    } else {
      consoleLog("Nothing to publish.");
    }
  } catch (e) {
    consoleError("Schedule error:", e);
  }
});

// Syntax highlighter for Markdown (Shiki)
import { highlighterPromise } from '$lib/utils/highlighter.js';
import { sanitizeInput } from "$lib/utils/sanitize/input";
await highlighterPromise;

// Define paths exempt from CSRF checks (e.g., public forms or APIs)
const allowedPaths = [];

// Define trusted origins allowed to make cross-origin form submissions
const allowedOrigins = [];

// Main hooks handler function
export const handle = sequence(
  csrf(allowedPaths, allowedOrigins),
  async ({ event, resolve }) => {
    // Initialize ComixCleric first - auth will be created internally
    event.locals.comixCleric = ComixCleric(
      event.request.headers,
      event.url.origin,
    );

    // Default values
    event.locals.isAdmin = false;
    event.locals.settings = {};

    // If the ComixCleric client exists in `locals`...
    if (event.locals.comixCleric) {
      try {
        // Get session from Better Auth
        const session = await event.locals.comixCleric.auth.api.getSession({
          headers: event.request.headers,
        });
        
        if (session) {
          event.locals.user = session.user;

          // Only refresh when the cached session claims admin
          // TODO: If any new privilaged roles get added, this needs to be revisited.
          // TODO: Pull the admin role ID dynamically instead of hard-coding it.
          if (session.user?.role === "admin") {
            const fresh = await event.locals.comixCleric.auth.api.getSession({
              headers: event.request.headers,
              query: { disableCookieCache: true },
            });

            // Some fields are missing from session dats, so we need a full reference to the current auth user.
            const getFullRef = await event.locals.comixCleric.db.findOne("user", fresh?.user?.id ?? session?.user?.id);

            // Make user data available to layout/page server locals object.
            event.locals.user = getFullRef;
            event.locals.isAdmin = getFullRef?.role === "admin";
          }
        }

        // Fetch app global settings
        const settings = await event.locals.comixCleric.db.find("globals", {
          limit: 1,
          populate: {
            logo: true,
            favicon: true,
          },
        });

        // Make global settings available to layout/page server locals object.
        event.locals.settings = settings?.[0] ?? {};
      } catch (e) {
        consoleError("Error in hooks:", e);
        event.locals.settings = {};
      }
    }

    try {
      const series = await event.locals.comixCleric.db.find("series", {
        limit: 1,
        populate: {
          logo: true,
          favicon: true,
          cover: true,
        }
      });
      event.locals.series = series?.[0] ?? {};
    } catch (e) {
      consoleError("Error in hooks:", e);
      event.locals.series = {};
    }

    // Now check if user is trying to access admin routes
    const routeId = event.route?.id?.replace("/(admin)", "") ?? '';
    const adminRoute = "/_cc_admin";

    const isAdminRoute = routeId === adminRoute || routeId.startsWith(adminRoute + '/');
    const isAdminLogin = routeId === adminRoute;

    if (isAdminRoute && !isAdminLogin) {
      consoleLog("Loading hooks.server.js - checking admin access");
      // If the user is not an admin...
      if (!event.locals.isAdmin) {
        // Log a warning to the console
        consoleWarn("User is not an admin, redirecting to home");
        // Force redirect them to the home page route (or another safe/non-sensitive location in the app)
        throw redirect(302, "/");
      }
      consoleLog("User is an admin, allowing access");
    }

    // Shorten global settings reference
    const settings = event.locals.settings;

    // Rate limiter
    const limit = rateLimit({ event, isAdmin: event.locals.isAdmin });
    if (limit) {
      return new Response(JSON.stringify({ error: "Too Many Requests" }), {
        status: 429,
        headers: {
          "content-type": "application/json",
          "retry-after": String(limit),
        },
      });
    }

    // Scraper handling
    // TODO: Still in progress
    let safeEvent = validateRequest(event);

    // Resolve the request
    const response = await resolve(event, {
      // Increase body size limit for file uploads (default is 512KB)
      // Set to 256MB to accommodate larger audio files
      maxFileSize: 256 * 1024 * 1024, // 256 bytes -> kilobytes (1024 bytes) -> megabytes (1024 kilobytes)
      
      // Add the data-theme attribute into the <html> tag
      transformPageChunk: ({ html }) => {
        // Get safe theme name (potentially redundant)
        const sanitizedName = sanitizeInput(settings?.theme || "comix-cleric");

        // Apply current theme
        html = html.replace(
          '<html lang="en">',
          `<html lang="en" data-theme="${sanitizedName}"${settings?.dark_only === true ? 'class="dark"' : ""}>`,
        );

        // Return the transformed HTML
        return html;
      },
    });

    // Additional security options
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-XSS-Protection", "1; mode=block"); // Only for IE8 support

    return response;
  },
);
