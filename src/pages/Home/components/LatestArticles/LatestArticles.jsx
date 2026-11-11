import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link } from "react-router-dom";

import { getPublishedArticleSummaries } from "../../../../supabase/articleService";
import { useSsrData } from "../../../../SsrDataContext";

import "./LatestArticles.css";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4.5 12h15m-6-6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 6.5c-2.4-1.7-5-2.1-8-1.6v13.4c3-.5 5.6-.1 8 1.6m0-13.4c2.4-1.7 5-2.1 8-1.6v13.4c-3-.5-5.6-.1-8 1.6m0-13.4v13.4"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArticleIcon({ variant = 0 }) {
  const paths = [
    <path
      key="book"
      d="M3.75 5.5c3-.7 5.6-.25 8.25 1.8 2.65-2.05 5.25-2.5 8.25-1.8v12.8c-3-.7-5.6-.25-8.25 1.8-2.65-2.05-5.25-2.5-8.25-1.8V5.5Zm8.25 1.8v12.8"
    />,
    <path
      key="pages"
      d="M7.5 3.75h8.1L19 7.2V20H7.5V3.75Zm8.1 0V7.2H19M5 7.5H4.25V22H16m-5.5-10.5h5m-5 3.5h5"
    />,
    <path
      key="layers"
      d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5"
    />,
    <path
      key="study"
      d="M8 3.75h9.25A2.75 2.75 0 0 1 20 6.5v13.75H8a4 4 0 0 1-4-4V7.75a4 4 0 0 1 4-4Zm0 0v12.5a4 4 0 0 0-4 4m4-4h12M11 8.5h5m-5 3.25h4"
    />,
  ];

  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <g
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {paths[variant % paths.length]}
      </g>
    </svg>
  );
}

