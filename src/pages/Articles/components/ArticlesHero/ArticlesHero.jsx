import "./ArticlesHero.css";

function ArticlesHero() {
  return (
    <section
      className="sib-articles-page-hero"
      aria-labelledby="sib-articles-page-hero-title"
    >
      <div
        className="sib-articles-page-hero-decoration"
        aria-hidden="true"
      >
        <span className="sib-articles-page-hero-decoration-circle"></span>

        <span className="sib-articles-page-hero-decoration-line sib-articles-page-hero-decoration-line-left"></span>

        <span className="sib-articles-page-hero-decoration-line sib-articles-page-hero-decoration-line-right"></span>

        <span className="sib-articles-page-hero-decoration-dot sib-articles-page-hero-decoration-dot-left"></span>

        <span className="sib-articles-page-hero-decoration-dot sib-articles-page-hero-decoration-dot-right"></span>
      </div>

      <div className="sib-articles-page-hero-container">
        <p className="sib-articles-page-hero-label">
          Islamisches Wissen auf Deutsch
        </p>

        <h1
          id="sib-articles-page-hero-title"
          className="sib-articles-page-hero-title"
        >
          Islamische Artikel
          <span>auf Deutsch lesen.</span>
        </h1>

        <p className="sib-articles-page-hero-description">
          Islamische Artikel auf Deutsch lesen und Wissen vertiefen:
          Entdecke veröffentlichte Beiträge von Dr. Shaykh Sayed
          Ibn Basyuni zu Themen der islamischen Wissenschaften.
          Die Artikel helfen dir dabei, den Islam zu lernen und
          wissenschaftliche Inhalte besser zu verstehen.
        </p>
      </div>
    </section>
  );
}

export default ArticlesHero;