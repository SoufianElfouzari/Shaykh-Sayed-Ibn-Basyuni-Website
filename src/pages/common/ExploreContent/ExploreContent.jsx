import { Link } from "react-router-dom";
import BookIcon from "../BookIcon.jsx";
import "./ExploreContent.css";

const contentByPage = {
  home: {
    heading: "Islamische Wissenschaften entdecken",
    description: "Entdecke die Fachgebiete Fiqh, Aqidah und Hadith durch deutschsprachige Artikel und Unterrichte.",
    links: [
      { to: "/artikel", title: "Fiqh und Usul al-Fiqh", detail: "Wissenschaftliche Beiträge und Erklärungen" },
      { to: "/durous", title: "Aqidah und Hadith", detail: "Islamische Unterrichte und Aufnahmen" },
      { to: "/shaykh", title: "Deinen Lehrer kennenlernen", detail: "Biografie und wissenschaftliche Tätigkeit" },
    ],
  },
  shaykh: {
    heading: "Die Unterrichte kennenlernen",
    description: "Entdecke die wissenschaftlichen Inhalte und Unterrichtsangebote.",
    links: [
      { to: "/durous", title: "Aufzeichnungen der Unterrichte", detail: "Aufzeichnungen und Unterrichtsreihen" },
      { to: "/artikel", title: "Islamische Fachartikel", detail: "Artikel zu islamischen Themen" },
    ],
  },
  durous: {
    heading: "Wissen weiter vertiefen",
    description: "Ergänzend zu den Unterrichten findest du schriftliche Beiträge und Informationen zum Lehrer.",
    links: [
      { to: "/artikel", title: "Artikel zum Islam", detail: "Islamische Themen schriftlich vertiefen" },
      { to: "/shaykh", title: "Wissenschaftlicher Werdegang", detail: "Biografie und wissenschaftlicher Werdegang" },
    ],
  },
  articles: {
    heading: "Weitere Lernmöglichkeiten",
    description: "Neben den Artikeln stehen auch Unterrichtsaufnahmen und Informationen zu den Unterrichten bereit.",
    links: [
      { to: "/durous", title: "Audio-Unterrichte und Reihen", detail: "Durous und Unterrichtsreihen" },
      { to: "/shaykh", title: "Biografie des Verfassers", detail: "Werdegang und Lehrtätigkeit" },
    ],
  },
  contact: {
    heading: "Weitere Bereiche der Website",
    description: "Du kannst direkt zu den veröffentlichten Inhalten oder den Unterrichtsinformationen wechseln.",
    links: [
      { to: "/artikel", title: "Islamische Veröffentlichungen", detail: "Schriftliche Veröffentlichungen" },
      { to: "/durous", title: "Unterrichtstermine und Aufnahmen", detail: "Aufnahmen und Termine" },
    ],
  },
};

function ExploreIcon({ type }) {
  if (type === 0) return <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" aria-hidden="true"><path d="m24 5 19 10-19 10L5 15 24 5Zm-19 20 19 10 19-10M5 34l19 10 19-10"/></svg>;
  if (type === 1) return <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="3.3" strokeLinecap="round" aria-hidden="true"><path d="M8 26v-4a16 16 0 0 1 32 0v4"/><rect x="4" y="23" width="9" height="17" rx="4"/><rect x="35" y="23" width="9" height="17" rx="4"/></svg>;
  return <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="24" cy="14" r="9"/><path d="M7 44v-6c0-9 7-15 17-15s17 6 17 15v6"/></svg>;
}
function Arrow() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>;
}
function ExternalIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M13 5h6v6M19 5l-9 9M19 14v5H5V5h5"/></svg>;
}

export default function ExploreContent({ page }) {
  const data = contentByPage[page];
  if (!data) return null;
  return (
    <section className={`sib-explore sib-explore--${page}`} aria-labelledby={`sib-explore-${page}`}>
      <div className="sib-explore-inner">
        <div className="sib-explore-mosque" aria-hidden="true" />
        <div className="sib-explore-heading">
          <p className="sib-explore-kicker">Weiterlernen</p>
          <h2 id={`sib-explore-${page}`}>{page === "home" ? <>Islamische Wissenschaften <span>entdecken</span></> : data.heading}</h2>
          <p className="sib-explore-intro">{data.description}</p>
        </div>
        <div className="sib-explore-grid">
          {data.links.map((link, index) => (
            <Link className={`sib-explore-card ${index === 0 ? "sib-explore-card--featured" : ""}`} to={link.to} key={link.to}>
              <span className="sib-explore-card-icon"><ExploreIcon type={index} /></span>
              <span className="sib-explore-card-text">
                <strong>{link.title}</strong>
                <span>{link.detail}</span>
              </span>
              <span className="sib-explore-card-arrow"><Arrow /></span>
            </Link>
          ))}
        </div>
        {page === "home" && (
          <div className="sib-explore-resources">
            <div className="sib-explore-resources-heading"><span className="sib-explore-resources-book"><BookIcon /></span><strong>Weiterführende Quellen:</strong></div>
            <span className="sib-explore-resources-divider" aria-hidden="true" />
            <a href="https://quran.com/" target="_blank" rel="noopener noreferrer"><BookIcon /> <span>Quran lesen</span><ExternalIcon /></a>
            <a href="https://sunnah.com/" target="_blank" rel="noopener noreferrer"><ExploreIcon type={0} /> <span>Hadith-Sammlungen nachschlagen</span><ExternalIcon /></a>
          </div>
        )}
      </div>
      {page === "home" && <svg className="sib-explore-bottom-wave" viewBox="0 0 1440 95" preserveAspectRatio="none" aria-hidden="true"><path d="M0 16C235 68 383 110 720 72S1220 25 1440 12V95H0Z" fill="#00563f"/><path d="M0 16C235 68 383 110 720 72S1220 25 1440 12" stroke="#e9b94c" strokeWidth="6" fill="none"/></svg>}
    </section>
  );
}
