import { addFilter } from "$lib/utils/api/query.js";
import { checkNull } from "$lib/utils/detectTypes.js";

export const load = async ({ url, locals }) => {
  let page = checkNull(url.searchParams.get("page"));
  let limit = checkNull(url.searchParams.get("limit")) ?? locals?.settings?.page_limit ?? 15;
  let sort = url.searchParams.get("sort") ?? "-date_published";
  let status = url.searchParams.get("status") ?? "*";


  // Build filter object conditionally
  const filter = {};


  addFilter(filter, "status", status, { _eq: status });


  const volumes = await locals.comixCleric.db.find("volumes", {
    sort: [`${sort}`],
    filter: filter,
    populate: {
      cover: true,
      chapters: true,
      updates: true
    },
    limit: Number(limit),
    page: Number(page),
  });


  const volumeCount = await locals.comixCleric.db.count("volumes", filter);


  const volumeCountTotal = await locals.comixCleric.db.count("volumes");


  return {
    volumes,
    volumes_count: volumeCountTotal,
    filtered_volumes_count: volumeCount,
  };
};
