// Utilities
import { checkStatus } from "$lib/utils/api/auth.js";
import { consoleError } from "$lib/utils/debug.js";
import { find } from "lodash-es";

// SvelteKit load function
export const load = async ({locals, url}) => {
  let pages = [];
  let currentPage = {};

  // Attempt to fetch data
  try {
    // Get all (visible) app pages
    const resPages = await locals.comixCleric.db.find("pages", {
      sort: "order_id",
      filter: {
        ...checkStatus(locals)
      }
    });

    pages = resPages;
    
  } catch (e) {
    consoleError(e);
    // ...
  }

  // See if the current url slug exists in the app pages array.
  function getPathname() {
    let pathname = null;

    if (url?.pathname != "/") {
      pathname = url?.pathname;
    } else {
      pathname = "/";
    }

    let res = find(pages, (p) => p?.url === pathname);

    return res?.status != 'published' ? null : res;
  }

  currentPage = getPathname();

  // Return what we have
  return {
    pages,
    currentPage,
  };
};
