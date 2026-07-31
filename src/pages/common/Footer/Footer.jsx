import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const footerNavigation = [
  {
    label: "Startseite",
    to: "/",
  },
  {
    label: "Der Shaykh",
    to: "/der-shaykh",
  },
  {
    label: "Durous",
    to: "/durous",
  },
  {
    label: "Artikel",
    to: "/artikel",
  },
  {
    label: "Kontakt",
    to: "/kontakt",
  },
];

const footerContentLinks = [
  {
    label: "Neueste Durous",
    to: "/durous",
  },
  {
    label: "Unterrichtsreihen",
    to: "/durous",
  },
  {
    label: "Aktuelle Artikel",
    to: "/artikel",
  },
  {
    label: "Suche",
    to: "/suche",
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

function Footer() {
  const footerRef = useRef(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const footer = footerRef.current;

    if (!footer) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        footer.classList.add("sib-footer-visible");
        observer.unobserve(footer);
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -30px 0px",
      },
    );

    observer.observe(footer);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <footer ref={footerRef} className="sib-footer">
      <div
        className="sib-footer-decoration"
        aria-hidden="true"
      >
        <span className="sib-footer-circle sib-footer-circle-one"></span>
        <span className="sib-footer-circle sib-footer-circle-two"></span>
        <span className="sib-footer-light"></span>
      </div>

      <div className="sib-footer-container">
        <div className="sib-footer-main">
          <div className="sib-footer-brand-column">
            <Link
              to="/"
              className="sib-footer-brand"
              aria-label="Zur Startseite"
            >
              <span
                className="sib-footer-brand-line"
                aria-hidden="true"
              ></span>

              <span className="sib-footer-brand-copy">
                <span className="sib-footer-brand-heading">
                  <span className="sib-footer-brand-title">
                    Shaykh
                  </span>

                  <strong className="sib-footer-brand-name">
                    Sayed Ibn Basyuni
                  </strong>
                </span>

                <span className="sib-footer-brand-meta">
                  Offizielle Website
                </span>
              </span>
            </Link>

            <p className="sib-footer-description">
              Eine geordnete Sammlung der Durous, Artikel und
              aktuellen Hinweise von Shaykh Sayed Ibn Basyuni.
            </p>

            <div className="sib-footer-status">
              <span
                className="sib-footer-status-dot"
                aria-hidden="true"
              ></span>

              <span>
                Inhalte auf Deutsch und Arabisch
              </span>
            </div>
          </div>

          <div className="sib-footer-navigation-column">
            <p className="sib-footer-column-label">
              Navigation
            </p>

            <nav
              className="sib-footer-links"
              aria-label="Footer Navigation"
            >
              {footerNavigation.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="sib-footer-link"
                >
                  <span>{item.label}</span>

                  <span
                    className="sib-footer-link-arrow"
                    aria-hidden="true"
                  >
                    <ArrowIcon />
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="sib-footer-navigation-column">
            <p className="sib-footer-column-label">
              Inhalte
            </p>

            <nav
              className="sib-footer-links"
              aria-label="Inhalte"
            >
              {footerContentLinks.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="sib-footer-link"
                >
                  <span>{item.label}</span>

                  <span
                    className="sib-footer-link-arrow"
                    aria-hidden="true"
                  >
                    <ArrowIcon />
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="sib-footer-information-column">
            <p className="sib-footer-column-label">
              Hinweis
            </p>

            <div className="sib-footer-information">
              <p>
                Offizielle Mitteilungen und Änderungen zu
                Unterrichtsterminen werden über diese Website
                sowie die bestätigten Kanäle veröffentlicht.
              </p>

              <Link
                to="/kontakt"
                className="sib-footer-contact-link"
              >
                <span>Kontakt aufnehmen</span>

                <span
                  className="sib-footer-contact-arrow"
                  aria-hidden="true"
                >
                  <ArrowIcon />
                </span>
              </Link>
            </div>
          </div>
        </div>

        <div className="sib-footer-divider">
          <span></span>
        </div>

        <div className="sib-footer-bottom">
          <p className="sib-footer-copyright">
            © {currentYear} Shaykh Sayed Ibn Basyuni
          </p>

          <div className="sib-footer-legal-links">
            <Link to="/impressum">
              Impressum
            </Link>

            <span aria-hidden="true"></span>

            <Link to="/datenschutz">
              Datenschutz
            </Link>
          </div>

          <a
            href="#top"
            className="sib-footer-top-link"
            aria-label="Zum Seitenanfang"
          >
            <span>Nach oben</span>

            <span
              className="sib-footer-top-arrow"
              aria-hidden="true"
            >
              <ArrowIcon />
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;