// This file contains admin navigation routes and helper functions

import { appVer } from "$lib/utils/utils";


// Svelte utilities


// Reference to the admin route
export const adminRoute = "/_cc_admin";


// Post management routes
export const mainRoutes = [
  {
    label: "Return to Main Site",
    slug: "return",
    url: "/",
    icon: "arrow-u-up-left",
    match: "exact",
  },
];


// Post management routes
export const comicRoutes = [
  {
    label: "Dashboard",
    slug: "dashboard",
    url: adminRoute,
    icon: "house",
    match: "exact",
  },
  {
    label: "Series",
    slug: "series",
    url: adminRoute + "/series",
    icon: "books",
  },
  {
    label: "Comic Updates",
    slug: "updates",
    url: adminRoute + "/updates",
    icon: "files",
  },
  {
    label: "Chapters",
    slug: "chapters",
    url: adminRoute + "/chapters",
    icon: "book-open-text",
  },
  {
    label: "Volumes",
    slug: "volumes",
    url: adminRoute + "/volumes",
    icon: "book",
  },
  {
    label: "Cast",
    slug: "cast",
    url: adminRoute + "/cast",
    icon: "users-three",
  },
  {
    label: "Blogs",
    slug: "blogs",
    url: adminRoute + "/blogs",
    icon: "notepad",
  },
  {
    label: "Gallery",
    slug: "gallery",
    url: adminRoute + "/gallery",
    icon: "image",
  },
];


// Asset management routes
export const assetRoutes = [
  {
    label: "Media Files",
    slug: "media-files",
    url: adminRoute + "/media",
    icon: "images",
  },
];


// Post moderation routes
export const moderationRoutes = [
  {
    label: "Comments",
    slug: "comments",
    url: adminRoute + "/comments",
    icon: "chat-text",
  },
];


// Site settings routes
export const siteRoutes = [
  {
    label: "Global Settings",
    slug: "global-settings",
    url: adminRoute + "/settings",
    icon: "globe",
    match: "exact",
  },
  {
    label: "Themes & Branding",
    slug: "theme-settings",
    url: adminRoute + "/settings/themes",
    icon: "palette",
  },
  {
    label: "App Pages",
    slug: "page-settings",
    url: adminRoute + "/settings/pages",
    icon: "layout",
  },
  // {
  //   label: "SEO & Performance",
  //   slug: "seo-settings",
  //   url: adminRoute + "/settings/seo",
  //   icon: "binoculars",
  // },
];


// User account routes
export const accountRoutes = [
  {
    label: "Users & Staff",
    slug: "users",
    url: adminRoute + "/users",
    icon: "address-book",
    match: "exact",
  },
  {
    label: "My Account",
    slug: "account",
    url: adminRoute + "/users/profile",
    icon: "user-list",
  },
  {
    label: "Account Settings",
    slug: "account-settings",
    url: adminRoute + "/users/edit",
    icon: "gear-six",
  },
];


// Help routes
export const helpRoutes = [
  {
    label: "Docs",
    slug: "docs",
    url: "https://comixcleric.com/docs/comix-cleric",
    icon: "question",
    external: true,
  },
  {
    label: "Report an Issue",
    slug: "report",
    url: "https://discord.gg/pJtz3EJsmG",
    icon: "chats-teardrop",
    external: true,
  },
  {
    label: "App Info",
    slug: "app-info",
    url: "https://comixcleric.com/docs/changelogs#" + appVer,
    icon: "info",
    external: true,
  },
];


// Gets the active route based on the page url state
export function getActiveState(route, state, match) {
  let res = false;

  if (match === "exact") {
    res = state?.url?.pathname === route;
  } else {
    res = state?.url?.pathname?.startsWith(route);
  }

  return res;
}
