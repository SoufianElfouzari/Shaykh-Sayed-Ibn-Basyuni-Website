import { Link } from "react-router-dom";
import "./AboutShaykh.css";

const overviewItems = [
  {
    label: "Sprachen",
    value: "Arabisch (Muttersprache) und Deutsch.",
    icon: "language",
  },
  {
    label: "Tätigkeiten",
    value: "Imam, Khatib, Lehrer, Forscher und Autor wissenschaftlicher Arbeiten.",
    icon: "work",
  },
  {
    label: "Studium",
    value: "Studium an der Al-Azhar-Universität.",
    icon: "study",
  },
  {
    label: "Wirkungsort",
    value: "Imam der Al Huda Moschee des Islamischen Zentrums Kassel.",
    icon: "mosque",
  },
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 12h16m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 6.5C9.3 4.7 6.5 4.5 3 5v13c3.5-.5 6.3-.3 9 1.5C14.7 17.7 17.5 17.5 21 18V5c-3.5-.5-6.3-.3-9 1.5Zm0 0v13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InfoIcon({ name }) {
  const icons = {
    language: (
      <>
        <rect x="2" y="3" width="13" height="14" rx="2" />
        <path d="M5 8h7M8.5 5v2m-3 6c3-1 5-3 6-5m-6 0c1 3 3 5 6 6" />
        <rect x="11" y="11" width="11" height="10" rx="2" />
        <path d="m14 18 2.5-5 2.5 5m-4.1-1.5h3.2" />
      </>
    ),
    work: (
      <>
        <rect x="3" y="7" width="18" height="14" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13c5 3 13 3 18 0m-9 0v3" />
      </>
    ),
    study: (
      <>
        <path d="m2 9 10-5 10 5-10 5L2 9Zm4 3v5c4 3 8 3 12 0v-5m4-3v8" />
      </>
    ),
    mosque: (
      <>
        <path d="M3 21V11l4-3 5-5 5 5 4 3v10H3Zm5 0v-6a4 4 0 0 1 8 0v6M2 21h20" />
        <path d="M12 3V1m-1 1h2" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {icons[name]}
    </svg>
  );
}

function AboutShaykh() {
  return (
    <section className="sib-about" aria-labelledby="sib-about-title">
      <div className="sib-about-decoration" aria-hidden="true" />
      <div className="sib-about-mosque" aria-hidden="true" />
      <div className="sib-about-container">
        <div className="sib-about-heading">
          <p className="sib-about-label">
            <span>Über den Shaykh</span>

          </p>

          <h2 className="sib-about-title" id="sib-about-title">
            Lerne deinen{" "}
            <span>Lehrer kennen.</span>
          </h2>

          <div className="sib-about-title-underline" aria-hidden="true" />

          <figure className="sib-about-brand">
            <img
              src="/ShaykhSayedLogo.png"
              alt="Offizielles Logo von Shaykh Sayed Ibn Basyuni"
              width="112"
              height="112"
              loading="lazy"
              decoding="async"
              className="sib-about-brand-image"
            />
            <figcaption>
              Offizielle Website des Lehrers
              <span className="sib-about-name">Dr. Shaykh Sayed Ibn Basyuni</span>
            </figcaption>
          </figure>

          <Link to="/shaykh" className="sib-about-link">
            <span>Ausführliche Biografie lesen</span>
            <ArrowIcon />
          </Link>
        </div>

        <div className="sib-about-content">
          <div className="sib-about-description">
            <p>
              <span className="sib-about-name">Dr. Shaykh Sayed Ibn Basyuni</span> stammt aus dem
              Gouvernement Gharbeyya in Ägypten. Bereits im Alter von fünf
              Jahren begann er den Besuch eines Kuttab und vollendete im
              Alter von elf Jahren das vollständige Auswendiglernen des
              edlen Quran. Anschließend durchlief er die schulische
              Ausbildung an den Schulen der Al-Azhar sowie das Studium
              an der Al-Azhar-Universität.
            </p>

            <p>
              Während seines Talab al-Ilm studierte er bei zahlreichen
              Gelehrten der Ahl as-Sunnah wal Jamaah, darunter Shaykh
              Mustafa al-Adawi und Shaykh Abu Ishaq al-Huwayni. Seine
              wissenschaftlichen Schwerpunkte liegen insbesondere im
              Fiqh nach den vier Rechtsschulen, der Aqidah sowie der
              wissenschaftlichen Untersuchung islamischer gedanklicher
              Strömungen. Neben seiner Tätigkeit als Imam und Khatib
              widmet er sich der Lehre, der wissenschaftlichen Forschung
              und der Ausbildung von Studenten des islamischen Wissens.
            </p>
          </div>

          <div className="sib-about-overview">
            {overviewItems.map((item) => (
              <div key={item.label} className="sib-about-overview-item">
                <span className="sib-about-overview-icon">
                  <InfoIcon name={item.icon} />
                </span>
                <div>
                  <h3 className="sib-about-overview-label">{item.label}</h3>
                  <p className="sib-about-overview-value">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="sib-about-location-note">
            Aufgrund von Bauarbeiten finden die Unterrichte derzeit in der
            ad Da&apos;wah Moschee in Kassel statt.
          </p>
        </div>
      </div>
      <div className="sib-about-bottom-wave" aria-hidden="true" />
    </section>
  );
}

export default AboutShaykh;
