import { Link } from "react-router-dom";
import "./Hero.css";

function BookIcon() {
  return (
    <svg viewBox="0 0 76 66" fill="none" focusable="false" aria-hidden="true">
      <path
        d="M37.7 16.1C26.8 9.8 16.6 8.7 5.3 9.5v42.2c13.6-1.1 24.3 1.1 32.4 8.2 8-7.1 18.8-9.3 32.4-8.2V9.5c-11.3-.8-21.5.3-32.4 6.6Z"
        stroke="#E8B647"
        strokeWidth="3.9"
        strokeLinejoin="round"
      />
      <path
        d="M37.7 12.3C27.8 5.4 16.5 4.9 9.9 5.5v40.8c10.6-.4 20.2 1.7 27.8 8.2V12.3Z"
        fill="#FFFEFA"
      />
      <path
        d="M37.7 12.3c9.9-6.9 21.2-7.4 27.8-6.8v40.8c-10.6-.4-20.2 1.7-27.8 8.2V12.3Z"
        fill="#F5F8F4"
      />
      <path d="M37.7 12.3v42.2" stroke="#D5DDCE" strokeWidth="1.6" />
    </svg>
  );
}

function FatwaIcon() {
  return (
    <svg viewBox="0 0 70 70" fill="none" focusable="false" aria-hidden="true">
      <defs>
        <linearGradient id="sib-fatwa-icon-gold" x1="7" y1="7" x2="59" y2="63" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6EAF82" />
          <stop offset=".52" stopColor="#D6AA37" />
          <stop offset="1" stopColor="#AD761C" />
        </linearGradient>
      </defs>
      <path
        d="M34.8 6.6C19 6.6 6.3 19.2 6.3 34.7c0 6.3 2.1 12.2 5.7 16.9L9.4 63l12.3-5.2a28.8 28.8 0 0 0 13.1 3.1c15.8 0 28.5-12.6 28.5-28.1C63.3 19.2 50.6 6.6 34.8 6.6Z"
        stroke="url(#sib-fatwa-icon-gold)"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path
        d="M25.8 27.2c.5-5 4-8.2 9.1-8.2 5.6 0 9.1 3.1 9.1 7.8 0 3.9-2.2 6-5.8 8.5-2.8 1.9-3.2 3.3-3.2 6.8"
        stroke="#06452F"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle cx="35.1" cy="49.9" r="2.9" fill="#06452F" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 46 46" fill="none" focusable="false" aria-hidden="true">
      <path d="M6 23h32M25 10l13 13-13 13" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg viewBox="0 0 46 46" fill="none" focusable="false" aria-hidden="true">
      <path d="M10 36 36 10M14 10h22v22" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}


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
          <Link
            className="sib-home-hero-action sib-home-hero-action-primary"
            to="/durous"
          >
            <span className="sib-home-hero-action-icon" aria-hidden="true">
              <BookIcon />
            </span>
            <span className="sib-home-hero-action-label">Islam lernen</span>
            <span className="sib-home-hero-action-arrow" aria-hidden="true">
              <ArrowRightIcon />
            </span>
          </Link>

          <Link
            className="sib-home-hero-action sib-home-hero-action-secondary"
            to="/kontakt?anliegen=fatwa#kontaktformular"
          >
            <span className="sib-home-hero-action-icon" aria-hidden="true">
              <FatwaIcon />
            </span>
            <span className="sib-home-hero-action-label">Fatwa anfragen</span>
            <span className="sib-home-hero-action-arrow" aria-hidden="true">
              <ArrowUpRightIcon />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;
