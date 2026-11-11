import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Footer.css";

const footerNavigation = [
  {
    label: "Startseite",
    to: "/",
  },
  {
    label: "Der Shaykh",
    to: "/shaykh",
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
  const [copyStatus, setCopyStatus] = useState("");
  const currentYear = new Date().getFullYear();
  const { pathname, search } = useLocation();
  const shareUrl = "https://www.shaykh-sayed.de" + pathname + search;
  const shareText = "Islamische Unterrichte und Artikel auf Shaykh Sayed";
  const whatsappUrl = "https://api.whatsapp.com/send?text=" + encodeURIComponent(shareText + ": " + shareUrl);
  const telegramUrl = "https://t.me/share/url?url=" + encodeURIComponent(shareUrl) + "&text=" + encodeURIComponent(shareText);
  const facebookUrl = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(shareUrl);
  const xUrl = "https://twitter.com/intent/tweet?url=" + encodeURIComponent(shareUrl) + "&text=" + encodeURIComponent(shareText);
  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopyStatus("Link kopiert!");
    } catch {
      setCopyStatus("Kopieren nicht möglich. Bitte die URL aus der Adresszeile kopieren.");
    }
  };
  const emailUrl = "mailto:?subject=" + encodeURIComponent(shareText) + "&body=" + encodeURIComponent(shareUrl);

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

        <nav className="sib-footer-sharing" aria-label="Diese Seite teilen">
          <span className="sib-footer-sharing-eyebrow">Wissen weitergeben</span>
          <h2 className="sib-footer-sharing-heading">Diese Seite teilen</h2>
          <p className="sib-footer-sharing-description">Teile hilfreiche Unterrichte und Artikel mit anderen.</p>
          <div className="sib-footer-sharing-actions">
            <a className="sib-footer-sharing-action sib-footer-sharing-whatsapp" href={whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Diese Seite über WhatsApp teilen">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.52 3.48A11.86 11.86 0 0 0 12.04 0C5.45 0 .08 5.36.08 11.96c0 2.11.55 4.17 1.6 5.99L0 24l6.2-1.63a11.9 11.9 0 0 0 5.84 1.49h.01C18.64 23.86 24 18.5 24 11.9c0-3.18-1.24-6.17-3.48-8.42ZM12.04 21.84a9.88 9.88 0 0 1-5.04-1.38l-.36-.21-3.68.97.98-3.59-.23-.37a9.9 9.9 0 0 1-1.52-5.3c0-5.49 4.47-9.96 9.97-9.96a9.9 9.9 0 0 1 7.04 2.92 9.88 9.88 0 0 1 2.91 7.05c0 5.49-4.47 9.96-9.97 9.97Zm5.46-7.45c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.23-.65.08-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.48-.5-.67-.51h-.57c-.2 0-.52.08-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.21 5.09 4.5.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z"/></svg>
              <span>WhatsApp</span>
            </a>
            <a className="sib-footer-sharing-action sib-footer-sharing-telegram" href={telegramUrl} target="_blank" rel="noopener noreferrer" aria-label="Diese Seite über Telegram teilen">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.94 4.67c.27-1.2-.43-1.67-1.4-1.32L2.3 10.38c-1.25.5-1.23 1.2-.23 1.51l4.68 1.46L17.6 6.5c.51-.31.98-.14.59.21l-8.8 7.95-.34 4.76c.49 0 .71-.23.98-.5l2.35-2.29 4.89 3.61c.9.5 1.55.24 1.78-.83l2.89-14.74Z"/></svg>
              <span>Telegram</span>
            </a>
            <a className="sib-footer-sharing-action sib-footer-sharing-email" href={emailUrl} aria-label="Diese Seite per E-Mail teilen">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2.5" y="4.5" width="19" height="15" rx="3"/><path d="m3.5 6.5 8.5 6.7 8.5-6.7"/></svg>
              <span>E-Mail</span>
            </a>
            <a className="sib-footer-sharing-action sib-footer-sharing-facebook" href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Diese Seite auf Facebook teilen"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.19 2.23.19v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12Z"/></svg><span>Facebook</span></a>
            <a className="sib-footer-sharing-action sib-footer-sharing-x" href={xUrl} target="_blank" rel="noopener noreferrer" aria-label="Diese Seite auf X teilen"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.9 2H22l-6.8 7.77L23.2 22h-6.26l-4.9-7.43L5.54 22H2.4l7.28-8.32L1.8 2h6.42l4.43 6.77L18.9 2Zm-1.1 18h1.73L7.28 3.9H5.42L17.8 20Z"/></svg><span>X</span></a>
            <button className="sib-footer-sharing-action sib-footer-sharing-copy" type="button" onClick={copyShareLink} aria-label="Link dieser Seite kopieren"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg><span>Link kopieren</span></button>
          </div>
          <span className="sib-footer-sharing-feedback" role="status" aria-live="polite">{copyStatus}</span>
        </nav>

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