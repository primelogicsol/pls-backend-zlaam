// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config({
  languageOptions: {
    parserOptions: {
      project: true,
      tsconfigRootDir: import.meta.dirname
    }
  },
  files: ["**/*.ts"],
  extends: [eslint.configs.recommended, ...tseslint.configs.recommendedTypeChecked],
  rules: {
    quotes: ["error", "double", { allowTemplateLiterals: true }],
    eqeqeq: "off",
    "no-unused-vars": "error",
    "prefer-const": ["error", { ignoreReadBeforeAssign: true }],
    "prefer-arrow-callback": ["error"],
    camelcase: ["error", { properties: "always" }]
  }
});
