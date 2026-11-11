import { Link } from "react-router-dom";
import "./ExploreContent.css";

const contentByPage = {
  home: {
    heading: "Islamische Wissenschaften entdecken",
    description: "Vertiefe dein Wissen mit Artikeln, Unterrichtsaufnahmen und Informationen über den Lehrer.",
    links: [
      { to: "/artikel", title: "Islamische Artikel lesen", detail: "Wissenschaftliche Beiträge auf Deutsch" },
      { to: "/durous", title: "Durous anhören", detail: "Unterrichtsaufnahmen und Reihen" },
      { to: "/shaykh", title: "Werdegang des Lehrers", detail: "Ausbildung und wissenschaftliche Tätigkeit" },
    ],
  },
  shaykh: {
    heading: "Die Unterrichte kennenlernen",
    description: "Entdecke die wissenschaftlichen Inhalte und Unterrichtsangebote.",
    links: [
      { to: "/durous", title: "Unterrichtsarchiv öffnen", detail: "Aufzeichnungen und Unterrichtsreihen" },
      { to: "/artikel", title: "Veröffentlichte Beiträge", detail: "Artikel zu islamischen Themen" },
    ],
  },
  durous: {
    heading: "Wissen weiter vertiefen",
    description: "Ergänzend zu den Unterrichten findest du schriftliche Beiträge und Informationen zum Lehrer.",
    links: [
      { to: "/artikel", title: "Begleitende Artikel", detail: "Islamische Themen schriftlich vertiefen" },
      { to: "/shaykh", title: "Den Lehrer kennenlernen", detail: "Biografie und wissenschaftlicher Werdegang" },
    ],
  },
  articles: {
    heading: "Weitere Lernmöglichkeiten",
    description: "Neben den Artikeln stehen auch Unterrichtsaufnahmen und Informationen zu den Unterrichten bereit.",
    links: [
      { to: "/durous", title: "Audio-Unterrichte entdecken", detail: "Durous und Unterrichtsreihen" },
      { to: "/shaykh", title: "Über den Verfasser", detail: "Werdegang und Lehrtätigkeit" },
    ],
  },
  contact: {
    heading: "Weitere Bereiche der Website",
    description: "Du kannst direkt zu den veröffentlichten Inhalten oder den Unterrichtsinformationen wechseln.",
    links: [
      { to: "/artikel", title: "Artikelverzeichnis", detail: "Schriftliche Veröffentlichungen" },
      { to: "/durous", title: "Unterrichtsinformationen", detail: "Aufnahmen und Termine" },
    ],
  },
};

export default function ExploreContent({ page }) {
  const data = contentByPage[page];
  if (!data) return null;
  return (
    <section className="sib-explore" aria-labelledby={"sib-explore-" + page}>
      <div className="sib-explore-inner">
        <p className="sib-explore-kicker">Weiterlernen</p>
        <h2 id={"sib-explore-" + page}>{data.heading}</h2>
        <p className="sib-explore-intro">{data.description}</p>
        <div className="sib-explore-grid">
          {data.links.map((link) => (
            <Link className="sib-explore-card" to={link.to} key={link.to}>
              <span className="sib-explore-card-text">
                <strong>{link.title}</strong>
                <span>{link.detail}</span>
              </span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>
            </Link>
          ))}
        </div>
        {page === "home" && (
          <p className="sib-explore-resources">
            Weiterführende Quellen:
            {" "}<a href="https://quran.com/" target="_blank" rel="noopener noreferrer">Quran lesen</a>
            {" "}und{" "}
            <a href="https://sunnah.com/" target="_blank" rel="noopener noreferrer">Hadith-Sammlungen nachschlagen</a>.
          </p>
        )}
      </div>
    </section>
  );
}
