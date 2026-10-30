// Handles form actions for creating/updating/deleting volumes

// Utilities
import { sanitizeFields } from "$lib/utils/sanitize/output.js";
import { checkNull } from "$lib/utils/detectTypes.js";
import { updateSchedule } from "$lib/utils/api/actions";
import { publishSeconds, postWindow } from "$lib/utils/date";
import { formAction } from "$lib/utils/api/handler";
import { serverValidate } from "$lib/utils/validation/schema";
import { slugSchema } from "$lib/utils/validation/schema";

// Form actions
export const actions = {
  create: formAction(async ({ data, db, user, locals }) => {
    // Get form values
    const action = data.get("action");
    const status = data.get("status");
    const name = data.get("name");
    const slug = data.get("slug");
    const blurb = data.get("blurb");
    const cover = data.get("cover");
    const desc = data.get("desc");
    const dateReleased = data.get("date_published");

    // Validate inputs
    const invalid = serverValidate(
      [slugSchema, slug]
    );
    if (invalid) return invalid;

    // Add seconds to assist in post sorting
    const publishDateFull = publishSeconds(dateReleased);

    // Sanitize inputs
    const sanitized = sanitizeFields({
      blurb,
      desc
    });

    // Create new volume
    const res = await db.create("volumes", {
      status: action ?? status,
      series: locals.series?.id,
      name,
      slug,
      cover: checkNull(cover),
      blurb: sanitized?.blurb,
      description: sanitized?.desc,
      date_published: publishDateFull,
      user_created: user?.id,
      user_updated: user?.id,
    });

    // If volume is scheduled, update the schedule
    await updateSchedule(locals, "volumes", { id: res?.id, date_published: publishDateFull }, action ?? status);

    // Return new volume data for edit redirect
    return { new_item: res };
  }),


  update: formAction(async ({ data, db, user, locals }) => {
    // Get form values
    const id = data.get("id");
    const action = data.get("action");
    const status = data.get("status");
    const name = data.get("name");
    const slug = data.get("slug");
    const blurb = data.get("blurb");
    const cover = data.get("cover");
    const desc = data.get("desc");
    const dateReleased = data.get("date_published");

    // Validate inputs
    const invalid = serverValidate(
			[slugSchema, slug]
		);
		if (invalid) return invalid;

    // TODO: These checks are a bit complex. I think we can simplify this.
    let existingDate = null;
    try {
      const current = await locals.comixCleric.db.findOne("updates", id, { fields: ["date_published"] });
      existingDate = current?.date_published ?? null;
    } catch {}
    const publishDateFull = postWindow(dateReleased, existingDate)
      ? new Date(existingDate).toISOString()
      : publishSeconds(dateReleased);

    // Sanitize inputs
    const sanitized = sanitizeFields({
      blurb,
      desc
    });

    // Update existing volume
    const res = await db.update("volumes", id, {
      status: action ?? status,
      series: locals.series?.id,
      name,
      slug,
      cover: checkNull(cover),
      blurb: sanitized?.blurb,
      description: sanitized?.desc,
      date_published: publishDateFull,
      user_updated: user?.id,
    });

    // If volume is scheduled, update schedule
    await updateSchedule(locals, "volumes", { id, date_published: publishDateFull }, action ?? status);

    // Return nothing
    return {};
  }),


  // Delete volume from server
  delete: formAction(async ({ data, db, locals }) => {
    // Get form values
    const id = data.get("id");

    // Delete volume
    const res = await db.delete("volumes", id);

    // Remove exisitng schedule items.
    await updateSchedule(locals, "volumes", { id }, 'delete');

    // Return action for redirect
    return { action: "delete" };
  }),
};
