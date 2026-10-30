// Handles form actions for creating/updating/deleting volumes

// Utilities
import { sanitizeFields } from "$lib/utils/sanitize/output.js";
import { checkNull } from "$lib/utils/detectTypes.js";
import { formAction } from "$lib/utils/api/handler";
import { usernameSchema } from "$lib/utils/validation/schema";
import { serverValidate } from "$lib/utils/validation/schema";

// Form actions
export const actions = {
  create: formAction(async ({ data, db, auth }) => {
    // Get form values
    let email = data.get("email");
    let password = data.get("password");
    let avatar = data.get("avatar");
    let username = data.get("username");
    let displayname = data.get("displayname");
    let description = data?.get("description");

    const invalid = serverValidate(
      [usernameSchema, username]
    );
    if (invalid) return invalid;
    
    const sanitized = sanitizeFields({
      description
    });

    const resUser = await auth.signUpEmail({
      email,
      password,
      name: username,
    });

    const resUpdate = await db.update("user", resUser?.user?.id, {
      displayname,
      username,
      avatar: avatar != "undefined" ? avatar : null,
      description: sanitized?.description,
      emailVerified: false,
      role: "user",
    });


    return { new_item: resUpdate };
  }),


  update: formAction(async ({ data, db }) => {
    let id = data.get("id");
    let avatar = data.get("avatar");
    let username = data.get("username");
    let displayname = data.get("displayname");
    let role = data.get("role");
    let description = data.get("description");


    const invalid = serverValidate(
      [usernameSchema, username]
    );
    if (invalid) return invalid;


    const sanitized = sanitizeFields({
      description
    });


    // Currently disallows changing user role.
    // TODO: Update this once we allow proper user accounts.
    if (role != "user") {
      role = "user";
    }


    const res = await db.update("user", id, {
      name: username,
      username,
      displayname,
      avatar: checkNull(avatar),
      description: sanitized?.description,
      role,
    });


    return {};
  }),


  // Delete volume from server
  delete: formAction(async ({ data, auth }) => {
    const userID = data.get("id");


    // Get a fresh reference to the user data
    const refUser = await auth.getUser(userID);


    // If the user is marked as an owner, prevent deletion
    // Handle both boolean and string representations
    const isOwner = refUser?.owner === true || refUser?.owner === "true";
    if (isOwner) {
      throw error(403, "Owners cannot be removed.");
    }


    // Get reference amount of admin users
    const resAdmin = await auth.listUsers({
      filterField: "role",
      filterValue: "admin",
      filterOperator: "eq",
    });

    
    // If there is only one admin account left, prevent deletion
    // Also exclude the user being deleted from the count
    const adminCount = resAdmin.users.filter(
      (u) => u.id !== userID,
    ).length;
    if (adminCount <= 0) {
      throw error(403, "The last remaining account cannot be removed.");
    }


    // Submit delete request and await response
    const res = await auth.deleteUser(userID);


    return { action: "delete" };
  }),
};
