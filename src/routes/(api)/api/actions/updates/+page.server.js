// Handles form actions for creating/updating/deleting volumes

// Utilities
import { sanitizeFields } from "$lib/utils/sanitize/output.js";
import { checkNull } from "$lib/utils/detectTypes.js";
import { updateContributors, updateSchedule } from "$lib/utils/api/actions";
import { setBoolean } from "$lib/utils/utils.js";
import { postWindow, publishSeconds } from "$lib/utils/date.js";
import { formAction } from "$lib/utils/api/handler.js";
import { serverValidate } from "$lib/utils/validation/schema";
import { slugSchema } from "$lib/utils/validation/schema";

export const actions = {
  create: formAction(async ({ data, db, user, locals }) => {
    // Destructure form data
    const id = data.get("id");
    const action = data.get("action");
    const status = data.get("status");
    const format_strip = data.get("format_strip");
    const type = data.get("type");
    const type_slug = data.get("type_slug");
    const number = data.get("number");
    const name = data.get("name");
    const slug = data.get("slug");
    const chapter = data.get("chapter");
    const volume = data.get("volume");
    const blurb = data.get("blurb");
    const cover = data.get("cover");
    const media = data.get("media");
    const desc = data.get("desc");
    const transcript = data.get("transcript");
    const warning_popup = data.get("warning_popup");
    const warning_message = data.get("warning_message");
    const dateReleased = data.get("date_published");
    const audio = data.get("audio");
    const audioAutoplay = data.has("audio_autoplay");
    const audioVolume = data.get("audio_volume");
    const audioLoop = data.get("audio_loop");
    const contributors = JSON.parse(data.get("contributors") ?? "[]");


    // Validate field values
    const invalid = serverValidate(
      [slugSchema, slug]
    );
    if (invalid) return invalid;


    // Get a full publish date, with seconds
    const publishDateFull = publishSeconds(dateReleased);


    // Sanitize form data
    const sanitized = sanitizeFields({
      blurb,
      desc,
      transcript
    });


    // Create new update item in database
    const res = await db.create("updates", {
      status: action ?? status ?? "draft",
      type: type && type != "undefined" ? type : null,
      number: type_slug != "main-story" || !checkNull(number) ? null : Number(number),
      name,
      slug,
      series: locals.series?.id,
      chapter: checkNull(chapter),
      volume: checkNull(volume),
      blurb: sanitized?.blurb,
      date_published: publishDateFull,
      cover: checkNull(cover),
      format_strip: setBoolean(format_strip),
      featured_media: media,
      description: sanitized?.desc,
      transcript: sanitized?.transcript,
      warning_popup: setBoolean(warning_popup),
      warning_message,
      audio: checkNull(audio),
      audio_autoplay: setBoolean(audioAutoplay),
      audio_volume: Number(audioVolume),
      audio_loop: setBoolean(audioLoop),
      user_created: user?.id,
      user_updated: user?.id,
    });


    // Update contributors
    await updateContributors(locals, "updates", res?.id, contributors);
    // Update post scheduler
    await updateSchedule(locals, "updates", { id: res?.id, date_published: publishDateFull }, action ?? status);


    // Return new item for client redirect
    return { new_item: res };
  }),


  update: formAction(async ({ data, db, user, locals }) => {
    // Destructure form data
    const id = data.get("id");
    const action = data.get("action");
    const status = data.get("status");
    const format_strip = data.get("format_strip");
    const type = data.get("type");
    const type_slug = data.get("type_slug");
    const number = data.get("number");
    const name = data.get("name");
    const slug = data.get("slug");
    const chapter = data.get("chapter");
    const volume = data.get("volume");
    const blurb = data.get("blurb");
    const cover = data.get("cover");
    const media = data.get("media");
    const desc = data.get("desc");
    const transcript = data.get("transcript");
    const dateReleased = data.get("date_published");
    const warning_popup = data.get("warning_popup");
    const warning_message = data.get("warning_message");
    const audio = data.get("audio");
    const audioAutoplay = data.has("audio_autoplay");
    const audioVolume = data.get("audio_volume");
    const audioLoop = data.get("audio_loop");
    const contributors = JSON.parse(data.get("contributors") ?? "[]");


    // Validate field values
    const invalid = serverValidate(
			[slugSchema, slug]
		);
		if (invalid) return invalid;


    // Sanitize form data
    const sanitized = sanitizeFields({
      blurb,
      desc,
      transcript
    });


    // Check for colliding dates
    let existingDate = null;
    try {
      const current = await db.findOne("updates", id, { fields: ["date_published"] });
      existingDate = current?.date_published ?? null;
    } catch {}


    const publishDateFull = postWindow(dateReleased, existingDate)
      ? new Date(existingDate).toISOString()
      : publishSeconds(dateReleased);


    // Update update in database
    const res = await db.update("updates", id, {
      status: action ?? status,
      type: checkNull(type),
      number: type_slug != "main-story" || !checkNull(number) ? null : Number(number),
      name,
      slug,
      series: locals.series?.id,
      chapter: checkNull(chapter),
      volume: checkNull(volume),
      blurb: sanitized.blurb,
      date_published: publishDateFull,
      cover: checkNull(cover),
      format_strip: setBoolean(format_strip),
      featured_media: media,
      description: sanitized.desc,
      transcript: sanitized.transcript,
      warning_popup: setBoolean(warning_popup),
      warning_message,
      audio: checkNull(audio),
      audio_autoplay: setBoolean(audioAutoplay),
      audio_volume: Number(audioVolume),
      audio_loop: setBoolean(audioLoop),
      user_updated: user?.id,
    });


    await updateContributors(locals, "updates", id, contributors);
    await updateSchedule(locals, "updates", { id, date_published: publishDateFull }, action ?? status);


    return {};
  }),


  // Delete volume from server
  delete: formAction(async ({ data, db, locals }) => {
    const id = data.get("id");


    // Submit delete request and await response
    const res = await db.delete("updates", id);


    // Remove related schedules
    await updateSchedule(locals, "updates", { id }, 'delete');


    return { action: "delete" };
  }),
};
