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

import "./ArticlesOverview.css";

const sortOptions = [
  {
    value: "newest",
    label: "Neueste zuerst",
  },
  {
    value: "oldest",
    label: "Älteste zuerst",
  },
  {
    value: "title",
    label: "Titel von A bis Z",
  },
  {
    value: "reading-time",
    label: "Kürzeste Lesezeit",
  },
];

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="11"
        cy="11"
        r="6.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M16 16L20 20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7 7L17 17"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M17 7L7 17"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowIcon() {
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

function EmptyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
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

function normalizeText(value) {
  return String(value || "")
    .toLocaleLowerCase("de-DE")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
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

function ArticlesOverview() {
  const [articles, setArticles] = useState([]);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [
    activeCategory,
    setActiveCategory,
  ] = useState("Alle");

  const [
    activeLanguage,
    setActiveLanguage,
  ] = useState("Alle");

  const [sortBy, setSortBy] =
    useState("newest");

  const [
    visibleCount,
    setVisibleCount,
  ] = useState(6);

  const [isLoading, setIsLoading] =
    useState(true);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const loadArticles = useCallback(
    async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const loadedArticles =
          await getPublishedArticles();

        setArticles(loadedArticles);
      } catch (error) {
        console.error(
          "Artikel konnten nicht geladen werden:",
          error,
        );

        setArticles([]);
        setErrorMessage(
          "Die veröffentlichten Artikel konnten nicht geladen werden. Bitte versuche es erneut.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  const categories = useMemo(() => {
    return [
      "Alle",
      ...new Set(
        articles.map(
          (article) => article.category,
        ),
      ),
    ];
  }, [articles]);

  const languages = useMemo(() => {
    return [
      "Alle",
      ...new Set(
        articles.map(
          (article) => article.language,
        ),
      ),
    ];
  }, [articles]);

  const filteredArticles = useMemo(() => {
    const normalizedSearch = normalizeText(
      searchTerm.trim(),
    );

    const matchingArticles =
      articles.filter((article) => {
        const categoryMatches =
          activeCategory === "Alle" ||
          article.category ===
            activeCategory;

        const languageMatches =
          activeLanguage === "Alle" ||
          article.language ===
            activeLanguage;

        const searchableContent =
          normalizeText(
            [
              article.title,
              article.excerpt,
              article.contentText,
              article.category,
              article.language,
              article.author,
              ...article.tags,
            ].join(" "),
          );

        const searchMatches =
          normalizedSearch.length === 0 ||
          searchableContent.includes(
            normalizedSearch,
          );

        return (
          categoryMatches &&
          languageMatches &&
          searchMatches
        );
      });

    return [...matchingArticles].sort(
      (
        firstArticle,
        secondArticle,
      ) => {
        if (sortBy === "oldest") {
          return (
            getDateTimestamp(
              firstArticle.publishedAt,
            ) -
            getDateTimestamp(
              secondArticle.publishedAt,
            )
          );
        }

        if (sortBy === "title") {
          return firstArticle.title.localeCompare(
            secondArticle.title,
            "de",
          );
        }

        if (
          sortBy === "reading-time"
        ) {
          return (
            firstArticle.readingTime -
            secondArticle.readingTime
          );
        }

        return (
          getDateTimestamp(
            secondArticle.publishedAt,
          ) -
          getDateTimestamp(
            firstArticle.publishedAt,
          )
        );
      },
    );
  }, [
    articles,
    searchTerm,
    activeCategory,
    activeLanguage,
    sortBy,
  ]);

  const visibleArticles =
    filteredArticles.slice(
      0,
      visibleCount,
    );

  const activeFilterCount = [
    searchTerm.trim().length > 0,
    activeCategory !== "Alle",
    activeLanguage !== "Alle",
  ].filter(Boolean).length;

  useEffect(() => {
    setVisibleCount(6);
  }, [
    searchTerm,
    activeCategory,
    activeLanguage,
    sortBy,
  ]);

  const resetFilters = () => {
    setSearchTerm("");
    setActiveCategory("Alle");
    setActiveLanguage("Alle");
    setSortBy("newest");
  };

  return (
    <section
      className="sib-articles-overview"
      aria-labelledby="sib-articles-overview-title"
    >
      <div
        className="sib-articles-overview-decoration"
        aria-hidden="true"
      >
        <span className="sib-articles-overview-circle"></span>

        <span className="sib-articles-overview-word">
          Artikel
        </span>
      </div>

      <div className="sib-articles-overview-container">
        <header className="sib-articles-overview-header">
          <div className="sib-articles-overview-heading">
            <div className="sib-articles-overview-label-row">
              <span className="sib-articles-overview-label-line"></span>

              <p>Artikelarchiv</p>
            </div>

            <h2 id="sib-articles-overview-title">
              Alle veröffentlichten
              <span>Beiträge.</span>
            </h2>
          </div>

          <p className="sib-articles-overview-description">
            Durchsuche die veröffentlichten Artikel
            und öffne jeden Beitrag auf seiner
            eigenen Artikelseite.
          </p>
        </header>

        {isLoading && (
          <div
            className="sib-articles-overview-empty"
            aria-live="polite"
            aria-busy="true"
          >
            <span aria-hidden="true">
              <EmptyIcon />
            </span>

            <h3>Artikel werden geladen</h3>

            <p>
              Die veröffentlichten Artikel werden
              gerade aus Appwrite abgerufen.
            </p>
          </div>
        )}

        {!isLoading && errorMessage && (
          <div
            className="sib-articles-overview-empty"
            role="alert"
          >
            <span aria-hidden="true">
              <EmptyIcon />
            </span>

            <h3>Artikel konnten nicht geladen werden</h3>

            <p>{errorMessage}</p>

            <button
              type="button"
              onClick={loadArticles}
            >
              Erneut versuchen
            </button>
          </div>
        )}

        {!isLoading && !errorMessage && (
          <>
            <div className="sib-articles-overview-controls">
              <div className="sib-articles-overview-search">
                <span
                  className="sib-articles-overview-search-icon"
                  aria-hidden="true"
                >
                  <SearchIcon />
                </span>

                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(
                      event.target.value,
                    )
                  }
                  placeholder="Artikel oder Begriff suchen"
                  aria-label="Artikel durchsuchen"
                />

                {searchTerm && (
                  <button
                    type="button"
                    onClick={() =>
                      setSearchTerm("")
                    }
                    aria-label="Suchbegriff löschen"
                  >
                    <CloseIcon />
                  </button>
                )}
              </div>

              <div className="sib-articles-overview-control">
                <label htmlFor="article-language">
                  Sprache
                </label>

                <select
                  id="article-language"
                  value={activeLanguage}
                  onChange={(event) =>
                    setActiveLanguage(
                      event.target.value,
                    )
                  }
                >
                  {languages.map(
                    (language) => (
                      <option
                        key={language}
                        value={language}
                      >
                        {language}
                      </option>
                    ),
                  )}
                </select>
              </div>

              <div className="sib-articles-overview-control">
                <label htmlFor="article-sort">
                  Sortierung
                </label>

                <select
                  id="article-sort"
                  value={sortBy}
                  onChange={(event) =>
                    setSortBy(
                      event.target.value,
                    )
                  }
                >
                  {sortOptions.map(
                    (option) => (
                      <option
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </option>
                    ),
                  )}
                </select>
              </div>
            </div>

            <nav
              className="sib-articles-overview-categories"
              aria-label="Artikelkategorien"
            >
              {categories.map(
                (category) => {
                  const categoryCount =
                    category === "Alle"
                      ? articles.length
                      : articles.filter(
                          (article) =>
                            article.category ===
                            category,
                        ).length;

                  return (
                    <button
                      key={category}
                      type="button"
                      className={
                        activeCategory ===
                        category
                          ? "sib-articles-overview-category sib-articles-overview-category-active"
                          : "sib-articles-overview-category"
                      }
                      onClick={() =>
                        setActiveCategory(
                          category,
                        )
                      }
                    >
                      <span>
                        {category}
                      </span>

                      <strong>
                        {categoryCount}
                      </strong>
                    </button>
                  );
                },
              )}
            </nav>

            <div className="sib-articles-overview-results">
              <p>
                <strong>
                  {
                    filteredArticles.length
                  }
                </strong>{" "}
                {filteredArticles.length ===
                1
                  ? "Artikel gefunden"
                  : "Artikel gefunden"}
              </p>

              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={resetFilters}
                >
                  Filter zurücksetzen
                </button>
              )}
            </div>

            {visibleArticles.length > 0 ? (
              <>
                <div className="sib-articles-overview-grid">
                  {visibleArticles.map(
                    (
                      article,
                      index,
                    ) => (
                      <article
                        key={article.id}
                        className={`sib-article-card ${
                          article.featured
                            ? "sib-article-card-featured"
                            : ""
                        }`}
                        style={{
                          "--sib-article-card-index":
                            index,
                        }}
                      >
                        <Link
                          to={`/artikel/${article.slug}`}
                          className="sib-article-card-link"
                          aria-label={`${article.title} lesen`}
                        >
                          <div className="sib-article-card-top">
                            <span className="sib-article-card-category">
                              {
                                article.category
                              }
                            </span>

                            {article.featured && (
                              <span className="sib-article-card-featured-label">
                                Hervorgehoben
                              </span>
                            )}
                          </div>

                          <div className="sib-article-card-content">
                            <div className="sib-article-card-meta">
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

                              <span
                                aria-hidden="true"
                              ></span>

                              <p>
                                {
                                  article.readingTime
                                }{" "}
                                Min. Lesezeit
                              </p>
                            </div>

                            <h3>
                              {article.title}
                            </h3>

                            <p className="sib-article-card-excerpt">
                              {
                                article.excerpt
                              }
                            </p>

                            {article.tags.length >
                              0 && (
                              <div className="sib-article-card-tags">
                                {article.tags
                                  .slice(0, 3)
                                  .map(
                                    (tag) => (
                                      <span
                                        key={
                                          tag
                                        }
                                      >
                                        {
                                          tag
                                        }
                                      </span>
                                    ),
                                  )}
                              </div>
                            )}
                          </div>

                          <footer className="sib-article-card-footer">
                            <div>
                              <span>Von</span>

                              <strong>
                                {
                                  article.author
                                }
                              </strong>
                            </div>

                            <span className="sib-article-card-action">
                              <span>
                                Artikel lesen
                              </span>

                              <span
                                className="sib-article-card-action-icon"
                                aria-hidden="true"
                              >
                                <ArrowIcon />
                              </span>
                            </span>
                          </footer>
                        </Link>
                      </article>
                    ),
                  )}
                </div>

                {visibleCount <
                  filteredArticles.length && (
                  <div className="sib-articles-overview-load-more">
                    <button
                      type="button"
                      onClick={() =>
                        setVisibleCount(
                          (
                            currentCount,
                          ) =>
                            currentCount +
                            6,
                        )
                      }
                    >
                      Weitere Artikel laden
                    </button>

                    <p>
                      {
                        visibleArticles.length
                      }{" "}
                      von{" "}
                      {
                        filteredArticles.length
                      }{" "}
                      Artikeln
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="sib-articles-overview-empty">
                <span aria-hidden="true">
                  <EmptyIcon />
                </span>

                <h3>
                  Keine Artikel gefunden
                </h3>

                <p>
                  Für den Suchbegriff oder
                  die gewählte Kategorie sind
                  aktuell keine passenden
                  Artikel vorhanden.
                </p>

                {activeFilterCount > 0 ? (
                  <button
                    type="button"
                    onClick={resetFilters}
                  >
                    Alle Artikel anzeigen
                  </button>
                ) : null}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default ArticlesOverview;