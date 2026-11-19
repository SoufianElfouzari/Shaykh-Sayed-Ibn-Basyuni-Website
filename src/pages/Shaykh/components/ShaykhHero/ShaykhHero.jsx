import { Link } from "react-router-dom";
import { HeroBackdrop } from "../../../Home/components/Hero/HeroArtwork";
import HeroLantern from "../../../Home/components/Hero/HeroLantern";
import BookIcon from "../../../common/BookIcon.jsx";
import "../../../Home/components/Hero/Hero.css";
import "../../../Home/components/Hero/HeroArtwork.css";
import "./ShaykhHero.css";

function Icon({ kind }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round" };
  if (kind === "person") return <svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="10" r="5" fill="currentColor" /><path d="M5 27c0-7 5-11 11-11s11 4 11 11Z" fill="currentColor" /></svg>;
  if (kind === "graduate") return <svg viewBox="0 0 40 40" aria-hidden="true"><path {...common} d="M3 14 20 6l17 8-17 9L3 14Zm7 6v9c7 5 13 5 20 0v-9M36 15v12" /></svg>;
  if (kind === "teaching") return <svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="10" r="6" fill="currentColor" /><circle cx="7" cy="17" r="5" fill="currentColor" /><circle cx="33" cy="17" r="5" fill="currentColor" /><path d="M9 35v-5c0-7 5-11 11-11s11 4 11 11v5ZM1 34v-7c0-4 2-6 6-6M39 34v-7c0-4-2-6-6-6" fill="currentColor" /></svg>;
  if (kind === "research") return <svg viewBox="0 0 40 40" aria-hidden="true"><path {...common} d="M20 11C15 7 9 6 3 8v25c7-2 12-1 17 3 5-4 10-5 17-3V8c-6-2-12-1-17 3Zm0 0v25M8 14c4-1 7 0 9 2m6 0c3-2 6-3 9-2" /></svg>;
  if (kind === "location") return <svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 3C11 3 6 9 6 17c0 10 14 20 14 20s14-10 14-20C34 9 29 3 20 3Z" fill="currentColor" /><circle cx="20" cy="17" r="5" fill="#fff7e6" /></svg>;
  if (kind === "calendar") return <svg viewBox="0 0 40 40" aria-hidden="true"><rect {...common} x="5" y="8" width="30" height="27" rx="3" /><path {...common} d="M5 17h30M12 4v9M28 4v9M12 24h5m6 0h5m-16 6h5" /></svg>;
  return <svg viewBox="0 0 46 46" fill="none" aria-hidden="true"><path d="M6 23h32M25 10l13 13-13 13" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function DividerBook() {
  return <svg viewBox="0 0 46 38" fill="none" aria-hidden="true"><path d="M23 11.3C17 6.7 9.7 6.2 4.5 7.4v22c6.8-1.1 13-.2 18.5 4.4 5.5-4.6 11.7-5.5 18.5-4.4v-22C36.3 6.2 29 6.7 23 11.3Z" stroke="currentColor" strokeWidth="2.1" strokeLinejoin="round" /><path d="M23 11.3V33.8M8 12c5.4-.7 10.4.7 15 4.5M38 12c-5.4-.7-10.4.7-15 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

const highlights = [
  { icon: "graduate", title: "Ausbildung", description: "an der Al-Azhar-Universität" },
  { icon: "teaching", title: "Lehrtätigkeit", description: "Islamische Unterrichte in Kassel" },
  { icon: "research", title: "Forschung", description: "in Aqidah, Fiqh und Hadith" },
  { icon: "location", title: "Wirken", description: "in Deutschland" },
];

function ShaykhHero() {
  return (
    <section className="sib-home-hero sib-shaykh-page-hero" aria-labelledby="sib-shaykh-hero-title">
      <div className="sib-home-hero-decoration" aria-hidden="true">
        <HeroBackdrop />
        <div className="sib-home-hero-ornament"><span className="sib-home-hero-ornament-image" /></div>
      </div>
      <HeroLantern />
      <div className="sib-shaykh-page-hero-container">
        <div className="sib-shaykh-page-hero-copy">
          <p className="sib-home-hero-label sib-shaykh-page-hero-label">
            <span className="sib-home-hero-label-icon" aria-hidden="true"><Icon kind="person" /></span>
            <span>Biografie und Werdegang</span>
          </p>
          <h1 id="sib-shaykh-hero-title" className="sib-home-hero-title sib-shaykh-page-hero-title">
            <span className="sib-home-hero-title-main">Dr. Shaykh</span>
            <span className="sib-home-hero-title-accent sib-shaykh-page-hero-name">Sayed Ibn Basyuni</span>
          </h1>
          <div className="sib-home-hero-divider sib-shaykh-page-hero-divider" aria-hidden="true">
            <span className="sib-home-hero-divider-line" /><DividerBook /><span className="sib-home-hero-divider-line" />
          </div>
          <p className="sib-home-hero-description sib-shaykh-page-hero-description">
            Lerne Dr. Shaykh Sayed Ibn Basyuni näher kennen: seine Ausbildung an der Al-Azhar-Universität, seine Lehrtätigkeit, seine Forschung und seinen Einsatz in Deutschland.
          </p>
          <div className="sib-home-hero-actions sib-shaykh-page-hero-actions">
            <a className="sib-home-hero-action sib-home-hero-action-primary" href="#kurzbiografie">
              <span className="sib-home-hero-action-icon" aria-hidden="true"><BookIcon /></span>
              <span className="sib-home-hero-action-label">Biografie lesen</span>
              <span className="sib-home-hero-action-arrow" aria-hidden="true"><Icon kind="arrow" /></span>
            </a>
            <Link className="sib-home-hero-action sib-home-hero-action-secondary" to="/durous">
              <span className="sib-home-hero-action-icon" aria-hidden="true"><Icon kind="calendar" /></span>
              <span className="sib-home-hero-action-label">Unterrichte ansehen</span>
              <span className="sib-home-hero-action-arrow" aria-hidden="true"><Icon kind="arrow" /></span>
            </Link>
          </div>
        </div>
        <div className="sib-shaykh-page-hero-portrait" aria-hidden="true">
          <div className="sib-shaykh-page-hero-arch">
            <svg className="sib-shaykh-page-hero-arch-shape" viewBox="0 0 500 540" preserveAspectRatio="none" aria-hidden="true"><path d="M 13 540 L 13 235 Q 13 187 56 167 Q 78 156 110 155 Q 117 115 156 95 Q 215 64 250 16 Q 285 64 344 95 Q 383 115 390 155 Q 422 156 444 167 Q 487 187 487 235 L 487 540 Z" fill="#006448" stroke="#DDAA29" strokeWidth="13" strokeLinejoin="round" /></svg>
            <img src="/assets/shaykh.png" alt="" className="sib-shaykh-page-hero-photo" loading="eager" decoding="async" />
          </div>
          <div className="sib-shaykh-page-hero-clouds" />
        </div>
      </div>
      <div className="sib-shaykh-page-hero-highlights">
        {highlights.map((item) => (
          <div className="sib-shaykh-page-hero-highlight" key={item.title}>
            <span className="sib-shaykh-page-hero-highlight-icon" aria-hidden="true"><Icon kind={item.icon} /></span>
            <span><strong>{item.title}</strong><small>{item.description}</small></span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ShaykhHero;
