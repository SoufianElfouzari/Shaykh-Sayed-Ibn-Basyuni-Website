import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Link,
  useParams,
} from "react-router-dom";
import DOMPurify from "dompurify";
import { useSsrData } from "../../../../SsrDataContext";
import { createSectionId } from "../../../../utils/articleSections";
import { articleSeo, SITE_FALLBACK_IMAGE, SITE_ORIGIN } from "../../../../utils/articleSeo";

import {
  getPublishedArticleBySlug,
  getPublishedArticleSummaries,
} from "../../../../supabase/articleService";

import "./ArticleDetails.css";

function ArrowLeftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M19 12H5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M9 8L5 12L9 16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12H19"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M15 8L19 12L15 16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M9.5 14.5L14.5 9.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M10 17H8.5C6 17 4 15 4 12.5C4 10 6 8 8.5 8H11"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M14 7H15.5C18 7 20 9 20 11.5C20 14 18 16 15.5 16H13"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PrintIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7 9V4H17V9"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      <path
        d="M7 17H5C3.9 17 3 16.1 3 15V11C3 9.9 3.9 9 5 9H19C20.1 9 21 9.9 21 11V15C21 16.1 20.1 17 19 17H17"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <rect
        x="7"
        y="14"
        width="10"
        height="6"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <circle
        cx="17.5"
        cy="12.5"
        r="0.8"
        fill="currentColor"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 12.5L10 16L18 8"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function parseArticleContent(contentHtml, serverContent) {
  // The server prepares safely sanitized rich text before rendering.
  // The browser continues using the existing DOMPurify editor renderer.
  if (typeof document === "undefined") {
    return serverContent || { introductionHtml: "", sections: [] };
  }
  const sanitizedHtml = DOMPurify.sanitize(
    String(contentHtml || ""),
    {
      USE_PROFILES: {
        html: true,
      },
      ADD_ATTR: [
        "target",
        "rel",
      ],
    },
  );

  if (!sanitizedHtml.trim()) {
    return {
      introductionHtml: "",
      sections: [],
    };
  }

  const htmlDocument =
    new DOMParser().parseFromString(
      sanitizedHtml,
      "text/html",
    );

  const introductionParts = [];
  const sections = [];
  const usedIds = new Set();

  let currentSection = null;

  Array.from(
    htmlDocument.body.childNodes,
  ).forEach((node) => {
    const isElementNode =
      node.nodeType === Node.ELEMENT_NODE;

    const tagName = isElementNode
      ? node.tagName.toLowerCase()
      : "";

    const isHeading = /^h[1-6]$/.test(tagName);

    if (isHeading) {
      const title =
        node.textContent?.trim() ||
        `Abschnitt ${sections.length + 1}`;

      const existingId =
        node.getAttribute("id")?.trim();

      const sectionId = createSectionId(
        existingId || title,
        sections.length,
        usedIds,
      );

      currentSection = {
        id: sectionId,
        title,
        level: Math.max(2, Number(tagName[1])),
        html: "",
      };

      sections.push(currentSection);

      return;
    }

    const nodeHtml =
      node.nodeType === Node.TEXT_NODE
        ? node.textContent
        : node.outerHTML;

    if (!nodeHtml?.trim()) {
      return;
    }

    if (currentSection) {
      currentSection.html += nodeHtml;
    } else {
      introductionParts.push(nodeHtml);
    }
  });

  if (sections.length === 0) {
    return {
      introductionHtml: "",
      sections: [
        {
          id: "artikelinhalt",
          title: "Artikelinhalt",
          level: 2,
          html: sanitizedHtml,
        },
      ],
    };
  }

  return {
    introductionHtml:
      introductionParts.join("").trim(),

    sections: sections.filter(
      (section) =>
        section.title.trim() ||
        section.html.trim(),
    ),
  };
}

function formatDate(value) {
  if (!value) {
    return "Datum nicht angegeben";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Datum nicht angegeben";
  }

  return new Intl.DateTimeFormat(
    "de-DE",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    },
  ).format(date);
}

function ArticleStatePage({
  code,
  title,
  description,
  showBackLink = true,
}) {
  return (
    <main className="sib-article-details-not-found">
      <div>
        <span>{code}</span>

        <h1>{title}</h1>

        <p>{description}</p>

        {showBackLink && (
          <Link to="/artikel">
            <ArrowLeftIcon />
            <span>
              Zur Artikelübersicht
            </span>
          </Link>
        )}
      </div>
    </main>
  );
}

