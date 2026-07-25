import { useEffect, useRef } from "react";
import "./OfficialChannels.css";

const officialChannels = [
  {
    id: 1,
    platform: "Telegram",
    description: "Hinweise, Ankündigungen und neue Beiträge",
    href: "#",
    type: "telegram",
    primary: true,
  },
  {
    id: 2,
    platform: "YouTube",
    description: "Duruus, Vorträge und Unterrichtsreihen",
    href: "#",
    type: "youtube",
  },
  {
    id: 3,
    platform: "WhatsApp",
    description: "Aktuelle Mitteilungen und wichtige Hinweise",
    href: "#",
    type: "whatsapp",
  },
];

function TelegramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M20.4 4.1L3.9 10.5C2.8 10.9 2.8 11.6 3.7 11.9L7.9 13.2L17.7 7C18.2 6.7 18.6 6.9 18.2 7.2L10.3 14.4L10 18.6C10.5 18.6 10.7 18.4 11 18.1L13 16.2L17.2 19.3C18 19.7 18.5 19.5 18.7 18.6L21.5 5.4C21.8 4.3 21.1 3.8 20.4 4.1Z"
        fill="currentColor"
      />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M20.8 8.1C20.6 6.9 19.9 6.2 18.7 6C17 5.7 14.6 5.5 12 5.5C9.4 5.5 7 5.7 5.3 6C4.1 6.2 3.4 6.9 3.2 8.1C3 9.2 2.9 10.5 2.9 12C2.9 13.5 3 14.8 3.2 15.9C3.4 17.1 4.1 17.8 5.3 18C7 18.3 9.4 18.5 12 18.5C14.6 18.5 17 18.3 18.7 18C19.9 17.8 20.6 17.1 20.8 15.9C21 14.8 21.1 13.5 21.1 12C21.1 10.5 21 9.2 20.8 8.1Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />

      <path
        d="M10 9L15 12L10 15V9Z"
        fill="currentColor"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M20 11.7C20 16.1 16.4 19.7 12 19.7C10.6 19.7 9.3 19.3 8.2 18.7L4 20L5.3 15.9C4.6 14.7 4.2 13.2 4.2 11.7C4.2 7.3 7.7 3.8 12.1 3.8C16.5 3.8 20 7.3 20 11.7Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M9.1 8.1C9.3 7.8 9.5 7.8 9.8 7.8H10.2C10.4 7.8 10.6 7.9 10.7 8.2L11.3 9.7C11.4 10 11.4 10.2 11.2 10.4L10.7 11C10.5 11.2 10.6 11.4 10.7 11.6C11.4 12.8 12.3 13.7 13.6 14.3C13.8 14.4 14 14.5 14.2 14.2L14.9 13.4C15.1 13.2 15.3 13.2 15.6 13.3L17 14C17.3 14.1 17.4 14.3 17.4 14.5C17.4 15.1 17.1 15.8 16.6 16.2C16.1 16.6 15.4 16.8 14.7 16.6C13.4 16.3 11.8 15.5 10.4 14.2C9.2 13.1 8.3 11.7 7.9 10.5C7.7 9.8 8.3 8.7 9.1 8.1Z"
        fill="currentColor"
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

function VerifiedIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 3L14.1 5L17 4.6L17.5 7.5L20 9L18.7 11.7L20 14.4L17.5 16L17 18.8L14.1 18.5L12 20.5L9.9 18.5L7 18.8L6.5 16L4 14.4L5.3 11.7L4 9L6.5 7.5L7 4.6L9.9 5L12 3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      <path
        d="M8.5 12L10.7 14.2L15.7 9.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChannelIcon({ type }) {
  if (type === "telegram") {
    return <TelegramIcon />;
  }

  if (type === "youtube") {
    return <YouTubeIcon />;
  }

  return <WhatsAppIcon />;
}

function OfficialChannels() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add(
            "sib-channels-banner-visible",
          );

          observer.unobserve(section);
        }
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -60px 0px",
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
      className="sib-channels-banner"
    >
      <div
        className="sib-channels-banner-decoration"
        aria-hidden="true"
      >
        <span className="sib-channels-banner-shine"></span>

        <span className="sib-channels-banner-circle sib-channels-banner-circle-one"></span>

        <span className="sib-channels-banner-circle sib-channels-banner-circle-two"></span>

        <span className="sib-channels-banner-circle sib-channels-banner-circle-three"></span>

        <span className="sib-channels-banner-orbit-dot sib-channels-banner-orbit-dot-one"></span>

        <span className="sib-channels-banner-orbit-dot sib-channels-banner-orbit-dot-two"></span>
      </div>

      <div className="sib-channels-banner-container">
        <div className="sib-channels-banner-introduction">
          <div className="sib-channels-banner-label">
            <span className="sib-channels-banner-verified">
              <VerifiedIcon />
            </span>

            <span>Offizielle Kanäle</span>
          </div>

          <h2 className="sib-channels-banner-title">
            Dem Shaykh über seine offiziellen Kanäle folgen.
          </h2>

          <p className="sib-channels-banner-description">
            Neue Duruus, Artikel, Hinweise und Ankündigungen
            werden über Telegram, YouTube und WhatsApp
            veröffentlicht.
          </p>
        </div>

        <div className="sib-channels-banner-links">
          {officialChannels.map((channel, index) => (
            <a
              key={channel.id}
              href={channel.href}
              target="_blank"
              rel="noreferrer"
              className={`sib-channels-banner-link ${
                channel.primary
                  ? "sib-channels-banner-link-primary"
                  : ""
              }`}
              style={{
                "--sib-channel-index": index,
              }}
              aria-label={`${channel.platform} öffnen`}
            >
              {channel.primary && (
                <span
                  className="sib-channels-banner-primary-shine"
                  aria-hidden="true"
                ></span>
              )}

              <span className="sib-channels-banner-link-icon">
                <ChannelIcon type={channel.type} />
              </span>

              <span className="sib-channels-banner-link-content">
                <strong>{channel.platform}</strong>
                <small>{channel.description}</small>
              </span>

              <span
                className="sib-channels-banner-link-arrow"
                aria-hidden="true"
              >
                <ArrowIcon />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default OfficialChannels;