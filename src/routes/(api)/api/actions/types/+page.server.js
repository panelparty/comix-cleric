// Handles form actions for creating/updating/deleting volumes

// Utilities
import { formAction } from '$lib/utils/api/handler';
import { checkNull } from '$lib/utils/detectTypes.js';
import { sanitizeFields } from "$lib/utils/sanitize/output.js";
import { slugSchema } from '$lib/utils/validation/schema';
import { serverValidate } from '$lib/utils/validation/schema';


// Form actions
export const actions = {
  // Create new blog post
	create: formAction(async ({ data, db, user }) => {
    // Get required form data
    const type = data.get("type");
    const action = data.get("action");
    const status = data.get("status");
    const title = data.get("title");
    const slug = data.get("slug");
    const cover = data.get("cover");
    const blurb = data.get("blurb");
    const description = data.get("description");


    // Check data that must match a strict schema
    const invalid = serverValidate(
      [slugSchema, slug],
      // Add more [<schema>, <value>] blocks to check
    );
    if (invalid) return invalid;

    
    // Sanitize form data
    const sanitized = sanitizeFields({
      blurb,
      description
    });


    // Create blog type in the database
    const res = await db.create(type + "_types", {
      status: action ?? status ?? "draft",
      name: title,
      slug,
      cover: checkNull(cover),
      blurb: sanitized?.blurb,
      description: sanitized?.description,
      user_created: user?.id,
      user_updated: user?.id,
    });


    // Return the new item
    return { new_item: res };
	}),

  
	update: formAction(async ({ data, db, user }) => {
    // Get required form data
    const type = data.get("type");
    const id = data.get("id");
    const action = data.get("action");
    const status = data.get("status");
    const title = data.get("title");
    const slug = data.get("slug");
    const cover = data.get("cover");
    const blurb = data.get("blurb");
    const description = data.get("description");


    // Check data that must match a strict schema
    const invalid = serverValidate(
      [slugSchema, slug],
      // Add more [<schema>, <value>] blocks to check
    );
    if (invalid) return invalid;


    // Sanitize form data
    const sanitized = sanitizeFields({
      blurb,
      description
    });

    // Update blog type in the database
    const res = await db.update(type + "_types", id, {
      status: action ?? status ?? "draft",
      name: title,
      slug,
      cover: checkNull(cover),
      blurb: sanitized?.blurb,
      description: sanitized?.description,
      user_created: user?.id,
      user_updated: user?.id,
    });


    // Return no additional data
    return {};
	}),


	delete: formAction(async ({ data, db }) => {
    // Get required form data
    const type = data.get("type");
    const id = data.get("id");


    // Delete blog type from the database
    const res = await db.delete(type + "_types", id);


    // Return the action used
    return { action: "delete" };
	}),
};