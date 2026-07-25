import { useEffect, useRef } from "react";
import "./ShortBiography.css";

const biographySections = [
  {
    number: "01",
    title: "Herkunft und frühe Jahre",
    paragraphs: [
      `Shaykh Sayed Ibn Basyuni wurde in [Geburtsort] in Ägypten geboren und wuchs dort in [weitere Angaben zur Herkunft ergänzen] auf.`,

      `Bereits in seinen frühen Jahren begann er mit [erste Schritte des wissenschaftlichen Weges ergänzen]. In dieser Zeit beschäftigte er sich insbesondere mit [erste Studiengebiete oder prägende Erfahrungen ergänzen].`,
    ],
  },
  {
    number: "02",
    title: "Studium und wissenschaftliche Ausbildung",
    paragraphs: [
      `Sein wissenschaftliches Studium führte er an der Al-Azhar-Universität, an der er [Studiengang, Fakultät oder Fachbereich ergänzen] durch.`,

      `Während seines Studiums spezialisierte er sich auf [Studiengebiete ergänzen]. [Weitere Angaben zu seinen Abschlüssen, wissenschaftlichen Arbeiten und Stationen werden an dieser Stelle später ergänzt.]`,
    ],
  },
  {
    number: "03",
    title: "Lehrer und wissenschaftliche Prägung",
    paragraphs: [
      `Im Verlauf seines Talab al-'Ilm lernte Shaykh Sayed Ibn Basyuni bei verschiedenen Gelehrten.`,

      `Zu seinen Lehrern gehören unter anderem Shaykh Mustafa al-Adawi und Shaykh Abu Ishaq al-Huwayni sowie [weitere Lehrer ergänzen]. Von ihnen profitierte er insbesondere in den Bereichen [Fachgebiete ergänzen].`,
    ],
  },
  {
    number: "04",
    title: "Unterricht, Forschung und heutiges Wirken",
    paragraphs: [
      `Shaykh Sayed Ibn Basyuni unterrichtet verschiedene islamische Wissenschaften. Dazu gehören unter anderem Aqidah, Fiqh, Quran, Mustalah al-Hadith, Nahw, Sarf und Tajwid.`,

      `Neben seiner Tätigkeit als Lehrer wirkt er als Imam und Khatib. Ein wesentlicher Teil seiner Arbeit besteht außerdem in der wissenschaftlichen Forschung und der Vorbereitung islamischer Unterrichtsinhalte.`,

      `Seine genaue wissenschaftliche Spezialisierung, sein aktueller Wirkungsort und weitere Tätigkeiten werden ergänzt.`,
    ],
  },
];

function ShortBiography() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        section.classList.add(
          "sib-short-biography-visible",
        );

        observer.unobserve(section);
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -70px 0px",
      },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="sib-short-biography"
      id="kurzbiografie"
    >
      <div
        className="sib-short-biography-decoration"
        aria-hidden="true"
      >
        <span className="sib-short-biography-decoration-circle sib-short-biography-decoration-circle-one"></span>

        <span className="sib-short-biography-decoration-circle sib-short-biography-decoration-circle-two"></span>

        <span className="sib-short-biography-decoration-line sib-short-biography-decoration-line-one"></span>

        <span className="sib-short-biography-decoration-line sib-short-biography-decoration-line-two"></span>

        <span className="sib-short-biography-decoration-dot sib-short-biography-decoration-dot-one"></span>

        <span className="sib-short-biography-decoration-dot sib-short-biography-decoration-dot-two"></span>
      </div>

      <div className="sib-short-biography-container">
        <header className="sib-short-biography-header">
          <div className="sib-short-biography-header-top">
            <div className="sib-short-biography-label-row">
              <span
                className="sib-short-biography-label-line"
                aria-hidden="true"
              ></span>

              <p className="sib-short-biography-label">
                Kurzbiografie
              </p>
            </div>

            <span className="sib-short-biography-header-number">
              01
            </span>
          </div>

          <h2 className="sib-short-biography-title">
            Biografie und
            <span>wissenschaftlicher Werdegang.</span>
          </h2>

          <p className="sib-short-biography-header-description">
            Eine zusammenfassende Darstellung der Herkunft,
            Ausbildung, Lehrer und heutigen Tätigkeiten von
            Shaykh Sayed Ibn Basyuni.
          </p>
        </header>

        <article className="sib-short-biography-article">
          <div className="sib-short-biography-lead">
            <span
              className="sib-short-biography-lead-mark"
              aria-hidden="true"
            ></span>

            <p>
              Shaykh Sayed Ibn Basyuni stammt aus Ägypten und
              widmet sich dem Studium, dem Unterricht und der
              Vermittlung islamischer Wissenschaften.
            </p>
          </div>

          <div className="sib-short-biography-chapters">
            {biographySections.map((chapter, index) => (
              <section
                key={chapter.number}
                className="sib-short-biography-chapter"
                style={{
                  "--sib-biography-chapter-index": index,
                }}
              >
                <header className="sib-short-biography-chapter-header">
                  <span className="sib-short-biography-chapter-number">
                    {chapter.number}
                  </span>

                  <div className="sib-short-biography-chapter-heading">
                    <span
                      className="sib-short-biography-chapter-line"
                      aria-hidden="true"
                    ></span>

                    <h3>{chapter.title}</h3>
                  </div>
                </header>

                <div className="sib-short-biography-chapter-text">
                  {chapter.paragraphs.map(
                    (paragraph, paragraphIndex) => (
                      <p key={paragraphIndex}>
                        {paragraph}
                      </p>
                    ),
                  )}
                </div>
              </section>
            ))}
          </div>

          <footer className="sib-short-biography-footer">
            <div className="sib-short-biography-footer-heading">
              <span
                className="sib-short-biography-footer-dot"
                aria-hidden="true"
              ></span>

              <p>Hinweis zur Biografie</p>
            </div>

            <p className="sib-short-biography-footer-text">
              Die hier aufgeführten Angaben sind vorläufig. Die
              vollständige Biografie wird nach Prüfung und
              Bestätigung der einzelnen Informationen ergänzt.
            </p>
          </footer>
        </article>
      </div>
    </section>
  );
}

export default ShortBiography;