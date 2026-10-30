// Handles form actions for creating/updating/deleting volumes

// Utilities
import { formAction } from '$lib/utils/api/handler';
import { checkNull } from '$lib/utils/detectTypes.js';
import { sanitizeFields } from "$lib/utils/sanitize/output.js";
import { uploadFilesAction } from '$lib/utils/uploadActions.js';
import { setBoolean } from '$lib/utils/utils.js';


export const actions = {
  // Update global settings
  update: formAction(async ({ data, db, locals }) => {
    const name = data.get("app_name");
    const description = data.get("app_desc");
    const subtitle = data.get("app_subtitle");
    const logo = data.get("app_logo");
    const series_branding = data.get("series_branding");
    const logo_height = data.get("logo_height");
    const favicon = data.get("app_favicon");
    const layout = data.get("app_layout");
    const width = data.get("app_width");
    const header_layout = data.get("header_layout");
    const main_section = data.get("main_section");
    const hero_title = data.get("hero_title");
    const hero_subtitle = data.get("hero_subtitle");
    const reader_height = data.get("reader_height");
    const reader_width = data.get("reader_width");
    const format_strip = data.get("format_strip");
    const format_infinite = data.get("format_infinite");
    const page_limit = data.get("page_limit");
    const copyright = data.get("copyright");
    const source_branding = data.get("source_branding");
    const bsky_feed = data.get("bsky_feed");
    const bsky_handle = data.get("bsky_handle");
    const bsky_feed_limit = data.get("bsky_feed_limit");
    const bsky_feed_message = data.get("bsky_feed_message");
    const content_rating = data.get("content_rating");
    const warning_popup = data.get("warning_popup");
    const warning_title = data.get("warning_title");
    const warning_message = data.get("warning_message");
    

    const sanitized = sanitizeFields({
      description,
      copyright,
      bsky_feed_message,
      warning_message
    });


    const resGlobals = await db.update(
      "globals",
      locals?.settings?.id,
      {
        name,
        description: sanitized?.description,
        subtitle,
        logo: checkNull(logo),
        favicon: checkNull(favicon),
        series_branding: setBoolean(series_branding),
        // layout: checkNull(layout, "default"),
        width: checkNull(width, "1280px"),
        logo_height: checkNull(logo_height, "3rem"),
        header_layout: checkNull(header_layout, "inline-evenly"),
        main_section: checkNull(main_section, "hero"),
        hero_title: checkNull(hero_title, ""),
        hero_subtitle: checkNull(hero_subtitle, ""),
        format_strip: setBoolean(format_strip),
        format_infinite: setBoolean(format_infinite),
        reader_height: checkNull(reader_height, "350px"),
        reader_width: checkNull(reader_width),
        page_limit: checkNull(Number(page_limit), 25),
        copyright: sanitized?.copyright,
        source_branding: setBoolean(source_branding),
        bsky_feed: setBoolean(bsky_feed),
        bsky_handle: checkNull(bsky_handle, ""),
        bsky_feed_limit: checkNull(Number(bsky_feed_limit), 6),
        bsky_feed_message: sanitized?.bsky_feed_message,
        content_rating: checkNull(content_rating, "everyone"),
        warning_popup: setBoolean(warning_popup),
        warning_title,
        warning_message: sanitized?.warning_message,
      },
    );


    return {};
  }),

  
  uploadFiles: uploadFilesAction,
};