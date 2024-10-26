import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,

  {
    ignores: [
      "dist/",
      "dist",
      "node_modules/",
      ".env",
      ".gitignore",
      "tsconfig.json",
      "./.env",
      ".env.example",
    ],

    rules: {
      eqeqeq: "off",
      "no-unused-vars": "error",
      "prefer-const": ["error", { ignoreReadBeforeAssign: true }],
      "prefer-arrow-callback": ["error"],
      camelcase: ["error", { properties: "always" }],
    },
  },
];
