import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const dir = new URL("../lighthouse-reports/", import.meta.url);
const path = dir.pathname;

if (!existsSync(path)) {
  console.log("Lighthouse-Berichte nicht vorhanden. Kein Messwert wird behauptet.");
  process.exit(0);
}

const reports = [];
for (const filename of readdirSync(path)) {
  if (!filename.endsWith(".json")) continue;
  try {
    const data = JSON.parse(readFileSync(join(path, filename), "utf8"));
    if (data?.lighthouseVersion && data?.audits && data?.categories) {
      reports.push(data);
    }
  } catch (error) {
    console.error("Lighthouse JSON konnte nicht gelesen werden:", filename, error);
  }
}

if (reports.length === 0) {
  console.log("Keine auswertbaren Lighthouse-JSON-Berichte vorhanden.");
  process.exit(0);
}

function score(value) {
  return Number.isFinite(value) ? Math.round(value * 100) + "/100" : "nicht gemessen";
}
function ms(value) {
  return Number.isFinite(value) ? Math.round(value) + " ms" : "nicht gemessen";
}

console.log("===== REAL LIGHTHOUSE MEASUREMENTS (" + reports.length + " RUNS) =====");
for (const report of reports) {
  const { categories, audits } = report;
  const url = report.finalDisplayedUrl || report.finalUrl || report.requestedUrl;
  console.log("URL: " + url);
  console.log("  Performance: " + score(categories.performance?.score));
  console.log("  SEO: " + score(categories.seo?.score));
  console.log("  Accessibility: " + score(categories.accessibility?.score));
  console.log("  LCP: " + ms(audits["largest-contentful-paint"]?.numericValue));
  console.log("  TTFB: " + ms(audits["server-response-time"]?.numericValue));
  console.log("  CLS: " + (audits["cumulative-layout-shift"]?.numericValue ?? "nicht gemessen"));
  console.log("  Total byte weight: " + (audits["total-byte-weight"]?.numericValue ?? "nicht gemessen") + " bytes");
}
