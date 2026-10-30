import svelte from "eslint-plugin-svelte";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";

export default [
  ...svelte.configs["flat/base"],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: 2024,
        sourceType: "module",
      },
    },
    plugins: {
      "unused-imports": unusedImports,
    },
    rules: {
      "no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_[a-zA-Z]",
          args: "after-used",
          argsIgnorePattern: "^_[a-zA-Z]",
        },
      ],
    },
  },
  {
    files: ["**/*.svelte"],
    languageOptions: {
      parserOptions: {
        svelteFeatures: {
          runes: true,
        },
      },
    },
    rules: {
      "no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_[a-zA-Z]|^\\$\\w+",
          args: "after-used",
          argsIgnorePattern: "^_[a-zA-Z]",
        },
      ],
    },
  },
  {
    ignores: ["node_modules/**", ".svelte-kit/**", "build/**", "static/**"],
  },
];
