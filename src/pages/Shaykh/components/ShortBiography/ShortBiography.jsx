import { useEffect, useRef } from "react";
import "./ShortBiography.css";

const biographySections = [
{
  number: "01",
  title: "Herkunft und frühe Jahre",
  paragraphs: [
    `Shaykh Sayed Ibn Basyuni wurde im Gouvernement Gharbeyya in Ägypten geboren und wuchs dort auf. Bereits im Alter von fünf Jahren begann er den Besuch eines Kuttab (Quran-Schule) in seinem Dorf, wo er das Lesen des Quran, die arabische Sprache sowie den Tadjweed erlernte und mit dem Auswendiglernen des Quran begann.`,

    `Anschließend setzte er seinen Bildungsweg an den Schulen der Al-Azhar fort. Bereits in jungen Jahren erhielt er dort eine fundierte Ausbildung im Quran, in der arabischen Sprache und in den islamischen Wissenschaften, welche den Grundstein für seinen späteren wissenschaftlichen Werdegang legte.`,
  ],
},
{
  number: "02",
  title: "Studium und wissenschaftliche Ausbildung",
  paragraphs: [
    `Im Alter von sieben Jahren begann Shaykh Sayed Ibn Basyuni seine Ausbildung an den Schulen der Al-Azhar mit dem Besuch der Grundschule, die er bis zum Alter von dreizehn Jahren absolvierte. Während dieser Zeit studierte er den Quran, die arabische Sprache, die Biographie des Propheten sowie die islamische Ethik. Bereits im Alter von elf Jahren vollendete er das vollständige Auswendiglernen des edlen Quran (Hifdh al Quran) und erhielt den Titel Hafidh al Quran.`,

    `Im Alter von dreizehn Jahren wechselte er an die Mittelschule der Al-Azhar, die er bis zum Alter von sechzehn Jahren besuchte. Dort vertiefte er seine Kenntnisse im Quran, im Tadjweed, im Fiqh, im Hadith, im Tafsir sowie in der islamischen Geschichte.`,

    `Im Alter von sechzehn Jahren begann er die Oberschule der Al-Azhar (Thanawiyyah Al-Azhariyyah), die er nach vier Jahren im Alter von zwanzig Jahren erfolgreich abschloss. In dieser Ausbildungsphase widmete er sich intensiv dem Quran, dem Fiqh nach den vier Rechtsschulen, dem Hadith, dem Tafsir sowie der islamischen Geschichte. Darüber hinaus studierte er die klassischen Disziplinen der arabischen Sprache, darunter Nahw (Grammatik), Sarf (Morphologie), Balaghah (Rhetorik), arabische Literatur, Arud (Metrik) sowie Mantiq (Logik).`,

    `Im Alter von zwanzig Jahren begann Shaykh Sayed Ibn Basyuni sein vierjähriges Bachelorstudium an der Hochschule für Sprachen und Übersetzung der Al-Azhar-Universität im Fachbereich Germanistik und Islamwissenschaft. Während seines Studiums beschäftigte er sich unter anderem mit den Bedeutungen des Quran, den Quran-Wissenschaften, den Hadith-Wissenschaften, den Tafsir-Wissenschaften, der Aqidah, dem vergleichenden Fiqh, Usul al Fiqh nach den vier Rechtsschulen, der Geschichte der islamischen Gesetzgebung, der islamischen Geschichte, der islamischen Kultur, islamischen Gruppierungen und gedanklichen Strömungen, der Widerlegung der Scheinargumente der Orientalisten, dem Fiqh muslimischer Minderheiten in nichtislamischen Ländern, den Quran-Lesarten (Qiraat), den Methoden der Dawah, der Predigtwissenschaft sowie dem islamischen Strafrecht. Parallel dazu vertiefte er seine Kenntnisse der deutschen Sprache und der Übersetzungswissenschaft.`,

    `Nach dem erfolgreichen Abschluss des Bachelorstudiums setzte er seine wissenschaftliche Laufbahn mit einem zweijährigen postgradualen Masterstudium fort, das der Vertiefung seiner wissenschaftlichen Kenntnisse sowie der Vorbereitung auf seine erste Promotion diente. Während dieser Zeit spezialisierte er sich insbesondere auf die wissenschaftliche Forschungsmethodik, die analytische Arbeit mit klassischen islamischen Quellen sowie die vertiefte Auseinandersetzung mit den islamischen Wissenschaften.`,

    `Im Anschluss daran begann Shaykh Sayed Ibn Basyuni seine erste Promotion, die er nach sechs Jahren erfolgreich abschloss. Seine Dissertation trug den Titel „Die Jihad-Verse des Quran und die Jihad-Hadithe sowie ihre historische Einordnung anhand der Aussagen der Gelehrten. Eine analytisch-kritische Studie.“ Mit dem erfolgreichen Abschluss dieser Forschungsarbeit erlangte er den Doktorgrad.`,

    `Nach dem Erwerb seines Doktortitels nahm Shaykh Sayed Ibn Basyuni eine zweite Promotion auf. Derzeit arbeitet er an seiner zweiten Dissertation mit dem Titel „Die Werke von Shaykh al Islam Ibn Taymiyyah und ihre Rezeption bei den verschiedenen islamischen Gruppierungen. Eine analytisch-kritische Studie.“ Die Schwerpunkte seiner wissenschaftlichen Forschung liegen insbesondere im Fiqh nach den vier Rechtsschulen, in der Aqidah sowie in der wissenschaftlichen Untersuchung islamischer gedanklicher Strömungen.`,
  ],
},
 {
  number: "03",
  title: "Lehrer und wissenschaftliche Prägung",
  paragraphs: [
    `Im Verlauf seines Talab al Ilm studierte Shaykh Sayed Ibn Basyuni bei einer Vielzahl von Gelehrten der Ahl as Sunnah wal Jamaah. Seine wissenschaftliche Ausbildung wurde sowohl durch den direkten Unterricht bei Gelehrten als auch durch das intensive Studium der klassischen Werke der Gelehrten der Salaf und ihrer Nachfolger geprägt. Von besonderer Bedeutung war dabei die Verbindung zwischen theoretischem Wissen, methodischer Forschung und der praktischen Vermittlung der islamischen Wissenschaften.`,

    `Zu seinen bekanntesten Lehrern gehören unter anderem Shaykh Mustafa al Adawi und Shaykh Abu Ishaq al Huwayni, bei denen er von ihrem Wissen und ihrer Methodik profitierte. Darüber hinaus studierte er zahlreiche klassische Werke der Gelehrten der Ahl as Sunnah in den Bereichen Aqidah, Fiqh, Hadith, Tafsir, Usul al Fiqh, Mustalah al Hadith sowie den arabischen Sprachwissenschaften. Diese wissenschaftliche Prägung bildet bis heute die Grundlage seines Unterrichts, seiner Forschung und seiner schriftlichen Arbeiten.`,
  ],
},
 {
  number: "04",
  title: "Unterricht, Forschung und heutiges Wirken",
  paragraphs: [
    `Shaykh Sayed Ibn Basyuni widmet sich dem Unterrichten, der wissenschaftlichen Forschung sowie der Vermittlung der islamischen Wissenschaften. Zu seinen Unterrichtsschwerpunkten gehören unter anderem Aqidah, Fiqh nach den vier Rechtsschulen, Quran und seine Wissenschaften, Hadith und Hadith-Wissenschaften, Tafsir, Usul al Fiqh, Mustalah al Hadith, Nahw, Sarf, Balaghah, Tadjweed sowie weitere Disziplinen der islamischen und arabischen Wissenschaften.`,

    `Shaykh Sayed Ibn Basyuni ist Imam und Khatib der Al Huda Moschee in Kassel. Neben seiner Tätigkeit als Imam unterrichtet er regelmäßig Studenten des islamischen Wissens, hält Vorträge, leitet Unterrichtsreihen und beantwortet Fragen in verschiedenen Bereichen der islamischen Wissenschaften. Darüber hinaus beschäftigt er sich mit der wissenschaftlichen Ausarbeitung von Unterrichtsinhalten sowie der Ausbildung von Studenten des islamischen Wissens.`,

    `Zu seinen wissenschaftlichen Forschungsschwerpunkten gehören insbesondere das Fiqh nach den vier Rechtsschulen, die Aqidah, die islamischen gedanklichen Strömungen, die Hadith-Wissenschaften sowie die analytische Untersuchung klassischer Werke und historischer Fragestellungen. Neben seiner Lehr- und Forschungstätigkeit veröffentlicht er regelmäßig Vorträge, Durous und wissenschaftliche Beiträge, um authentisches islamisches Wissen auf Grundlage des Quran, der authentischen Sunnah und des Verständnisses der Salaf as Salih zu vermitteln.`,
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
             Diese Biografie wurde von einem Schüler von Shaykh Sayed Ibn Basyuni auf Grundlage seiner wissenschaftlichen Laufbahn und seines Lebensweges verfasst. Sämtliche aufgeführten Angaben wurden dem Shaykh vorgelegt und von ihm geprüft sowie bestätigt.
            </p>
          </footer>
        </article>
      </div>
    </section>
  );
}

export default ShortBiography;