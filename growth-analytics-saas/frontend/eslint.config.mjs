import { defineConfig } from "eslint/config";
import nextConfig from "eslint-config-next";

export default defineConfig([
  ...nextConfig,
  {
    rules: {
      // Disable the annoying TypeScript 'any' rule
      "@typescript-eslint/no-explicit-any": "off",
      
      // Disable the unused vars rule (or make it a warning only)
      "@typescript-eslint/no-unused-vars": "warn",
      
      // Disable the apostrophe escaping rule
      "react/no-unescaped-entities": "off",
      
      // Make these warnings instead of errors during build
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
]);
