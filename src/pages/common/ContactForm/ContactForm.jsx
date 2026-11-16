import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
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

function ContactIcon({ kind }) {
  const paths = {
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4.5 21v-2a7.5 7.5 0 0 1 15 0v2" /></>,
    layers: <><path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5" /></>,
    question: <><path d="M12 3a9 9 0 0 0-7.5 14L3 21l4.8-2.2A9 9 0 1 0 12 3Z" /><path d="M9 9a3 3 0 0 1 6 1c0 2-3 2-3 4" /><path d="M12 17h.01" /></>,
    shield: <><path d="m12 2 9 4v6c0 6-4 9-9 11-5-2-9-5-9-11V6l9-4Z" /><path d="m8 12 3 3 5-6" /></>,
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7v2" /></>,
    message: <><path d="M21 11a8 8 0 0 1-8 8H6l-3 2 1-5a8 8 0 1 1 17-5Z" /></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[kind]}</svg>;
}
const fatwaBenefits = [
  { icon: "question", title: "Fundierte Antwort", text: "auf Grundlage von Quran und Sunnah" },
  { icon: "layers", title: "Wissenschaftlich geprüft", text: "nach den Prinzipien der Ahl as-Sunnah" },
  { icon: "shield", title: "Vertraulich & respektvoll", text: "deine Anfrage wird mit Sorgfalt behandelt" },
];
function ContactForm({ headingLevel = 2 }) {
  const HeadingTag = headingLevel === 1 ? "h1" : "h2";
  const homeFatwa = headingLevel !== 1;
  const location = useLocation();
  const isFatwaRequest = new URLSearchParams(location.search).get("anliegen") === "fatwa";
  const sectionRef = useRef(null);

  const [formData, setFormData] = useState(() => ({ ...initialFormData, subject: isFatwaRequest ? "fatwa" : "" }));
  useEffect(() => {
    if (!isFatwaRequest) return undefined;
    // Update a mounted form when navigating to the Fatwa CTA without
    // synchronously scheduling React state updates inside an effect.
    const frame = window.requestAnimationFrame(() => {
      setFormData((current) => ({ ...current, subject: "fatwa" }));
    });
    return () => window.cancelAnimationFrame(frame);
  }, [isFatwaRequest]);
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
      setFormData({ ...initialFormData, subject: isFatwaRequest ? "fatwa" : "" });
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
      className={`sib-contact-form ${homeFatwa ? "sib-contact-form--home-fatwa" : ""}`}
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
        {homeFatwa && <div className="sib-contact-form-mosque" aria-hidden="true" />}
        <header className="sib-contact-form-header">
          <div className="sib-contact-form-header-top">
            <div className="sib-contact-form-label-row">
              <span
                className="sib-contact-form-label-line"
                aria-hidden="true"
              ></span>

              <p className="sib-contact-form-label">
                {homeFatwa ? "Fatwa anfragen" : "Kontakt"}
              </p>
            </div>

            {!homeFatwa && <span className="sib-contact-form-section-number">01</span>}
          </div>

          <HeadingTag className="sib-contact-form-title">
            {homeFatwa ? "Stelle deine Frage" : (isFatwaRequest ? "Fatwa" : "Eine Nachricht")}
            <span>{homeFatwa ? "zum Islam." : (isFatwaRequest ? "anfragen." : "übermitteln.")}</span>
          </HeadingTag>

          <p className="sib-contact-form-description">
            {homeFatwa ? "Du hast eine Frage zum Gebet, Fasten, zur Glaubenslehre oder zu anderen islamischen Angelegenheiten? Reiche deine Frage über das Formular ein." : (isFatwaRequest ? "Hier kannst du eine religiöse Frage einreichen. Bitte beschreibe dein Anliegen möglichst klar. Eine persönliche Antwort kann nicht garantiert werden." : "Über dieses Formular können allgemeine Anfragen, Hinweise und organisatorische Anliegen übermittelt werden.")}
          </p>
          {homeFatwa && <div className="sib-contact-benefits">{fatwaBenefits.map((item) => <div className="sib-contact-benefit" key={item.title}><span className="sib-contact-benefit-icon"><ContactIcon kind={item.icon} /></span><span className="sib-contact-benefit-copy"><strong>{item.title}</strong><span>{item.text}</span></span></div>)}</div>}
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
              {homeFatwa && <span className="sib-contact-panel-icon"><ContactIcon kind="mail" /></span>}
              <div>
                {!homeFatwa && <p className="sib-contact-form-panel-label">Kontaktformular</p>}

                <h2>{homeFatwa ? "Fatwa anfragen" : "Nachricht verfassen"}</h2>

                <p className="sib-contact-form-panel-subtitle">
                  {homeFatwa ? "Fülle das Formular aus und stelle deine Frage." : "Wir antworten ausschließlich per E-Mail an die von dir angegebene Adresse."}
                </p>
              </div>

              {!homeFatwa && <p className="sib-contact-form-required-note">Mit <span>*</span> markierte Felder sind erforderlich.</p>}
            </div>

            <div className="sib-contact-form-fields">
              <div className="sib-contact-field">
                <label htmlFor="contact-name">
                  {homeFatwa ? "Dein Name" : "Name"} <span>*</span>
                </label>

                <div className="sib-contact-input-wrap">{homeFatwa && <ContactIcon kind="user" />}
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={homeFatwa ? "z. B. Ahmad" : "Vor- und Nachname"}
                  autoComplete="name"
                  required
                /></div>
              </div>

              <div
                className="sib-contact-field"
              >
                <label htmlFor="contact-email">
                  {homeFatwa ? "Deine E-Mail-Adresse" : "E-Mail-Adresse"} <span>*</span>
                </label>

                <div className="sib-contact-input-wrap">{homeFatwa && <ContactIcon kind="mail" />}
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={homeFatwa ? "z. B. ahmad@example.de" : "name@beispiel.de"}
                  autoComplete="email"
                  required
                /></div>
              </div>

              <div
                className="sib-contact-field sib-contact-field-full"
              >
                <label htmlFor="contact-subject">
                  {homeFatwa ? "Thema deiner Frage" : "Anliegen"} <span>*</span>
                </label>

                <div className="sib-contact-select-wrapper">
                  {homeFatwa && <ContactIcon kind="layers" />}
                  <select
                    id="contact-subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>
                      {homeFatwa ? "Thema auswählen" : "Bitte ein Anliegen auswählen"}
                    </option>

                    <option value="fatwa">Fatwa-Anfrage (religiöse Frage)</option>

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
              >
                <div className="sib-contact-textarea-heading">
                  <label htmlFor="contact-message">
                    {homeFatwa ? "Deine Frage" : "Nachricht"} <span>*</span>
                  </label>

                  <span>
                    {formData.message.length} / 2000
                  </span>
                </div>

                <div className="sib-contact-textarea-wrap">{homeFatwa && <ContactIcon kind="message" />}
                <textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={homeFatwa ? "Stelle hier deine Frage so klar und detailliert wie möglich ..." : "Bitte formuliere dein Anliegen möglichst klar und vollständig."}
                  rows={homeFatwa ? 5 : 9}
                  maxLength="2000"
                  required
                ></textarea></div>
              </div>
            </div>

            {homeFatwa && <div className="sib-contact-notice"><ContactIcon kind="info" /><p><strong>Hinweis</strong><span>Eine persönliche Antwort kann nicht garantiert werden. Ausgewählte Fragen werden auf der Website als Fatwa (Frage und Antwort) veröffentlicht.</span></p></div>}
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
                    : homeFatwa ? "Frage einreichen" : "Nachricht senden"}
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

        {!homeFatwa && <footer className="sib-contact-form-footer">
          <span
            className="sib-contact-form-footer-line"
            aria-hidden="true"
          ></span>

          <p>
            Bitte habe Verständnis dafür, dass nicht jede
            Nachricht persönlich beantwortet werden kann.
          </p>
        </footer>}
      </div>
    </section>
  );
}

export default ContactForm;