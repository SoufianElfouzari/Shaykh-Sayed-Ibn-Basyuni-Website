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
    icon: "layers",
  },
  {
    label: "Studium",
    value: "Studium an der Al-Azhar-Universität.",
    icon: "study",
  },
  {
    label: "Wirkungsort",
    value: "Imam der Al Huda Moschee des Islamischen Zentrums Kassel.",
    icon: "location",
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
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c-3 3-3 15 0 18m0-18c3 3 3 15 0 18M5 7.5h14M5 16.5h14" />
      </>
    ),
    layers: (
      <>
        <path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5" />
      </>
    ),
    study: (
      <>
        <path d="m2 9 10-5 10 5-10 5L2 9Zm4 3v5c4 3 8 3 12 0v-5m4-3v8" />
      </>
    ),
    location: (
      <>
        <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
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
      <div className="sib-about-container">
        <div className="sib-about-heading">
          <p className="sib-about-label">
            <span>Über den Shaykh</span>
            <span className="sib-about-label-line" aria-hidden="true" />
          </p>

          <h2 className="sib-about-title" id="sib-about-title">
            Ein kurzer Einblick in seinen wissenschaftlichen{" "}
            <span>Werdegang und seine Tätigkeit.</span>
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
              <strong>Dr. Shaykh Sayed Ibn Basyuni</strong>
            </figcaption>
          </figure>

          <Link to="/shaykh" className="sib-about-link">
            <BookIcon />
            <span>Ausführliche Biografie lesen</span>
            <ArrowIcon />
          </Link>
        </div>

        <div className="sib-about-content">
          <div className="sib-about-description">
            <p>
              <strong>Dr. Shaykh Sayed Ibn Basyuni</strong> stammt aus dem
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
