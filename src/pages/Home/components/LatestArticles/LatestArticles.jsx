import { Link } from "react-router-dom";
import "./LatestArticles.css";

const articles = [
  {
    id: 1,
    category: "Hadithwissenschaft",
    title:
      "Die Bedeutung von Mustalah al-Hadith für das Verständnis der Sunnah",
    excerpt:
      "Eine Einführung in die Aufgabe der Hadithterminologie und ihre Bedeutung für die Unterscheidung und Beurteilung von Überlieferungen.",
    date: "18. Juli 2026",
    readingTime: "8 Min. Lesezeit",
    href: "/artikel/mustalah-al-hadith",
    featured: true,
  },
  {
    id: 2,
    category: "Fiqh",
    title:
      "Warum das Erlernen des Fiqh mit den Grundlagen beginnt",
    excerpt:
      "Über einen geordneten und schrittweisen Zugang zum Verständnis der islamischen Rechtswissenschaft.",
    date: "12. Juli 2026",
    readingTime: "6 Min. Lesezeit",
    href: "/artikel/grundlagen-des-fiqh",
  },
  {
    id: 3,
    category: "Wissen",
    title:
      "Der richtige Umgang mit Meinungsverschiedenheiten",
    excerpt:
      "Grundsätze für einen respektvollen und wissensbasierten Umgang mit unterschiedlichen Ansichten.",
    date: "5. Juli 2026",
    readingTime: "5 Min. Lesezeit",
    href: "/artikel/meinungsverschiedenheiten",
  },
];

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

function LatestArticles() {
  const featuredArticle = articles.find(
    (article) => article.featured,
  );

  const secondaryArticles = articles.filter(
    (article) => !article.featured,
  );

  return (
    <section className="sib-articles">
      <div className="sib-articles-container">
        <header className="sib-articles-header">
          <div className="sib-articles-heading">
            <p className="sib-articles-label">
              Neueste Artikel
            </p>

            <h2 className="sib-articles-title">
              Die Neusten Artikel des Shaykh.
            </h2>
          </div>

          <div className="sib-articles-header-side">
            <p>
              Ausgewählte Artikel, wissenschaftliche Beiträge und
              schriftliche Hinweise des Shaykh.
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

        <div className="sib-articles-layout">
          <Link
            to={featuredArticle.href}
            className="sib-articles-featured"
          >
            <div className="sib-articles-featured-top">
              <span className="sib-articles-icon">
                <DocumentIcon />
              </span>

              <span className="sib-articles-category">
                {featuredArticle.category}
              </span>
            </div>

            <div className="sib-articles-featured-content">
              <div className="sib-articles-meta">
                <span>{featuredArticle.date}</span>
                <span aria-hidden="true">·</span>
                <span>{featuredArticle.readingTime}</span>
              </div>

              <h3>{featuredArticle.title}</h3>

              <p>{featuredArticle.excerpt}</p>
            </div>

            <div className="sib-articles-featured-footer">
              <span>Artikel lesen</span>

              <span className="sib-articles-arrow">
                <ArrowIcon />
              </span>
            </div>
          </Link>

          <div className="sib-articles-secondary-list">
            {secondaryArticles.map((article) => (
              <Link
                key={article.id}
                to={article.href}
                className="sib-articles-secondary"
              >
                <div className="sib-articles-secondary-content">
                  <div className="sib-articles-secondary-top">
                    <span className="sib-articles-category">
                      {article.category}
                    </span>

                    <span className="sib-articles-date">
                      {article.date}
                    </span>
                  </div>

                  <h3>{article.title}</h3>

                  <p>{article.excerpt}</p>

                  <span className="sib-articles-reading-time">
                    {article.readingTime}
                  </span>
                </div>

                <span className="sib-articles-secondary-arrow">
                  <ArrowIcon />
                </span>
              </Link>
            ))}
          </div>
        </div>

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