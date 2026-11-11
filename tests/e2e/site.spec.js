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

test("home and Durous copy uses H1 keywords with descriptive link labels", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".sib-home-hero-description"))
    .toContainText("Islam lernen mit Quran und Sunnah");
  await expect(page.locator(".sib-articles-all-link"))
    .toContainText("Alle Artikel ansehen");
  await expect(page.locator(".sib-articles-mobile-link"))
    .toContainText("Zur Artikelübersicht");
  await expect(page.locator(".sib-schedule-subject strong")).toHaveCount(0);

  await page.goto("/durous");
  await expect(page.locator(".sib-duruus-page-hero-description"))
    .toContainText("Islamische Unterrichte von Shaykh Sayed");
  await expect(page.locator(".sib-notices-banner-affected-dars strong"))
    .toHaveCount(0);
  await expect(page.locator(".sib-schedule-subject strong")).toHaveCount(0);
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

test("biography stays visible on a 410px screen, including long chapters", async ({ page }) => {
  await page.setViewportSize({ width: 410, height: 860 });
  const response = await page.goto("/shaykh");
  expect(response.status()).toBe(200);
  await expect(page.locator(".sib-short-biography-chapter")).toHaveCount(4);

  for (const selector of [
    ".sib-short-biography-header",
    ".sib-short-biography-lead",
    ".sib-short-biography-chapter",
    ".sib-short-biography-footer",
  ]) {
    const element = page.locator(selector).first();
    await element.scrollIntoViewIfNeeded();
    await expect(element).toBeVisible();
    await expect.poll(
      () => element.evaluate((node) => getComputedStyle(node).opacity),
      { timeout: 5000 },
    ).toBe("1");
  }

  await expect(page.locator(".sib-short-biography-title"))
    .toContainText("wissenschaftlicher Werdegang");
});

test("biography is readable on mobile Safari without JavaScript", async ({ browser, browserName }) => {
  test.skip(browserName !== "webkit", "Verify the reported Safari layout.");
  const context = await browser.newContext({
    baseURL: "http://127.0.0.1:4179",
    javaScriptEnabled: false,
    viewport: { width: 410, height: 860 },
  });
  try {
    const page = await context.newPage();
    const response = await page.goto("/shaykh");
    expect(response.status()).toBe(200);

    const heading = page.locator(".sib-short-biography-title");
    await heading.scrollIntoViewIfNeeded();
    await expect(heading).toBeVisible();
    expect(await heading.evaluate((node) => getComputedStyle(node).opacity)).toBe("1");

    const paragraphs = page.locator(".sib-short-biography-chapter-text p");
    expect(await paragraphs.count()).toBeGreaterThan(4);
    const firstParagraph = paragraphs.first();
    await firstParagraph.scrollIntoViewIfNeeded();
    expect(await firstParagraph.evaluate((node) => getComputedStyle(node).opacity)).toBe("1");
  } finally {
    await context.close();
  }
});

test("Safari mobile hard reload keeps biography visible without animation", async ({ page, browserName }) => {
  test.skip(browserName !== "webkit", "Safari-specific regression.");
  await page.setViewportSize({ width: 410, height: 860 });
  await page.goto("/shaykh");
  await page.reload({ waitUntil: "domcontentloaded" });
  const heading = page.locator(".sib-short-biography-title");
  await heading.scrollIntoViewIfNeeded();
  await expect(heading).toBeVisible();
  await expect.poll(() => heading.evaluate((node) => getComputedStyle(node).opacity)).toBe("1");
  await expect(page.locator(".sib-short-biography-chapter")).toHaveCount(4);
  expect(await page.locator(".sib-short-biography-chapter").first().evaluate((node) => getComputedStyle(node).animationName)).toBe("none");
});

test("static development fallback never flashes unstyled text", async ({ page }) => {
  await page.goto("/shaykh", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".seo-initial-content")).toHaveCount(0);
});


test("all static routes expose unique crawlable titles and descriptions", async ({ page }) => {
  const expected = [
    ["/", "Islam lernen mit Quran und Sunnah | Unterrichte & Artikel"],
    ["/shaykh", "Islamischer Lehrer in Kassel | Biografie & Ausbildung"],
    ["/durous", "Islamische Unterrichte auf Deutsch | Fiqh & Hadith"],
    ["/artikel", "Islamische Artikel lesen | Fiqh, Aqidah & Hadith"],
    ["/kontakt", "Fragen zum Islam stellen | Kontakt & Fatwa-Anfrage"],
    ["/impressum", "Impressum | Rechtliche Informationen"],
    ["/datenschutz", "Datenschutz | Informationen zur Datenverarbeitung"],
  ];
  const descriptions = new Set();
  for (const [path, title] of expected) {
    const response = await page.goto(path);
    expect(response.status()).toBe(200);
    await expect(page).toHaveTitle(title);
    const description = await page.locator('meta[name="description"]').getAttribute("content");
    expect(description?.length).toBeGreaterThan(60);
    expect(descriptions.has(description)).toBe(false);
    descriptions.add(description);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", title);
    await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute("content", description);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://www.shaykh-sayed.de" + path);
    expect(await page.locator('meta[name="description"]').count()).toBe(1);
  }
});

test("article detail title uses its own headline, not a site-name suffix", async ({ page }) => {
  const response = await page.goto("/artikel/fiqh-grundlagen");
  expect(response.status()).toBe(200);
  await expect(page).toHaveTitle("Fiqh Grundlagen: ein Testartikel");
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", "Fiqh Grundlagen: ein Testartikel");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /Grundlagen des Fiqh/);
});


test("latest articles use the editorial two-column layout with live preview links", async ({ page }) => {
  const response = await page.goto("/");
  expect(response.status()).toBe(200);
  const section = page.locator(".sib-articles");
  await expect(section.getByRole("heading", { level: 2 })).toContainText("Islam lernen.");
  await expect(section.locator(".sib-articles-content .sib-articles-secondary")).toHaveCount(2);
  await expect(section.locator(".sib-articles-secondary").first()).toHaveAttribute("href", "/artikel/fiqh-grundlagen");
  await expect(section.getByRole("link", { name: "Alle Artikel ansehen" })).toHaveAttribute("href", "/artikel");
  await expect(section.locator(".sib-articles-featured h3")).toContainText("Fiqh");
});

test("latest article preview remains readable and navigable on small screens", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const section = page.locator(".sib-articles");
  const link = section.getByRole("link", { name: "Alle Artikel ansehen" });
  await expect(link).toBeVisible();
  await expect(section.locator(".sib-articles-secondary").first()).toBeVisible();
  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);
});
