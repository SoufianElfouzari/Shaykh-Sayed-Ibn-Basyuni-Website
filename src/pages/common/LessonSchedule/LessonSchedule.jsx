import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSsrData } from "../../../SsrDataContext";
import "./LessonSchedule.css";


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
  const { lessons: initialLessons } = useSsrData();
  const serverLessons = Array.isArray(initialLessons) ? initialLessons : null;
  const [weeklyLessons, setWeeklyLessons] = useState(serverLessons || []);

  useEffect(() => {
    // Initial SSR has the deployed JSON already. Avoid a redundant fetch
    // and a client-side overwrite that could change the server-rendered table.
    if (serverLessons) return undefined;
    const controller = new AbortController();

    async function loadSchedule() {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}data/durus-schedule.json`, {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!response.ok) throw new Error("Schedule request failed");
        const data = await response.json();
        if (!Array.isArray(data.lessons)) throw new Error("Invalid schedule format");
        const lessons = data.lessons
          .filter((lesson) => lesson.enabled !== false)
          .filter((lesson) => lesson.day && lesson.time && lesson.subject);
        setWeeklyLessons(lessons);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Could not load Durus schedule:", error);
        }
      }
    }

    loadSchedule();
    return () => controller.abort();
  }, [serverLessons]);

  return (
    <section className="sib-schedule">
      <div className="sib-schedule-container">
        <header className="sib-schedule-header">
          <div>
            <p className="sib-schedule-label">
              Unterrichtsplan
            </p>

            <h2 className="sib-schedule-title">
              Islamische Unterrichte in Kassel
            </h2>
          </div>

          <p className="sib-schedule-intro">
            Hier findest du die regelmäßigen Fiqh-Unterrichtstage
            und Uhrzeiten von Shaykh Sayed Ibn Basyuni.
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