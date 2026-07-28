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

import {
  getPublishedArticles,
} from "../../../../appwrite/articleService";

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

function createSectionId(
  title,
  index,
  usedIds,
) {
  const normalizedTitle = String(title || "")
    .trim()
    .toLocaleLowerCase("de-DE")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const baseId =
    normalizedTitle ||
    `abschnitt-${index + 1}`;

  let sectionId = baseId;
  let duplicateNumber = 2;

  while (usedIds.has(sectionId)) {
    sectionId =
      `${baseId}-${duplicateNumber}`;

    duplicateNumber += 1;
  }

  usedIds.add(sectionId);

  return sectionId;
}

function parseArticleContent(contentHtml) {
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

    const isHeading = [
      "h1",
      "h2",
      "h3",
    ].includes(tagName);

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

function ArticleDetails() {
  const { slug } = useParams();

  const [articles, setArticles] =
    useState([]);

  const [isLoading, setIsLoading] =
    useState(true);

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
    let isCurrentRequest = true;

    const loadArticleData = async () => {
      setIsLoading(true);
      setErrorMessage("");
      setArticles([]);

      try {
        const loadedArticles =
          await getPublishedArticles();

        if (!isCurrentRequest) {
          return;
        }

        setArticles(loadedArticles);
      } catch (error) {
        console.error(
          "Der Artikel konnte nicht geladen werden:",
          error,
        );

        if (!isCurrentRequest) {
          return;
        }

        setErrorMessage(
          "Der Artikel konnte nicht aus Appwrite geladen werden.",
        );
      } finally {
        if (isCurrentRequest) {
          setIsLoading(false);
        }
      }
    };

    loadArticleData();

    return () => {
      isCurrentRequest = false;
    };
  }, [slug]);

  const article = useMemo(() => {
    return (
      articles.find(
        (entry) => entry.slug === slug,
      ) || null
    );
  }, [
    articles,
    slug,
  ]);

  const currentArticleIndex =
    useMemo(() => {
      return articles.findIndex(
        (entry) => entry.slug === slug,
      );
    }, [
      articles,
      slug,
    ]);

  const previousArticle =
    currentArticleIndex > 0
      ? articles[currentArticleIndex - 1]
      : null;

  const nextArticle =
    currentArticleIndex >= 0 &&
    currentArticleIndex <
      articles.length - 1
      ? articles[currentArticleIndex + 1]
      : null;

  const articleContent = useMemo(() => {
    return parseArticleContent(
      article?.contentHtml,
    );
  }, [article?.contentHtml]);

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

    setReadingProgress(0);
    setActiveSection("");
  }, [slug]);

  useEffect(() => {
    if (!article) {
      return undefined;
    }

    document.title =
      `${article.title} | Shaykh Sayed`;

    return () => {
      document.title = "Shaykh Sayed";
    };
  }, [article]);

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

    setActiveSection(
      sectionElements[0].id,
    );

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

  if (isLoading) {
    return (
      <ArticleStatePage
        code="..."
        title="Artikel wird geladen"
        description="Der veröffentlichte Artikel wird gerade aus Appwrite abgerufen."
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
          <Link
            to="/artikel"
            className="sib-article-details-back"
          >
            <ArrowLeftIcon />
            <span>Alle Artikel</span>
          </Link>

          <div className="sib-article-details-category-row">
            <span>Artikel</span>
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
                {article.author}
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

                      <h2>
                        {section.title}
                      </h2>
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