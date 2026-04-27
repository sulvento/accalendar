import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Default `vitest` / `vitest run` will skip integration tests.
    // Run them explicitly with `npm run test:integration`, which targets
    // the file directly and bypasses this exclude.
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/*.integration.test.js",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json-summary", "lcov"],
    },
  },
});
