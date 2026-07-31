import Footer from "../common/Footer/Footer";
import "./Datenschutz.css";

const privacySections = [
  {
    number: "01",
    title: "Verantwortlicher",
    content: (
      <>
        <p>
          Verantwortlicher für die Verarbeitung personenbezogener Daten auf
          dieser Website im Sinne der Datenschutz-Grundverordnung ist:
        </p>

        <address className="datenschutz-contact-card">
          <strong>Soufian El-Fouzari</strong>
          <span>Rauchstraße 1</span>
          <span>34125 Kassel</span>
          <span>Deutschland</span>

          <a href="mailto:elfouzari.soufian@gmail.com">
            elfouzari.soufian@gmail.com
          </a>
        </address>

        <p>
          Für inhaltliche oder religiöse Anfragen an den Shaykh kann zusätzlich
          folgende E-Mail-Adresse genutzt werden:
        </p>

        <p>
          <a
            className="datenschutz-inline-link"
            href="mailto:elsayed.barakaat@gmail.com"
          >
            elsayed.barakaat@gmail.com
          </a>
        </p>

        <p>
          Ein Datenschutzbeauftragter wurde nicht bestellt, da hierfür keine
          gesetzliche Verpflichtung besteht.
        </p>
      </>
    ),
  },
  {
    number: "02",
    title: "Allgemeine Hinweise zur Datenverarbeitung",
    content: (
      <>
        <p>
          Der Schutz Ihrer persönlichen Daten ist uns wichtig. Personenbezogene
          Daten sind alle Informationen, durch die eine natürliche Person
          unmittelbar oder mittelbar identifiziert werden kann.
        </p>

        <p>
          Wir verarbeiten personenbezogene Daten nur, soweit dies zur
          Bereitstellung dieser Website, zur Bearbeitung von Anfragen oder zur
          Erfüllung gesetzlicher Pflichten erforderlich ist.
        </p>

        <p>
          Die Verarbeitung erfolgt insbesondere auf Grundlage von Art. 6 Abs. 1
          lit. a, b, c und f der Datenschutz-Grundverordnung, abhängig vom
          jeweiligen Zweck der Verarbeitung.
        </p>
      </>
    ),
  },
  {
    number: "03",
    title: "Hosting durch Vercel",
    content: (
      <>
        <p>
          Diese Website wird über den Hosting-Dienst Vercel bereitgestellt.
          Anbieter ist:
        </p>

        <div className="datenschutz-provider">
          <strong>Vercel Inc.</strong>
          <span>440 N Barranca Avenue, Suite 4133</span>
          <span>Covina, CA 91723</span>
          <span>USA</span>
        </div>

        <p>
          Beim Aufruf der Website verarbeitet Vercel technisch erforderliche
          Verbindungsdaten. Hierzu können insbesondere folgende Daten gehören:
        </p>

        <ul>
          <li>IP-Adresse des aufrufenden Geräts</li>
          <li>Datum und Uhrzeit des Zugriffs</li>
          <li>aufgerufene Seite oder Datei</li>
          <li>übertragene Datenmenge</li>
          <li>Browsertyp und Browserversion</li>
          <li>Betriebssystem</li>
          <li>Referrer-URL</li>
          <li>Informationen zur Fehleranalyse und Systemsicherheit</li>
        </ul>

        <p>
          Die Verarbeitung dieser Daten ist erforderlich, um die Website
          technisch bereitzustellen, ihre Stabilität zu gewährleisten und
          Angriffe oder missbräuchliche Zugriffe zu erkennen.
        </p>

        <p>
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes
          Interesse liegt in der sicheren, stabilen und zuverlässigen
          Bereitstellung unseres Internetangebots.
        </p>

        <p>
          Da Vercel ein Unternehmen mit Sitz in den USA ist, kann eine
          Verarbeitung von Daten außerhalb der Europäischen Union oder des
          Europäischen Wirtschaftsraums nicht vollständig ausgeschlossen
          werden. Hierbei werden die jeweils geltenden datenschutzrechtlichen
          Übermittlungsmechanismen eingesetzt.
        </p>

        <p>
          Weitere Informationen finden Sie in den Datenschutzhinweisen von
          Vercel:
        </p>

        <a
          className="datenschutz-external-link"
          href="https://vercel.com/legal/privacy-notice"
          target="_blank"
          rel="noreferrer"
        >
          Datenschutzhinweise von Vercel öffnen
          <span aria-hidden="true">↗</span>
        </a>
      </>
    ),
  },
  {
    number: "04",
    title: "Domainverwaltung über STRATO",
    content: (
      <>
        <p>
          Die Domain dieser Website wird durch Soufian El-Fouzari über STRATO
          verwaltet. Anbieter ist:
        </p>

        <div className="datenschutz-provider">
          <strong>STRATO AG</strong>
          <span>Otto-Ostrowski-Straße 7</span>
          <span>10249 Berlin</span>
          <span>Deutschland</span>
        </div>

        <p>
          Im Rahmen der Domainverwaltung können technisch notwendige Daten
          verarbeitet werden. Hierzu können insbesondere Domain-, Vertrags-,
          Verbindungs- und DNS-Daten gehören.
        </p>

        <p>
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit die Verarbeitung
          der Erfüllung vertraglicher Pflichten dient, sowie Art. 6 Abs. 1 lit. f
          DSGVO aufgrund unseres berechtigten Interesses an einer sicheren und
          zuverlässigen Domainverwaltung.
        </p>

        <a
          className="datenschutz-external-link"
          href="https://www.strato.de/datenschutz/"
          target="_blank"
          rel="noreferrer"
        >
          Datenschutzhinweise von STRATO öffnen
          <span aria-hidden="true">↗</span>
        </a>
      </>
    ),
  },
  {
    number: "05",
    title: "Kontaktaufnahme und Kontaktformular",
    content: (
      <>
        <p>
          Auf dieser Website besteht die Möglichkeit, über ein Kontaktformular
          mit uns Kontakt aufzunehmen. Dabei werden folgende Angaben
          verarbeitet:
        </p>

        <ul>
          <li>Name</li>
          <li>E-Mail-Adresse</li>
          <li>ausgewähltes Anliegen</li>
          <li>Inhalt der Nachricht</li>
          <li>gegebenenfalls freiwillig mitgeteilte weitere Informationen</li>
        </ul>

        <p>
          Die Angaben werden über eine selbst entwickelte Schnittstelle
          verarbeitet und anschließend per E-Mail über SMTP an die zuständige
          E-Mail-Adresse übermittelt. Die Inhalte werden nicht zusätzlich in
          einer eigenen Datenbank gespeichert.
        </p>

        <p>Das Kontaktformular kann unter anderem verwendet werden für:</p>

        <ul>
          <li>islamische Fragen</li>
          <li>Beratungsanfragen</li>
          <li>Nikah-Anfragen</li>
          <li>Vortragsanfragen</li>
          <li>Unterrichtsanfragen</li>
          <li>organisatorische Fragen</li>
          <li>technische Hinweise</li>
          <li>sonstige Anliegen</li>
        </ul>

        <p>
          Soweit Ihre Anfrage auf den Abschluss oder die Durchführung eines
          Vertrags oder einer konkreten Leistung gerichtet ist, erfolgt die
          Verarbeitung auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO.
        </p>

        <p>
          Bei allgemeinen, religiösen, organisatorischen oder sonstigen Anfragen
          erfolgt die Verarbeitung auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO.
          Unser berechtigtes Interesse liegt in der sachgerechten Bearbeitung
          der an uns gerichteten Anfrage.
        </p>

        <p>
          Falls Sie ausdrücklich in eine weitergehende Verarbeitung eingewilligt
          haben, ist Art. 6 Abs. 1 lit. a DSGVO die Rechtsgrundlage.
        </p>

        <div className="datenschutz-notice">
          <strong>Hinweis zu vertraulichen Angaben</strong>
          <p>
            Bitte übermitteln Sie über das Kontaktformular nur solche
            Informationen, die für die Bearbeitung Ihrer Anfrage erforderlich
            sind. Besonders sensible medizinische, familiäre oder andere
            vertrauliche Angaben sollten nur mitgeteilt werden, wenn dies für
            die Anfrage zwingend notwendig ist.
          </p>
        </div>
      </>
    ),
  },
  {
    number: "06",
    title: "E-Mail-Kommunikation",
    content: (
      <>
        <p>
          Wenn Sie uns per E-Mail kontaktieren, verarbeiten wir Ihre
          E-Mail-Adresse, den Inhalt Ihrer Nachricht, den Zeitpunkt der
          Übermittlung sowie gegebenenfalls weitere von Ihnen mitgeteilte
          Informationen.
        </p>

        <p>
          Die Übermittlung und Zustellung der E-Mails erfolgt über einen
          SMTP-Dienst. Dabei werden die technisch notwendigen
          Verbindungsinformationen durch die beteiligten E-Mail-Anbieter
          verarbeitet.
        </p>

        <p>
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, wenn Ihre Nachricht
          einer vertraglichen oder vorvertraglichen Maßnahme dient. In allen
          anderen Fällen erfolgt die Verarbeitung auf Grundlage von Art. 6 Abs.
          1 lit. f DSGVO aufgrund unseres berechtigten Interesses an der
          Beantwortung eingehender Nachrichten.
        </p>
      </>
    ),
  },
  {
    number: "07",
    title: "Speicherdauer von Anfragen",
    content: (
      <>
        <p>
          Personenbezogene Daten aus Kontaktanfragen werden nur so lange
          gespeichert, wie dies zur Bearbeitung der jeweiligen Anfrage
          erforderlich ist.
        </p>

        <p>
          Nach abschließender Bearbeitung wird die Kommunikation gelöscht,
          sofern keine gesetzlichen Aufbewahrungspflichten, berechtigten
          Interessen oder laufenden rechtlichen Angelegenheiten einer Löschung
          entgegenstehen.
        </p>

        <p>
          Geschäfts- oder steuerrechtlich relevante Kommunikation kann
          entsprechend den gesetzlichen Aufbewahrungsfristen länger gespeichert
          werden.
        </p>
      </>
    ),
  },
  {
    number: "08",
    title: "Vercel Web Analytics",
    content: (
      <>
        <p>
          Diese Website verwendet Vercel Web Analytics, um allgemeine
          Informationen über die Nutzung der Website auszuwerten.
        </p>

        <p>
          Vercel Web Analytics arbeitet nach Angaben des Anbieters ohne
          Drittanbieter-Cookies. Besucher werden nicht dauerhaft anhand einer
          gespeicherten Kennung verfolgt. Zur statistischen Zuordnung kann aus
          technischen Informationen einer Anfrage ein temporärer Hash gebildet
          werden. Eine daraus gebildete Sitzung wird nach Angaben von Vercel
          nach 24 Stunden verworfen.
        </p>

        <p>Verarbeitet werden können insbesondere:</p>

        <ul>
          <li>aufgerufene Seiten</li>
          <li>ungefähres Herkunftsland</li>
          <li>Browsertyp</li>
          <li>Betriebssystem</li>
          <li>Geräteart</li>
          <li>Referrer-Informationen</li>
          <li>Zeitpunkt eines Seitenaufrufs</li>
        </ul>

        <p>
          Wir verwenden diese Informationen, um zu verstehen, welche Inhalte
          aufgerufen werden, technische Probleme zu erkennen und die Website zu
          verbessern.
        </p>

        <p>
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes
          Interesse liegt in der datensparsamen statistischen Auswertung und
          Verbesserung unseres Internetangebots.
        </p>

        <a
          className="datenschutz-external-link"
          href="https://vercel.com/docs/analytics/privacy-policy"
          target="_blank"
          rel="noreferrer"
        >
          Informationen zum Datenschutz bei Vercel Analytics
          <span aria-hidden="true">↗</span>
        </a>
      </>
    ),
  },
  {
    number: "09",
    title: "Google Analytics",
    content: (
      <>
        <p>
          Soweit Sie hierzu ausdrücklich eingewilligt haben, verwendet diese
          Website Google Analytics 4. Anbieter für Nutzer innerhalb des
          Europäischen Wirtschaftsraums ist grundsätzlich:
        </p>

        <div className="datenschutz-provider">
          <strong>Google Ireland Limited</strong>
          <span>Gordon House, Barrow Street</span>
          <span>Dublin 4</span>
          <span>Irland</span>
        </div>

        <p>
          Google Analytics dient der statistischen Auswertung der Nutzung dieser
          Website. Dabei können insbesondere Informationen über Seitenaufrufe,
          Sitzungsdauer, Interaktionen, verwendete Geräte, Browser,
          Betriebssysteme und ungefähre geografische Herkunft verarbeitet
          werden.
        </p>

        <p>
          Google gibt an, IP-Adressen von Nutzern aus der Europäischen Union,
          dem Europäischen Wirtschaftsraum, der Schweiz und dem Vereinigten
          Königreich vor einer dauerhaften Protokollierung zu verwerfen.
        </p>

        <p>
          Abhängig von der erteilten Einwilligung können Cookies oder
          vergleichbare Technologien eingesetzt werden. Google Analytics wird
          daher erst aktiviert, nachdem Sie über die
          Datenschutzeinstellungen ausdrücklich zugestimmt haben.
        </p>

        <p>
          Rechtsgrundlage ist ausschließlich Ihre Einwilligung gemäß Art. 6 Abs.
          1 lit. a DSGVO sowie, soweit Informationen auf Ihrem Endgerät
          gespeichert oder ausgelesen werden, § 25 Abs. 1 TDDDG.
        </p>

        <p>
          Sie können Ihre Einwilligung jederzeit mit Wirkung für die Zukunft
          über die Datenschutzeinstellungen oder den Consent-Banner widerrufen.
          Die Rechtmäßigkeit der bis zum Widerruf erfolgten Verarbeitung bleibt
          unberührt.
        </p>

        <p>
          Es kann nicht ausgeschlossen werden, dass Daten durch Google oder
          verbundene Unternehmen auch in den USA verarbeitet werden. Google
          verwendet hierfür die jeweils geltenden rechtlichen Grundlagen und
          Schutzmechanismen für internationale Datenübermittlungen.
        </p>

        <div className="datenschutz-actions">
          <a
            className="datenschutz-external-link"
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noreferrer"
          >
            Datenschutzerklärung von Google
            <span aria-hidden="true">↗</span>
          </a>

          <a
            className="datenschutz-external-link"
            href="https://support.google.com/analytics/answer/6004245"
            target="_blank"
            rel="noreferrer"
          >
            Datenschutz bei Google Analytics
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </>
    ),
  },
  {
    number: "10",
    title: "Cookies und ähnliche Technologien",
    content: (
      <>
        <p>
          Diese Website setzt keine eigenen Cookies für Benutzerkonten,
          Kommentare, Warenkörbe, Zahlungen oder personalisierte Werbung ein.
        </p>

        <p>
          Technisch erforderliche Funktionen können ohne eine vorherige
          Einwilligung eingesetzt werden, soweit sie für die Bereitstellung der
          ausdrücklich gewünschten Website erforderlich sind.
        </p>

        <p>
          Nicht erforderliche Analyse-Technologien, insbesondere Google
          Analytics, werden nur nach Ihrer vorherigen Einwilligung aktiviert.
          Eine erteilte Einwilligung kann jederzeit über die
          Datenschutzeinstellungen widerrufen werden.
        </p>
      </>
    ),
  },
  {
    number: "11",
    title: "Downloads und Unterrichtsaufnahmen",
    content: (
      <>
        <p>
          Auf der Website können Unterrichtsaufnahmen, Audiodateien, Dokumente
          oder andere Inhalte zum Download angeboten werden.
        </p>

        <p>
          Beim Aufruf oder Download einer Datei verarbeitet der Hosting-Anbieter
          technisch notwendige Zugriffsdaten. Dazu können insbesondere die
          IP-Adresse, der Zeitpunkt des Abrufs, die aufgerufene Datei, die
          übertragene Datenmenge sowie Browser- und Geräteinformationen gehören.
        </p>

        <p>
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes
          Interesse liegt in der sicheren und zuverlässigen Bereitstellung der
          angebotenen Inhalte.
        </p>
      </>
    ),
  },
  {
    number: "12",
    title: "Artikel, Teilen und Drucken",
    content: (
      <>
        <p>
          Auf dieser Website werden eigene sowie gegebenenfalls unter Angabe der
          jeweiligen Quelle übernommene oder zitierte Artikel und Inhalte
          bereitgestellt.
        </p>

        <p>
          Artikel können über die Druckfunktion des Browsers ausgedruckt werden.
          Die Nutzung der Druckfunktion erfolgt lokal über den Browser und
          führt durch uns grundsätzlich zu keiner zusätzlichen Verarbeitung
          personenbezogener Daten.
        </p>

        <p>
          Soweit eine Teilen-Funktion verwendet wird, wird ein Inhalt erst nach
          einer aktiven Handlung des Nutzers an den ausgewählten Dienst oder
          eine auf dem Endgerät vorhandene Anwendung übergeben. Ab diesem
          Zeitpunkt kann der jeweilige externe Anbieter personenbezogene Daten
          nach seinen eigenen Datenschutzbestimmungen verarbeiten.
        </p>

        <p>
          Auf dieser Website werden derzeit keine automatisch ladenden
          Social-Media-Plugins eingesetzt.
        </p>
      </>
    ),
  },
  {
    number: "13",
    title: "Bilder und Mediendateien",
    content: (
      <>
        <p>
          Auf dieser Website werden Bilder, Grafiken, Audiodateien und sonstige
          Mediendateien verwendet. Die Dateien werden grundsätzlich über die
          eigene Website oder die verwendete Hosting-Infrastruktur
          bereitgestellt.
        </p>

        <p>
          Beim Abruf dieser Dateien entstehen die gleichen technisch
          erforderlichen Zugriffsdaten wie beim allgemeinen Aufruf der Website.
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO.
        </p>
      </>
    ),
  },
  {
    number: "14",
    title: "Eigene API",
    content: (
      <>
        <p>
          Für bestimmte technische Funktionen, insbesondere die Übermittlung
          des Kontaktformulars, wird eine selbst entwickelte API verwendet.
        </p>

        <p>
          Über diese API werden nur die für die jeweilige Funktion erforderlichen
          Daten verarbeitet. Die Kontaktdaten und Nachrichten werden nicht
          dauerhaft in einer eigenen Datenbank gespeichert, sondern per E-Mail
          an die zuständige Adresse übermittelt.
        </p>

        <p>
          Zur Sicherstellung der technischen Funktion und zur Abwehr von
          Missbrauch können kurzfristig technische Protokolldaten verarbeitet
          werden. Hierzu können IP-Adresse, Zeitpunkt des Zugriffs,
          Anfragepfad, Antwortstatus und technische Fehlerangaben gehören.
        </p>

        <p>
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit die Verarbeitung
          für eine konkrete Anfrage erforderlich ist, sowie Art. 6 Abs. 1 lit. f
          DSGVO zur Gewährleistung der Sicherheit und Funktionsfähigkeit der
          Schnittstelle.
        </p>
      </>
    ),
  },
  {
    number: "15",
    title: "Nutzung durch Minderjährige",
    content: (
      <>
        <p>
          Die öffentlich zugänglichen Inhalte dieser Website können auch von
          Minderjährigen aufgerufen werden. Die Nutzung der allgemeinen Inhalte
          erfordert weder ein Benutzerkonto noch die Angabe personenbezogener
          Daten.
        </p>

        <p>
          Minderjährige sollten über das Kontaktformular keine unnötigen
          persönlichen oder besonders vertraulichen Informationen übermitteln.
          Bei Anfragen, die rechtliche, familiäre oder besonders persönliche
          Angelegenheiten betreffen, kann je nach Alter und Art der Anfrage die
          Mitwirkung oder Zustimmung einer erziehungsberechtigten Person
          erforderlich sein.
        </p>

        <p>
          Sofern eine Verarbeitung auf einer Einwilligung beruht, gelten die
          besonderen gesetzlichen Anforderungen an die Einwilligung von
          Minderjährigen.
        </p>
      </>
    ),
  },
  {
    number: "16",
    title: "Keine Benutzerkonten und keine Datenbankprofile",
    content: (
      <>
        <p>
          Diese Website bietet derzeit keine Registrierung, keine
          Benutzerkonten und keinen Login-Bereich an.
        </p>

        <p>
          Es werden keine Nutzerprofile, Kundenkonten, Kommentarprofile oder
          vergleichbare personenbezogene Datensätze in einer eigenen Datenbank
          angelegt.
        </p>
      </>
    ),
  },
  {
    number: "17",
    title: "Keine Zahlungsdienste",
    content: (
      <>
        <p>
          Auf dieser Website werden derzeit keine Zahlungen abgewickelt und
          keine Zahlungsdienste eingebunden.
        </p>

        <p>
          Es werden daher über diese Website keine Zahlungs-, Konto- oder
          Kreditkartendaten erhoben.
        </p>
      </>
    ),
  },
  {
    number: "18",
    title: "Keine Newsletter und keine eingebetteten Videos",
    content: (
      <>
        <p>
          Derzeit wird über diese Website kein Newsletter angeboten. Ebenso
          werden aktuell keine Videos von externen Videoplattformen automatisch
          in die Website eingebettet.
        </p>

        <p>
          Sollte zukünftig ein Newsletter oder ein Videoportal eingeführt
          werden, wird diese Datenschutzerklärung vor der Aktivierung der
          entsprechenden Funktionen angepasst.
        </p>

        <p>
          Bei extern eingebetteten Videos wird, soweit erforderlich, eine
          datenschutzfreundliche Lösung eingesetzt, bei der eine Verbindung zum
          jeweiligen Anbieter erst nach einer aktiven Einwilligung oder
          Freigabe hergestellt wird.
        </p>
      </>
    ),
  },
  {
    number: "19",
    title: "Datensicherheit",
    content: (
      <>
        <p>
          Diese Website verwendet eine verschlüsselte HTTPS-Verbindung. Dadurch
          werden Daten, die zwischen Ihrem Browser und der Website übertragen
          werden, vor einem unbefugten Mitlesen während der Übertragung
          geschützt.
        </p>

        <p>
          Darüber hinaus treffen wir angemessene technische und organisatorische
          Maßnahmen, um personenbezogene Daten vor Verlust, Manipulation,
          unberechtigtem Zugriff und unberechtigter Offenlegung zu schützen.
        </p>

        <p>
          Eine vollständig risikofreie Datenübertragung über das Internet kann
          trotz sorgfältiger Schutzmaßnahmen nicht garantiert werden.
        </p>
      </>
    ),
  },
  {
    number: "20",
    title: "Empfänger personenbezogener Daten",
    content: (
      <>
        <p>
          Personenbezogene Daten werden nur an solche Empfänger weitergegeben,
          deren Einbindung für den Betrieb der Website oder die Bearbeitung
          einer Anfrage erforderlich ist.
        </p>

        <p>Hierzu können insbesondere gehören:</p>

        <ul>
          <li>Hosting- und Infrastrukturprovider</li>
          <li>Domainanbieter</li>
          <li>E-Mail- und SMTP-Anbieter</li>
          <li>technische Dienstleister</li>
          <li>Analysedienste nach erteilter Einwilligung</li>
          <li>Behörden oder Gerichte bei einer gesetzlichen Verpflichtung</li>
        </ul>

        <p>
          Eine Weitergabe zu Werbezwecken oder ein Verkauf personenbezogener
          Daten findet nicht statt.
        </p>
      </>
    ),
  },
  {
    number: "21",
    title: "Internationale Datenübermittlungen",
    content: (
      <>
        <p>
          Bei der Nutzung von Vercel, Google Analytics oder beteiligten
          technischen Dienstleistern kann nicht ausgeschlossen werden, dass
          personenbezogene Daten auch außerhalb der Europäischen Union oder des
          Europäischen Wirtschaftsraums verarbeitet werden.
        </p>

        <p>
          Soweit für das jeweilige Empfängerland kein
          Angemessenheitsbeschluss der Europäischen Kommission besteht, erfolgt
          eine Übermittlung nur auf Grundlage geeigneter Garantien, gesetzlicher
          Ausnahmen oder anderer zulässiger Übermittlungsmechanismen.
        </p>
      </>
    ),
  },
  {
    number: "22",
    title: "Ihre Datenschutzrechte",
    content: (
      <>
        <p>
          Ihnen stehen nach Maßgabe der gesetzlichen Voraussetzungen
          insbesondere folgende Rechte zu:
        </p>

        <div className="datenschutz-rights-grid">
          <article>
            <span>01</span>
            <div>
              <strong>Auskunft</strong>
              <p>
                Sie können Auskunft darüber verlangen, ob und welche
                personenbezogenen Daten über Sie verarbeitet werden.
              </p>
            </div>
          </article>

          <article>
            <span>02</span>
            <div>
              <strong>Berichtigung</strong>
              <p>
                Sie können die Berichtigung unrichtiger oder die Vervollständigung
                unvollständiger Daten verlangen.
              </p>
            </div>
          </article>

          <article>
            <span>03</span>
            <div>
              <strong>Löschung</strong>
              <p>
                Sie können unter den gesetzlichen Voraussetzungen die Löschung
                Ihrer personenbezogenen Daten verlangen.
              </p>
            </div>
          </article>

          <article>
            <span>04</span>
            <div>
              <strong>Einschränkung</strong>
              <p>
                Sie können unter bestimmten Voraussetzungen die Einschränkung
                der Verarbeitung verlangen.
              </p>
            </div>
          </article>

          <article>
            <span>05</span>
            <div>
              <strong>Datenübertragbarkeit</strong>
              <p>
                Sie können bestimmte Daten in einem strukturierten,
                gebräuchlichen und maschinenlesbaren Format erhalten.
              </p>
            </div>
          </article>

          <article>
            <span>06</span>
            <div>
              <strong>Widerruf</strong>
              <p>
                Eine erteilte Einwilligung kann jederzeit mit Wirkung für die
                Zukunft widerrufen werden.
              </p>
            </div>
          </article>
        </div>
      </>
    ),
  },
  {
    number: "23",
    title: "Widerspruchsrecht",
    content: (
      <>
        <div className="datenschutz-objection">
          <strong>Widerspruch nach Art. 21 DSGVO</strong>

          <p>
            Soweit wir personenbezogene Daten auf Grundlage von Art. 6 Abs. 1
            lit. e oder f DSGVO verarbeiten, haben Sie das Recht, aus Gründen,
            die sich aus Ihrer besonderen Situation ergeben, jederzeit gegen
            diese Verarbeitung Widerspruch einzulegen.
          </p>

          <p>
            Wir verarbeiten die betroffenen Daten anschließend nicht mehr, es
            sei denn, wir können zwingende schutzwürdige Gründe für die
            Verarbeitung nachweisen, die Ihre Interessen, Rechte und Freiheiten
            überwiegen, oder die Verarbeitung dient der Geltendmachung,
            Ausübung oder Verteidigung von Rechtsansprüchen.
          </p>
        </div>
      </>
    ),
  },
  {
    number: "24",
    title: "Beschwerderecht bei einer Aufsichtsbehörde",
    content: (
      <>
        <p>
          Sie haben das Recht, sich bei einer Datenschutzaufsichtsbehörde über
          die Verarbeitung Ihrer personenbezogenen Daten zu beschweren.
        </p>

        <p>
          Zuständig ist insbesondere die Aufsichtsbehörde Ihres gewöhnlichen
          Aufenthaltsorts, Ihres Arbeitsplatzes oder des Orts des mutmaßlichen
          Datenschutzverstoßes.
        </p>

        <div className="datenschutz-provider">
          <strong>
            Der Hessische Beauftragte für Datenschutz und Informationsfreiheit
          </strong>
          <span>Postfach 3163</span>
          <span>65021 Wiesbaden</span>
          <span>Deutschland</span>
        </div>

        <a
          className="datenschutz-external-link"
          href="https://datenschutz.hessen.de/"
          target="_blank"
          rel="noreferrer"
        >
          Datenschutzaufsicht Hessen öffnen
          <span aria-hidden="true">↗</span>
        </a>
      </>
    ),
  },
  {
    number: "25",
    title: "Änderung dieser Datenschutzerklärung",
    content: (
      <>
        <p>
          Wir behalten uns vor, diese Datenschutzerklärung anzupassen, wenn sich
          die Website, die eingesetzten Dienste oder die gesetzlichen
          Anforderungen ändern.
        </p>

        <p>
          Dies gilt insbesondere für die geplante Einführung eines Newsletters,
          eines Videoportals, neuer Kommunikationsmöglichkeiten oder weiterer
          technischer Funktionen.
        </p>

        <p>
          Es gilt die jeweils auf dieser Website veröffentlichte aktuelle
          Fassung.
        </p>
      </>
    ),
  },
];

