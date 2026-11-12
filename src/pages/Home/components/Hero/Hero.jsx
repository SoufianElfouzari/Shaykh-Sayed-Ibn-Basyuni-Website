import { Link } from "react-router-dom";
import "./Hero.css";

function Hero() {
  return (
    <section className="sib-home-hero" aria-labelledby="sib-home-hero-title">
      <div className="sib-home-hero-decoration" aria-hidden="true">
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

        <h1 id="sib-home-hero-title" className="sib-home-hero-title">
          Islam lernen{" "}
          <span>mit Quran und Sunnah.</span>
        </h1>

        <p className="sib-home-hero-description">
          Entdecke islamische Unterrichte und fundierte Artikel zu Fiqh,
          Aqidah und Hadith. Lerne den Islam auf Grundlage von Quran und
          Sunnah und stelle deine islamischen Fragen direkt an Dr. Shaykh
          Sayed Ibn Basyuni.
        </p>

        <div className="sib-home-hero-actions">
          <Link className="sib-home-hero-action sib-home-hero-action-primary" to="/durous">
            Islam lernen <span aria-hidden="true">→</span>
          </Link>
          <Link className="sib-home-hero-action sib-home-hero-action-secondary" to="/kontakt?anliegen=fatwa#kontaktformular">
            Fatwa anfragen <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;
