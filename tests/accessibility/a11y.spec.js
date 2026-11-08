import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "../support/browser-fixture.js";

for (const route of ["/", "/artikel", "/durous", "/kontakt"]) {
  test("accessibility: no critical or serious violations on " + route, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(route);
    if (route === "/kontakt") await page.locator("#kontaktformular").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1450);
    await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    const blockers = result.violations.filter(
      (violation) => violation.impact === "critical" || violation.impact === "serious",
    );
    expect(blockers, JSON.stringify(blockers.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })), null, 2)).toEqual([]);
  });
}
