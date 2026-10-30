// Handles form actions for creating/updating/deleting volumes

// Utilities
import { updateContributors, updateSchedule } from "$lib/utils/api/actions.js";
import { sanitizeFields } from "$lib/utils/sanitize/output.js";
import { checkNull } from "$lib/utils/detectTypes.js";
import { postWindow, publishSeconds } from "$lib/utils/date";
import { formAction } from "$lib/utils/api/handler";
import { serverValidate } from "$lib/utils/validation/schema";
import { slugSchema } from "$lib/utils/validation/schema";

// Form actions
export const actions = {
  // Create new gallery item
  create: formAction(async ({ data, db, user, locals }) => {
    const action = data.get("action");
    const status = data.get("status");
    const type = data.get("type");
    const name = data.get("name");
    const slug = data.get("slug");
    const blurb = data.get("blurb");
    const desc = data.get("desc");
    const cover = data.get("cover");
    const featuredMedia = data.get("featured-media");
    const additionalMedia = data.get("additional-media");
    const dateReleased = data.get("date-released");


    // Check data that must match a strict schema
    const invalid = serverValidate(
      [slugSchema, slug]
    );
    if (invalid) return invalid;


    const publishDateFull = publishSeconds(dateReleased);


    const sanitized = sanitizeFields({
      blurb,
      desc
    });


    const contributors = JSON.parse(data.get("contributors") ?? "[]"); // boolean


    // Create new gallery item in database
    const res = await db.create("gallery", {
      status: action ?? status ?? "draft",
      type: checkNull(type),
      name,
      slug,
      blurb: sanitized?.blurb,
      description: sanitized?.desc,
      cover: checkNull(cover),
      featured_media: checkNull(featuredMedia),
      additional_media: checkNull(additionalMedia),
      date_published: publishDateFull,
      user_created: user?.id,
      user_updated: user?.id,
    });


    await updateContributors(locals, "gallery", res?.id, contributors);
    await updateSchedule(locals, "gallery", { id: res?.id, date_published: publishDateFull }, action ?? status);


    return { new_item: res };
  }),

  
  update: formAction(async ({ data, db, user, locals }) => {
    const id = data.get("id");
    const action = data.get("action");
    const status = data.get("status");
    const type = data.get("type");
    const name = data.get("name");
    const slug = data.get("slug");
    const blurb = data.get("blurb");
    const desc = data.get("desc");
    const cover = data.get("cover");
    const featuredMedia = data.get("featured-media");
    const additionalMedia = data.get("additional-media");
    const dateReleased = data.get("date-released");


    // Check data that must match a strict schema
    const invalid = serverValidate(
      [slugSchema, slug]
    );
    if (invalid) return invalid;


    let existingDate = null;
    try {
      const current = await db.findOne("updates", id, { fields: ["date_published"] });
      existingDate = current?.date_published ?? null;
    } catch {}


    const publishDateFull = postWindow(dateReleased, existingDate)
      ? new Date(existingDate).toISOString()
      : publishSeconds(dateReleased);


    const sanitized = sanitizeFields({
      blurb,
      desc
    });


    const refSeries = await db.find("series", {
      limit: 1
    });


    const seriesID = refSeries[0]?.id;


    const contributors = JSON.parse(data.get("contributors") ?? "[]"); // boolean


    const res = await db.update("gallery", id, {
      status: action ?? status ?? "draft",
      type: checkNull(type),
      name,
      slug,
      blurb: sanitized?.blurb,
      description: sanitized?.desc,
      cover: checkNull(cover),
      featured_media: checkNull(featuredMedia),
      date_published: publishDateFull,
      user_updated: user?.id,
    });


    await updateContributors(locals, "gallery", id, contributors);
    await updateSchedule(locals, "gallery", { id, date_published: publishDateFull }, action ?? status);

    return {};
  }),


  delete: formAction(async ({ data, db, locals }) => {
    const id = data.get("id");


    // Submit delete request and await response
    const res = await db.delete("gallery", id);


    await updateSchedule(locals, "gallery", { id }, 'delete');


    return { action: "delete" };
  }),
};
