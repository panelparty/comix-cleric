// Utilities
import { consoleError } from '$lib/utils/debug.js';

// SvelteKit load function
export const load = async ({ url, locals }) => {
  // If ComixCleric client connection exists and user is an admin
  // NOTICE: To keep data safe, you should not return any data fields unless the user is authenticated as an admin.
  if (locals.comixCleric && locals.isAdmin) {
    try {
      // Get the paginated `Updates` data
      const updates = await locals.comixCleric.db.find("updates", {
        sort: "-date_published",
        populate: {
          cover: true,
          chapter: true,
          volume: true,
          type: true,
        },
        limit: 5,
      });

      // Get all chapters
      const chapters = await locals.comixCleric.db.find("chapters", {
        sort: "-date_published",
        populate: {
          cover: true,
          volume: true,
          updates: true,
        },
        limit: 5,
      });

      // Get all volumes
      const volumes = await locals.comixCleric.db.find("volumes", {
        sort: "-date_published",
        populate: {
          cover: true,
          chapters: true,
          updates: true,
        },
        limit: 5,
      });

      // Get all cast
      const cast = await locals.comixCleric.db.find("cast", {
        sort: "-date_published",
        populate: {
          cover: true,
          type: true,
        },
        limit: 5,
      });

      // Get all gallery posts
      const gallery = await locals.comixCleric.db.find("gallery", {
        sort: "-date_published",
        populate: {
          cover: true,
          type: true,
        },
        limit: 5,
      });

      // Get all blogs
      const blogs = await locals.comixCleric.db.find("blogs", {
        sort: "-date_published",
        populate: {
          cover: true,
          type: true,
        },
        limit: 5,
      });

      // Get count of all updates
      const updateCount = await locals.comixCleric.db.count("updates");

      // Get count of all chapters
      const chapterCount = await locals.comixCleric.db.count("chapters");

      // Get count of all volumes
      const volumeCount = await locals.comixCleric.db.count("volumes");

      // Get count of all volumes
      const castCount = await locals.comixCleric.db.count("cast");

      // Get count of all volumes
      const galleryCount = await locals.comixCleric.db.count("gallery");

      // Get count of all volumes
      const blogsCount = await locals.comixCleric.db.count("blogs");

      // Get count of all users
      const userCount = await locals.comixCleric.db.count("user");

      // Return fetched data
      return {
        updates,
        chapters,
        volumes,
        cast,
        gallery,
        blogs,
        update_count: updateCount,
        chapter_count: chapterCount,
        volume_count: volumeCount,
        cast_count: castCount,
        gallery_count: galleryCount,
        blogs_count: blogsCount,
        user_count: userCount,
      };
    } catch (e) {
      consoleError(e);
    }
  } else {
    return;
  }
};
