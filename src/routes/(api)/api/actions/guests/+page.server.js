// Handles form actions for creating/updating/deleting volumes

// Utilities
import {
  sanitizeFields,
} from "$lib/utils/sanitize/output.js";
import { checkNull } from "$lib/utils/detectTypes.js";
import { formAction } from "$lib/utils/api/handler";
import { usernameSchema } from "$lib/utils/validation/schema";
import { serverValidate } from "$lib/utils/validation/schema";


export const actions = {
  // Creates only a basic user for safety
  create: formAction(async ({ data, db, locals }) => {
    let status = data.get("status");
    let avatar = data.get("avatar");
    let username = data.get("username");
    let displayname = data.get("displayname");
    let project_role = data?.get("project_role");
    let description = data?.get("description");

    
    // Check data that must match a strict schema
    const invalid = serverValidate(
      [usernameSchema, username]
    );
    if (invalid) return invalid;


    const sanitized = sanitizeFields({
      description,
    });


    // Submit user data and await response
    const res = await db.create("guests", {
      status: status ?? "published",
      avatar: checkNull(avatar),
      name: username,
      username,
      displayname,
      project_role,
      description: sanitized?.description,
    });


    return { new_item: res };
  }),


  // Creates only a basic user for safety
  update: formAction(async ({ data, db, locals }) => {
    let id = data.get("id");
    let status = data.get("status");
    let avatar = data.get("avatar");
    let username = data.get("username");
    let displayname = data.get("displayname");
    let project_role = data?.get("project_role");
    let description = data?.get("description");

    
    const invalid = serverValidate(
      [usernameSchema, username]
    );
    if (invalid) return invalid;


    const sanitized = sanitizeFields({
      description,
    });


    // Submit user data and await response
    const res = await db.update("guests", id, {
      status: status ?? "published",
      avatar: checkNull(avatar),
      name: username,
      username,
      displayname,
      project_role,
      description: sanitized?.description,
    });


    return {};
  }),


  // Delete user from server
  delete: formAction(async ({ data, db, locals }) => {
    const id = data.get("id");


    // Submit delete request and await response
    const res = await db.delete("guests", id);


    return { action: "delete" };
  }),
};
