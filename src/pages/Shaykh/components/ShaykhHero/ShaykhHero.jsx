import "./ShaykhHero.css";

function ShaykhHero() {
  return (
    <section className="sib-shaykh-page-hero">
      <div
        className="sib-shaykh-page-hero-decoration"
        aria-hidden="true"
      >
        <span className="sib-shaykh-page-hero-decoration-circle"></span>

        <span className="sib-shaykh-page-hero-decoration-line sib-shaykh-page-hero-decoration-line-left"></span>

        <span className="sib-shaykh-page-hero-decoration-line sib-shaykh-page-hero-decoration-line-right"></span>

        <span className="sib-shaykh-page-hero-decoration-dot sib-shaykh-page-hero-decoration-dot-left"></span>

        <span className="sib-shaykh-page-hero-decoration-dot sib-shaykh-page-hero-decoration-dot-right"></span>
      </div>

      <div className="sib-shaykh-page-hero-container">
        <p className="sib-shaykh-page-hero-label">
          Biografie und wissenschaftlicher Werdegang
        </p>

        <h1 className="sib-shaykh-page-hero-title">
          Dr. Shaykh
          <span>Sayed Ibn Basyuni</span>
        </h1>

        <p className="sib-shaykh-page-hero-description">
          Entdecke die Biografie von Dr. Shaykh Sayed Ibn
          Basyuni: seine Ausbildung an der Al-Azhar-Universität,
          seine Lehrer, seine Forschung und seine islamischen
          Unterrichte in Kassel.
        </p>
      </div>
    </section>
  );
}

export default ShaykhHero;