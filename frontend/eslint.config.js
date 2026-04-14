import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint"; // 1. Add this import
import { defineConfig, globalIgnores } from "eslint/config";

export default tseslint.config(
  // 2. Wrap the config in tseslint.config
  globalIgnores(["dist", "node_modules"]),
  {
    // 3. Update the file extensions to include .ts and .tsx
    files: ["**/*.{ts,tsx,js,jsx}"],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended, // 4. Add TypeScript rules
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    rules: {
      // 5. Keep your custom rule for unused variables
      "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],
      // Optional: Add detailed comments as per your preference
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
);
