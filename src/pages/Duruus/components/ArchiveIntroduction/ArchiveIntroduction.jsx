import { useEffect, useRef } from "react";
import "./ArchiveIntroduction.css";

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
            Durous geordnet
            <span>und dauerhaft zugänglich.</span>
          </h2>
        </header>

        <div className="sib-archive-introduction-content">
          <p className="sib-archive-introduction-lead">
            Das Unterrichtsarchiv bietet einen geordneten Zugang
            zu vergangenen Durous, einzelnen Unterrichtseinheiten
            und zusammenhängenden Unterrichtsreihen.
          </p>

          <div className="sib-archive-introduction-text">
            <p>
              Die Aufnahmen werden nach Themen und Reihen
              eingeordnet, damit zusammengehörende Unterrichte
              leichter gefunden und in der richtigen Reihenfolge
              angehört werden können.
            </p>

            <p>
              Neben abgeschlossenen Reihen können auch einzelne
              Durous und fortlaufende Unterrichte im Archiv
              aufgerufen werden. Neue Aufnahmen werden an der
              entsprechenden Stelle ergänzt.
            </p>
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
            className="sib-archive-introduction-link"
          >
            <span>Zum Unterrichtsarchiv</span>

            <span
              className="sib-archive-introduction-link-icon"
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