// 
import { checkStatus } from '$lib/utils/api/auth';

// Standard SvelteKit load function
export const load = async ({ locals, params }) => {
  // Get slug from request params
  const slug = params?.slug;

  // Setup for fetching
  let volume = [];
  let chapters = [];
  let chapterCount = 0;

  // If we have a slug value
  if (slug) {
    // Attempt to fetch data
    try {
      // Get the volume based on the current slug
      const resVolume = await locals.comixCleric.db.find("volumes", {
        filter: {
          ...checkStatus(locals),
          slug: {
            _eq: slug,
          },
        },
      });
      volume = resVolume[0];

      // Get all (visible) Chapters in this volume
      const resChapters = await locals.comixCleric.db.find("chapters", {
        filter: {
          ...checkStatus(locals),
          volume: {
            _eq: volume?.id,
          },
        },
        populate: {
          volume: true,
          updates: true,
        }
      });
      chapters = resChapters;

      // Get the count of all (visible) Chapters in this volume
      const resChapterCount = await locals.comixCleric.db.count("chapters", {
        filter: {
          ...checkStatus(locals),
          volume: {
            _eq: volume?.id,
          },
        },
      });
      chapterCount = resChapterCount;
    } catch (e) {
      // ...
    }
  }

  // Return what we have
  return { volume, chapters, chapterCount };
};
