// Standard SvelteKit load function
export const load = async ({ locals, url }) => {
  // Prepare to get the active theme.
  let theme;

  // Attempt to find the active theme data in the database.
  try {
    // Request a theme with a slug matching the active theme.
    const resTheme = await locals.comixCleric.db.find("themes", {
      filter: {
        slug: {
          _eq: `${locals.settings?.theme}`,
        },
      }
    });
    
    // If we got data back, assign the first value to the theme variable.
    theme = resTheme[0];
  } catch {}

  // If a user is authenticated, return their *sanitized* data to the client as well.
  if (locals.user) {
    return {
      user: {
        id: locals.user?.id,
        username: locals.user?.username,
        displayname: locals.user?.displayname,
        avatar: locals.user?.avatar,
        role: locals.isAdmin ? "Admin" : "Basic",
        project_role: locals.user?.project_role,
      },
      isAdmin: locals.isAdmin,
      settings: locals.settings,
      series: locals.series,
      theme: theme,
      customMeta: false,
      origin: url?.origin,
    };
  }

  // Otherwise, return what we have.
  return {
    user: null,
    isAdmin: false,
    settings: locals.settings,
    series: locals.series,
    theme: theme,
    customMeta: false,
    origin: url?.origin,
  };
};
