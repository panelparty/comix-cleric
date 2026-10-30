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
  // Create new blog post
  create: formAction(async ({ data, db, user, locals }) => {
    const action = data.get("action");
    const status = data.get("status");
    const type = data.get("type");
    const name = data.get("name");
    const slug = data.get("slug");
    const nickname = data.get("nickname");
    const age = data.get("age");
    const height = data.get("height");
    const weight = data.get("weight");
    const pronouns = data.get("pronouns");
    const appearance = data.get("appearance");
    const bio = data.get("bio");
    const spoilers = data.get("spoilers");
    const description = data.get("desc");
    const blurb = data.get("blurb");
    const cover = data.get("cover");
    const sheet = data.get("sheet");
    const dateReleased = data.get("date_published");


    // Check data that must match a strict schema
    const invalid = serverValidate(
      [slugSchema, slug]
    );
    if (invalid) return invalid;


    const publishDateFull = publishSeconds(dateReleased);


    const sanitized = sanitizeFields({
      blurb,
      description,
      bio,
      appearance,
      spoilers
    });

    // Create new cast item in database
    const res = await db.create("cast", {
      status: action ?? status,
      type: checkNull(type),
      name,
      slug,
      nickname,
      age,
      height,
      weight,
      pronouns,
      appearance: sanitized?.appearance,
      blurb: sanitized?.blurb,
      bio: sanitized?.bio,
      description: sanitized?.description,
      spoilers: sanitized?.spoilers,
      cover: checkNull(cover),
      sheet: checkNull(sheet),
      date_published: publishDateFull,
      user_created: user?.id,
      user_updated: user?.id,
    });


    await updateSchedule(locals, "cast", {id: res?.id, date_published: publishDateFull }, action ?? status);


    // Return success state and new page
    return { new_item: res };
  }),

  // Update cast item
  update: formAction(async ({ data, db, user, locals }) => {
    const id = data.get("id");
    const action = data.get("action");
    const status = data.get("status");
    const type = data.get("type");
    const name = data.get("name");
    const slug = data.get("slug");
    const nickname = data.get("nickname");
    const age = data.get("age");
    const height = data.get("height");
    const weight = data.get("weight");
    const pronouns = data.get("pronouns");
    const appearance = data.get("appearance");
    const blurb = data.get("blurb");
    const bio = data.get("bio");
    const description = data.get("desc");
    const spoilers = data.get("spoilers");
    const cover = data.get("cover");
    const sheet = data.get("sheet");
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
      description,
      bio,
      appearance,
      spoilers
    });


    // Update cast item in database
    const res = await db.update("cast", id, {
      status: action ?? status,
      type: checkNull(type),
      name,
      slug,
      nickname,
      age,
      height,
      weight,
      pronouns,
      appearance: sanitized?.appearance,
      blurb: sanitized?.blurb,
      bio: sanitized?.bio,
      description: sanitized?.description,
      spoilers: sanitized?.spoilers,
      cover: checkNull(cover),
      sheet: checkNull(sheet),
      date_published: publishDateFull,
      user_updated: user?.id,
    });


    await updateSchedule(locals, "cast", { id, date_published: publishDateFull }, action ?? status);


    return {};
  }),


  delete: formAction(async ({ data, db, locals }) => {
    const id = data.get("id");

    // Submit delete request and await response
    const res = await db.delete("cast", id);


    await updateSchedule(locals, "cast", { id }, 'delete');


    // Return action used and success state
    return { action: "delete" };
  }),
};
