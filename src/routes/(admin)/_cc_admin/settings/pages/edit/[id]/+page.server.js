export const load = async ({ locals, params }) => {
  let id = params?.id;
  let page = {};
  let themes = [];

  try {
    const resPage = await locals.comixCleric.db.findOne("pages", id);

    page = resPage;

    const resThemes = await locals.comixCleric.db.find("themes");

    themes = resThemes;
  } catch {
    // ...
  }

  return {
    page,
    themes,
  };
};
