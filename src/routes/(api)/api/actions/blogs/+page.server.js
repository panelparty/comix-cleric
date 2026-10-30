// Handles form actions for creating/updating/deleting volumes

// Utilities
import { sanitizeFields } from "$lib/utils/sanitize/output.js";
import { checkNull } from "$lib/utils/detectTypes.js";
import { updateSchedule } from "$lib/utils/api/actions";
import { formAction } from "$lib/utils/api/handler.js";
import { publishSeconds, postWindow } from "$lib/utils/date";
import { serverValidate, slugSchema } from "$lib/utils/validation/schema";

// Form actions
export const actions = {
  // Create new blog post
  create: formAction(async ({ data, db, user, locals }) => {
    // Get required form data
    const action = data.get("action");
    const status = data.get("status");
    const title = data.get("title");
    const slug = data.get("slug");
    const type = data.get("type");
    const blurb = data.get("blurb");
    const cover = data.get("cover");
    const body = data.get("body");
    const date_published = data.get("date_published");


    // Check data that must match a strict schema
    const invalid = serverValidate(
      [slugSchema, slug],
      // Add more [<schema>, <data>] blocks to check
    );
    if (invalid) return invalid;


    // Sanitize form data
    const sanitized = sanitizeFields({
      blurb,
      body
    });


    // Ensure datetime has proper formatting
    const publishDateFull = publishSeconds(date_published);


    // Create blog post in the database
    const res = await db.create("blogs", {
      status: action ?? status ?? "draft",
      type: checkNull(type),
      name: title,
      slug,
      cover: checkNull(cover),
      blurb: sanitized?.blurb,
      body: sanitized?.body,
      date_published: publishDateFull,
      user_created: user?.id,
      user_updated: user?.id,
    });

    // Return new post
    return { new_item: res };
  }),


  // Update blog post
  update: formAction(async ({ data, db, user, locals }) => {
    // Get required form data
    const id = data.get("id");
    const action = data.get("action");
    const status = data.get("status");
    const title = data.get("title");
    const slug = data.get("slug");
    const type = data.get("type");
    const blurb = data.get("blurb");
    const cover = data.get("cover");
    const body = data.get("body");
    const date_published = data.get("date_published");


    // Check data that must match a strict schema
    const invalid = serverValidate(
      [slugSchema, slug]
    );
    if (invalid) return invalid;


    // Ensure datetime has proper formatting
    let existingDate = null;

    try {
      const current = await db.findOne("updates", id, { fields: ["date_published"] });
      existingDate = current?.date_published ?? null;
    } catch {}

    const publishDateFull = postWindow(date_published, existingDate)
      ? new Date(existingDate).toISOString()
      : publishSeconds(date_published);


    // Sanitize fields that are rendered later
    const sanitized = sanitizeFields({
      blurb,
      body
    });


    // Update blog post in the database
    const res = await db.update("blogs", id, {
      status: action ?? status ?? "draft",
      type: checkNull(type),
      name: title,
      slug,
      cover: checkNull(cover),
      blurb: sanitized?.blurb,
      body: sanitized?.body,
      date_published: publishDateFull,
      user_updated: user?.id,
    });


    // Update schedule to reflect the publish date
    // TODO: Only do this if the date changes to reduce server calls
    // It is fine for now, though
    await updateSchedule(locals, "blogs", { id, date_published: publishDateFull }, action ?? status);


    // Return no additional data
    return {};
  }),


  // Delete blog post
  delete: formAction(async ({ data, db, locals }) => {
    // Get required form data
    const id = data.get("id");


    // Update blog post from the database
    const res = await db.delete("blogs", id);


    // Update the schedule to remove entries matching the deleted ID
    await updateSchedule(locals, "blog", { id }, 'delete');


    // Return the action used to display proper toast.
    return { action: "delete" };
  }),
};
