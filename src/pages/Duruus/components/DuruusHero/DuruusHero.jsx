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
          Islamische Unterrichte und Durous
        </p>

        <h1 className="sib-duruus-page-hero-title">
          Islamische Unterrichte
          <span>von Shaykh Sayed.</span>
        </h1>

        <p className="sib-duruus-page-hero-description">
          Islam lernen mit den Unterrichten von Dr. Shaykh Sayed
          Ibn Basyuni: Hier findest du den Fiqh-Unterrichtsplan
          in Kassel, aktuelle Hinweise und veröffentlichte
          Audioaufnahmen der Durous.
        </p>
      </div>
    </section>
  );
}

export default DuruusHero;