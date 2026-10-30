// -- Utilities for converting, inspecting, and building data structures. -- //

// Imports
import { detectType } from "$lib/utils/detectTypes.js";

// Appends a value to a FormData or similar target object.
// Objects and arrays are JSON-stringified; primitives are appended as-is.
export function appendData(target, name, value) {
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    value === null ||
    value === undefined
  ) {
    target.append(name, value);
  } else {
    target.append(name, JSON.stringify(value));
  }
}

// Parses a value that might be a JSON string or a plain value.
// Returns null for empty, "undefined", or "null" strings.
export const parseValue = (value) => {
  if (!value || value === "undefined" || value === "null") return null;

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

// Scans an array of objects and returns a single object containing one
// non-null example value for each key found across the array.
// Pass `endNull: true` to include keys that only had null values.
export function buildPreviewObject(array, endNull) {
  if (!array || array.length === 0) return {};

  const result = {};
  const keys = array.reduce((newObj, item) => {
    Object.keys(item).forEach((i) => newObj.add(i));
    return newObj;
  }, new Set());

  for (const key of keys) {
    for (const item of array) {
      if (item[key] !== null && item[key] !== undefined) {
        result[key] = item[key];
        break;
      } else {
        if (endNull && !(key in result)) result[key] = null;
      }
    }
  }

  return result;
}

// Like buildPreviewObject, but returns an array of { key, value, type } entries
// instead of a plain object useful for rendering a field preview table.
export function buildPreviewArray(array) {
  if (!array || array.length === 0) return [];

  const keys = array.reduce((newArray, item) => {
    Object.keys(item).forEach((i) => newArray.add(i));
    return newArray;
  }, new Set());

  return [...keys].map((key) => ({
    key,
    value:
      array.find((item) => item[key] !== null && item[key] !== undefined)?.[key] ?? null,
    type: detectType(
      array.find((item) => item[key] !== null && item[key] !== undefined)?.[key] ?? null,
    ),
  }));
}
