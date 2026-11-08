import { existsSync, readdirSync, readFileSync } from "node:fs";

const directory = "lighthouse-reports";
if (!existsSync(directory)) {
  console.log("No Lighthouse reports have been generated.");
  process.exit(0);
}

let reported = 0;
for (const filename of readdirSync(directory).filter((name) => name.endsWith(".json"))) {
  let report;
  try {
    report = JSON.parse(readFileSync(`${directory}/${filename}`, "utf8"));
  } catch {
    continue;
  }

  if (!report.categories?.seo || !report.audits) continue;
  reported += 1;
  const scores = Object.entries(report.categories)
    .map(([key, value]) => `${key}: ${Math.round((value.score || 0) * 100)}/100`)
    .join(" | ");
  console.log(`Lighthouse ${report.finalUrl || report.requestedUrl || filename}: ${scores}`);

  for (const audit of report.categories.seo.auditRefs || []) {
    const entry = report.audits[audit.id];
    if (entry && audit.weight > 0 && entry.score !== null && entry.score < 1) {
      console.log(`  SEO finding: ${audit.id}: ${entry.title} (score ${entry.score})`);
    }
  }
}
if (reported === 0) console.log("No parsed Lighthouse JSON reports found.");
