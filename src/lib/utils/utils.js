// General-purpose utilities that don't belong to a more specific category.
// TODO: Vet this list for functions that may overlap with an imported dependency and see which is more viable.

// Imports
import { capitalize, isArray, uniqWith, isEqual } from "lodash-es";

// Get current app version from package.json
export const appVer = import.meta.env.VITE_APP_VERSION;

// The current year
export const currentYear = new Date().getFullYear();

// Creates a plain copy of a proxy object
export const serializeNonPOJOs = (obj) => {
  return structuredClone(obj);
};

// Returns the keys of an object as an array of strings.
export function varToString(obj) {
  if (obj) return Object.keys(obj);

  return null;
}

// Converts object keys into a list of { label, value } option objects.
// Pass `labels: true` to capitalize keys and replace underscores/hyphens with spaces.
export function keysToOptions(obj, labels) {
  if (obj) {
    const list = [];

    for (let i = 0; i < varToString(obj).length; i++) {
      list.push({
        label:
          labels === true
            ? capitalize(
                varToString(obj)[i].replaceAll("_", " ").replaceAll("-", " "),
              )
            : varToString(obj)[i],
        value: varToString(obj)[i],
      });
    }

    return list;
  }
}

// Returns the keys of an object as a list of capitalized, space-separated strings.
export function getLabels(obj) {
  if (obj) {
    const list = [];

    for (let i = 0; i < varToString(obj).length; i++) {
      list.push(capitalize(varToString(obj)[i].replace("_", " ")));
    }

    return list;
  }
}

// Builds a fast index over an array by a given field, returning a lookup function.
// The returned function accepts a value and returns that item's index, or -1 if not found.
export function createLookup(array, field) {
  const lookup = new Map();

  array?.forEach((obj, index) => {
    lookup.set(obj[field], index);
  });

  return (value) => lookup.get(value) ?? -1;
}

// Normalizes various "truthy" string/value representations to a real boolean
// Handles: true, "true", "on", "1", "yes", "enabled"
export function setBoolean(value) {
  if (
    value === true ||
    value === "true" ||
    value === "on" ||
    value === "1" ||
    value === "yes" ||
    value === "enabled"
  ) {
    return true;
  }

  return false;
}

// Parses a cookie header string into a plain key/value object
export function parseCookies(cookieString) {
  const cookies = {};

  if (!cookieString) return cookies;

  cookieString.split(";").forEach((cookie) => {
    const [name, value] = cookie.trim().split("=");

    if (name && value) {
      cookies[name] = decodeURIComponent(value);
    }
  });

  return cookies;
}

// Returns the first "truthy" value from the provided array
export function fallback(values) {
  if (isArray(values) && values?.length > 0) {
    for (let i = 0; i < values.length; i++) {
      if (values[i]) {
        return values[i];
      }
    }
  }
}

// Removes duplicate entries from an array
export function deepSet(arr = []) {
  return uniqWith(arr, isEqual);
}
