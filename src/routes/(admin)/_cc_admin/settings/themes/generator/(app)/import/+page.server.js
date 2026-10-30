// SvelteKit load function
export const load = async ({ locals }) => {
	// Setup for data fetching
	let themes = [];

	// Attempt to fetch data
	try {
		// Get all themes
		const resThemes = await locals.comixCleric.db.find("themes");

		themes = resThemes;
	} catch (e) {
		// ...
	}

	// Return what we have
	return { themes };
};
