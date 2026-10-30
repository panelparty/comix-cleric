// -- Utilities for replacing custom placeholder tags in template strings -- //

// Utilities
import { currentYear } from "$lib/utils/utils.js";

// Replaces known $TAGS in a string with live values from the app's data.
// Useful for injecting dynamic content into templates stored in the database.
export function parseCustomTags(data, src) {
  const supportedTags = {
    $CURRENT_YEAR: currentYear,
    $APP_NAME: data?.settings?.name ?? "",
    $APP_SUBTITLE: data?.settings?.subtitle ?? "",
    $SERIES_NAME: data?.series?.name ?? "",
    $BSKY_LINK: "https://bsky.app/profile/" + data?.settings?.bsky_handle,
  };

  const initial = typeof src === "string" ? src : String(src ?? "");

  return Object.entries(supportedTags).reduce(
    (acc, [tag, value]) => acc.replaceAll(tag, String(value ?? "")),
    initial,
  );
}


// Escapes characters that have special meaning in regular expressions.
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
