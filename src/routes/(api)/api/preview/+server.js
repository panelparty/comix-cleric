import { json, error } from "@sveltejs/kit";

export const GET = async ({ url, fetch }) => {
  const targetUrl = url.searchParams.get("url");

  if (!targetUrl) throw error(400, "Missing url parameter");

  let parsedUrl;
  try {
    parsedUrl = new URL(targetUrl);
  } catch {
    throw error(400, "Invalid URL");
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    throw error(400, "Only http/https URLs are allowed");
  }

  const origin = url.origin;

  if (parsedUrl.origin !== origin) {
    throw error(403, "Only same-origin URLs are allowed.");
  }

  try {
    const response = await fetch(parsedUrl.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; LinkPreview/1.0)",
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) throw error(502, "Failed to fetch target URL");

    const html = await response.text();
    const meta = parseMetaTags(html, parsedUrl.origin);
    return json(meta);
  } catch (e) {
    throw error(502, "Could not reach URL");
  }
};

function parseMetaTags(html, origin) {
  const getMeta = (property) => {
    const match =
      html.match(
        new RegExp(
          `<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`,
          "i",
        ),
      ) ||
      html.match(
        new RegExp(
          `<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`,
          "i",
        ),
      );
    return match?.[1] ?? null;
  };

  const getMetaName = (name) => {
    const match =
      html.match(
        new RegExp(
          `<meta[^>]+name=["']${name}["'][^>]+content=["']([^"']+)["']`,
          "i",
        ),
      ) ||
      html.match(
        new RegExp(
          `<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${name}["']`,
          "i",
        ),
      );
    return match?.[1] ?? null;
  };

  const getTitle = () => {
    const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    return match?.[1]?.trim() ?? null;
  };

  const resolveImage = (src) => {
    if (!src) return null;
    if (src.startsWith("http")) return src;
    if (src.startsWith("//")) return "https:" + src;
    return origin + (src.startsWith("/") ? src : "/" + src);
  };

  return {
    // Open Graph
    preview_og: {
      title: getMeta("og:title") ?? getTitle(),
      description: getMeta("og:description") ?? getMetaName("description"),
      image: resolveImage(getMeta("og:image")),
      siteName: getMeta("og:site_name"),
      url: getMeta("og:url"),
    },
    // Twitter Card
    preview_twitter: {
      card: getMetaName("twitter:card") ?? "summary",
      title: getMetaName("twitter:title") ?? getMeta("og:title") ?? getTitle(),
      description:
        getMetaName("twitter:description") ?? getMeta("og:description"),
      image: resolveImage(getMetaName("twitter:image") ?? getMeta("og:image")),
      site: getMetaName("twitter:site"),
    },
  };
}
