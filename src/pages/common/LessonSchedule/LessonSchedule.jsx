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

function CalendarIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6M17 2v6M3 11h18"/></svg>; }
function ClockIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/></svg>; }
function BookIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true"><path d="M12 6c-3-3-7-3-10-2v15c4-1 8 0 10 2 2-2 6-3 10-2V4c-3-1-7-1-10 2Zm0 0v15"/></svg>; }
function InfoIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 11v6M12 7v2"/></svg>; }
function LessonSchedule() {
  const { lessons: serverLessons, __ssrPath } = useSsrData();
  const hasServerLessons = (__ssrPath === "/" || __ssrPath === "/durous") && Array.isArray(serverLessons);
  const [weeklyLessons, setWeeklyLessons] = useState(hasServerLessons ? serverLessons : []);

  useEffect(() => {
    if (hasServerLessons) return undefined;
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
  }, [hasServerLessons]);

  return (
    <section className="sib-schedule">
      <div className="sib-schedule-mosque" aria-hidden="true" />
      <div className="sib-schedule-container">
        <header className="sib-schedule-header">
          <div>
            <p className="sib-schedule-label">
              Unterrichtsplan
            </p>

            <h2 className="sib-schedule-title">
              Islamische Unterrichte <span>in Kassel</span>
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
                    <CalendarIcon />

                    <span>{lesson.day}</span>
                  </div>

                  <div className="sib-schedule-time">
                    <ClockIcon />
                    <span className="sib-schedule-mobile-label">
                      Uhrzeit
                    </span>

                    <span>{lesson.time}</span>
                  </div>

                  <div className="sib-schedule-subject">
                    <BookIcon />
                    <span className="sib-schedule-mobile-label">
                      Unterricht
                    </span>

                    <span className="sib-schedule-subject-name">{lesson.subject}</span>
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