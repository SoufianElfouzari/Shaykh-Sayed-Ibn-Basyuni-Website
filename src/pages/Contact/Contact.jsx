import { Link } from "react-router-dom";
import ExploreContent from "../common/ExploreContent/ExploreContent";
import ContactForm from "../common/ContactForm/ContactForm";
import Footer from "../common/Footer/Footer";
import Header from "../common/Header/Header";

function Contact() {
  return (
    <div className="contact">
      <Header />

      <main>
        <ContactForm headingLevel={1} />

        <section
          aria-labelledby="kontakt-informationen-title"
          style={{
            maxWidth: "1080px",
            margin: "0 auto",
            padding: "clamp(32px, 5vw, 64px) 24px",
            lineHeight: 1.8,
          }}
        >
          <h2 id="kontakt-informationen-title">
            Informationen zu deiner Kontaktanfrage
          </h2>
          <p>
            Über die Kontaktseite kannst du eine Nachricht an das Team der
            Website von Shaykh Sayed Ibn Basyuni senden. Das Formular ist
            für allgemeine Fragen, organisatorische Hinweise und Anliegen
            zu den veröffentlichten islamischen Inhalten vorgesehen.
            Wähle dazu zunächst den passenden Betreff aus und beschreibe
            anschließend dein Anliegen möglichst verständlich.
          </p>

          <h3>Fragen zu Unterrichten und Veröffentlichungen</h3>
          <p>
            Wenn du eine Frage zu einem Unterricht, einer Unterrichtsreihe
            oder einer veröffentlichten Aufnahme hast, nenne nach
            Möglichkeit den Titel des Unterrichts. Bei Fragen zu einem
            Artikel ist es hilfreich, den Titel des Beitrags oder den
            entsprechenden Link anzugeben. So lässt sich deine Nachricht
            besser einordnen. Bereits veröffentlichte Inhalte findest du
            im <Link to="/durous">Unterrichtsarchiv</Link> und in der
            {" "}<Link to="/artikel">Artikelübersicht</Link>.
          </p>

          <h3>Eine religiöse Frage einreichen</h3>
          <p>
            Für eine Fatwa-Anfrage kannst du im Kontaktformular das
            Anliegen „Fatwa-Anfrage“ auswählen. Formuliere deine
            religiöse Frage klar und füge die Informationen hinzu, die
            für das Verständnis der Situation notwendig sind. Vermeide
            dabei unnötige persönliche Angaben. Die Einreichung einer
            Frage bedeutet nicht, dass eine individuelle Antwort oder
            eine bestimmte Bearbeitungszeit zugesichert werden kann.
          </p>

          <h3>Antworten und Datenschutz</h3>
          <p>
            Bitte gib eine gültige E-Mail-Adresse an, damit eine
            Rückmeldung möglich ist. Prüfe deine Angaben vor dem
            Absenden und übermittle keine Passwörter oder anderen
            vertraulichen Zugangsdaten. Informationen zur Verarbeitung
            der übermittelten Daten findest du in den
            {" "}<Link to="/datenschutz">Datenschutzhinweisen</Link>.
            Bei organisatorischen Änderungen zu Unterrichtsterminen
            empfiehlt es sich außerdem, die aktuellen Hinweise auf
            der Website zu beachten.
          </p>
        </section>

        <ExploreContent page="contact" />
      </main>

      <Footer />
    </div>
  );
}

export default Contact;
