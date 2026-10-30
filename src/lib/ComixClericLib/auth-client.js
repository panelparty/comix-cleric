import { createAuthClient } from "better-auth/svelte";
import { adminClient, usernameClient } from "better-auth/client/plugins";
import { usernameSchema } from "$lib/utils/validation/schema";

export const authClient = createAuthClient({
  plugins: [
    adminClient(),
    usernameClient({
      minUsernameLength: 3,
      maxUsernameLength: 24,
      usernameValidator: (u) => usernameSchema.safeParse(u).success,
      displayUsername: false,
    }),
  ],
});