function Datenschutz() {
  return (
    <main className="datenschutz-page">
      <section className="datenschutz-hero">
        <div className="datenschutz-hero-pattern" aria-hidden="true" />

        <div className="datenschutz-shell datenschutz-hero-content">
          <div className="datenschutz-breadcrumb">
            <a href="/">Startseite</a>
            <span aria-hidden="true">/</span>
            <span>Datenschutz</span>
          </div>

          <div className="datenschutz-hero-grid">
            <div className="datenschutz-hero-copy">
              <span className="datenschutz-eyebrow">Rechtliche Informationen</span>

              <h1>Datenschutz&shy;erklärung</h1>

              <p>
                Informationen zur Verarbeitung personenbezogener Daten beim
                Besuch und bei der Nutzung dieser Website.
              </p>
            </div>

            <div className="datenschutz-hero-meta">
              <span>Stand</span>
              <strong>31. Juli 2026</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="datenschutz-main">
        <div className="datenschutz-shell datenschutz-layout">
          <aside className="datenschutz-sidebar">
            <div className="datenschutz-sidebar-inner">
              <span className="datenschutz-sidebar-label">Auf dieser Seite</span>

              <nav aria-label="Inhaltsverzeichnis Datenschutz">
                {privacySections.map((section) => (
                  <a
                    key={section.number}
                    href={`#datenschutz-${section.number}`}
                  >
                    <span>{section.number}</span>
                    {section.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          <div className="datenschutz-content">
            <div className="datenschutz-intro">
              <span className="datenschutz-intro-icon" aria-hidden="true">
                i
              </span>

              <div>
                <strong>Transparente Informationen</strong>
                <p>
                  Nachfolgend erläutern wir, welche Daten bei der Nutzung dieser
                  Website verarbeitet werden, zu welchen Zwecken dies geschieht
                  und welche Rechte Ihnen zustehen.
                </p>
              </div>
            </div>

            {privacySections.map((section) => (
              <article
                className="datenschutz-section"
                id={`datenschutz-${section.number}`}
                key={section.number}
              >
                <header className="datenschutz-section-header">
                  <span>{section.number}</span>
                  <h2>{section.title}</h2>
                </header>

                <div className="datenschutz-section-body">
                  {section.content}
                </div>
              </article>
            ))}

            <section className="datenschutz-contact">
              <div>
                <span className="datenschutz-contact-label">
                  Fragen zum Datenschutz
                </span>

                <h2>Kontakt aufnehmen</h2>

                <p>
                  Bei Fragen zur Verarbeitung Ihrer personenbezogenen Daten oder
                  zur Ausübung Ihrer Datenschutzrechte können Sie uns per E-Mail
                  kontaktieren.
                </p>
              </div>

              <a href="mailto:elfouzari.soufian@gmail.com">
                E-Mail schreiben
                <span aria-hidden="true">↗</span>
              </a>
            </section>
          </div>
        </div>
      </section>
      <Footer/>
    </main>
  );
}

export default Datenschutz;