import { Link } from "react-router-dom";
import "./Hero.css";
import { HeroBackdrop, HeroFeature } from "./HeroArtwork";
import HeroLantern from "./HeroLantern.jsx";
import "./HeroArtwork.css";

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


function MosqueBadgeIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" focusable="false" aria-hidden="true">
      <path d="M5.2 25.5h21.6M8 25.5V14.8h16v10.7M11 14.8c0-5 2.2-7.6 5-9.2 2.8 1.6 5 4.2 5 9.2M16 5.6V2.8M11.6 25.5v-6.3a4.4 4.4 0 0 1 8.8 0v6.3M4.5 25.5v2.4m23-2.4v2.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.2 28h21.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function DividerBookIcon() {
  return (
    <svg viewBox="0 0 46 38" fill="none" focusable="false" aria-hidden="true">
      <path d="M23 11.3C17 6.7 9.7 6.2 4.5 7.4v22c6.8-1.1 13-.2 18.5 4.4 5.5-4.6 11.7-5.5 18.5-4.4v-22C36.3 6.2 29 6.7 23 11.3Z" stroke="currentColor" strokeWidth="2.1" strokeLinejoin="round" />
      <path d="M23 11.3V33.8M8 12c5.4-.7 10.4.7 15 4.5M38 12c-5.4-.7-10.4.7-15 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Hero() {
  return (
    <section className="sib-home-hero" aria-labelledby="sib-home-hero-title">
      <div className="sib-home-hero-decoration" aria-hidden="true">
        <HeroBackdrop />
        <div className="sib-home-hero-ornament">
          <span className="sib-home-hero-ornament-image" />
        </div>
      </div>

      <HeroLantern />

      <div className="sib-home-hero-container">
        <p className="sib-home-hero-label">
          <span className="sib-home-hero-label-icon" aria-hidden="true">
            <MosqueBadgeIcon />
          </span>
          <span>
            Offizielle Website von <strong>Dr. Shaykh Sayed Ibn Basyuni</strong>
          </span>
        </p>

        <h1 id="sib-home-hero-title" className="sib-home-hero-title">
          <span className="sib-home-hero-title-main">Islam lernen</span>
          <span className="sib-home-hero-title-accent">mit Quran und Sunnah.</span>
        </h1>

        <div className="sib-home-hero-divider" aria-hidden="true">
          <span className="sib-home-hero-divider-line" />
          <DividerBookIcon />
          <span className="sib-home-hero-divider-line" />
        </div>

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

        <div className="sib-home-hero-features" aria-label="Besonderheiten des Angebots">
          <HeroFeature kind="knowledge" title="Authentisches Wissen" subtitle="auf Quran und Sunnah" />
          <HeroFeature kind="lessons" title="Strukturierte Inhalte" subtitle="für Einsteiger und Fortgeschrittene" />
          <HeroFeature kind="trust" title="Vertrauenswürdige Quelle" subtitle="unter der Leitung des Shaykh" />
        </div>
      </div>
    </section>
  );
}

export default Hero;
