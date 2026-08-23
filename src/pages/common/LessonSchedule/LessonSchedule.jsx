import { Link } from "react-router-dom";
import "./LessonSchedule.css";

const weeklyLessons = [
  {
    id: 1,
    day: "Dienstag",
    time: "Nach Asr",
    subject: "Mustalah al-Hadith",
  },
  {
    id: 2,
    day: "Mittwoch",
    time: "Nach Asr",
    subject: "Fiqh (Mulakhas al-Fiqhi von Shaykh al-Fawzan)",
  },
  {
    id: 3,
    day: "Donnerstag",
    time: "Nach Asr",
    subject: "Fiqh (Mulakhas al-Fiqhi von Shaykh al-Fawzan)",
  },
  {
    id: 4,
    day: "Sonntag",
    time: "Nach Asr",
    subject: "Fiqh",
  },
  {
    id: 5,
    day: "Sonntag",
    time: "Nach Maghrib bis Ishaa",
    subject: "Fiqh (Arabisch)",
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

function LessonSchedule() {
  return (
    <section className="sib-schedule">
      <div className="sib-schedule-container">
        <header className="sib-schedule-header">
          <div>
            <p className="sib-schedule-label">
              Unterrichtsplan
            </p>

            <h2 className="sib-schedule-title">
              Regelmäßige Unterrichte
            </h2>
          </div>

          <p className="sib-schedule-intro">
            Eine Übersicht der aktuellen Unterrichtstage und
            Uhrzeiten.
          </p>
        </header>

        <div className="sib-schedule-panel">
          <div className="sib-schedule-panel-header">
            <div>
              <span className="sib-schedule-panel-eyebrow">
                Wochenplan
              </span>

              <h3>Aktuelle Durous</h3>
            </div>

            <span className="sib-schedule-status">
              <span
                className="sib-schedule-status-dot"
                aria-hidden="true"
              ></span>

              Aktuell
            </span>
          </div>

          <div className="sib-schedule-table">
            <div
              className="sib-schedule-table-head"
              aria-hidden="true"
            >
              <span>Tag</span>
              <span>Uhrzeit</span>
              <span>Unterricht</span>
            </div>

            <div className="sib-schedule-table-body">
              {weeklyLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="sib-schedule-row"
                >
                  <div className="sib-schedule-day">
                    <span
                      className="sib-schedule-row-dot"
                      aria-hidden="true"
                    ></span>

                    <span>{lesson.day}</span>
                  </div>

                  <div className="sib-schedule-time">
                    <span className="sib-schedule-mobile-label">
                      Uhrzeit
                    </span>

                    <span>{lesson.time}</span>
                  </div>

                  <div className="sib-schedule-subject">
                    <span className="sib-schedule-mobile-label">
                      Unterricht
                    </span>

                    <strong>{lesson.subject}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <footer className="sib-schedule-footer">
            <p>
              Änderungen und weitere Hinweise werden auf der
              Durous-Seite veröffentlicht.
            </p>

            <Link
              to="/durous"
              className="sib-schedule-link"
            >
              <span>Alle Durous ansehen</span>
              <ArrowIcon />
            </Link>
          </footer>
        </div>
      </div>
    </section>
  );
}

export default LessonSchedule;