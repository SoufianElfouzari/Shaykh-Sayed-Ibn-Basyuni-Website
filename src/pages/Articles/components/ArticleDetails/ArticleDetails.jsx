import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Link,
  useParams,
} from "react-router-dom";
import { articleEntries } from "../ArticlesOverview/ArticlesOverview";
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
        d="M7.5 16.5L5.8 18.2C4.3 19.7 1.9 19.7 0.4 18.2"
        stroke="currentColor"
        strokeWidth="0"
      />

      <path
        d="M8.5 15.5L7 17C5.3 18.7 5.3 21.3 7 23"
        stroke="currentColor"
        strokeWidth="0"
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

function formatDate(value) {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`));
}

function ArticleDetails() {
  const { slug } = useParams();

  const [readingProgress, setReadingProgress] =
    useState(0);
  const [activeSection, setActiveSection] =
    useState("");
  const [copyStatus, setCopyStatus] =
    useState("idle");

  const article = useMemo(() => {
    return articleEntries.find(
      (entry) => entry.slug === slug,
    );
  }, [slug]);

  const currentArticleIndex =
    articleEntries.findIndex(
      (entry) => entry.slug === slug,
    );

  const previousArticle =
    currentArticleIndex > 0
      ? articleEntries[currentArticleIndex - 1]
      : null;

  const nextArticle =
    currentArticleIndex >= 0 &&
    currentArticleIndex <
      articleEntries.length - 1
      ? articleEntries[currentArticleIndex + 1]
      : null;

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, [slug]);

  useEffect(() => {
    const updateReadingProgress = () => {
      const documentHeight =
        document.documentElement.scrollHeight -
        window.innerHeight;

      if (documentHeight <= 0) {
        setReadingProgress(0);
        return;
      }

      const progress =
        (window.scrollY / documentHeight) * 100;

      setReadingProgress(
        Math.min(Math.max(progress, 0), 100),
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
    if (!article) {
      return undefined;
    }

    const sectionElements =
      article.sections
        .map((section) =>
          document.getElementById(section.id),
        )
        .filter(Boolean);

    if (sectionElements.length === 0) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (firstEntry, secondEntry) =>
              secondEntry.intersectionRatio -
              firstEntry.intersectionRatio,
          )[0];

        if (visibleEntry) {
          setActiveSection(
            visibleEntry.target.id,
          );
        }
      },
      {
        rootMargin: "-20% 0px -65% 0px",
        threshold: [0.1, 0.3, 0.6],
      },
    );

    sectionElements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, [article]);

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

  if (!article) {
    return (
      <main className="sib-article-details-not-found">
        <div>
          <span>404</span>

          <h1>Artikel nicht gefunden</h1>

          <p>
            Der gesuchte Artikel existiert nicht oder
            wurde verschoben.
          </p>

          <Link to="/artikel">
            <ArrowLeftIcon />
            <span>Zur Artikelübersicht</span>
          </Link>
        </div>
      </main>
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
            width: `${readingProgress}%`,
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
            <span>{article.category}</span>

            {article.featured && (
              <span>Hervorgehobener Beitrag</span>
            )}
          </div>

          <h1>{article.title}</h1>

          <p className="sib-article-details-excerpt">
            {article.excerpt}
          </p>

          <div className="sib-article-details-meta">
            <div>
              <span>Autor</span>
              <strong>{article.author}</strong>
            </div>

            <div>
              <span>Veröffentlicht</span>
              <time
                dateTime={article.publishedAt}
              >
                {formatDate(
                  article.publishedAt,
                )}
              </time>
            </div>

            <div>
              <span>Lesezeit</span>
              <strong>
                {article.readingTime} Minuten
              </strong>
            </div>

            <div>
              <span>Sprache</span>
              <strong>{article.language}</strong>
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
                <a
                  href="#einleitung"
                  className={
                    activeSection === ""
                      ? "sib-article-details-toc-active"
                      : ""
                  }
                >
                  <span>00</span>
                  <strong>Einleitung</strong>
                </a>

                {article.sections.map(
                  (section, index) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className={
                        activeSection ===
                        section.id
                          ? "sib-article-details-toc-active"
                          : ""
                      }
                    >
                      <span>
                        {String(
                          index + 1,
                        ).padStart(2, "0")}
                      </span>

                      <strong>
                        {section.title}
                      </strong>
                    </a>
                  ),
                )}

                <a href="#schluss">
                  <span>
                    {String(
                      article.sections.length + 1,
                    ).padStart(2, "0")}
                  </span>

                  <strong>Schluss</strong>
                </a>
              </nav>

              <div className="sib-article-details-sidebar-actions">
                <button
                  type="button"
                  onClick={handleCopyLink}
                >
                  {copyStatus === "copied" ? (
                    <CheckIcon />
                  ) : (
                    <LinkIcon />
                  )}

                  <span>
                    {copyStatus === "copied"
                      ? "Link kopiert"
                      : copyStatus === "error"
                        ? "Kopieren fehlgeschlagen"
                        : "Link kopieren"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                >
                  <PrintIcon />
                  <span>Artikel drucken</span>
                </button>
              </div>
            </div>
          </aside>

          <article className="sib-article-details-content">
            <section
              id="einleitung"
              className="sib-article-details-introduction"
            >
              <p>{article.introduction}</p>
            </section>

            <aside className="sib-article-details-key-points">
              <div className="sib-article-details-key-points-header">
                <span aria-hidden="true"></span>

                <h2>
                  Zentrale Punkte des Artikels
                </h2>
              </div>

              <ul>
                {article.keyPoints.map(
                  (point) => (
                    <li key={point}>
                      <span aria-hidden="true">
                        <CheckIcon />
                      </span>

                      <p>{point}</p>
                    </li>
                  ),
                )}
              </ul>
            </aside>

            <div className="sib-article-details-sections">
              {article.sections.map(
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
                        ).padStart(2, "0")}
                      </span>

                      <h2>{section.title}</h2>
                    </header>

                    <div>
                      {section.paragraphs.map(
                        (
                          paragraph,
                          paragraphIndex,
                        ) => (
                          <p
                            key={
                              paragraphIndex
                            }
                          >
                            {paragraph}
                          </p>
                        ),
                      )}
                    </div>
                  </section>
                ),
              )}
            </div>

            <section
              id="schluss"
              className="sib-article-details-conclusion"
            >
              <div>
                <span aria-hidden="true"></span>
                <p>Schluss</p>
              </div>

              <h2>
                Zusammenfassende Betrachtung
              </h2>

              <p>{article.conclusion}</p>
            </section>

            <footer className="sib-article-details-footer">
              <div className="sib-article-details-tags">
                <p>Themen dieses Artikels</p>

                <div>
                  {article.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>

              <div className="sib-article-details-updated">
                <span>Zuletzt aktualisiert</span>

                <time
                  dateTime={article.updatedAt}
                >
                  {formatDate(article.updatedAt)}
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
                <span>Vorheriger Artikel</span>
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
                <span>Nächster Artikel</span>
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
                <span>Zurück zur Übersicht</span>
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