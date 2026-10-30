// Generates a merged RSS feed of all post types.

// Utilities
import { checkStatus } from "$lib/utils/api/auth.js";
import { consoleError } from "$lib/utils/debug.js";
import { renderMarkdown } from "$lib/utils/sanitize/output.js";
import { isArray, orderBy } from "lodash-es";

// Data
let settings = {};

// SvelteKit GET function
export async function GET({ locals, url }) {
  const ref = url.origin;
  let posts = [];

  settings = locals?.settings;

  try {
    const resUpdates = await locals.comixCleric.db.find("updates", {
      sort: ["-date_published"],
      limit: 20,
      filter: checkStatus(locals),
    });

    const resBlogs = await locals.comixCleric.db.find("blogs", {
      sort: ["-date_published"],
      limit: 20,
      filter: checkStatus(locals),
    });

    const resCast = await locals.comixCleric.db.find("cast", {
      sort: ["-date_published"],
      limit: 20,
      filter: checkStatus(locals),
    });

    const resGallery = await locals.comixCleric.db.find("gallery", {
      sort: ["-date_published"],
      limit: 20,
      filter: checkStatus(locals),
    });

    posts = mergeFeeds([resUpdates, resBlogs, resCast, resGallery]);

    posts = orderBy(
      posts,
      [(item) => new Date(item?.date_published).getTime()],
      ["desc"],
    );

    posts = posts.slice(0, 20);
  } catch (e) {
    consoleError(e);
  }

  const feed = generateRSS(posts, ref);

  return new Response(feed, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "max-age=0, s-maxage=3600",
    },
  });
}

// Merge all fetched data
function mergeFeeds(feeds) {
  if (feeds && isArray(feeds)) {
    let mergedFeed = [];

    for (let i = 0; i < feeds.length; i++) {
      let feed = feeds[i];
      let postRoute = "";

      if (i === 0) {
        postRoute = "comic";
      } else if (i === 1) {
        postRoute = "blog";
      } else if (i === 2) {
        postRoute = "cast";
      } else if (i === 3) {
        postRoute = "gallery";
      }

      for (let i = 0; i < feed.length; i++) {
        feed[i].route = postRoute;
        mergedFeed.push(feed[i]);
      }
    }

    return mergedFeed;
  }
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
      <link>${ref}/${post?.route}/${post?.slug}</link>
      <guid isPermaLink="true">${ref}/${post?.route}/${post?.slug}</guid>
      <description><![CDATA[${renderMarkdown(post?.blurb ?? post?.description ?? "")?.html}]]></description>
      <pubDate>${new Date(post?.date_published).toUTCString()}</pubDate>
    </item>`,
      )
      .join("")}
  </channel>
</rss>`;
}
