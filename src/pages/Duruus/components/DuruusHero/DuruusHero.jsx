import "./DuruusHero.css";

function DuruusHero() {
  return (
    <section className="sib-duruus-page-hero">
      <div
        className="sib-duruus-page-hero-decoration"
        aria-hidden="true"
      >
        <span className="sib-duruus-page-hero-decoration-circle"></span>

        <span className="sib-duruus-page-hero-decoration-line sib-duruus-page-hero-decoration-line-left"></span>

        <span className="sib-duruus-page-hero-decoration-line sib-duruus-page-hero-decoration-line-right"></span>

        <span className="sib-duruus-page-hero-decoration-dot sib-duruus-page-hero-decoration-dot-left"></span>

        <span className="sib-duruus-page-hero-decoration-dot sib-duruus-page-hero-decoration-dot-right"></span>
      </div>

      <div className="sib-duruus-page-hero-container">
        <p className="sib-duruus-page-hero-label">
          Unterricht und Aufnahmen
        </p>

        <h1 className="sib-duruus-page-hero-title">
          Durous und Unterricht
          <span>übersichtlich gesammelt.</span>
        </h1>

        <p className="sib-duruus-page-hero-description">
          Hier finden sich aktuelle und kommende Unterrichte,
          aufgezeichnete Durous sowie geordnete Unterrichtsreihen
          von Dr. Shaykh Sayed Ibn Basyuni.
        </p>
      </div>
    </section>
  );
}

export default DuruusHero;