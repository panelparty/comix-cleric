// Public endpoint that takes the user to a random comic update

// SvelteKit utilities
import { redirect } from "@sveltejs/kit";

// Utilities
import { checkStatus } from "$lib/utils/api/auth.js";

// SvelteKit GET function
export async function GET({ locals }) {
  // Attempt to find the latest page on the server
  const resUpdates = await locals.comixCleric.db.find("updates", {
    filter: {
      ...checkStatus(locals),
      number: {
        _neq: null,
      },
    },
    fields: [
      'number'
    ]
  });

  const updates = resUpdates;

  let pageNumbers = [];

  updates.forEach((item)=>{
    pageNumbers.push(item?.number);
  });
  
  const randPageNumber = Math.floor(Math.random() * pageNumbers?.length);
  
  // Take the generated random page number and locate the page, if possible.
  const res = await locals.comixCleric.db.find("updates", {
    sort: "-date_published",
    filter: {
      ...checkStatus(locals),
      number: {
        _eq: pageNumbers[randPageNumber],
      },
    },
    fields: [
      'slug'
    ],
    limit: 1,
  });
  
  // Reassign the first object in the array to something we can keep track of more easily
  const page = res[0];

  // Redirect to the reader path with the latest page slug appended.
  // TODO: Add fail state
  throw redirect(303, `/comic/${page?.slug}`);
}
