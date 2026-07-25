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
          Der Shaykh
          <span>Sayed Ibn Basyuni</span>
        </h1>

        <p className="sib-shaykh-page-hero-description">
          Diese Seite bietet einen geordneten Einblick in den
          wissenschaftlichen Werdegang, die Lehrer und die
          Tätigkeiten von Shaykh Sayed Ibn Basyuni.
        </p>
      </div>
    </section>
  );
}

export default ShaykhHero;