// Generates an RSS feed of blog posts.

// Utilities
import { checkStatus } from "$lib/utils/api/auth.js";
import { consoleError } from "$lib/utils/debug.js";
import { renderMarkdown } from "$lib/utils/sanitize/output.js";

// Data
let settings = {};
let route = "blog";

// SvelteKit GET function
export async function GET({ locals, url }) {
  const ref = url.origin;
  let posts = [];

  settings = locals?.settings;

  try {
    const res = await locals.comixCleric.db.find("blogs", {
      sort: ["-date_published"],
      limit: 20,
      filter: checkStatus(locals),
    });

    posts = res;
  } catch (e) {
    consoleError(e);
  }

  const feed = generateRSS(posts, ref);

  return new Response(feed, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "max-age=0, s-maxage=3600", // Cache for 1 hour on CDN
    },
  });
}

// Generate RSS output
// TODO: Replace this hard-coded XML with an RSS generator library
function generateRSS(posts, ref) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${settings?.name}</title>
    <link>${ref}</link>
    <description>${settings?.description}</description>
    <language>${settings?.locale}</language>
    <atom:link href="${ref}/api/rss" rel="self" type="application/rss+xml"/>
    ${posts
      .map(
        (post) => `
    <item>
      <title><![CDATA[${post?.name}]]></title>
      <link>${ref}/${route}/${post?.slug}</link>
      <guid isPermaLink="true">${ref}/${route}/${post?.slug}</guid>
      <description><![CDATA[${renderMarkdown(post?.blurb || post?.description)?.html}]]></description>
      <pubDate>${new Date(post?.date_published).toUTCString()}</pubDate>
    </item>`,
      )
      .join("")}
  </channel>
</rss>`;
}
