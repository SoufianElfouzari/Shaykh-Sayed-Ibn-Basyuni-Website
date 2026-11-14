import { test, expect } from "../support/browser-fixture.js";

test("real hanging lantern defers expensive 3D and loads the local asset on interaction", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "GPU-specific 3D interaction smoke test runs on Chromium.");

  const response = await page.goto("/", { waitUntil: "domcontentloaded" });
  expect(response.status()).toBe(200);

  const host = page.locator(".sib-lantern-host");
  await expect(host).toBeVisible();
  await expect(host.locator(".sib-lantern-poster")).toHaveAttribute("src", "/assets/brass-diya-lantern-preview.png");

  // Initial SEO and LCP must not load the 3 MB WebGL physics engine.
  await expect(host.locator("canvas")).toHaveCount(0);

  const supportsWebGL = await page.evaluate(() => {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  });
  test.skip(!supportsWebGL, "No hardware or software WebGL rendering is available.");

  const glbRequest = page.waitForResponse(
    (request) => request.url().includes("/models/brass-diya-lantern.glb"),
    { timeout: 30000 },
  );

  await host.hover();
  const model = await glbRequest;
  expect(model.status()).toBe(200);
  await expect(host.locator("canvas")).toBeVisible({ timeout: 30000 });
  await expect(host).toHaveClass(/sib-lantern-host-ready/, { timeout: 30000 });

  // A drag must not crash the scene; the model should remain visible.
  const dimensions = await host.boundingBox();
  expect(dimensions).not.toBeNull();
  const x = dimensions.x + dimensions.width / 2;
  const y = dimensions.y + dimensions.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + 18, y + 25, { steps: 5 });
  await page.mouse.up();
  await expect(host.locator("canvas")).toBeVisible();
});
