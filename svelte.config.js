import adapter from "@sveltejs/adapter-node";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
    // Set the app directory
    appDir: "app",
    paths: {
      base: "", // adjust if using subpath
    },
    alias: {
      '$theme': 'theme/',
      '$theme/*': 'theme/*'
    }
  },
  // Note: We're using custom CSRF protection in hooks.server.js
  // No need for checkOrigin here
};

export default config;
