// -- Utilities for identifying the type or format of a value -- //
// Used in batch importer

// Svelte utilities
import { error } from "@sveltejs/kit";

// Utilities
import { isNull, isArray, isPlainObject } from "lodash-es";
import * as v from "validator";

// Basic type/format detection
const checks = [
  // Common string formats
  ["uuid", (s) => v.isUUID(s)],
  ["email", (s) => v.isEmail(s)],
  ["jwt", (s) => v.isJWT(s)],
  ["locale", (s) => v.isLocale(s)],
  ["iso8601", (s) => v.isISO8601(s)],
  ["rfc3339", (s) => v.isRFC3339(s)],
  ["time", (s) => v.isTime(s)],
  ["url", (s) => v.isURL(s)],
  ["mimeType", (s) => v.isMimeType(s)],
  ["decimal", (s) => v.isDecimal(s)],
  ["float", (s) => v.isFloat(s)],
  ["int", (s) => v.isInt(s)],
  ["numeric", (s) => v.isNumeric(s)],
  ["hexColor", (s) => v.isHexColor(s)],
  ["rgbColor", (s) => v.isRgbColor(s)],
  ["rgbColorNoAlpha", (s) => v.isRgbColor(s, false)],
  ["hslColor", (s) => v.isHSL(s)],
  ["phoneNumber", (s) => v.isMobilePhone(s, "any")],
  ["json", (s) => v.isJSON(s)],
  ["slug", (s) => v.isSlug(s)],

  // Less common / more specific formats
  ["ip", (s) => v.isIP(s)],
  ["iso31661Alpha2", (s) => v.isISO31661Alpha2(s)],
  ["iso31661Alpha3", (s) => v.isISO31661Alpha3(s)],
  ["ipv4", (s) => v.isIP(s, 4)],
  ["ipv6", (s) => v.isIP(s, 6)],
  ["ipRange", (s) => v.isIPRange(s)],
  ["macAddress", (s) => v.isMACAddress(s)],
  ["currency", (s) => v.isCurrency(s)],
  ["latLong", (s) => v.isLatLong(s)],
  ["base64", (s) => v.isBase64(s)],
  ["base64url", (s) => v.isBase64(s, { urlSafe: true })],
  ["hex", (s) => v.isHexadecimal(s)],
  ["octal", (s) => v.isOctal(s)],
  ["md5", (s) => v.isMD5(s)],
  ["hash_sha1", (s) => v.isHash(s, "sha1")],
  ["hash_sha256", (s) => v.isHash(s, "sha256")],
  ["hash_sha512", (s) => v.isHash(s, "sha512")],
];

// Returns a string label describing the format of a value.
// Non-strings return their JS type name directly (e.g. "number", "boolean").
export function detectType(value) {
  const jsType = typeof value;
  if (jsType !== "string") return jsType;

  for (const [label, check] of checks) {
    if (check(value)) return label;
  }

  return "string";
}

// Returns the structural type of a value: "null", "array", "object", or a JS primitive type.
export function getType(val) {
  if (isNull(val)) return "null";
  if (isArray(val)) return "array";
  if (isPlainObject(val)) return "object";

  return typeof val;
}

// Returns data if it is a real, non-nullish value, otherwise returns the fallback (or null).
// Checks for null, "null", undefined, and "undefined" string variants.
export function checkNull(data, fallback) {
  if (
    data &&
    !isNull(data) &&
    data != null &&
    data != "null" &&
    data != undefined &&
    data != "undefined"
  ) {
    return data;
  }

  if (fallback) {
    return fallback;
  }

  return null;
}

// For throwing errors when data is not found
export function notFound(val) {
  if (!val || val?.length < 1) {
    throw error(404, "Page not found");
  }
}