// Handles form actions for creating/updating/deleting volumes

// Utilities
import { sanitizeFields } from "$lib/utils/sanitize/output.js";
import { checkNull } from "$lib/utils/detectTypes.js";
import { error } from "@sveltejs/kit";
import { formAction } from "$lib/utils/api/handler";
import { serverValidate } from "$lib/utils/validation/schema";
import { usernameSchema } from "$lib/utils/validation/schema";
import { consoleLog } from "$lib/utils/debug.js";
import { setBoolean } from "$lib/utils/utils.js";

export const actions = {
  create: formAction(async ({ data, db, auth, user, locals }) => {
    let email = data.get("email");
    let password = data.get("password");
    let avatar = data.get("avatar");
    let username = data.get("username");
    let displayname = data.get("displayname");
    let project_role = data.get("project_role");
    let description = data.get("description");
    let role = data.get("role");
    let owner = setBoolean(data.get("owner"));

    const invalid = serverValidate(
      [usernameSchema, username]
    );
    if (invalid) return invalid;

    const sanitized = sanitizeFields({
      description,
    });

    // Non-owners cannot set other owners
    if (!user?.owner) {
      owner = false;
    }
    
    // If owner is set "true", user must be "admin"
    if (owner) {
      role = "admin";
    }

    // Create a user with the `auth` method and required fields
    const resCreate = await auth.createUser({
      email,
      password,
      name: username,
      role,
    });

    // Update optional fields in the new user entry
    const resUpdate = await db.update("user", resCreate?.user?.id, {
      status: "active",
      displayname,
      username,
      avatar: avatar != "undefined" ? avatar : null,
      project_role,
      description: sanitized?.description,
      owner,
      emailVerified: true,
    });

    return { new_item: resUpdate?.user };
  }),

  update: formAction(async ({ data, db, user, locals }) => {
    let id = data.get("id");
    let avatar = data.get("avatar");
    let username = data.get("username");
    let displayname = data.get("displayname");
    let projectRole = data.get("project_role");
    let description = data.get("description");
    let role = data.get("role");
    let owner = setBoolean(data.get("owner"));

    const invalid = serverValidate(
      [usernameSchema, username]
    );
    if (invalid) return invalid;

    const sanitized = sanitizeFields({
      description,
    });

    const userRef = db.findOne("user", id);

    
    // If current user is not an owner and reference user is an owner, do not change status.
    if (!user?.owner && userRef?.owner && user?.id != userRef?.id) {
      owner = userRef?.owner;
    }

    // Non-owners cannot set other owners
    if (!user?.owner) {
      owner = false;
    }
    
    // If owner is set "true", user must be "admin"
    if (owner) {
      role = "admin";
    }

    // Update user
    const res = await db.update("user", id, {
      name: username,
      username,
      displayname,
      avatar: checkNull(avatar),
      project_role: projectRole,
      description: sanitized?.description,
      role,
      owner,
    });

    return {};
  }),

  // Delete user from database
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

    const res = await auth.deleteUser(userID);

    return { action: "delete" };
  }),
};
