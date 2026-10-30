// -- Contains helpers and utilities for forcing tyoe array orders -- //

// Utilities
import { sortBy } from "lodash-es";

// Sort/re-order function
export function sortBySlugOrder(items, order, key = "slug") {
  if (!Array.isArray(items)) return items;
  const orderMap = new Map(order.map((slug, i) => [slug, i]));
  const end = order.length;
  return sortBy(items, (item) =>
    orderMap.has(item?.[key]) ? orderMap.get(item[key]) : end
  );
}

// Forced update type order
export const UPDATE_TYPE_ORDER = [
  "main-story",
  "update",
  "intermission",
  "hiatus",
  "notice",
  "snippet",
  "preview",
  "misc",
];

// Forced cast type order
export const CAST_TYPE_ORDER = [
  "main-character",
  "side-character",
  "supporting-character",
  "main-villain",
];
