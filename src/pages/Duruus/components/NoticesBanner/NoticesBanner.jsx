import {
  useEffect,
  useState,
} from "react";

import {
  getActivePublishedNotices,
} from "../../../../appwrite/noticesService";

import "./NoticesBanner.css";

function NoticeIcon({
  type,
}) {
  if (
    type ===
    "Unterricht entfällt"
  ) {
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
          r="8"
          stroke="currentColor"
          strokeWidth="1.7"
        />

        <path
          d="M8.5 8.5L15.5 15.5"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (
    type === "Terminänderung"
  ) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M7 3.5V6.5"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />

        <path
          d="M17 3.5V6.5"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />

        <path
          d="M4.5 9H19.5"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />

        <rect
          x="4.5"
          y="5.5"
          width="15"
          height="14"
          rx="2.8"
          stroke="currentColor"
          strokeWidth="1.7"
        />

        <path
          d="M11 14H16"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />

        <path
          d="M14 12L16 14L14 16"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (
    type === "Ortsänderung"
  ) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M12 20C15.5 16.2 18 13.2 18 9.5C18 6.2 15.3 3.5 12 3.5C8.7 3.5 6 6.2 6 9.5C6 13.2 8.5 16.2 12 20Z"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />

        <circle
          cx="12"
          cy="9.5"
          r="2.2"
          stroke="currentColor"
          strokeWidth="1.7"
        />
      </svg>
    );
  }

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
        r="8"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M12 11V16"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <circle
        cx="12"
        cy="8"
        r="1"
        fill="currentColor"
      />
    </svg>
  );
}

function LoadingIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeDasharray="18 10"
      />
    </svg>
  );
}

function formatNoticeDate(
  value,
) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (
    Number.isNaN(date.getTime())
  ) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "de-DE",
    {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    },
  ).format(date);
}

function NoticesBanner() {
  const [notices, setNotices] =
    useState([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  useEffect(() => {
    let isCurrentRequest = true;

    async function loadNotices() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const loadedNotices =
          await getActivePublishedNotices();

        if (!isCurrentRequest) {
          return;
        }

        setNotices(
          loadedNotices,
        );
      } catch (error) {
        console.error(
          "Hinweise konnten nicht geladen werden:",
          error,
        );

        if (!isCurrentRequest) {
          return;
        }

        setNotices([]);

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Die Hinweise konnten nicht geladen werden.",
        );
      } finally {
        if (isCurrentRequest) {
          setIsLoading(false);
        }
      }
    }

    loadNotices();

    return () => {
      isCurrentRequest = false;
    };
  }, []);

  if (isLoading) {
    return (
      <section
        className="sib-notices-banner-section"
        aria-labelledby="sib-notices-banner-title"
      >
        <div className="sib-notices-banner">
          <div
            className="sib-notices-banner-decoration"
            aria-hidden="true"
          >
            <span className="sib-notices-banner-circle sib-notices-banner-circle-one"></span>
            <span className="sib-notices-banner-circle sib-notices-banner-circle-two"></span>
            <span className="sib-notices-banner-line"></span>
          </div>

          <div className="sib-notices-banner-list">
            <article className="sib-notices-banner-item">
              <div className="sib-notices-banner-icon">
                <LoadingIcon />
              </div>

              <div className="sib-notices-banner-content">
                <div className="sib-notices-banner-meta">
                  <span>
                    Aktuelle Informationen
                  </span>
                </div>

                <h3>
                  Hinweise werden geladen
                </h3>

                <p>
                  Die aktuellen Änderungen
                  werden aus Appwrite geladen.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>
    );
  }

  if (errorMessage) {
    console.error(
      errorMessage,
    );

    return null;
  }

  if (notices.length === 0) {
    return null;
  }

  return (
    <section
      className="sib-notices-banner-section"
      aria-labelledby="sib-notices-banner-title"
    >
      <div className="sib-notices-banner">
        <div
          className="sib-notices-banner-decoration"
          aria-hidden="true"
        >
          <span className="sib-notices-banner-circle sib-notices-banner-circle-one"></span>
          <span className="sib-notices-banner-circle sib-notices-banner-circle-two"></span>
          <span className="sib-notices-banner-line"></span>
        </div>

        <header className="sib-notices-banner-header">
          <div className="sib-notices-banner-heading">
            <span
              className="sib-notices-banner-status"
              aria-hidden="true"
            ></span>

            <div>
              <p>
                Aktuelle Informationen
              </p>

              <h2 id="sib-notices-banner-title">
                Hinweise und Terminänderungen
              </h2>
            </div>
          </div>

          <span className="sib-notices-banner-count">
            {notices.length}{" "}
            {notices.length === 1
              ? "Hinweis"
              : "Hinweise"}
          </span>
        </header>

        <div className="sib-notices-banner-list">
          {notices.map(
            (notice, index) => {
              const formattedDate =
                formatNoticeDate(
                  notice.validFrom,
                );

              return (
                <article
                  key={notice.id}
                  className="sib-notices-banner-item"
                >
                  <div className="sib-notices-banner-icon">
                    <NoticeIcon
                      type={notice.type}
                    />
                  </div>

                  <div className="sib-notices-banner-content">
                    <div className="sib-notices-banner-meta">
                      <span>
                        {notice.type}
                      </span>

                      {formattedDate && (
                        <>
                          <span
                            className="sib-notices-banner-meta-dot"
                            aria-hidden="true"
                          ></span>

                          <time
                            dateTime={
                              notice.validFrom
                            }
                          >
                            {formattedDate}
                          </time>
                        </>
                      )}
                    </div>

                    <h3>
                      {notice.title}
                    </h3>

                    <p>
                      {notice.message}
                    </p>

                    {notice.affectedDars && (
                      <p>
                        Betroffener Unterricht:{" "}
                        <strong>
                          {
                            notice.affectedDars
                          }
                        </strong>
                      </p>
                    )}
                  </div>

                  <span
                    className="sib-notices-banner-index"
                    aria-hidden="true"
                  >
                    {String(
                      index + 1,
                    ).padStart(
                      2,
                      "0",
                    )}
                  </span>
                </article>
              );
            },
          )}
        </div>
      </div>
    </section>
  );
}

export default NoticesBanner;