import sanitizeHtml from "sanitize-html";

// Server-only HTML sanitization. Preserve the editorial structure, references,
// Quran citations, lists and tables without allowing scripts or unsafe URLs.
const options = {
  allowedTags: [
    "p", "br", "div", "span", "strong", "b", "em", "i", "u",
    "s", "sub", "sup", "blockquote", "ul", "ol", "li", "a",
    "h1", "h2", "h3", "h4", "h5", "h6", "hr", "pre", "code",
    "table", "thead", "tbody", "tfoot", "tr", "th", "td",
    "figure", "figcaption", "img", "cite", "q", "time",
  ],
  allowedAttributes: {
    "*": ["lang", "dir"],
    a: ["href", "title", "target", "rel"],
    img: ["src", "alt", "title", "width", "height", "loading"],
    th: ["colspan", "rowspan", "scope"],
    td: ["colspan", "rowspan"],
    time: ["datetime"],
  },
  allowedSchemes: ["http", "https", "mailto"],
  allowProtocolRelative: false,
  disallowedTagsMode: "discard",
};

function decodeEntities(value) {
  const named = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
  return String(value).replace(/&(?:#([0-9]+)|#x([a-f0-9]+)|([a-z]+));/gi,
    (match, decimal, hex, name) => {
      if (name) return named[name.toLowerCase()] ?? match;
      const number = Number.parseInt(decimal || hex, hex ? 16 : 10);
      if (!Number.isInteger(number) || number <= 0 ||
          number > 0x10ffff || (number >= 0xd800 && number <= 0xdfff)) {
        return match;
      }
      return String.fromCodePoint(number);
    },
  );
}

function headingText(value) {
  return decodeEntities(String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim());
}

export function parseServerArticleContent(contentHtml, createSectionId) {
  const sanitized = sanitizeHtml(String(contentHtml || ""), options).trim();
  const headings = /<(h[1-3])\b[^>]*>([\s\S]*?)<\/\1\s*>/gi;
  const sections = [];
  const usedIds = new Set();
  let introductionHtml = "";
  let cursor = 0;
  let match;

  while ((match = headings.exec(sanitized)) !== null) {
    const contentBefore = sanitized.slice(cursor, match.index).trim();
    if (sections.length > 0) {
      sections[sections.length - 1].html += contentBefore;
    } else {
      introductionHtml += contentBefore;
    }

    const title = headingText(match[2]) || "Abschnitt " + (sections.length + 1);
    const sectionId = createSectionId(title, sections.length, usedIds);
    sections.push({ id: sectionId, title, html: "" });
    cursor = headings.lastIndex;
  }

  const remainingHtml = sanitized.slice(cursor).trim();
  if (sections.length > 0) {
    sections[sections.length - 1].html += remainingHtml;
  } else if (remainingHtml) {
    sections.push({ id: "artikelinhalt", title: "Artikelinhalt", html: remainingHtml });
  }

  return { introductionHtml, sections };
}