function SectionHeading({ level, children }) {
  // The page title is the only H1. Keep each editorial subheading level.
  const safeLevel = Math.max(2, Math.min(6, Number(level) || 2));
  const Tag = `h${safeLevel}`;
  return <Tag>{children}</Tag>;
}

function ArticleDetails() {
  const { slug } = useParams();
  const {
    article: initialArticle,
    articleContent: initialServerContent,
    relatedArticles: initialRelated = [],
  } = useSsrData();

  const [articles, setArticles] =
    useState(initialArticle?.slug === slug ? [initialArticle] : []);

  const [articleSummaries, setArticleSummaries] = useState([]);
  const [requestedSlug, setRequestedSlug] = useState(slug);

  const [isLoading, setIsLoading] =
    useState(initialArticle?.slug !== slug);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [
    readingProgress,
    setReadingProgress,
  ] = useState(0);

  const [
    activeSection,
    setActiveSection,
  ] = useState("");

  const [copyStatus, setCopyStatus] =
    useState("idle");

  useEffect(() => {
    if (initialArticle?.slug === slug) {
      // Hydrated article already includes its complete content.
      return undefined;
    }

    let isCurrentRequest = true;
    const frame = window.requestAnimationFrame(() => {
      setRequestedSlug(slug);
      setIsLoading(true);
      setErrorMessage("");
      setArticles([]);

      getPublishedArticleBySlug(slug)
        .then((loadedArticle) => {
          if (isCurrentRequest) {
            setArticles(loadedArticle ? [loadedArticle] : []);
          }
        })
        .catch((error) => {
          console.error("Der Artikel konnte nicht geladen werden:", error);
          if (isCurrentRequest) {
            setErrorMessage("Der Artikel konnte nicht aus Supabase geladen werden.");
          }
        })
        .finally(() => {
          if (isCurrentRequest) setIsLoading(false);
        });
    });

    return () => {
      isCurrentRequest = false;
      window.cancelAnimationFrame(frame);
    };
  }, [slug, initialArticle]);

  useEffect(() => {
    let isCurrentRequest = true;
    // Needed only for previous/next article navigation and related-article cards.
    // This query transfers metadata, never full article bodies.
    const frame = window.requestAnimationFrame(() => {
      getPublishedArticleSummaries()
        .then((items) => {
          if (isCurrentRequest) setArticleSummaries(items);
        })
        .catch((error) => {
          console.error("Artikelübersicht konnte nicht geladen werden:", error);
        });
    });
    return () => {
      isCurrentRequest = false;
      window.cancelAnimationFrame(frame);
    };
  }, []);

  const article = useMemo(() => {
    if (initialArticle?.slug === slug) return initialArticle;
    return articles.find((entry) => entry.slug === slug) || null;
  }, [articles, slug, initialArticle]);

  const currentArticleIndex =
    useMemo(() => {
      return articleSummaries.findIndex(
        (entry) => entry.slug === slug,
      );
    }, [
      articleSummaries,
      slug,
    ]);

  const previousArticle =
    currentArticleIndex > 0
      ? articleSummaries[currentArticleIndex - 1]
      : null;

  const nextArticle =
    currentArticleIndex >= 0 &&
    currentArticleIndex <
      articleSummaries.length - 1
      ? articleSummaries[currentArticleIndex + 1]
      : null;

  const seo = useMemo(
    () => (article ? articleSeo(article) : null),
    [article],
  );

  useEffect(() => {
    // The HTTP status is authoritative on a direct request. During SPA
    // navigation, a missing published article must also lose its canonical.
    if (isLoading || requestedSlug !== slug || article) return;
    document.head.querySelector('link[rel="canonical"]')?.remove();
    let robots = document.head.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement("meta");
      robots.setAttribute("name", "robots");
      document.head.appendChild(robots);
    }
    robots.setAttribute("content", "noindex, follow");
    document.title = "Artikel nicht gefunden | Shaykh Sayed";
  }, [article, isLoading, requestedSlug, slug]);

  const relatedArticles = useMemo(() => {
    if (!article) return [];
    if (initialArticle?.slug === article.slug &&
        Array.isArray(initialRelated) && initialRelated.length) {
      return initialRelated.filter((item) => item.slug !== article.slug);
    }

    const tags = new Set(
      (article.tags || []).map((tag) => String(tag).toLowerCase()),
    );
    const category = String(article.category || "").toLowerCase();
    return articleSummaries
      .filter((entry) => entry.slug && entry.slug !== article.slug)
      .map((entry) => ({
        ...entry,
        relevance: (entry.tags || []).filter((tag) =>
          tags.has(String(tag).toLowerCase())).length * 3 +
          (category && String(entry.category || "").toLowerCase() === category ? 2 : 0),
      }))
      .filter((entry) => entry.relevance > 0)
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 4);
  }, [article, articleSummaries, initialArticle?.slug, initialRelated]);

  const articleContent = useMemo(() => {
    // Use the exact server-sanitized structure during hydration.
    // New articles opened through client-side navigation are parsed in the browser.
    if (initialArticle?.slug === article?.slug && initialServerContent) {
      return initialServerContent;
    }
    return parseArticleContent(article?.contentHtml);
  }, [article?.slug, article?.contentHtml, initialArticle?.slug, initialServerContent]);

  const tableOfContents =
    useMemo(() => {
      const entries = [];

      if (
        articleContent.introductionHtml
      ) {
        entries.push({
          id: "einleitung",
          title: "Einleitung",
        });
      }

      articleContent.sections.forEach(
        (section) => {
          entries.push({
            id: section.id,
            title: section.title,
          });
        },
      );

      return entries;
    }, [articleContent]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "auto",
    });

    const frame = window.requestAnimationFrame(() => {
      setReadingProgress(0);
      setActiveSection("");
    });
    return () => window.cancelAnimationFrame(frame);
  }, [slug]);

  useEffect(() => {
    if (!seo) return;

    document.title = seo.title;
    const image = seo.image || SITE_FALLBACK_IMAGE;
    const url = SITE_ORIGIN + "/artikel/" + encodeURIComponent(article.slug);

    const metadata = [
      ["name", "description", seo.description],
      ["name", "author", seo.author.name],
      ["property", "og:type", "article"],
      ["property", "og:title", seo.title],
      ["property", "og:description", seo.description],
      ["property", "og:url", url],
      ["property", "og:image", image],
      ["property", "og:image:alt", seo.headline],
      ["name", "twitter:title", seo.title],
      ["name", "twitter:description", seo.description],
      ["name", "twitter:image", image],
      ["name", "twitter:image:alt", seo.headline],
      ["property", "article:published_time", seo.publishedAt],
      ["property", "article:modified_time", seo.updatedAt],
    ];

    for (const [attribute, name, value] of metadata) {
      let element = document.head.querySelector(`meta[${attribute}="${name}"]`);
      if (!value) {
        element?.remove();
        continue;
      }
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute("content", value);
    }

    return () => {
      document.head.querySelectorAll(
        'meta[property="article:published_time"], meta[property="article:modified_time"], meta[name="author"]',
      ).forEach((element) => element.remove());
    };
  }, [article, seo]);

  useEffect(() => {
    const updateReadingProgress = () => {
      const documentHeight =
        document.documentElement
          .scrollHeight -
        window.innerHeight;

      if (documentHeight <= 0) {
        setReadingProgress(0);
        return;
      }

      const progress =
        (
          window.scrollY /
          documentHeight
        ) * 100;

      setReadingProgress(
        Math.min(
          Math.max(progress, 0),
          100,
        ),
      );
    };

    updateReadingProgress();

    window.addEventListener(
      "scroll",
      updateReadingProgress,
      {
        passive: true,
      },
    );

    window.addEventListener(
      "resize",
      updateReadingProgress,
    );

    return () => {
      window.removeEventListener(
        "scroll",
        updateReadingProgress,
      );

      window.removeEventListener(
        "resize",
        updateReadingProgress,
      );
    };
  }, []);

  useEffect(() => {
    if (
      !article ||
      tableOfContents.length === 0
    ) {
      return undefined;
    }

    const sectionElements =
      tableOfContents
        .map((entry) =>
          document.getElementById(
            entry.id,
          ),
        )
        .filter(Boolean);

    if (sectionElements.length === 0) {
      return undefined;
    }

    const frame = window.requestAnimationFrame(() => {
      setActiveSection(sectionElements[0].id);
    });

    const observer =
      new IntersectionObserver(
        (entries) => {
          const visibleEntry = entries
            .filter(
              (entry) =>
                entry.isIntersecting,
            )
            .sort(
              (
                firstEntry,
                secondEntry,
              ) =>
                secondEntry
                  .intersectionRatio -
                firstEntry
                  .intersectionRatio,
            )[0];

          if (visibleEntry) {
            setActiveSection(
              visibleEntry.target.id,
            );
          }
        },
        {
          rootMargin:
            "-20% 0px -65% 0px",
          threshold: [
            0.1,
            0.3,
            0.6,
          ],
        },
      );

    sectionElements.forEach(
      (element) => {
        observer.observe(element);
      },
    );

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [
    article,
    tableOfContents,
  ]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        window.location.href,
      );

      setCopyStatus("copied");
    } catch (error) {
      console.error(
        "Der Link konnte nicht kopiert werden.",
        error,
      );

      setCopyStatus("error");
    }

    window.setTimeout(() => {
      setCopyStatus("idle");
    }, 2200);
  };

  if (initialArticle?.slug !== slug && (isLoading || requestedSlug !== slug)) {
    return (
      <ArticleStatePage
        code="..."
        title="Artikel wird geladen"
        description="Der veröffentlichte Artikel wird gerade aus Supabase abgerufen."
        showBackLink={false}
      />
    );
  }

  if (errorMessage) {
    return (
      <ArticleStatePage
        code="!"
        title="Artikel konnte nicht geladen werden"
        description={errorMessage}
      />
    );
  }

  if (!article) {
    return (
      <ArticleStatePage
        code="404"
        title="Artikel nicht gefunden"
        description="Der gesuchte Artikel existiert nicht oder ist nicht veröffentlicht."
      />
    );
  }

  return (
    <main className="sib-article-details">
      <div
        className="sib-article-reading-progress"
        aria-hidden="true"
      >
        <span
          style={{
            width:
              `${readingProgress}%`,
          }}
        ></span>
      </div>

      <header className="sib-article-details-hero">
        <div
          className="sib-article-details-hero-decoration"
          aria-hidden="true"
        >
          <span className="sib-article-details-hero-circle sib-article-details-hero-circle-one"></span>

          <span className="sib-article-details-hero-circle sib-article-details-hero-circle-two"></span>

          <span className="sib-article-details-hero-line"></span>
        </div>

        <div className="sib-article-details-hero-container">
          <nav className="sib-article-details-breadcrumbs" aria-label="Seitenpfad">
            <Link to="/">Startseite</Link>
            <span aria-hidden="true">/</span>
            <Link to="/artikel">Islamische Artikel</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{article.title}</span>
          </nav>

          <Link
            to="/artikel"
            className="sib-article-details-back"
          >
            <ArrowLeftIcon />
            <span>Alle Artikel</span>
          </Link>

          <div className="sib-article-details-category-row">
            <span>{seo?.category || "Artikel"}</span>
          </div>

          <h1>{article.title}</h1>

          {article.excerpt && (
            <p className="sib-article-details-excerpt">
              {article.excerpt}
            </p>
          )}

          <div className="sib-article-details-meta">
            <div>
              <span>Autor</span>

              <strong>
                {seo?.author.profileUrl ? (
                  <Link to="/shaykh" className="sib-article-details-author-link">
                    {article.author}
                  </Link>
                ) : (
                  article.author
                )}
              </strong>
            </div>

            <div>
              <span>
                Veröffentlicht
              </span>

              <time
                dateTime={
                  article.publishedAt ||
                  undefined
                }
              >
                {formatDate(
                  article.publishedAt,
                )}
              </time>
            </div>

            <div>
              <span>Lesezeit</span>

              <strong>
                {article.readingTime}{" "}
                {article.readingTime === 1
                  ? "Minute"
                  : "Minuten"}
              </strong>
            </div>

            <div>
              <span>Sprache</span>

              <strong>
                {article.language}
              </strong>
            </div>
          </div>
        </div>
      </header>

      <div className="sib-article-details-page">
        <div className="sib-article-details-layout">
          <aside className="sib-article-details-sidebar">
            <div className="sib-article-details-sidebar-inner">
              <p className="sib-article-details-sidebar-label">
                Inhalt
              </p>

              <nav aria-label="Artikelinhalt">
                {tableOfContents.map(
                  (entry, index) => (
                    <a
                      key={entry.id}
                      href={`#${entry.id}`}
                      className={
                        activeSection ===
                        entry.id
                          ? "sib-article-details-toc-active"
                          : ""
                      }
                    >
                      <span>
                        {String(
                          index + 1,
                        ).padStart(
                          2,
                          "0",
                        )}
                      </span>

                      <strong>
                        {entry.title}
                      </strong>
                    </a>
                  ),
                )}
              </nav>

              <div className="sib-article-details-sidebar-actions">
                <button
                  type="button"
                  onClick={handleCopyLink}
                >
                  {copyStatus ===
                  "copied" ? (
                    <CheckIcon />
                  ) : (
                    <LinkIcon />
                  )}

                  <span>
                    {copyStatus ===
                    "copied"
                      ? "Link kopiert"
                      : copyStatus ===
                          "error"
                        ? "Kopieren fehlgeschlagen"
                        : "Link kopieren"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    window.print()
                  }
                >
                  <PrintIcon />

                  <span>
                    Artikel drucken
                  </span>
                </button>
              </div>
            </div>
          </aside>

          <article className="sib-article-details-content">
            {articleContent
              .introductionHtml && (
              <section
                id="einleitung"
                className="sib-article-details-introduction"
                dangerouslySetInnerHTML={{
                  __html:
                    articleContent
                      .introductionHtml,
                }}
              />
            )}

            <div className="sib-article-details-sections">
              {articleContent.sections.map(
                (section, index) => (
                  <section
                    key={section.id}
                    id={section.id}
                    className="sib-article-details-section"
                  >
                    <header>
                      <span>
                        {String(
                          index + 1,
                        ).padStart(
                          2,
                          "0",
                        )}
                      </span>

                      <SectionHeading level={section.level}>
                        {section.title}
                      </SectionHeading>
                    </header>

                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          section.html,
                      }}
                    />
                  </section>
                ),
              )}
            </div>

            <footer className="sib-article-details-footer">
              {seo?.tags.length > 0 && (
                <div className="sib-article-details-tags" aria-label="Themen des Artikels">
                  <p>Themen</p>
                  <div>
                    {seo.tags.map((tag) => (
                      <span key={tag} >{tag}</span>
                    ))}
                  </div>
                </div>
              )}
              <div className="sib-article-details-updated">
                <span>
                  Zuletzt aktualisiert
                </span>

                <time
                  dateTime={
                    article.updatedAt ||
                    undefined
                  }
                >
                  {formatDate(
                    article.updatedAt,
                  )}
                </time>
              </div>
            </footer>
          </article>
        </div>

        {relatedArticles.length > 0 && (
          <section className="sib-article-details-related" aria-labelledby="related-articles-heading">
            <h2 id="related-articles-heading">Weitere Artikel zum Thema</h2>
            <div className="sib-article-details-related-grid">
              {relatedArticles.map((entry) => (
                <article key={entry.slug} className="sib-article-details-related-card">
                  {entry.category && <p>{entry.category}</p>}
                  <h3><Link to={`/artikel/${entry.slug}`}>{entry.title}</Link></h3>
                  {entry.excerpt && <p>{entry.excerpt}</p>}
                </article>
              ))}
            </div>
          </section>
        )}

        <nav
          className="sib-article-details-navigation"
          aria-label="Weitere Artikel"
        >
          {previousArticle ? (
            <Link
              to={`/artikel/${previousArticle.slug}`}
              className="sib-article-details-navigation-item sib-article-details-navigation-previous"
            >
              <span
                className="sib-article-details-navigation-icon"
                aria-hidden="true"
              >
                <ArrowLeftIcon />
              </span>

              <div>
                <span>
                  Vorheriger Artikel
                </span>

                <strong>
                  {previousArticle.title}
                </strong>
              </div>
            </Link>
          ) : (
            <div className="sib-article-details-navigation-placeholder"></div>
          )}

          {nextArticle ? (
            <Link
              to={`/artikel/${nextArticle.slug}`}
              className="sib-article-details-navigation-item sib-article-details-navigation-next"
            >
              <div>
                <span>
                  Nächster Artikel
                </span>

                <strong>
                  {nextArticle.title}
                </strong>
              </div>

              <span
                className="sib-article-details-navigation-icon"
                aria-hidden="true"
              >
                <ArrowRightIcon />
              </span>
            </Link>
          ) : (
            <Link
              to="/artikel"
              className="sib-article-details-navigation-item sib-article-details-navigation-next"
            >
              <div>
                <span>
                  Zurück zur Übersicht
                </span>

                <strong>
                  Alle Artikel anzeigen
                </strong>
              </div>

              <span
                className="sib-article-details-navigation-icon"
                aria-hidden="true"
              >
                <ArrowRightIcon />
              </span>
            </Link>
          )}
        </nav>
      </div>
    </main>
  );
}

export default ArticleDetails;