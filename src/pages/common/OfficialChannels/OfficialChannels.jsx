import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./OfficialChannels.css";

function VerifiedIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 3.5L14.1 5.3L16.9 5L17.5 7.7L20 9.2L18.8 11.8L20 14.4L17.5 15.9L16.9 18.6L14.1 18.3L12 20.1L9.9 18.3L7.1 18.6L6.5 15.9L4 14.4L5.2 11.8L4 9.2L6.5 7.7L7.1 5L9.9 5.3L12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.45"
        strokeLinejoin="round"
      />

      <path
        d="M8.7 11.9L10.8 14L15.5 9.3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BroadcastIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="2.1"
        fill="currentColor"
      />

      <path
        d="M8.6 8.6C6.7 10.5 6.7 13.5 8.6 15.4"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinecap="round"
      />

      <path
        d="M15.4 8.6C17.3 10.5 17.3 13.5 15.4 15.4"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinecap="round"
      />

      <path
        d="M5.7 5.7C2.2 9.2 2.2 14.8 5.7 18.3"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinecap="round"
      />

      <path
        d="M18.3 5.7C21.8 9.2 21.8 14.8 18.3 18.3"
        stroke="currentColor"
        strokeWidth="1.55"
        strokeLinecap="round"
      />
    </svg>
  );
}

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

function OfficialChannels() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return undefined;
    }

    if (!("IntersectionObserver" in window)) {
      section.classList.add("sib-official-channels-visible");
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        section.classList.add(
          "sib-official-channels-visible",
        );

        observer.unobserve(section);
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -40px 0px",
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
      className="sib-official-channels"
      aria-labelledby="sib-official-channels-title"
    >
      <div
        className="sib-official-channels-decoration"
        aria-hidden="true"
      >
        <span className="sib-official-channels-line sib-official-channels-line-one" />

        <span className="sib-official-channels-line sib-official-channels-line-two" />

        <span className="sib-official-channels-mark">
          <BroadcastIcon />
        </span>
      </div>

      <div className="sib-official-channels-container">
        <div className="sib-official-channels-content">
          <div className="sib-official-channels-label">
            <span className="sib-official-channels-label-icon">
              <VerifiedIcon />
            </span>

            <span>Offizielle Kanäle</span>
          </div>

          <h2
            id="sib-official-channels-title"
            className="sib-official-channels-title"
          >
            Die offiziellen Kanäle des Shaykhs werden zu einem
            späteren Zeitpunkt bekanntgegeben.
          </h2>

          <p className="sib-official-channels-description">
            Sobald die offiziellen Kanäle von Dr. Shaykh Sayed Ibn
            Basyuni eingerichtet wurden, werden sie an dieser
            Stelle veröffentlicht und über diese Website
            bestätigt.
          </p>
        </div>

        <div className="sib-official-channels-information">
          <span className="sib-official-channels-information-line" />

          <div className="sib-official-channels-information-content">
            <span className="sib-official-channels-information-label">
              Aktuelle Inhalte
            </span>

            <p>
              Wissenschaftliche Beiträge und veröffentlichte
              Artikel des Shaykhs finden Sie bereits im
              Artikelbereich dieser Website.
            </p>
          </div>

          <Link
            to="/artikel"
            className="sib-official-channels-button"
            aria-label="Zum Artikelbereich"
          >
            <span>Zu den Artikeln</span>

            <span
              className="sib-official-channels-button-icon"
              aria-hidden="true"
            >
              <ArrowIcon />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default OfficialChannels;