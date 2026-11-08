// Safe, dependency-free fallback for server-rendering authored rich-text.
// Escape all text, but preserve existing section headings and paragraph
// boundaries so crawlers receive a meaningful document structure.

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function decodeEntities(value) {
  const named = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
    nbsp: " ",
  };

  return String(value).replace(/&(?:#([0-9]+)|#x([a-f0-9]+)|([a-z]+));/gi,
    (match, decimal, hex, name) => {
      if (name) return named[name.toLowerCase()] ?? match;

      const codePoint = Number.parseInt(decimal || hex, hex ? 16 : 10);
      if (!Number.isInteger(codePoint) || codePoint <= 0 ||
          codePoint > 0x10ffff || (codePoint >= 0xd800 && codePoint <= 0xdfff)) {
        return match;
      }
      return String.fromCodePoint(codePoint);
    },
  );
}

function removeExecutableTags(html) {
  return String(html || "")
    .replace(/<(script|style|template|iframe)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ");
}

function textFragments(fragment) {
  return removeExecutableTags(fragment)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(?:p|div|li|ul|ol|blockquote|section|article|h[1-6])\s*>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .split(/\n+/)
    .map((line) => decodeEntities(line).replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function safeParagraphs(fragment) {
  return textFragments(fragment)
    .map((paragraph) => "<p>" + escapeHtml(paragraph) + "</p>")
    .join("");
}

export function parseServerArticleContent(contentHtml, createSectionId) {
  const html = removeExecutableTags(contentHtml);
  const headings = /<(h[1-3])\b[^>]*>([\s\S]*?)<\/\1\s*>/gi;
  const sections = [];
  const usedIds = new Set();
  let introductionHtml = "";
  let cursor = 0;
  let match;

  while ((match = headings.exec(html)) !== null) {
    const textBefore = safeParagraphs(html.slice(cursor, match.index));
    if (sections.length > 0) {
      sections[sections.length - 1].html += textBefore;
    } else {
      introductionHtml += textBefore;
    }

    const title = textFragments(match[2]).join(" ").trim() ||
      "Abschnitt " + (sections.length + 1);
    const sectionId = createSectionId(title, sections.length, usedIds);

    sections.push({
      id: sectionId,
      title,
      html: "",
    });

    cursor = headings.lastIndex;
  }

  const trailing = safeParagraphs(html.slice(cursor));
  if (sections.length > 0) {
    sections[sections.length - 1].html += trailing;
  } else if (trailing) {
    sections.push({
      id: "artikelinhalt",
      title: "Artikelinhalt",
      html: trailing,
    });
  }

  return { introductionHtml, sections };
}
