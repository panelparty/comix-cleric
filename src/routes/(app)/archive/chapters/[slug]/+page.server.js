import { checkStatus } from '$lib/utils/api/auth';

// Standard SvelteKit load function
export const load = async ({ locals, params }) => {
  // Get the chapter slug from params
  const slug = params?.slug;

  // Setup for data fetching
  let chapter = [];
  let updates = [];
  let updateCount = 0;

  // If the slug exists
  if (slug) {
    // Attempt to fetch the chapter data
    try {
      // Get info about the chapter
      const resChapter = await locals.comixCleric.db.find("chapters", {
        filter: {
          ...checkStatus(locals),
          slug: {
            _eq: slug,
          },
        },
        populate: {
          cover: true,
          volume: true,
        }
      });

      chapter = resChapter[0];

      // Get updates from this chapter
      const resUpdates = await locals.comixCleric.db.find("updates", {
        filter: {
          ...checkStatus(locals),
          chapter: {
            _eq: chapter?.id,
          },
        },
        populate: {
          cover: true,
          chapter: true,
          chapter: {
            cover: true
          },
          volume: true,
          volume: {
            cover: true
          },
        }
      });

      updates = resUpdates;

      // Get the number of (visible) updates in this chapter
      const resUpdateCount = await locals.comixCleric.db.count("updates", {
        filter: {
          ...checkStatus(locals),
          chapter: {
            _eq: chapter?.id,
          },
        },
      });

      updateCount = resUpdateCount;
    } catch (e) {
      // ...
    }
  }

  // Return what we have
  return { chapter, updates, updateCount };
};