function getDateTimestamp(value) {
  if (!value) return 0;
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function formatDate(value) {
  if (!value || !getDateTimestamp(value)) return null;

  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function getArticlePath(article) {
  return article?.slug ? "/artikel/" + encodeURIComponent(article.slug) : "/artikel";
}

function LatestArticles() {
  const { articles: initialArticles } = useSsrData();
  const [articles, setArticles] = useState(initialArticles || []);
  const [isLoading, setIsLoading] = useState(!initialArticles);
  const [errorMessage, setErrorMessage] = useState("");

  const loadArticles = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const loadedArticles = await getPublishedArticleSummaries();
      setArticles(Array.isArray(loadedArticles) ? loadedArticles : []);
    } catch (error) {
      console.error("Neueste Artikel konnten nicht geladen werden:", error);
      setArticles([]);
      setErrorMessage("Die neuesten Artikel konnten nicht geladen werden.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Published article summaries are already present in production SSR.
    if (Array.isArray(initialArticles)) return undefined;
    const frame = window.requestAnimationFrame(() => {
      void loadArticles();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [initialArticles, loadArticles]);

  const visibleArticles = useMemo(
    () => [...articles]
      .filter((article) => article?.slug && article?.title)
      .sort(
        (first, second) =>
          getDateTimestamp(second.publishedAt) -
          getDateTimestamp(first.publishedAt),
      )
      .slice(0, 6),
    [articles],
  );

  return (
    <section
      className="sib-articles"
      aria-labelledby="sib-latest-articles-title"
    >
      <div className="sib-articles-decoration" aria-hidden="true">
        <span className="sib-articles-decoration-arch" />
        <span className="sib-articles-decoration-pattern" />
      </div>

      <div className="sib-articles-container">
        <header className="sib-articles-heading-panel">
          <p className="sib-articles-label">
            <span>Wissen und Erkenntnis</span>
            <span className="sib-articles-label-rule" aria-hidden="true" />
          </p>

          <h2 id="sib-latest-articles-title" className="sib-articles-title">
            Islam lernen.
            <span> Wissen verstehen und vertiefen.</span>
          </h2>

          <p className="sib-articles-heading-copy">
            Entdecke islamische Artikel auf Deutsch und erweitere dein Wissen
            über Fiqh, Aqidah, Hadith und weitere Wissenschaften.
          </p>

          <div className="sib-articles-identity">
            <span className="sib-articles-identity-icon">
              <BookIcon />
            </span>
            <span className="sib-articles-identity-divider" aria-hidden="true" />
            <p>
              <strong>Islamische Wissenschaften</strong>
              <span>Auf Grundlage von Quran und Sunnah</span>
            </p>
          </div>

          <Link to="/artikel" className="sib-articles-all-link">
            <BookIcon />
            <span>Alle Artikel ansehen</span>
            <ArrowIcon />
          </Link>
        </header>

        <div className="sib-articles-content">
          <div className="sib-articles-introduction">
            <p>
              <strong>Wissen, das zum Nachdenken anregt.</strong> Hier findest
              du schriftliche Beiträge zu wichtigen Fragen des Islam, zu
              den Grundlagen des Fiqh und zu weiteren islamischen Themen.
            </p>
            <p>
              Wähle einen Artikel aus und lies die vollständige
              Veröffentlichung in Ruhe.
            </p>
          </div>

          {isLoading && (
            <div className="sib-articles-status" aria-live="polite" aria-busy="true">
              <span className="sib-articles-status-icon"><BookIcon /></span>
              <div>
                <h3>Artikel werden geladen</h3>
                <p>Die neuesten Veröffentlichungen werden abgerufen.</p>
              </div>
            </div>
          )}

          {!isLoading && errorMessage && (
            <div className="sib-articles-status" role="alert">
              <span className="sib-articles-status-icon"><BookIcon /></span>
              <div>
                <h3>Artikel konnten nicht geladen werden</h3>
                <p>{errorMessage}</p>
                <button type="button" onClick={loadArticles}>
                  Erneut versuchen
                </button>
              </div>
            </div>
          )}

          {!isLoading && !errorMessage && visibleArticles.length === 0 && (
            <div className="sib-articles-status">
              <span className="sib-articles-status-icon"><BookIcon /></span>
              <div>
                <h3>Noch keine Artikel veröffentlicht</h3>
                <p>Neue islamische Artikel werden hier angezeigt, sobald sie veröffentlicht sind.</p>
              </div>
            </div>
          )}

          {!isLoading && !errorMessage && visibleArticles.length > 0 && (
            <div className="sib-articles-layout">
              {visibleArticles.map((article, index) => {
                const date = formatDate(article.publishedAt);

                return (
                  <Link
                    key={article.id || article.slug}
                    to={getArticlePath(article)}
                    className={
                      "sib-articles-secondary" +
                      (index === 0 ? " sib-articles-featured" : "")
                    }
                  >
                    <span className="sib-articles-card-icon" aria-hidden="true">
                      <ArticleIcon variant={index} />
                    </span>

                    <div className="sib-articles-secondary-content">
                      <div className="sib-articles-secondary-top">
                        <span className="sib-articles-category">
                          {article.category || "Islamischer Artikel"}
                        </span>
                        {date && (
                          <time dateTime={article.publishedAt} className="sib-articles-date">
                            {date}
                          </time>
                        )}
                      </div>

                      <h3>{article.title}</h3>

                      {article.excerpt && (
                        <p className="sib-articles-excerpt">{article.excerpt}</p>
                      )}

                      <span className="sib-articles-card-footer">
                        <span>Artikel lesen</span>
                        <span className="sib-articles-secondary-arrow">
                          <ArrowIcon />
                        </span>
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          <Link to="/artikel" className="sib-articles-mobile-link">
            <span>Zur Artikelübersicht</span>
            <ArrowIcon />
          </Link>
        </div>
      </div>

      <span className="sib-articles-bottom-wave" aria-hidden="true" />
    </section>
  );
}

export default LatestArticles;
