export const load = async ({ locals }) => {
  let pages = [];

  try {
    const resPages = await locals.comixCleric.db.find("pages", {
      sort: "order_id",
    });

    pages = resPages;
  } catch {
    // ...
  }

  return {
    pages,
  };
};
