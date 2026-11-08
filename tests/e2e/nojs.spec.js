import { test, expect } from "../support/browser-fixture.js";

test.use({ javaScriptEnabled: false });

test("server-rendered homepage, article archive and detail remain readable without JS", async ({ page }) => {
  const pages = [
    ["/", "Islam lernen"],
    ["/artikel", "Islamische Artikel"],
    ["/artikel/fiqh-grundlagen", "Fiqh Grundlagen"],
    ["/shaykh", "Shaykh Sayed"],
  ];

  for (const [path, expectedHeading] of pages) {
    const response = await page.goto(path);
    expect(response.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(expectedHeading);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://www.shaykh-sayed.de" + path,
    );
    await expect(page.locator("#root")).not.toBeEmpty();
  }
});

test("published article links and private draft isolation work with JavaScript disabled", async ({ page }) => {
  const index = await page.goto("/artikel");
  expect(index.status()).toBe(200);
  await expect(page.locator('a[href="/artikel/fiqh-grundlagen"]')).toHaveCount(1);
  const detail = await page.goto("/artikel/geheimer-entwurf");
  expect(detail.status()).toBe(404);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
});
