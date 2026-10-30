// -- Utilities and helpers for choosing icons -- //

// Utilities
import { icons } from "@phosphor-icons/core";

// Full list of icons
export const phosphorIcons = icons;

// Icon names
export const phosphorIconNames = icons.map((i) => i.name).sort();

// Finds an icon for an update type
export function getIcon(type) {
  const postTypes = [
    { value: "main-story", icon: "question-mark" },
    { value: "update", icon: "newspaper" },
    { value: "intermission", icon: "timer" },
    { value: "hiatus", icon: "calendar-slash" },
    { value: "notice", icon: "note" },
    { value: "snippet", icon: "scissors" },
    { value: "preview", icon: "film-slate" },
    { value: "misc", icon: "dots-three" },
  ];

  const match = postTypes.find((item) => item.value === type);

  return match ? match.icon : "question-mark";
}
