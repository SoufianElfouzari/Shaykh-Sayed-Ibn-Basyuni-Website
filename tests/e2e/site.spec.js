import { test, expect } from "../support/browser-fixture.js";

test("homepage hydrates without JavaScript errors", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error" && /hydrat|react/i.test(message.text())) errors.push(message.text());
  });
  const response = await page.goto("/");
  expect(response.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(page.locator(".sib-articles-featured h3").first()).toContainText("Fiqh");
  expect(await page.evaluate(() => Object.keys(document.querySelector("#root")).some((key) => key.startsWith("__reactContainer")))).toBe(true);
  expect(errors).toEqual([]);
});

test("SPA navigation preserves article archive search and loads the article", async ({ page }) => {
  await page.goto("/");
  let documentRequests = 0;
  page.on("request", (request) => {
    if (request.resourceType() === "document") documentRequests += 1;
  });
  await page.getByRole("link", { name: "Alle Artikel ansehen" }).first().click();
  await expect(page).toHaveURL(/\/artikel$/);
  await expect(page.locator(".sib-article-card")).toHaveCount(2);
  const search = page.getByRole("searchbox", { name: "Artikel durchsuchen" });
  await search.fill("Tahara");
  await expect(page.locator(".sib-article-card")).toHaveCount(1);
  await expect(page.locator(".sib-article-card")).toContainText("Reinigung");
  await search.fill("");
  await page.locator(".sib-article-card-link").first().click();
  await expect(page).toHaveURL(/\/artikel\/fiqh-grundlagen$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Fiqh Grundlagen");
  expect(documentRequests).toBe(0);
});

test("404 articles return the correct HTTP status and robots directive", async ({ page }) => {
  const response = await page.goto("/artikel/geheimer-entwurf");
  expect(response.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});

test("sitemap contains only published articles", async ({ request }) => {
  const response = await request.get("/sitemap.xml");
  expect(response.ok()).toBeTruthy();
  const xml = await response.text();
  expect(xml).toContain("/artikel/fiqh-grundlagen");
  expect(xml).toContain("/artikel/tahara-reinigung");
  expect(xml).not.toContain("geheimer-entwurf");
});

test("mobile navigation can be opened and closed with keyboard", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Mobile navigation is tested in the mobile browser project.");
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Menü öffnen" });
  await expect(menu).toBeVisible();
  await menu.click();
  await expect(page.getByRole("button", { name: "Menü schließen" }).first()).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(menu).toHaveAttribute("aria-expanded", "false");
});

test("archive page parameters keep canonical URL and reject nonexistent pages", async ({ page }) => {
  const first = await page.goto("/artikel?page=1");
  expect(first.status()).toBe(200);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://www.shaykh-sayed.de/artikel");

  const missing = await page.goto("/artikel?page=2");
  expect(missing.status()).toBe(404);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
});

test("SPA navigation to a missing article removes canonical after hydration", async ({ page }) => {
  await page.goto("/artikel");
  await page.evaluate(() => {
    window.history.pushState({}, "", "/artikel/geheimer-entwurf");
    window.dispatchEvent(new PopStateEvent("popstate"));
  });
  await expect(page.getByRole("heading", { name: "Artikel nicht gefunden" })).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
});
