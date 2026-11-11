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
          Offizielle Website von Dr. Shaykh Sayed Ibn Basyuni
        </p>

        <h1 className="sib-home-hero-title">
          Islam lernen{" "}
          <span>mit Quran und Sunnah.</span>
        </h1>

        <p className="sib-home-hero-description">
          Islam lernen mit Quran und Sunnah: Auf Deutsch findest du
          hier verständliche Grundlagen für Anfänger und Fortgeschrittene,
          islamische Unterrichte sowie fundierte Artikel zu Fiqh, Hadith
          und weiteren islamischen Wissenschaften.
        </p>
      </div>
    </section>
  );
}

export default Hero;