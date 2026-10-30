import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import path from 'path';
import pkg from "./package.json";

export default defineConfig({
  plugins: [sveltekit(), tailwindcss()],
  build: {
    target: "es2022",
  },
  define: {
    "import.meta.env.VITE_APP_VERSION": JSON.stringify(pkg.version),
  },
  server: {
    watch: {
      ignored: ["./api"],
    },
    allowedHosts: true,
  },
  resolve: {
    alias: {
      '$theme': path.resolve(__dirname, 'theme')
    }
  }
});
