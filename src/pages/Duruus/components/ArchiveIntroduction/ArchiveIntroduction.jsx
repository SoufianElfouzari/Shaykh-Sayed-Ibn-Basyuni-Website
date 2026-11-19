import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./ArchiveIntroduction.css";
import "../../../Home/components/Hero/Hero.css";

function ArrowDownIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 5V19"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <path
        d="M7 14L12 19L17 14"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArchiveIntroduction() {
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
          "sib-archive-introduction-visible",
        );

        observer.unobserve(section);
      },
      {
        threshold: 0.16,
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
      className="sib-archive-introduction"
      aria-labelledby="sib-archive-introduction-title"
    >
      <div
        className="sib-archive-introduction-decoration"
        aria-hidden="true"
      >
        <span className="sib-archive-introduction-background-word">
          Archiv
        </span>

        <span className="sib-archive-introduction-circle sib-archive-introduction-circle-one"></span>

        <span className="sib-archive-introduction-circle sib-archive-introduction-circle-two"></span>

        <span className="sib-archive-introduction-line"></span>
      </div>

      <div className="sib-archive-introduction-container">
        <header className="sib-archive-introduction-header">
          <div className="sib-archive-introduction-label-row">
            <span
              className="sib-archive-introduction-label-line"
              aria-hidden="true"
            ></span>

            <p className="sib-archive-introduction-label">
              Unterrichtsarchiv
            </p>
          </div>

          <h2
            id="sib-archive-introduction-title"
            className="sib-archive-introduction-title"
          >
            Durous nach Themen
            <span>und Reihen entdecken.</span>
          </h2>
        </header>

        <div className="sib-archive-introduction-content">
          <p className="sib-archive-introduction-lead">
            Das Unterrichtsarchiv hilft dir, veröffentlichte
            islamische Unterrichte nach Themen und Reihen zu
            finden und systematisch nachzuhören.
          </p>

          <div className="sib-archive-introduction-text">
            <p>
              Die Aufnahmen sind übersichtlich nach Themen und
              Unterrichtsreihen geordnet. So kannst du zusammengehörende
              Durous finden und in der richtigen Reihenfolge anhören.
            </p>
            <p>
              Neben vollständigen Unterrichtsreihen findest du auch
              einzelne Vorträge. Neue Aufnahmen werden regelmäßig
              im Archiv ergänzt.
            </p>
            <nav className="sib-archive-introduction-related" aria-label="Weitere Inhalte entdecken">
              <Link to="/shaykh" className="sib-archive-introduction-related-link">
                <span>Mehr über den Shaykh</span>
                <span aria-hidden="true">↑</span>
              </Link>
              <Link to="/artikel" className="sib-archive-introduction-related-link">
                <span>Islamische Artikel lesen</span>
                <span aria-hidden="true">↑</span>
              </Link>
            </nav>
          </div>
        </div>

        <footer className="sib-archive-introduction-footer">
          <div className="sib-archive-introduction-features">
            <div className="sib-archive-introduction-feature">
              <span>01</span>
              <p>Nach Themen geordnet</p>
            </div>

            <div className="sib-archive-introduction-feature">
              <span>02</span>
              <p>In Reihen zusammengefasst</p>
            </div>

            <div className="sib-archive-introduction-feature">
              <span>03</span>
              <p>Fortlaufend ergänzt</p>
            </div>
          </div>

          <a
            href="#unterrichtsarchiv"
            className="sib-archive-introduction-link sib-home-hero-action sib-home-hero-action-primary"
          >
            <span className="sib-home-hero-action-label">Zum Unterrichtsarchiv</span>

            <span
              className="sib-archive-introduction-link-icon sib-home-hero-action-arrow"
              aria-hidden="true"
            >
              <ArrowDownIcon />
            </span>
          </a>
        </footer>
      </div>
    </section>
  );
}

export default ArchiveIntroduction;