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
          Texte und wissenschaftliche Beiträge
        </p>

        <h1
          id="sib-articles-page-hero-title"
          className="sib-articles-page-hero-title"
        >
          Artikel und Beiträge
          <span>geordnet an einem Ort.</span>
        </h1>

        <p className="sib-articles-page-hero-description">
          Hier finden sich veröffentlichte Artikel, kurze
          Abhandlungen und weitere schriftliche Beiträge von
          Shaykh Sayed Ibn Basyuni.
        </p>
      </div>
    </section>
  );
}

export default ArticlesHero;