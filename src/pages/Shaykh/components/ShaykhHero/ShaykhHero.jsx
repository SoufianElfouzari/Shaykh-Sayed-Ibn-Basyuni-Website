import { Link } from "react-router-dom";
import { HeroBackdrop, HeroFeature } from "../../../Home/components/Hero/HeroArtwork";
import HeroLantern from "../../../Home/components/Hero/HeroLantern";
import BookIcon from "../../../common/BookIcon.jsx";
import "../../../Home/components/Hero/Hero.css";
import "../../../Home/components/Hero/HeroArtwork.css";
import "./ShaykhHero.css";

function MosqueIcon() {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false">
      <path d="M5.2 25.5h21.6M8 25.5V14.8h16v10.7M11 14.8c0-5 2.2-7.6 5-9.2 2.8 1.6 5 4.2 5 9.2M16 5.6V2.8M11.6 25.5v-6.3a4.4 4.4 0 0 1 8.8 0v6.3M4.5 25.5v2.4m23-2.4v2.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.2 28h21.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function DividerBook() {
  return (
    <svg viewBox="0 0 46 38" fill="none" aria-hidden="true" focusable="false">
      <path d="M23 11.3C17 6.7 9.7 6.2 4.5 7.4v22c6.8-1.1 13-.2 18.5 4.4 5.5-4.6 11.7-5.5 18.5-4.4v-22C36.3 6.2 29 6.7 23 11.3Z" stroke="currentColor" strokeWidth="2.1" strokeLinejoin="round" />
      <path d="M23 11.3V33.8M8 12c5.4-.7 10.4.7 15 4.5M38 12c-5.4-.7-10.4.7-15 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 46 46" fill="none" aria-hidden="true" focusable="false">
      <path d="M6 23h32M25 10l13 13-13 13" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShaykhHero() {
  return (
    <section className="sib-home-hero sib-shaykh-page-hero" aria-labelledby="sib-shaykh-hero-title">
      <div className="sib-home-hero-decoration" aria-hidden="true">
        <HeroBackdrop />
        <div className="sib-home-hero-ornament">
          <span className="sib-home-hero-ornament-image" />
        </div>
      </div>
      <HeroLantern />
      <div className="sib-home-hero-container sib-shaykh-page-hero-container">
        <p className="sib-home-hero-label">
          <span className="sib-home-hero-label-icon" aria-hidden="true"><MosqueIcon /></span>
          <span>Biografie und wissenschaftlicher Werdegang</span>
        </p>
        <h1 id="sib-shaykh-hero-title" className="sib-home-hero-title sib-shaykh-page-hero-title">
          <span className="sib-home-hero-title-main">Dr. Shaykh</span>
          <span className="sib-home-hero-title-accent sib-shaykh-page-hero-name">Sayed Ibn Basyuni</span>
        </h1>
        <div className="sib-home-hero-divider" aria-hidden="true">
          <span className="sib-home-hero-divider-line" />
          <DividerBook />
          <span className="sib-home-hero-divider-line" />
        </div>
        <p className="sib-home-hero-description sib-shaykh-page-hero-description">
          Entdecke die Biografie von Dr. Shaykh Sayed Ibn Basyuni:
          seine Ausbildung an der Al-Azhar-Universität, seine Lehrer,
          seine Forschung und seine islamischen Unterrichte in Kassel.
        </p>
        <div className="sib-home-hero-actions">
          <a className="sib-home-hero-action sib-home-hero-action-primary" href="#kurzbiografie">
            <span className="sib-home-hero-action-icon" aria-hidden="true"><BookIcon /></span>
            <span className="sib-home-hero-action-label">Biografie entdecken</span>
            <span className="sib-home-hero-action-arrow" aria-hidden="true"><ArrowIcon /></span>
          </a>
          <Link className="sib-home-hero-action sib-home-hero-action-secondary" to="/durous">
            <span className="sib-home-hero-action-icon" aria-hidden="true"><BookIcon /></span>
            <span className="sib-home-hero-action-label">Unterrichte ansehen</span>
            <span className="sib-home-hero-action-arrow" aria-hidden="true"><ArrowIcon /></span>
          </Link>
        </div>
        <div className="sib-home-hero-features" aria-label="Wissenschaftlicher Werdegang">
          <HeroFeature kind="knowledge" title="Islamische Wissenschaften" subtitle="Studium an der Al-Azhar-Universität" />
          <HeroFeature kind="lessons" title="Lehre und Forschung" subtitle="Wissenschaftlicher Werdegang" />
          <HeroFeature kind="trust" title="Islamische Unterrichte" subtitle="Wissensvermittlung in Kassel" />
        </div>
      </div>
    </section>
  );
}

export default ShaykhHero;
