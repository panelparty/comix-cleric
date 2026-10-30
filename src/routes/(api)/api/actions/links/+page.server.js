// Handles form actions for creating/updating/deleting volumes

// Utilities
import { formAction } from '$lib/utils/api/handler';
import { sanitizeFields } from "$lib/utils/sanitize/output.js";
import { slugSchema } from '$lib/utils/validation/schema';
import { serverValidate } from '$lib/utils/validation/schema';


export const actions = {
	create: formAction(async ({ data, db, user, locals }) => {
		const id = data?.get("id");
		const action = data.get("action");
    const status = data.get("status");
		const name = data?.get("name");
		const slug = data?.get("slug");
		const url = data?.get("url");
		const icon = data?.get("icon");
		const color = data?.get("color");
		const custom_css = data?.get("custom_css");


		const invalid = serverValidate(
			[slugSchema, slug]
		);
		if (invalid) return invalid;


		const sanitized = sanitizeFields({
			url,
			custom_css
		});


    const res = await db.create("links",{
      status: action ?? status ?? "draft",
      name,
      slug,
      url: sanitized?.url,
      icon,
      color,
      custom_css: sanitized?.custom_css,
    });


    return { new_item: res };
	}),


	update: formAction(async ({ data, db, user, locals }) => {
		const id = data?.get("id");
		const action = data.get("action");
    const status = data.get("status");
		const name = data?.get("name");
		const slug = data?.get("slug");
		const url = data?.get("url");
		const icon = data?.get("icon");
		const color = data?.get("color");
		const custom_css = data?.get("custom_css");


		const invalid = serverValidate(
			[slugSchema, slug]
		);
		if (invalid) return invalid;


		const sanitized = sanitizeFields({
			url,
			custom_css
		});


    const resGlobals = await db.update(
      "links",
      id,
      {
        status: action ?? status ?? "draft",
        name,
        slug,
        url: sanitized?.url,
        icon,
        color,
        custom_css: sanitized?.custom_css,
      },
    );


    return {};
	}),


	delete: formAction(async ({ data, db, user, locals }) => {
    const id = data?.get("id");


    const res = await db.delete("links", id);


    return { action: "delete" };
	}),
}