// Creates default datebase entries and first admin user

// Seed data
import {
  blog_types,
  cast_types,
  content_ratings,
  gallery_types,
  globals,
  languages,
  links,
  pages,
  series,
  themes,
  update_types,
} from "$lib/ComixClericLib/data/default.js";

// Utilities
import { formAction } from "$lib/utils/api/handler.js";
import { consoleError, consoleInfo, consoleSuccess } from "$lib/utils/debug.js";
import {
  displaynameSchema,
  emailSchema,
  passSchema,
  serverValidate,
  usernameSchema,
} from "$lib/utils/validation/schema.js";
import { error } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";

// Load page data
export const load = async ({ locals, params }) => {
  // If app is set up, redirect to homepage.
  if (locals?.settings?.setup_complete) {
    throw redirect(303, "/");
  }
};

// Form actions
export const actions = {
  // Setup
  setup: formAction(async ({ data, db, auth, locals }) => {
    consoleInfo("Attempting setup...");
    
    if (locals?.settings?.setup_complete) {
      consoleError("Setup already completed.");
      throw redirect(303, "/");
    }

    const email = data.get("email");
    const username = data.get("username");
    const displayname = data.get("displayname");
    const password = data.get("password");
    const passwordConfirm = data.get("passwordConfirm");

    const invalid = serverValidate(
      [emailSchema, email],
			[usernameSchema, username],
			[displaynameSchema, displayname],
			[passSchema, password],
			[passSchema, passwordConfirm],
		);
		if (invalid) return invalid;

    if (password != passwordConfirm) {
      throw error(400, "Passwords do not match.");
    }

    const resUser = await auth.signUpEmail({
      email,
      password,
      name: username,
    });
    
    await db.update("user", resUser?.user?.id, {
      status: "active",
      username,
      displayname,
      project_role: "Creator",
      emailVerified: true,
      owner: true,
      role: "admin",
    });

    // Auto-login (does not populate well without logging back out)
    // await auth.signInEmail({
    //   email: email,
    //   password: password,
    // });

    // Submit default database data with custom values.
    await seedDB(db, data, resUser?.user);

    return {};
  }, { admin: false, user: false }),
};

// Submits default database data
// Add formData to use custom values from form inputs
async function seedDB(db, formData, user) {
  consoleInfo("Seeding database...");
  let resGlobals = {};

  // Seed the database with the existing datasets
  try {
    // Add Languages/Locale data
    languages.forEach(async (item) => {
      try {
        await db.create("languages", item);
      } catch (e) { consoleError(e); }
    });
    consoleSuccess("Inserted Languages");

    // Add Globals data
    globals.forEach(async (item) => {
      try {
        resGlobals = await db.create("globals", item);
      } catch (e) { consoleError(e); }
    });
    consoleSuccess("Inserted Globals");

    // Add Content Ratings data
    content_ratings.forEach(async (item) => {
      try {
        await db.create("content_ratings", item);
      } catch (e) { consoleError(e); }
    });
    consoleSuccess("Inserted Content Ratings");

    // Add Series data
    await db.create("series", series[0]);
    consoleSuccess("Inserted Series");

    // Add Themes data
    await db.create("themes", themes[0]);
    consoleSuccess("Inserted Themes");

    // Add Pages data
    pages.forEach(async (item) => {
      try {
        await db.create("pages", item);
      } catch (e) { consoleError(e); }
    });
    consoleSuccess("Inserted Pages");

    // Add Links data
    links.forEach(async (item) => {
      try {
        await db.create("links", {...item, user: user?.id});
      } catch (e) { consoleError(e); }
    });
    consoleSuccess("Inserted Links");

    // Add Update Types data
    update_types.forEach(async (item) => {
      try {

      } catch (e) { consoleError(e); }
      await db.create("update_types", item);
    });
    consoleSuccess("Inserted Update Types");

    // Add Blog Types data
    blog_types.forEach(async (item) => {
      try {
        await db.create("blog_types", item);
      } catch (e) { consoleError(e); }
    });
    consoleSuccess("Inserted Blog Types");

    // Add Cast Types data
    cast_types.forEach(async (item) => {
      try {
        await db.create("cast_types", item);
      } catch (e) { consoleError(e); }
    });
    consoleSuccess("Inserted Cast Types");

    // Add Gallery Types data
    gallery_types.forEach(async (item) => {
      try {
        await db.create("gallery_types", item);
      } catch (e) { consoleError(e); }
    });
    consoleSuccess("Inserted Gallery Types");

    // If all else completes successfully, set the completed flag
    await db.update("globals", resGlobals?.id, {
      setup_complete: true,
    });
  } catch (e) { consoleError(e); }

  // All steps completed
  consoleSuccess("Done!");
}
