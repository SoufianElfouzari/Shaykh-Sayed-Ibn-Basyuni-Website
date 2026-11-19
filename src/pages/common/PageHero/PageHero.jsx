import { Link } from "react-router-dom";
import { HeroBackdrop, HeroFeature } from "../../Home/components/Hero/HeroArtwork";
import HeroLantern from "../../Home/components/Hero/HeroLantern";
import BookIcon from "../BookIcon.jsx";
import "../../Home/components/Hero/Hero.css";
import "../../Home/components/Hero/HeroArtwork.css";
import "./PageHero.css";

function BadgeIcon({ type }) {
  return <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" focusable="false">
    {type === "lessons" ? <>
      <path d="M6 6h20v20H6zM11 3v6M21 3v6M6 12h20M11 18h4m3 0h4m-11 5h4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/>
    </> : <>
      <path d="M16 8C12 5 7 5 3 6v21c5-1 9 0 13 3 4-3 8-4 13-3V6c-4-1-9-1-13 2Zm0 0v22M7 11c3-.5 5 0 7 1m4 0c2-1 4-1.5 7-1" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/>
    </>}
  </svg>;
}

function DividerBook() {
  return <svg viewBox="0 0 46 38" fill="none" aria-hidden="true" focusable="false">
    <path d="M23 11.3C17 6.7 9.7 6.2 4.5 7.4v22c6.8-1.1 13-.2 18.5 4.4 5.5-4.6 11.7-5.5 18.5-4.4v-22C36.3 6.2 29 6.7 23 11.3Z" stroke="currentColor" strokeWidth="2.1" strokeLinejoin="round"/>
    <path d="M23 11.3V33.8" stroke="currentColor" strokeWidth="1.6"/>
  </svg>;
}

function ArrowIcon() {
  return <svg viewBox="0 0 46 46" fill="none" aria-hidden="true" focusable="false"><path d="M6 23h32M25 10l13 13-13 13" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

const variants = {
  lessons: {
    badge: "Islamische Unterrichte und Durous",
    first: "Islamische Unterrichte",
    second: "von Shaykh Sayed.",
    description: "Islamische Unterrichte von Shaykh Sayed bieten dir einen Zugang zu islamischem Wissen auf Deutsch. Entdecke die Audioaufnahmen von Shaykh Sayed Ibn Basyuni, den Fiqh-Unterrichtsplan in Kassel und aktuelle Terminänderungen.",
    primary: "Unterrichte entdecken",
    target: "#unterrichtsarchiv",
    secondary: "Artikel lesen",
    route: "/artikel",
    features: [
      ["knowledge", "Islamisches Wissen", "auf Quran und Sunnah"],
      ["lessons", "Audioaufnahmen", "Unterrichte zum Nachhören"],
      ["trust", "Unterricht in Kassel", "Termine und Änderungen"],
    ],
  },
  articles: {
    badge: "Islamisches Wissen auf Deutsch",
    first: "Islamische Artikel",
    second: "auf Deutsch lesen.",
    description: "Islamische Artikel auf Deutsch lesen und Wissen vertiefen: Entdecke veröffentlichte Beiträge von Dr. Shaykh Sayed Ibn Basyuni zu Themen der islamischen Wissenschaften. Die Artikel helfen dir dabei, den Islam zu lernen und wissenschaftliche Inhalte besser zu verstehen.",
    primary: "Artikel entdecken",
    target: "#sib-articles-overview-title",
    secondary: "Unterrichte ansehen",
    route: "/durous",
    features: [
      ["knowledge", "Fundierte Beiträge", "zu islamischen Wissenschaften"],
      ["lessons", "Wissen vertiefen", "Artikel auf Deutsch"],
      ["trust", "Vom Shaykh", "Wissenschaftliche Inhalte"],
    ],
  },
};

export default function PageHero({ type }) {
  const data = variants[type];
  if (!data) return null;
  const headingId = type === "lessons" ? "sib-duruus-page-hero-title" : "sib-articles-page-hero-title";
  return (
    <section className={`sib-home-hero sib-inner-page-hero sib-inner-page-hero-${type}`} aria-labelledby={headingId}>
      <div className="sib-home-hero-decoration" aria-hidden="true">
        <HeroBackdrop />
        <div className="sib-home-hero-ornament"><span className="sib-home-hero-ornament-image" /></div>
      </div>
      <HeroLantern />
      <div className="sib-home-hero-container">
        <p className="sib-home-hero-label">
          <span className="sib-home-hero-label-icon" aria-hidden="true"><BadgeIcon type={type}/></span>
          <span>{data.badge}</span>
        </p>
        <h1 id={headingId} className="sib-home-hero-title">
          <span className="sib-home-hero-title-main">{data.first}</span>
          <span className="sib-home-hero-title-accent">{data.second}</span>
        </h1>
        <div className="sib-home-hero-divider" aria-hidden="true">
          <span className="sib-home-hero-divider-line"/><DividerBook/><span className="sib-home-hero-divider-line"/>
        </div>
        <p className="sib-home-hero-description">{data.description}</p>
        <div className="sib-home-hero-actions">
          <a href={data.target} className="sib-home-hero-action sib-home-hero-action-primary">
            <span className="sib-home-hero-action-icon" aria-hidden="true"><BookIcon/></span>
            <span className="sib-home-hero-action-label">{data.primary}</span>
            <span className="sib-home-hero-action-arrow" aria-hidden="true"><ArrowIcon/></span>
          </a>
          <Link to={data.route} className="sib-home-hero-action sib-home-hero-action-secondary">
            <span className="sib-home-hero-action-icon" aria-hidden="true"><BadgeIcon type={type === "lessons" ? "articles" : "lessons"}/></span>
            <span className="sib-home-hero-action-label">{data.secondary}</span>
            <span className="sib-home-hero-action-arrow" aria-hidden="true"><ArrowIcon/></span>
          </Link>
        </div>
        <div className="sib-home-hero-features" aria-label="Inhalte dieser Seite">
          {data.features.map(([kind,title,subtitle]) => <HeroFeature key={title} kind={kind} title={title} subtitle={subtitle}/>)}
        </div>
      </div>
    </section>
  );
}
