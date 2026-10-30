// -- This file contains ATProto integration agents, utilities, and helpers. -- //

// AT Protocol SDK
import { AtpAgent } from "@atproto/api";

// Creates new ATProto client connection (agent)
const ATProtoAgent = (provider) => new AtpAgent({
  service: provider ?? "https://api.bsky.app",
});

// Export agents
export { ATProtoAgent };
