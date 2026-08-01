import { Link } from "react-router-dom";
import "./AboutShaykh.css";
const overviewItems = [
  {
    label: "Sprachen",
    value:
      "Arabisch (Muttersprache) und Deutsch.",
  },
  {
    label: "Tätigkeiten",
    value:
      "Imam, Khatib, Lehrer, Forscher und Autor wissenschaftlicher Arbeiten.",
  },
  {
    label: "Wirkungsort",
    value:
      "Imam der Al Huda Moschee des Islamischen Zentrums Kassel. Aufgrund von Bauarbeiten finden die Unterrichte derzeit in der ad Da'wah Moschee in Kassel statt.",
  },
];

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M5 12H19"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <path
        d="M15 8L19 12L15 16"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AboutShaykh() {
  return (
    <section className="sib-about">
      <div className="sib-about-container">
        <div className="sib-about-heading">
          <p className="sib-about-label">
            Über den Shaykh
          </p>

          <h2 className="sib-about-title">
            Ein kurzer Einblick in seinen wissenschaftlichen
            Werdegang und seine Tätigkeit.
          </h2>
        </div>

        <div className="sib-about-content">
          <div className="sib-about-description">
  <p>
    Dr. Shaykh Sayed Ibn Basyuni stammt aus dem Gouvernement
    Gharbeyya in Ägypten. Bereits im Alter von fünf Jahren
    begann er den Besuch eines Kuttab und vollendete im Alter
    von elf Jahren das vollständige Auswendiglernen des edlen
    Quran. Anschließend durchlief er die schulische Ausbildung
    an den Schulen der Al-Azhar sowie das Studium an der
    Al-Azhar-Universität.
  </p>

  <p>
    Während seines Talab al Ilm studierte er bei zahlreichen
    Gelehrten der Ahl as Sunnah wal Jamaah, darunter Shaykh
    Mustafa al Adawi und Shaykh Abu Ishaq al Huwayni. Seine
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
              <div
                key={item.label}
                className="sib-about-overview-item"
              >
                <span className="sib-about-overview-label">
                  {item.label}
                </span>

                <p className="sib-about-overview-value">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <Link
            to="/shaykh"
            className="sib-about-link"
          >
            <span>Mehr über den Shaykh erfahren</span>
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default AboutShaykh;