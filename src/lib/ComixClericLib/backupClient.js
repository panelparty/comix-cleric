import { env } from "$env/dynamic/private";

function apiBaseUrl() {
  return env.COMIX_CLERIC_API_URL || "http://localhost:3001";
}

export async function requestBackup(body, bearerToken) {
  return fetch(`${apiBaseUrl()}/api/backup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${bearerToken}`,
    },
    body: JSON.stringify(body),
  });
}
