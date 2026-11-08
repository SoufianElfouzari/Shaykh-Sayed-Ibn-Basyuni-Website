import { test as base, expect } from "@playwright/test";
import { fixtureResponse } from "../fixtures/data.mjs";

export const test = base.extend({
  page: async ({ page }, provide) => {
    await page.route("**/rest/v1/**", async (route) => {
      const result = fixtureResponse(route.request().url());
      if (!result) {
        await route.abort();
        throw new Error("Unexpected REST call: " + route.request().url());
      }
      await route.fulfill({
        status: result.status,
        contentType: "application/json",
        headers: { "access-control-allow-origin": "*" },
        body: await result.text(),
      });
    });
    await page.route("**/functions/v1/**", (route) => route.abort());
    await provide(page);
  },
});
export { expect };
