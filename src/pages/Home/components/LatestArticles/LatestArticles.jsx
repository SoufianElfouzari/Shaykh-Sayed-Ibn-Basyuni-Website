import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link } from "react-router-dom";

import {
  getPublishedArticles,
} from "../../../../appwrite/articleService";

import "./LatestArticles.css";

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M5 12H19"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <path
        d="M15 8L19 12L15 16"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M7 3.75H14.5L19 8.25V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V5.75C5 4.65 5.9 3.75 7 3.75Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />

      <path
        d="M14 4V8.75H18.75"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />

      <path
        d="M8.5 12H15.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      <path
        d="M8.5 15.5H15.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EmptyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="5"
        y="4"
        width="14"
        height="16"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M9 9H15"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <path
        d="M9 13H15"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <path
        d="M9 17H13"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function getDateTimestamp(value) {
  if (!value) {
    return 0;
  }

  const timestamp = new Date(value).getTime();

  if (Number.isNaN(timestamp)) {
    return 0;
  }

  return timestamp;
}

function formatDate(value) {
  if (!value) {
    return "Datum offen";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Datum offen";
  }

  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatReadingTime(value) {
  const readingTime = Number(value);

  if (
    !Number.isFinite(readingTime) ||
    readingTime <= 0
  ) {
    return "Lesezeit offen";
  }

  return `${readingTime} Min. Lesezeit`;
}

function getArticlePath(article) {
  if (!article?.slug) {
    return "/artikel";
  }

  return `/artikel/${article.slug}`;
}

function LatestArticles() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] =
    useState(true);
  const [errorMessage, setErrorMessage] =
    useState("");

  const loadArticles = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const loadedArticles =
        await getPublishedArticles();

      setArticles(
        Array.isArray(loadedArticles)
          ? loadedArticles
          : [],
      );
    } catch (error) {
      console.error(
        "Neueste Artikel konnten nicht geladen werden:",
        error,
      );

      setArticles([]);
      setErrorMessage(
        "Die neuesten Artikel konnten nicht geladen werden.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  const latestArticles = useMemo(() => {
    return [...articles].sort(
      (firstArticle, secondArticle) =>
        getDateTimestamp(
          secondArticle.publishedAt,
        ) -
        getDateTimestamp(
          firstArticle.publishedAt,
        ),
    );
  }, [articles]);

  const featuredArticle = useMemo(() => {
    if (latestArticles.length === 0) {
      return null;
    }

    return (
      latestArticles.find(
        (article) => article.featured,
      ) || latestArticles[0]
    );
  }, [latestArticles]);

  const secondaryArticles = useMemo(() => {
    if (!featuredArticle) {
      return [];
    }

    return latestArticles
      .filter(
        (article) =>
          article.id !== featuredArticle.id,
      )
      .slice(0, 2);
  }, [latestArticles, featuredArticle]);

  return (
    <section
      className="sib-articles"
      aria-labelledby="sib-latest-articles-title"
    >
      <div className="sib-articles-container">
        <header className="sib-articles-header">
          <div className="sib-articles-heading">
            <p className="sib-articles-label">
              Neueste Artikel
            </p>

            <h2
              id="sib-latest-articles-title"
              className="sib-articles-title"
            >
              Die neuesten Artikel des Shaykh.
            </h2>
          </div>

          <div className="sib-articles-header-side">
            <p>
              Ausgewählte Artikel, wissenschaftliche
              Beiträge und schriftliche Hinweise des
              Shaykh.
            </p>

            <Link
              to="/artikel"
              className="sib-articles-all-link"
            >
              <span>Alle Artikel ansehen</span>
              <ArrowIcon />
            </Link>
          </div>
        </header>

        {isLoading && (
          <div
            className="sib-articles-featured"
            aria-live="polite"
            aria-busy="true"
          >
            <div className="sib-articles-featured-top">
              <span className="sib-articles-icon">
                <DocumentIcon />
              </span>

              <span className="sib-articles-category">
                Artikel
              </span>
            </div>

            <div className="sib-articles-featured-content">
              <h3>Artikel werden geladen</h3>

              <p>
                Die neuesten veröffentlichten Artikel
                werden gerade abgerufen.
              </p>
            </div>
          </div>
        )}

        {!isLoading && errorMessage && (
          <div
            className="sib-articles-featured"
            role="alert"
          >
            <div className="sib-articles-featured-top">
              <span className="sib-articles-icon">
                <EmptyIcon />
              </span>

              <span className="sib-articles-category">
                Fehler
              </span>
            </div>

            <div className="sib-articles-featured-content">
              <h3>
                Artikel konnten nicht geladen werden
              </h3>

              <p>{errorMessage}</p>
            </div>

            <div className="sib-articles-featured-footer">
              <button
                type="button"
                onClick={loadArticles}
              >
                Erneut versuchen
              </button>
            </div>
          </div>
        )}

        {!isLoading &&
          !errorMessage &&
          !featuredArticle && (
            <div className="sib-articles-featured">
              <div className="sib-articles-featured-top">
                <span className="sib-articles-icon">
                  <EmptyIcon />
                </span>

                <span className="sib-articles-category">
                  Artikel
                </span>
              </div>

              <div className="sib-articles-featured-content">
                <h3>
                  Aktuell gibt es keine Artikel.
                </h3>

                <p>
                  Derzeit wurden noch keine Artikel
                  veröffentlicht.
                </p>
              </div>
            </div>
          )}

        {!isLoading &&
          !errorMessage &&
          featuredArticle && (
            <div className="sib-articles-layout">
              <Link
                to={getArticlePath(
                  featuredArticle,
                )}
                className="sib-articles-featured"
                aria-label={`${featuredArticle.title} lesen`}
              >
                <div className="sib-articles-featured-top">
                  <span className="sib-articles-icon">
                    <DocumentIcon />
                  </span>

                  <span className="sib-articles-category">
                    {featuredArticle.category ||
                      "Artikel"}
                  </span>
                </div>

                <div className="sib-articles-featured-content">
                  <div className="sib-articles-meta">
                    <time
                      dateTime={
                        featuredArticle.publishedAt ||
                        undefined
                      }
                    >
                      {formatDate(
                        featuredArticle.publishedAt,
                      )}
                    </time>

                    <span aria-hidden="true">
                      ·
                    </span>

                    <span>
                      {formatReadingTime(
                        featuredArticle.readingTime,
                      )}
                    </span>
                  </div>

                  <h3>
                    {featuredArticle.title}
                  </h3>

                  {featuredArticle.excerpt && (
                    <p>
                      {featuredArticle.excerpt}
                    </p>
                  )}
                </div>

                <div className="sib-articles-featured-footer">
                  <span>Artikel lesen</span>

                  <span className="sib-articles-arrow">
                    <ArrowIcon />
                  </span>
                </div>
              </Link>

              {secondaryArticles.length > 0 && (
                <div className="sib-articles-secondary-list">
                  {secondaryArticles.map(
                    (article) => (
                      <Link
                        key={article.id}
                        to={getArticlePath(article)}
                        className="sib-articles-secondary"
                        aria-label={`${article.title} lesen`}
                      >
                        <div className="sib-articles-secondary-content">
                          <div className="sib-articles-secondary-top">
                            <span className="sib-articles-category">
                              {article.category ||
                                "Artikel"}
                            </span>

                            <time
                              className="sib-articles-date"
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

                          <h3>{article.title}</h3>

                          {article.excerpt && (
                            <p>
                              {article.excerpt}
                            </p>
                          )}

                          <span className="sib-articles-reading-time">
                            {formatReadingTime(
                              article.readingTime,
                            )}
                          </span>
                        </div>

                        <span className="sib-articles-secondary-arrow">
                          <ArrowIcon />
                        </span>
                      </Link>
                    ),
                  )}
                </div>
              )}
            </div>
          )}

        <Link
          to="/artikel"
          className="sib-articles-mobile-link"
        >
          <span>Alle Artikel ansehen</span>
          <ArrowIcon />
        </Link>
      </div>
    </section>
  );
}

export default LatestArticles;