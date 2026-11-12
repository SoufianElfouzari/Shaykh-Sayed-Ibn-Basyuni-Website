import { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  useLocation,
} from "react-router-dom";
import "./Header.css";

const navigationItems = [
  {
    label: "Startseite",
    mobileLabel: "Start",
    path: "/",
  },
  {
    label: "Der Shaykh",
    mobileLabel: "Biografie und Werdegang",
    path: "/shaykh",
  },
  {
    label: "Durus",
    mobileLabel: "Audio und Unterrichte",
    path: "/durous",
  },
  {
    label: "Veröffentlichungen",
    mobileLabel: "Artikel lesen",
    path: "/artikel",
  },
  {
    label: "Fatwa-Fragen",
    mobileLabel: "Fatwa anfragen",
    path: "/kontakt?anliegen=fatwa",
  },
  {
    label: "Kontaktseite",
    mobileLabel: "Kontaktformular",
    path: "/kontakt",
  },
];

function Header() {
  const location = useLocation();

  const [isScrolled, setIsScrolled] =
    useState(false);

  const [isMenuOpen, setIsMenuOpen] =
    useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      },
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll,
      );
    };
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setIsMenuOpen(false));
    return () => window.cancelAnimationFrame(frame);
  }, [location.pathname]);

  useEffect(() => {
    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = isMenuOpen
      ? "hidden"
      : "";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, []);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen((currentValue) => {
      return !currentValue;
    });
  };

  const getDesktopLinkClass = ({
    isActive,
  }) => {
    return isActive
      ? "sib-header-nav-link sib-header-nav-link-active"
      : "sib-header-nav-link";
  };

  const getMobileLinkClass = ({
    isActive,
  }) => {
    return isActive
      ? "sib-mobile-nav-link sib-mobile-nav-link-active"
      : "sib-mobile-nav-link";
  };

  return (
    <>
      <header
        className={`sib-header${
          isScrolled
            ? " sib-header-scrolled"
            : ""
        }`}
      >
        <div className="sib-header-container">
          <Link
            to="/"
            className="sib-header-brand"
            onClick={closeMenu}
          >
            <span
              className="sib-header-brand-line"
              aria-hidden="true"
            ></span>

            <span className="sib-header-brand-copy">
              <span className="sib-header-brand-name">
                <span className="sib-header-brand-title">
                  Dr. Shaykh
                </span>

                <span className="sib-header-brand-person">
                  Sayed Ibn Basyuni
                </span>
              </span>

              <span className="sib-header-brand-meta">
                Offizielle Website
              </span>
            </span>
          </Link>

          <nav
            className="sib-header-navigation"
            aria-label="Hauptnavigation"
          >
            {navigationItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={getDesktopLinkClass}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="sib-header-actions">
            <a className="sib-header-search" href="https://www.google.com/search?q=site%3Ashaykh-sayed.de" aria-label="Website über Google durchsuchen" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.7" stroke="currentColor" strokeWidth="2" /><path d="m16 16 4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            </a>
            <Link to="/kontakt?anliegen=fatwa#kontaktformular" className="sib-header-fatwa-cta" onClick={closeMenu}>
              <span className="sib-fatwa-icon" aria-hidden="true">
                <svg viewBox="0 0 32 32" fill="none" focusable="false">
                  <path d="M9 4.5h11l4 4V27H9a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3Z" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round"/>
                  <path d="M20 4.5V9h4M11 14h9M11 19h8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="m17 25 9-10 2 2-9 10-4 1 2-3Z" fill="var(--sib-fatwa-pen-fill,#d9b979)" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                </svg>
              </span>
              <span className="sib-fatwa-label">Fatwa anfragen</span>
              <span className="sib-fatwa-arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" focusable="false"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
            </Link>

            <button
              type="button"
              className={`sib-header-menu-button${
                isMenuOpen
                  ? " sib-header-menu-button-open"
                  : ""
              }`}
              aria-label={
                isMenuOpen
                  ? "Menü schließen"
                  : "Menü öffnen"
              }
              aria-expanded={isMenuOpen}
              aria-controls="sib-mobile-menu"
              onClick={toggleMenu}
            >
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      <div
        className={`sib-mobile-backdrop${
          isMenuOpen
            ? " sib-mobile-backdrop-visible"
            : ""
        }`}
        aria-hidden="true"
        onClick={closeMenu}
      ></div>

      <aside
        id="sib-mobile-menu"
        className={`sib-mobile-menu${
          isMenuOpen
            ? " sib-mobile-menu-open"
            : ""
        }`}
        aria-hidden={!isMenuOpen}
      >
        <div className="sib-mobile-menu-header">
          <Link
            to="/"
            className="sib-mobile-brand"
            onClick={closeMenu}
          >
            <span
              className="sib-mobile-brand-line"
              aria-hidden="true"
            ></span>

            <span className="sib-mobile-brand-copy">
              <span className="sib-mobile-brand-name">
                <span className="sib-mobile-brand-title">
                  Dr. Shaykh
                </span>

                <span className="sib-mobile-brand-person">
                  Sayed Ibn Basyuni
                </span>
              </span>

              <span className="sib-mobile-brand-meta">
                Offizielle Website
              </span>
            </span>
          </Link>

          <button
            type="button"
            className="sib-mobile-menu-close"
            aria-label="Menü schließen"
            onClick={closeMenu}
          >
            <span></span>
            <span></span>
          </button>
        </div>

        <nav
          className="sib-mobile-navigation"
          aria-label="Mobile Hauptnavigation"
        >
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={getMobileLinkClass}
              onClick={closeMenu}
            >
              <span className="sib-mobile-nav-label">
                {item.mobileLabel || item.label}
              </span>

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
            </NavLink>
          ))}
        </nav>

        <Link to="/kontakt?anliegen=fatwa#kontaktformular" className="sib-mobile-fatwa-cta" onClick={closeMenu}>Fatwa anfragen <span aria-hidden="true">→</span></Link>
        <div className="sib-mobile-menu-footer">


          <p>
            Durous, Veröffentlichungen und
            Informationen von Dr. Shaykh Sayed Ibn
            Basyuni.
          </p>
        </div>
      </aside>
    </>
  );
}

export default Header;