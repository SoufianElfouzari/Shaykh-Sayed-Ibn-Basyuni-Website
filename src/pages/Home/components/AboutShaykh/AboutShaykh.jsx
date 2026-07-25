import { Link } from "react-router-dom";
import "./AboutShaykh.css";

const overviewItems = [
  {
    label: "Sprachen",
    value:
      "Der Shaykh spricht und arbeitet sowohl in deutscher als auch in arabischer Sprache.",
  },
  {
    label: "Aufgaben",
    value:
      "Er ist als Imam und Khatib tätig und widmet sich hauptsächlich der wissenschaftlichen Forschung.",
  },
  {
    label: "Wirkungsort",
    value:
      "Der Shaykh ist derzeit am Islamischen Zentrum Kassel, der Al-Huda Moschee, tätig. Aufgrund von Bauarbeiten finden seine Unterrichte und seine Anwesenheit derzeit jedoch in der ad-Da'wah Moschee in Kassel statt.",
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
              Unser ehrenwerter Shaykh Sayed Ibn Basyuni stammt
              aus Ägypten und studierte an der
              Al-Azhar-Universität. Während seines
              wissenschaftlichen Werdegangs lernte er bei
              zahlreichen Gelehrten, darunter Shaykh Mustafa
              al-Adawi und Shaykh Abu Ishaq al-Huwayni sowie
              [weitere Lehrer].
            </p>

            <p>
              Sein wissenschaftlicher Schwerpunkt liegt im
              Bereich [Spezialisierung]. Seine Arbeit ist durch
              das Studium der islamischen Quellen, die
              wissenschaftliche Forschung und die Vermittlung
              fundierten Wissens geprägt.
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