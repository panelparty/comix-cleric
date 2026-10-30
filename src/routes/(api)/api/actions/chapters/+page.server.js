// Handles form actions for creating/updating/deleting volumes

// Utilities
import { sanitizeFields } from "$lib/utils/sanitize/output.js";
import { checkNull } from "$lib/utils/detectTypes.js";
import { updateSchedule } from "$lib/utils/api/actions";
import { postWindow, publishSeconds } from "$lib/utils/date";
import { formAction } from "$lib/utils/api/handler";
import { serverValidate } from "$lib/utils/validation/schema";
import { slugSchema } from "$lib/utils/validation/schema";


export const actions = {
  create: formAction(async ({ data, db, user, locals }) => {
    const action = data.get("action");
    const status = data.get("status");
    const name = data.get("name");
    const slug = data.get("slug");
    const volume = data.get("volume");
    const blurb = data.get("blurb");
    const cover = data.get("cover");
    const description = data.get("description");
    const dateReleased = data.get("date_published");


    // Check data that must match a strict schema
    const invalid = serverValidate(
      [slugSchema, slug]
    );
    if (invalid) return invalid;


    const publishDateFull = publishSeconds(dateReleased);


    const sanitized = sanitizeFields({
      blurb,
      description
    });


    // Create new chapter in database
    const res = await locals.comixCleric.db.create("chapters", {
      status: action ?? status ?? "draft",
      series: locals.series?.id,
      name,
      slug,
      volume: volume,
      cover: checkNull(cover),
      blurb: sanitized?.blurb,
      description: sanitized?.description,
      date_published: publishDateFull,
      user_created: user?.id,
      user_updated: user?.id,
    });


    await updateSchedule(locals, "chapters", { id: res?.id, date_published: publishDateFull }, action ?? status);


    return { new_item: res };
  }),


  update: formAction(async ({ data, db, user, locals }) => {
    const id = data.get("id");
    const action = data.get("action");
    const status = data.get("status");
    const name = data.get("name");
    const slug = data.get("slug");
    const volume = data.get("volume");
    const blurb = data.get("blurb");
    const cover = data.get("cover");
    const description = data.get("description");
    const dateReleased = data.get("date_published");


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
      description
    });


    // Update chapter in database
    const res = await db.update("chapters", id, {
      status: action ?? status ?? "draft",
      series: locals.series?.id,
      name,
      slug,
      volume: volume,
      cover: checkNull(cover),
      blurb: sanitized?.blurb,
      description: sanitized?.description,
      date_published: publishDateFull,
      user_updated: user?.id,
    });


    await updateSchedule(locals, "chapters", { id, date_published: publishDateFull }, action ?? status);


    return {};
  }),


  // Delete volume from server
  delete: formAction(async ({ data, db, locals }) => {
    const id = data.get("id");


    // Submit delete request and await response
    const res = await db.delete("chapters", id);


    await updateSchedule(locals, "chapters", { id }, 'delete');


    // Return action used and success state
    return { action: "delete" };
  }),
};
