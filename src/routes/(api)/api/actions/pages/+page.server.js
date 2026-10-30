// Handles form actions for creating/updating/deleting volumes

// Utilities
import {
  sanitizeFields,
} from "$lib/utils/sanitize/output.js";
import { setBoolean } from "$lib/utils/utils.js";
import { checkNull } from "$lib/utils/detectTypes.js";
import { error } from "@sveltejs/kit";
import { updateSchedule } from "$lib/utils/api/actions";
import { publishSeconds } from "$lib/utils/date";
import { pages } from "$lib/ComixClericLib/data/default.js";
import { find } from "lodash-es";
import { formAction } from "$lib/utils/api/handler";
import { serverValidate } from "$lib/utils/validation/schema";
import { slugSchema } from "$lib/utils/validation/schema";


export const actions = {
  create: formAction(async ({ data, db, user, locals }) => {
    throw error(
      400,
      "You do not have permission to use this functionality or it does not exist.",
    );


    // Get form data
    const status = data.get("status");
    const action = data.get("action");
    const name = data.get("name");
    const slug = data.get("slug");
    const url = data.get("url");
    const subtitle = data.get("subtitle");
    const label = data.get("label");
    const icon = data.get("icon");
    const color = data.get("color");
    const theme = data.get("theme");
    const showHeader = data.get("show-header");
    const showFooter = data.get("show-footer");
    const showMobile = data.get("show-mobile");
    const showThumb = data.get("show-thumb");
    const showReader = data.get("show-reader");
    const blurb = data.get("blurb");
    const description = data?.get("desc");
    const dateReleased = data?.get("date-released");


    // Check data that must match a strict schema
    const invalid = serverValidate(
      [slugSchema, slug]
    );
    if (invalid) return invalid;


    const publishDateFull = publishSeconds(dateReleased);


    const sanitized = sanitizeFields({
      url,
      blurb,
      description,
    });


    // Get current page count to increment `order_id`
    let currentPageCount = await db.count("pages");


    const res = await db.create("pages", {
      status: status ?? action ?? "published",
      name,
      slug,
      // url: sanitized?.url,
      subtitle,
      label,
      icon,
      // color,
      theme,
      order_id: currentPageCount,
      show_header: setBoolean(showHeader),
      show_footer: setBoolean(showFooter),
      show_mobile: setBoolean(showMobile),
      show_thumb: setBoolean(showThumb),
      show_reader: setBoolean(showReader),
      blurb: sanitized?.blurb,
      description: sanitized?.description,
      date_published: publishDateFull,
      user_created: user?.id,
      user_updated: user?.id,
    });


    await updateSchedule(
      locals,
      "pages",
      { id: res?.id, date_published: publishDateFull },
      action ?? status,
    );


    return { new_item: res };
  }),

  createDefault: formAction(async ({ data, db, user, locals }) => {
    const status = data.get("status");
    const slug = data.get("slug");


    // Check data that must match a strict schema
    const invalid = serverValidate(
      [slugSchema, slug]
    );
    if (invalid) return invalid;


    // Get reference to seed data (default pages)
    const defaultPage = Object.assign({}, find(pages, { slug: slug }));


    // Get current page count to increment `order_id`
    let currentPageCount = await db.count("pages");


    // Send page creation request to database
    const res = await db.create("pages", {
      ...defaultPage,
      status: status ?? "draft",
      order_id: currentPageCount,
      date_published: new Date().toISOString(),
    });


    return { new_item: res };
  }),

  // Creates only a basic user for safety
  update: formAction(async ({ data, db, user, locals }) => {
    const id = data.get("id");
    const status = data.get("status");
    const action = data.get("action");
    const order_id = data.get("order_id");
    const name = data.get("name");
    const slug = data.get("slug");
    const url = data.get("url");
    const subtitle = data.get("subtitle");
    const label = data.get("label");
    const icon = data.get("icon");
    const color = data.get("color");
    const theme = data.get("theme");
    const body = data.get("body");
    const show_header = data.get("show-header");
    const show_footer = data.get("show-footer");
    const show_mobile = data.get("show-mobile");
    const show_thumb = data.get("show-thumb");
    const show_reader = data.get("show-reader");
    const blurb = data.get("blurb");
    const description = data.get("desc");
    const dateReleased = data.get("date-released");


    // Check data that must match a strict schema
    const invalid = serverValidate(
      [slugSchema, slug]
    );
    if (invalid) return invalid;


    const sanitized = sanitizeFields({
      url,
      blurb,
      description,
    });

    let setOrderID = checkNull(Number(order_id)) ? {order_id: Number(order_id)} : null;

    // Submit user data and await response
    const res = await db.update("pages", id, {
      status: action ?? status ?? "published",
      name,
      slug,
      // url: sanitized?.url,
      subtitle,
      label,
      icon,
      // color,
      body,
      theme,
      ...setOrderID,
      show_header: setBoolean(show_header),
      show_footer: setBoolean(show_footer),
      show_mobile: setBoolean(show_mobile),
      show_thumb: setBoolean(show_thumb),
      show_reader: setBoolean(show_reader),
      blurb: sanitized?.blurb,
      description: sanitized?.description,
      date_published: publishSeconds(dateReleased),
      user_updated: user?.id,
    });


    await updateSchedule(
      locals,
      "pages",
      { id, date_published: publishSeconds(dateReleased) },
      action ?? status,
    );


    return {};
  }),

  // Creates only a basic user for safety
  batchUpdate: formAction(async ({ data, db, user, locals }) => {
    const action = data.get("action");
    const pages = data.get("pages");

    const parsedPages = JSON.parse(pages);

    for (const item of parsedPages) {
      const id = item?.id;
      const status = item?.status;
      const orderId = item?.order_id;
      const name = item?.name;
      const slug = item?.slug;
      const url = item?.url;
      const subtitle = item?.subtitle;
      const label = item?.label;
      const icon = item?.icon;
      const color = item?.color;
      const theme = item?.theme;
      const showHeader = item?.show_header;
      const showFooter = item?.show_footer;
      const showMobile = item?.show_mobile;
      const showThumb = item?.show_thumb;
      const showReader = item?.show_reader;
      const blurb = item?.blurb;
      const description = item?.description;
      const dateReleased = item?.date_released;

      const sanitized = sanitizeFields({
        url,
        blurb,
        description,
      });

      // Submit user data and await response
      const res = await db.update("pages", id, {
        status: action ?? status ?? "draft",
        order_id: Number(orderId),
        name,
        slug,
        // url: sanitized?.url,
        subtitle,
        label,
        icon,
        // color,
        theme,
        show_header: setBoolean(showHeader),
        show_footer: setBoolean(showFooter),
        show_mobile: setBoolean(showMobile),
        show_thumb: setBoolean(showThumb),
        show_reader: setBoolean(showReader),
        blurb: sanitized?.blurb,
        description: sanitized?.description,
        date_published: publishSeconds(dateReleased),
        user_updated: user?.id,
      });

      await updateSchedule(
        locals,
        "pages",
        { id, date_published: publishSeconds(dateReleased) },
        action ?? status,
      );
    }

    return {};
  }),

  // Delete user from server
  delete: formAction(async ({ data, db, locals }) => {
    const id = data.get("id");

    // Submit delete request and await response
    const res = await db.delete("pages", id);

    await updateSchedule(locals, "pages", { id }, "delete");

    return { action: "delete" };
  }),
};
