import "./NoticesBanner.css";

const notices = [
  
  {
    id: 1,
    type: "Terminänderung",
    date: "Sonntag, 26. Juli 2026",
    title: "Der Tajwid-Unterricht beginnt später",
    message:
      "Der Unterricht beginnt an diesem Sonntag ausnahmsweise um 17:00 Uhr statt um 16:00 Uhr.",
  },
  

  /*
  {
    id: 2,
    type: "Unterricht entfällt",
    date: "Dienstag, 28. Juli 2026",
    title: "Der Unterricht fällt aus",
    message:
      "Der Mustalah al-Hadith Unterricht findet an diesem Tag nicht statt.",
  },
  */
];

function NoticeIcon({ type }) {
  if (type === "Unterricht entfällt") {
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

  if (type === "Terminänderung") {
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

function NoticesBanner() {
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
              <p>Aktuelle Informationen</p>

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
          {notices.map((notice, index) => (
            <article
              key={notice.id}
              className="sib-notices-banner-item"
            >
              <div className="sib-notices-banner-icon">
                <NoticeIcon type={notice.type} />
              </div>

              <div className="sib-notices-banner-content">
                <div className="sib-notices-banner-meta">
                  <span>{notice.type}</span>

                  {notice.date && (
                    <>
                      <span
                        className="sib-notices-banner-meta-dot"
                        aria-hidden="true"
                      ></span>

                      <time>{notice.date}</time>
                    </>
                  )}
                </div>

                <h3>{notice.title}</h3>

                <p>{notice.message}</p>
              </div>

              <span
                className="sib-notices-banner-index"
                aria-hidden="true"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default NoticesBanner;