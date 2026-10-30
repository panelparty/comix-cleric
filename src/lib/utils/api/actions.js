// -- Helpers for common Comix Cleric server actions -- //

// Svelte utilities
import { error } from "@sveltejs/kit";

// Utilities
import { isArray } from "lodash-es";

// Update contributors function
export async function updateContributors(req, collName, postId, users) {
  // Check for existing contributors
  const existing = await req.comixCleric.db.find("contributors", {
    filter: {
      post_type: collName,
      post_id: postId,
    },
    populate: {
      user_id: true,
      guest_id: true,
    },
  });
  
  // Create a "create" list for new entries
  const toCreate = users.map((c) => ({
    post_type: collName,
    post_id: postId,
    user_id: c?.user_id?.id ?? c.user_id ?? null,
    guest_id: c?.guest_id?.id ?? c.guest_id ?? null,
    order_id: c.order_id,
  }));
  
  // Create a "delete" list to remove outdated entries
  const toDeleteAll = existing.map((r) => r.id);
    
  // Run deletion process
  if (toDeleteAll.length) {
    toDeleteAll.forEach(async (item) => {
      try {
        await req.comixCleric.db.delete("contributors", item);
      } catch (e) {
        consoleError("Previous Contributors records failed to delete:", e);
        throw error(400, e);
      }
    });
  }

  // Run creation process
  if (toCreate.length) {
    toCreate.forEach(async (item) => {
      try {
        await req.comixCleric.db.create("contributors", item);
      } catch (e) {
        consoleError("New Contributors records failed to create:", e);
        throw error(400, e);
      }
    });
  }
}

// Updates the post schedule
export async function updateSchedule(req, collName, post, action) {
  // Check for matching schedule item
  const existing = await req.comixCleric.db.find("post_schedule", {
    filter: {
      post_type: collName,
      post_id: post?.id,
    },
    populate: {
      user_id: true,
      guest_id: true,
    },
  });

  // If data already exists
  if (isArray(existing) && existing?.length > 0) {
    // If user is trying to schedule again
    if (action === 'scheduled') {
      // Update existing entry
      try {
        await req.comixCleric.db.update("post_schedule", existing?.[0]?.id, {
          post_type: collName,
          post_id: post?.id,
          date_published: post?.date_published
        });
      } catch (e) {
        consoleError("Schedule failed to update record:", e);
        throw error(400, e);
      }
    }
    // If user is not trying to schedule again
    if (action != 'scheduled') {
      // Remove existing entry
      try {
        await req.comixCleric.db.delete("post_schedule", existing?.[0]?.id);
      } catch (e) {
        consoleError("Schedule failed to delete record:", e);
        throw error(400, e);
      }
    }
  }
  
  // No matching entries exists yet
  else {
    // Create new entry
    try {
      if (action === 'scheduled') {
        await req.comixCleric.db.create("post_schedule", {
          post_type: collName,
          post_id: post?.id,
          date_published: post?.date_published
        });
      }
    } catch (e) {
      consoleError("Schedule failed to create record:", e);
      throw error(400, e);
    }
  }
}