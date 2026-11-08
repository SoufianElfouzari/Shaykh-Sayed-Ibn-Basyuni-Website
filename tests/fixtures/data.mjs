// Deterministic test data, not copied from the live database.
export const fixtureHostname = "hwksfmccecfsxbxjlizm.supabase.co";
export const rows = {
  articles: [
    {
      id: "fixture-article-one", slug: "fiqh-grundlagen",
      title: "Fiqh Grundlagen: ein Testartikel",
      excerpt: "Eine Einleitung zu den Grundlagen des Fiqh.",
      contentHtml: "<h2>Einleitung</h2><p>Dieser Testartikel ist veröffentlicht.</p><h2>Quellen und Hinweise</h2><p>Mehr Informationen zur islamischen Wissenschaft.</p>",
      status: "published", category: "Fiqh", language: "Deutsch",
      author: "Shaykh Sayed Ibn Basyuni", tags: ["Fiqh", "Grundlagen"],
      featured: true, publishedAt: "2026-10-15T08:00:00Z",
      updated_at: "2026-10-16T08:00:00Z", coverImageUrl: "",
    },
    {
      id: "fixture-article-two", slug: "tahara-reinigung",
      title: "Reinigung und Tahara", excerpt: "Grundregeln der rituellen Reinigung.",
      contentHtml: "<h2>Die Reinheit</h2><p>Testinhalt zu Wasser und Reinigung.</p>",
      status: "published", category: "Fiqh", language: "Deutsch",
      author: "Shaykh Sayed Ibn Basyuni", tags: ["Fiqh", "Tahara"],
      featured: false, publishedAt: "2026-10-12T08:00:00Z",
      updated_at: "2026-10-13T08:00:00Z", coverImageUrl: "",
    },
    {
      id: "fixture-draft", slug: "geheimer-entwurf",
      title: "Darf nicht öffentlich sein", excerpt: "Unveröffentlichte Daten.",
      contentHtml: "<p>Vertraulicher Entwurf.</p>", status: "draft",
      category: "Intern", language: "Deutsch", tags: [], publishedAt: null,
    },
  ],
  duruus: [
    {
      id: "fixture-dars", title: "Fiqh Unterricht 1", series: "Fiqh",
      lessonNumber: 1, lessonDate: "2026-10-17", durationSeconds: 1500,
      description: "Öffentliche Aufnahme.", audioObjectKey: "public/fiqh-1.mp3",
      audioFileName: "fiqh-1.mp3", status: "published",
      publishedAt: "2026-10-17T12:00:00Z", language: "Deutsch", category: "Fiqh",
    },
    {
      id: "fixture-dars-draft", title: "Geheime Aufnahme", series: "Intern",
      audioObjectKey: "private/hidden.mp3", status: "draft",
    },
  ],
  notices: [
    {
      id: "fixture-notice", title: "Aktueller Unterrichtshinweis",
      message: "Der Unterricht findet regulär statt.", noticeType: "general",
      affectedDars: "", status: "published", validFrom: null, validUntil: null,
      publishedAt: "2026-10-16T10:00:00Z",
    },
    {
      id: "fixture-notice-draft", title: "Interner Hinweis",
      message: "Nicht öffentlich.", noticeType: "general",
      status: "draft", validFrom: null, validUntil: null,
    },
  ],
};

export function queryFixture(input) {
  const url = input instanceof URL ? input : new URL(input);
  if (url.hostname !== fixtureHostname || !url.pathname.startsWith("/rest/v1/")) return null;
  const table = url.pathname.slice("/rest/v1/".length);
  if (!Object.hasOwn(rows, table)) {
    return { status: 404, body: { code: "PGRST205", message: "Unknown fixture table" } };
  }
  let data = [...rows[table]];
  for (const [key, value] of url.searchParams) {
    if (key === "status" && value.startsWith("eq.")) {
      data = data.filter((row) => row.status === value.slice(3));
    } else if (key === "slug" && value.startsWith("eq.")) {
      data = data.filter((row) => row.slug === value.slice(3));
    } else if (key === "slug" && value.startsWith("neq.")) {
      data = data.filter((row) => row.slug !== value.slice(4));
    }
  }
  const order = url.searchParams.get("order");
  if (order) {
    const [field, direction] = order.split(".");
    const sign = direction === "asc" ? 1 : -1;
    data.sort((a, b) => sign * String(a[field] || "").localeCompare(String(b[field] || "")));
  }
  const totalCount = data.length;
  const offset = Number(url.searchParams.get("offset") || 0);
  const limit = Number(url.searchParams.get("limit") || 1000);
  data = data.slice(offset, offset + limit);
  const select = url.searchParams.get("select");
  if (select && select !== "*") {
    const keys = select.split(",");
    data = data.map((row) => Object.fromEntries(
      keys.filter((key) => Object.hasOwn(row, key)).map((key) => [key, row[key]]),
    ));
  }
  return { status: 200, body: data, totalCount, offset };
}

export function fixtureResponse(input) {
  const result = queryFixture(input);
  if (!result) return null;
  return new Response(JSON.stringify(result.body), {
    status: result.status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": "*",
      "access-control-expose-headers": "content-range",
      "content-range": `${result.offset || 0}-${Math.max(result.offset || 0, (result.offset || 0) + result.body.length - 1)}/${result.totalCount || 0}`,
    },
  });
}
