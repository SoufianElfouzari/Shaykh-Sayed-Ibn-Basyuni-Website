import Footer from "../common/Footer/Footer";
import "./Impressum.css";

const ExternalLinkIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M14 5h5v5" />
    <path d="M10 14 19 5" />
    <path d="M19 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h4" />
  </svg>
);

const MailIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m4 7 8 6 8-6" />
  </svg>
);

const LocationIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

const PersonIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </svg>
);

const ContentIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M6 3h9l4 4v14H6V3Z" />
    <path d="M14 3v5h5" />
    <path d="M9 13h6" />
    <path d="M9 17h6" />
  </svg>
);

const ServerIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <rect x="3" y="4" width="18" height="6" rx="2" />
    <rect x="3" y="14" width="18" height="6" rx="2" />
    <path d="M7 7h.01" />
    <path d="M7 17h.01" />
  </svg>
);

const sections = [
  {
    id: "anbieter",
    number: "01",
    title: "Diensteanbieter",
  },
  {
    id: "kontakt",
    number: "02",
    title: "Kontakt",
  },
  {
    id: "inhaltlich-verantwortlich",
    number: "03",
    title: "Inhaltlich verantwortlich",
  },
  {
    id: "hosting",
    number: "04",
    title: "Hosting und Domain",
  },
  {
    id: "haftung-inhalte",
    number: "05",
    title: "Haftung für Inhalte",
  },
  {
    id: "haftung-links",
    number: "06",
    title: "Haftung für Links",
  },
  {
    id: "urheberrecht",
    number: "07",
    title: "Urheberrecht",
  },
  {
    id: "streitbeilegung",
    number: "08",
    title: "Streitbeilegung",
  },
];

