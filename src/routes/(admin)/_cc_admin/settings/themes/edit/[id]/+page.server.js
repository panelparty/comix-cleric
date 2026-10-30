export const load = async ({ locals, params }) => {
  // Get series ID from request params
  const id = params.id;

  // Setup for fetching
  let currentTheme = {};

  // Attempt to fetch data
  try {
    // Get series matching ID
    const resTheme = await locals.comixCleric.db.findOne("themes", id);

    currentTheme = resTheme;
  } catch (e) {
    // ...
  }

  // Return what we have
  return { currentTheme };
};
