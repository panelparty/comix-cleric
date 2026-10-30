// Handles form actions for creating/updating/deleting volumes

// Utilities
import { checkNull } from "$lib/utils/detectTypes.js";
import { updateContributors } from "$lib/utils/api/actions.js";
import { sanitizeFields } from "$lib/utils/sanitize/output.js";
import { publishSeconds, postWindow } from "$lib/utils/date";
import { formAction } from "$lib/utils/api/handler";
import { serverValidate } from "$lib/utils/validation/schema";
import { slugSchema } from "$lib/utils/validation/schema";


// Form actions
export const actions = {
  // Update edited series
  update: formAction(async ({ data, db, user, locals }) => {
    const id = data.get("id");
    const action = data.get("action");
    const status = data.get("status");
    const name = data.get("name");
    const slug = data.get("slug");
    const logo = data.get("logo");
    const cover = data.get("cover");
    const favicon = data.get("favicon");
    const theme = data.get("theme");
    const blurb = data.get("blurb");
    const desc = data.get("desc");
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
      desc
    });

    const contributors = JSON.parse(data.get("contributors") ?? "[]");

    // Update existing series item
    const res = await db.update("series", id, {
      status: action ?? status,
      name,
      slug,
      blurb: sanitized?.blurb,
      description: sanitized?.desc,
      date_published: publishDateFull,
      logo: checkNull(logo),
      favicon: checkNull(favicon),
      cover: checkNull(cover),
      user_updated: user?.id,
    });

    await updateContributors(locals, "series", id, contributors);

    return {};
  }),
};
