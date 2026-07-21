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
    path: "/",
  },
  {
    label: "Der Shaykh",
    path: "/shaykh",
  },
  {
    label: "Duruus",
    path: "/duruus",
  },
  {
    label: "Veröffentlichungen",
    path: "/veroeffentlichungen",
  },
  {
    label: "Termine",
    path: "/termine",
  },
  {
    label: "Kontakt",
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
    setIsMenuOpen(false);
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
            aria-label="Zur Startseite von Shaykh Sayed Ibn Basyuni"
            onClick={closeMenu}
          >
            <span
              className="sib-header-brand-line"
              aria-hidden="true"
            ></span>

            <span className="sib-header-brand-copy">
              <span className="sib-header-brand-name">
                <span className="sib-header-brand-title">
                  Shaykh
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
            <NavLink
              to="/suche"
              className={({ isActive }) =>
                isActive
                  ? "sib-header-search sib-header-search-active"
                  : "sib-header-search"
              }
              aria-label="Website durchsuchen"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <circle
                  cx="10.8"
                  cy="10.8"
                  r="6.3"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />

                <path
                  d="M15.5 15.5L20 20"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </NavLink>

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
                  Shaykh
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
                {item.label}
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

        <div className="sib-mobile-menu-footer">
          <NavLink
            to="/suche"
            className="sib-mobile-search-link"
            onClick={closeMenu}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle
                cx="10.8"
                cy="10.8"
                r="6.3"
                stroke="currentColor"
                strokeWidth="1.8"
              />

              <path
                d="M15.5 15.5L20 20"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>

            <span>Website durchsuchen</span>
          </NavLink>

          <p>
            Duruus, Veröffentlichungen und
            Informationen von Shaykh Sayed Ibn
            Basyuni.
          </p>
        </div>
      </aside>
    </>
  );
}

export default Header;