// -- This file contains email address validation methods, utilities, and helpers -- //

// Email blacklist imports
import { blacklist } from "./blacklist.js";

// Exported function that checks if a provided email exists in the blacklist
export function isEmailDomainBanned(email) {
  const domain = email?.split("@")[1]?.toLowerCase();
  return blacklist.has(domain);
}

// Exported function that pings a provided email server name to see if it is reachable.
// TODO: Make sure this method is valid.
export async function domainExists(email) {
  const domain = email?.split("@")[1];

  fetch("https://" + domain)
    .then((response) => {
      if (response.ok) {
        return true;
      } else {
        return false;
      }
    })
    .catch((error) => {
      return false;
    });
}
