import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./ContactForm.css";

const CONTACT_ENDPOINT = "https://shaykhsayeddev.pythonanywhere.com/api/contact";

const initialFormData = {
  name: "",
  email: "",
  subject: "",
  message: "",
  privacyAccepted: false,
};

function SendIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M20.5 4.5L10.6 14.4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <path
        d="M20.5 4.5L14.2 20L10.6 14.4L5 10.8L20.5 4.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M6.5 12.5L10.2 16L17.8 8.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ContactForm() {
  const sectionRef = useRef(null);

  const [formData, setFormData] = useState(initialFormData);
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [submitMessage, setSubmitMessage] = useState("");

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

        section.classList.add("sib-contact-form-visible");
        observer.unobserve(section);
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -60px 0px",
      },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (submitStatus !== "idle") {
      setSubmitStatus("idle");
      setSubmitMessage("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.privacyAccepted) {
      setSubmitStatus("error");
      setSubmitMessage(
        "Bitte bestätige zuerst die Datenschutzhinweise.",
      );
      return;
    }

    setSubmitStatus("sending");
    setSubmitMessage("");

    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject,
          message: formData.message.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Kontaktanfrage fehlgeschlagen: ${response.status}`,
        );
      }

      setSubmitStatus("success");
      setSubmitMessage(
        "Deine Nachricht wurde erfolgreich übermittelt.",
      );
      setFormData(initialFormData);
    } catch (error) {
      console.error(error);

      setSubmitStatus("error");
      setSubmitMessage(
        "Die Nachricht konnte nicht versendet werden. Bitte versuche es später erneut.",
      );
    }
  };

  const handleSendAnother = () => {
    setSubmitStatus("idle");
    setSubmitMessage("");
  };

  return (
    <section
      ref={sectionRef}
      className="sib-contact-form"
      id="kontaktformular"
    >
      <div
        className="sib-contact-form-decoration"
        aria-hidden="true"
      >
        <span className="sib-contact-form-decoration-circle sib-contact-form-decoration-circle-one"></span>
        <span className="sib-contact-form-decoration-circle sib-contact-form-decoration-circle-two"></span>

        <span className="sib-contact-form-decoration-line"></span>

        <span className="sib-contact-form-decoration-dot sib-contact-form-decoration-dot-one"></span>
        <span className="sib-contact-form-decoration-dot sib-contact-form-decoration-dot-two"></span>
      </div>

      <div className="sib-contact-form-container">
        <header className="sib-contact-form-header">
          <div className="sib-contact-form-header-top">
            <div className="sib-contact-form-label-row">
              <span
                className="sib-contact-form-label-line"
                aria-hidden="true"
              ></span>

              <p className="sib-contact-form-label">
                Kontakt
              </p>
            </div>

            <span className="sib-contact-form-section-number">
              01
            </span>
          </div>

          <h1 className="sib-contact-form-title">
            Eine Nachricht
            <span>übermitteln.</span>
          </h1>

          <p className="sib-contact-form-description">
            Über dieses Formular können allgemeine Anfragen,
            Hinweise und organisatorische Anliegen übermittelt
            werden.
          </p>
        </header>

        {submitStatus === "success" ? (
          <div
            className="sib-contact-form-panel sib-contact-success"
            role="status"
            aria-live="polite"
          >
            <span
              className="sib-contact-success-icon"
              aria-hidden="true"
            >
              <CheckIcon />
            </span>

            <h2>Nachricht gesendet</h2>

            <p className="sib-contact-success-message">
              {submitMessage}
            </p>

            <p className="sib-contact-success-note">
              Die Kommunikation erfolgt ausschließlich per
              E-Mail. Du erhältst deine Antwort an die von dir
              angegebene E-Mail-Adresse.
            </p>

            <button
              type="button"
              className="sib-contact-submit sib-contact-success-reset"
              onClick={handleSendAnother}
            >
              <span>Weitere Nachricht senden</span>
            </button>
          </div>
        ) : (
          <form
            className="sib-contact-form-panel"
            onSubmit={handleSubmit}
          >
            <div className="sib-contact-form-panel-header">
              <div>
                <p className="sib-contact-form-panel-label">
                  Kontaktformular
                </p>

                <h2>Nachricht verfassen</h2>

                <p className="sib-contact-form-panel-subtitle">
                  Wir antworten ausschließlich per E-Mail an
                  die von dir angegebene Adresse.
                </p>
              </div>

              <p className="sib-contact-form-required-note">
                Mit <span>*</span> markierte Felder sind
                erforderlich.
              </p>
            </div>

            <div className="sib-contact-form-fields">
              <div
                className="sib-contact-field"
                style={{ "--sib-contact-field-index": 0 }}
              >
                <label htmlFor="contact-name">
                  Name <span>*</span>
                </label>

                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Vor- und Nachname"
                  autoComplete="name"
                  required
                />
              </div>

              <div
                className="sib-contact-field"
                style={{ "--sib-contact-field-index": 1 }}
              >
                <label htmlFor="contact-email">
                  E-Mail-Adresse <span>*</span>
                </label>

                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@beispiel.de"
                  autoComplete="email"
                  required
                />
              </div>

              <div
                className="sib-contact-field sib-contact-field-full"
                style={{ "--sib-contact-field-index": 2 }}
              >
                <label htmlFor="contact-subject">
                  Anliegen <span>*</span>
                </label>

                <div className="sib-contact-select-wrapper">
                  <select
                    id="contact-subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>
                      Bitte ein Anliegen auswählen
                    </option>

                    <option value="allgemeine-anfrage">
                      Allgemeine Frage
                    </option>

                    <option value="unterricht">
                      Frage zum Unterricht
                    </option>

                    <option value="website">
                      Hinweis zur Website
                    </option>

                    <option value="organisatorisches">
                      Organisatorisches Anliegen
                    </option>

                    <option value="nikah">
                      Termin für Heirat vereinbaren
                    </option>

                    <option value="sonstiges">
                      Sonstiges
                    </option>
                  </select>

                  <span
                    className="sib-contact-select-arrow"
                    aria-hidden="true"
                  ></span>
                </div>
              </div>

              <div
                className="sib-contact-field sib-contact-field-full"
                style={{ "--sib-contact-field-index": 3 }}
              >
                <div className="sib-contact-textarea-heading">
                  <label htmlFor="contact-message">
                    Nachricht <span>*</span>
                  </label>

                  <span>
                    {formData.message.length} / 2000
                  </span>
                </div>

                <textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Bitte formuliere dein Anliegen möglichst klar und vollständig."
                  rows="9"
                  maxLength="2000"
                  required
                ></textarea>
              </div>
            </div>

            <div className="sib-contact-form-bottom">
              <label className="sib-contact-privacy">
                <input
                  name="privacyAccepted"
                  type="checkbox"
                  checked={formData.privacyAccepted}
                  onChange={handleChange}
                />

                <span
                  className="sib-contact-privacy-box"
                  aria-hidden="true"
                >
                  <CheckIcon />
                </span>

                <span className="sib-contact-privacy-text">
                  Ich habe die{" "}
                  <Link to="/datenschutz">
                    Datenschutzhinweise
                  </Link>{" "}
                  gelesen und stimme der Verarbeitung meiner
                  Angaben zur Bearbeitung der Anfrage zu.
                </span>
              </label>

              <button
                type="submit"
                className="sib-contact-submit"
                disabled={submitStatus === "sending"}
              >
                <span>
                  {submitStatus === "sending"
                    ? "Wird versendet"
                    : "Nachricht senden"}
                </span>

                <span
                  className="sib-contact-submit-icon"
                  aria-hidden="true"
                >
                  <SendIcon />
                </span>
              </button>
            </div>

            <div
              className={`sib-contact-form-status ${
                submitStatus === "error"
                  ? "sib-contact-form-status-error"
                  : ""
              }`}
              aria-live="polite"
            >
              {submitStatus === "error" && submitMessage && (
                <>
                  <span
                    className="sib-contact-form-status-dot"
                    aria-hidden="true"
                  ></span>

                  <p>{submitMessage}</p>
                </>
              )}
            </div>
          </form>
        )}

        <footer className="sib-contact-form-footer">
          <span
            className="sib-contact-form-footer-line"
            aria-hidden="true"
          ></span>

          <p>
            Bitte habe Verständnis dafür, dass nicht jede
            Nachricht persönlich beantwortet werden kann.
          </p>
        </footer>
      </div>
    </section>
  );
}

export default ContactForm;