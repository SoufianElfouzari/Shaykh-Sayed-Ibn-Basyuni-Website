import "./Hero.css";

function Hero() {
  return (
    <section className="sib-home-hero">
      <div
        className="sib-home-hero-decoration"
        aria-hidden="true"
      >
        <span className="sib-home-hero-decoration-circle"></span>
        <span className="sib-home-hero-decoration-line sib-home-hero-decoration-line-left"></span>
        <span className="sib-home-hero-decoration-line sib-home-hero-decoration-line-right"></span>

        <span className="sib-home-hero-decoration-dot sib-home-hero-decoration-dot-left"></span>
        <span className="sib-home-hero-decoration-dot sib-home-hero-decoration-dot-right"></span>
      </div>

      <div className="sib-home-hero-container">
        <p className="sib-home-hero-label">
          Offizielle Website von Shaykh Sayed Ibn Basyuni
        </p>

        <h1 className="sib-home-hero-title">
          Duruus, Schriften und Termine
          <span>geordnet an einem Ort.</span>
        </h1>

        <p className="sib-home-hero-description">
          Diese Website bietet eine übersichtliche Sammlung der
          Unterrichte, Veröffentlichungen und aktuellen Hinweise
          des Shaykh.
        </p>
      </div>
    </section>
  );
}

export default Hero;