function Impressum() {
  return (
    <main className="impressum-page">
      <section className="impressum-hero">
        <div className="impressum-hero-decoration" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <div className="impressum-container impressum-hero-inner">
          <nav className="impressum-breadcrumb" aria-label="Brotkrümelnavigation">
            <a href="/">Startseite</a>
            <span aria-hidden="true">/</span>
            <span>Impressum</span>
          </nav>

          <div className="impressum-hero-grid">
            <div className="impressum-hero-content">
              <span className="impressum-eyebrow">
                Rechtliche Informationen
              </span>

              <h1>Impressum</h1>

              <p>
                Angaben zur verantwortlichen Person und zu den rechtlichen
                Rahmenbedingungen dieser Website.
              </p>
            </div>

            <div className="impressum-hero-status">
              <span>Betreiber</span>
              <strong>Soufian El-Fouzari</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="impressum-main">
        <div className="impressum-container impressum-layout">
          <aside className="impressum-sidebar">
            <div className="impressum-sidebar-inner">
              <span className="impressum-sidebar-heading">
                Auf dieser Seite
              </span>

              <nav aria-label="Inhaltsverzeichnis Impressum">
                {sections.map((section) => (
                  <a key={section.id} href={`#${section.id}`}>
                    <span>{section.number}</span>
                    <strong>{section.title}</strong>
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <div className="impressum-content">
            <section
              className="impressum-section impressum-section-primary"
              id="anbieter"
            >
              <header className="impressum-section-header">
                <span className="impressum-section-number">01</span>

                <div>
                  <span className="impressum-section-kicker">
                    Angaben gemäß § 5 DDG
                  </span>
                  <h2>Diensteanbieter</h2>
                </div>
              </header>

              <div className="impressum-section-body">
                <div className="impressum-person-card">
                  <div className="impressum-card-icon">
                    <PersonIcon />
                  </div>

                  <div>
                    <span className="impressum-card-label">
                      Verantwortlicher Betreiber
                    </span>
                    <strong>Soufian El-Fouzari</strong>
                  </div>
                </div>

                <div className="impressum-information-grid">
                  <div className="impressum-information-card">
                    <span className="impressum-information-icon">
                      <LocationIcon />
                    </span>

                    <div>
                      <span className="impressum-information-label">
                        Anschrift
                      </span>

                      <address>
                        Soufian El-Fouzari
                        <br />
                        Rauchstraße 1
                        <br />
                        34125 Kassel
                        <br />
                        Deutschland
                      </address>
                    </div>
                  </div>

                  <div className="impressum-information-card">
                    <span className="impressum-information-icon">
                      <MailIcon />
                    </span>

                    <div>
                      <span className="impressum-information-label">
                        E-Mail
                      </span>

                      <a href="mailto:elfouzari.soufian@gmail.com">
                        elfouzari.soufian@gmail.com
                      </a>
                    </div>
                  </div>
                </div>

                <p>
                  Betreiber und technischer Verantwortlicher dieser Website ist
                  Soufian El-Fouzari.
                </p>
              </div>
            </section>

            <section className="impressum-section" id="kontakt">
              <header className="impressum-section-header">
                <span className="impressum-section-number">02</span>

                <div>
                  <span className="impressum-section-kicker">
                    Direkte Kommunikation
                  </span>
                  <h2>Kontakt</h2>
                </div>
              </header>

              <div className="impressum-section-body">
                <p>
                  Für technische, organisatorische und allgemeine Anfragen zur
                  Website erreichen Sie den Betreiber unter:
                </p>

                <a
                  className="impressum-contact-link"
                  href="mailto:elfouzari.soufian@gmail.com"
                >
                  <span>
                    <MailIcon />
                  </span>

                  <div>
                    <small>E-Mail an den Betreiber</small>
                    <strong>elfouzari.soufian@gmail.com</strong>
                  </div>
                </a>

                <p>
                  Für religiöse und inhaltliche Anfragen an den Shaykh kann
                  folgende E-Mail-Adresse verwendet werden:
                </p>

                <a
                  className="impressum-contact-link"
                  href="mailto:elsayed.barakaat@gmail.com"
                >
                  <span>
                    <MailIcon />
                  </span>

                  <div>
                    <small>Religiöse und inhaltliche Anfragen</small>
                    <strong>elsayed.barakaat@gmail.com</strong>
                  </div>
                </a>
              </div>
            </section>

            <section
              className="impressum-section"
              id="inhaltlich-verantwortlich"
            >
              <header className="impressum-section-header">
                <span className="impressum-section-number">03</span>

                <div>
                  <span className="impressum-section-kicker">
                    Redaktionelle Verantwortung
                  </span>
                  <h2>Inhaltlich verantwortlich</h2>
                </div>
              </header>

              <div className="impressum-section-body">
            

                <div className="impressum-editorial-card">
                  <span className="impressum-editorial-icon">
                    <ContentIcon />
                  </span>

                  <div>
                    <span className="impressum-card-label">
                      Verantwortlich für religiöse Inhalte und Artikel
                    </span>

                    <strong>
                      Shaykh Sayed Ibn Basyuni
                    </strong>

                    <a href="mailto:elsayed.barakaat@gmail.com">
                      elsayed.barakaat@gmail.com
                    </a>
                  </div>
                </div>

                <p>
                  Die technische Bereitstellung, Gestaltung und Verwaltung der
                  Website erfolgt durch Soufian El-Fouzari. Die religiösen
                  Inhalte und Artikel werden inhaltlich vom oben genannten
                  Verantwortlichen verantwortet.
                </p>
              </div>
            </section>

            <section className="impressum-section" id="hosting">
              <header className="impressum-section-header">
                <span className="impressum-section-number">04</span>

                <div>
                  <span className="impressum-section-kicker">
                    Technische Infrastruktur
                  </span>
                  <h2>Hosting und Domain</h2>
                </div>
              </header>

              <div className="impressum-section-body">
                <div className="impressum-provider-grid">
                  <article className="impressum-provider-card">
                    <span className="impressum-provider-icon">
                      <ServerIcon />
                    </span>

                    <div>
                      <span className="impressum-card-label">
                        Hosting-Anbieter
                      </span>

                      <strong>Vercel Inc.</strong>

                      <address>
                        440 N Barranca Avenue
                        <br />
                        Suite 4133
                        <br />
                        Covina, CA 91723
                        <br />
                        USA
                      </address>

                      <a
                        href="https://vercel.com/legal/privacy-policy"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Vercel öffnen
                        <ExternalLinkIcon />
                      </a>
                    </div>
                  </article>

                  <article className="impressum-provider-card">
                    <span className="impressum-provider-icon">
                      <ServerIcon />
                    </span>

                    <div>
                      <span className="impressum-card-label">
                        Domainverwaltung
                      </span>

                      <strong>STRATO AG</strong>

                      <address>
                        Otto-Ostrowski-Straße 7
                        <br />
                        10249 Berlin
                        <br />
                        Deutschland
                      </address>

                      <a
                        href="https://www.strato.de/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        STRATO öffnen
                        <ExternalLinkIcon />
                      </a>
                    </div>
                  </article>
                </div>

                <p>
                  Die Domain wird von Soufian El-Fouzari über die STRATO AG
                  verwaltet. Die Website wird technisch über Vercel
                  bereitgestellt.
                </p>
              </div>
            </section>

            <section className="impressum-section" id="haftung-inhalte">
              <header className="impressum-section-header">
                <span className="impressum-section-number">05</span>

                <div>
                  <span className="impressum-section-kicker">
                    Rechtliche Hinweise
                  </span>
                  <h2>Haftung für Inhalte</h2>
                </div>
              </header>

              <div className="impressum-section-body">
                <p>
                  Als Diensteanbieter sind wir für eigene Inhalte auf diesen
                  Seiten nach den allgemeinen Gesetzen verantwortlich.
                </p>

                <p>
                  Die auf dieser Website bereitgestellten religiösen,
                  wissenschaftlichen und allgemeinen Inhalte wurden mit
                  größtmöglicher Sorgfalt erstellt. Eine Gewähr für die
                  Richtigkeit, Vollständigkeit und Aktualität aller Inhalte kann
                  dennoch nicht übernommen werden.
                </p>

                <p>
                  Die bereitgestellten Inhalte dienen der allgemeinen
                  Information und religiösen Bildung. Sie ersetzen keine
                  individuelle rechtliche, medizinische, steuerliche oder
                  sonstige fachliche Beratung.
                </p>

                <p>
                  Bei Bekanntwerden konkreter Rechtsverletzungen werden
                  betroffene Inhalte geprüft und, soweit erforderlich,
                  unverzüglich entfernt oder korrigiert.
                </p>
              </div>
            </section>

            <section className="impressum-section" id="haftung-links">
              <header className="impressum-section-header">
                <span className="impressum-section-number">06</span>

                <div>
                  <span className="impressum-section-kicker">
                    Externe Angebote
                  </span>
                  <h2>Haftung für externe Links</h2>
                </div>
              </header>

              <div className="impressum-section-body">
                <p>
                  Diese Website kann Links zu externen Websites Dritter
                  enthalten. Auf deren Inhalte haben wir keinen unmittelbaren
                  Einfluss. Für die Inhalte der verlinkten Seiten ist stets der
                  jeweilige Anbieter oder Betreiber verantwortlich.
                </p>

                <p>
                  Verlinkte Seiten werden zum Zeitpunkt der Verlinkung auf
                  erkennbare Rechtsverstöße überprüft. Eine dauerhafte
                  inhaltliche Kontrolle externer Seiten ist ohne konkrete
                  Anhaltspunkte für eine Rechtsverletzung nicht zumutbar.
                </p>

                <p>
                  Bei Bekanntwerden einer Rechtsverletzung werden entsprechende
                  Links geprüft und, soweit erforderlich, entfernt.
                </p>
              </div>
            </section>

            <section className="impressum-section" id="urheberrecht">
              <header className="impressum-section-header">
                <span className="impressum-section-number">07</span>

                <div>
                  <span className="impressum-section-kicker">
                    Schutz der Inhalte
                  </span>
                  <h2>Urheberrecht</h2>
                </div>
              </header>

              <div className="impressum-section-body">
                <p>
                  Die auf dieser Website veröffentlichten Inhalte, Texte,
                  Artikel, Unterrichtsaufnahmen, Audiodateien, Grafiken, Bilder,
                  Designs und sonstigen Werke unterliegen dem jeweils
                  anwendbaren Urheberrecht.
                </p>

                <p>
                  Die Vervielfältigung, Bearbeitung, Verbreitung oder sonstige
                  Verwertung außerhalb der gesetzlichen Grenzen bedarf der
                  vorherigen Zustimmung des jeweiligen Rechteinhabers, sofern
                  nicht ausdrücklich etwas anderes angegeben ist.
                </p>

                <p>
                  Downloads und Kopien der angebotenen Inhalte sind nur für den
                  privaten, nicht kommerziellen Gebrauch zulässig, soweit auf
                  der jeweiligen Seite keine abweichende Erlaubnis erteilt wird.
                </p>

                <p>
                  Soweit Inhalte auf dieser Website nicht vom Betreiber oder vom
                  inhaltlich Verantwortlichen erstellt wurden, werden die Rechte
                  Dritter beachtet und vorhandene Quellen oder Urheber
                  gekennzeichnet.
                </p>

                <p>
                  Hinweise auf mögliche Urheberrechtsverletzungen können per
                  E-Mail an den Betreiber gesendet werden. Berechtigte Hinweise
                  werden geprüft und betroffene Inhalte gegebenenfalls entfernt.
                </p>
              </div>
            </section>

            <section className="impressum-section" id="streitbeilegung">
              <header className="impressum-section-header">
                <span className="impressum-section-number">08</span>

                <div>
                  <span className="impressum-section-kicker">
                    Verbraucherinformationen
                  </span>
                  <h2>Streitbeilegung</h2>
                </div>
              </header>

              <div className="impressum-section-body">
                <p>
                  Der Betreiber ist nicht bereit und nicht verpflichtet, an
                  Streitbeilegungsverfahren vor einer
                  Verbraucherschlichtungsstelle teilzunehmen.
                </p>

                <p>
                  Die Website bietet derzeit keine kostenpflichtigen
                  Dienstleistungen, Zahlungsabwicklungen oder direkten
                  Vertragsabschlüsse mit Verbrauchern an.
                </p>
              </div>
            </section>

            <section className="impressum-contact-section">
              <div>
                <span className="impressum-contact-kicker">
                  Fragen oder rechtliche Hinweise
                </span>

                <h2>Kontakt zum Betreiber</h2>

                <p>
                  Bei Fragen zur Website, zu rechtlichen Angaben oder bei
                  Hinweisen auf mögliche Rechtsverletzungen können Sie sich
                  direkt per E-Mail melden.
                </p>
              </div>

              <a href="mailto:elfouzari.soufian@gmail.com">
                E-Mail schreiben
                <ExternalLinkIcon />
              </a>
            </section>
          </div>
        </div>
      </section>
      <Footer></Footer>
    </main>
  );
}

export default Impressum;