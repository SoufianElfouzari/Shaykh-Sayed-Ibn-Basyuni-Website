# Shaykh Sayed Ibn Basyuni Website

Offizielle deutschsprachige Website von Dr. Shaykh Sayed Ibn Basyuni hafidhahullah.

Die Plattform stellt Informationen über den Shaykh, seine Unterrichtstätigkeit, veröffentlichte Artikel, aufgezeichnete Durous, aktuelle Unterrichtshinweise und Kontaktmöglichkeiten bereit.

## Live-Website

https://www.shaykh-sayed.de/

## Inhaltsverzeichnis

- [Über das Projekt](#über-das-projekt)
- [Funktionen](#funktionen)
- [Seiten und Routen](#seiten-und-routen)
- [Technologien](#technologien)
- [Projektstruktur](#projektstruktur)
- [Lokale Installation](#lokale-installation)
- [Umgebungsvariablen](#umgebungsvariablen)
- [Appwrite-Konfiguration](#appwrite-konfiguration)
- [Datenmodell](#datenmodell)
- [Audioverwaltung](#audioverwaltung)
- [Kontaktformular](#kontaktformular)
- [Sicherheit](#sicherheit)
- [SEO](#seo)
- [Deployment](#deployment)
- [Verfügbare Befehle](#verfügbare-befehle)
- [Inhaltliche Verantwortung](#inhaltliche-verantwortung)
- [Entwicklung](#entwicklung)
- [Lizenz und Nutzung](#lizenz-und-nutzung)

## Über das Projekt

Diese Website ist keine allgemeine Nachrichtenplattform und kein soziales Netzwerk. Sie dient als zentrale, ruhige und übersichtliche Anlaufstelle für die veröffentlichten Inhalte und organisatorischen Informationen von Dr. Shaykh Sayed Ibn Basyuni hafidhahullah.

Zu den Schwerpunkten gehören:

- Informationen über den Shaykh, seinen Werdegang und seine Unterrichtstätigkeit
- Veröffentlichung islamischer Artikel
- Bereitstellung aufgezeichneter Durous als Audio
- Übersicht aktueller und regelmäßiger Unterrichte
- Veröffentlichung kurzfristiger Terminänderungen und Ausfälle
- Kontaktaufnahme für allgemeine, organisatorische und unterrichtsbezogene Anliegen
- Bereitstellung von Impressum und Datenschutzerklärung

Die Anwendung ist als React Single Page Application umgesetzt. Dynamische Inhalte werden über Appwrite geladen. Audio-Dateien werden nicht direkt öffentlich aus dem Frontend ausgeliefert, sondern über eine Appwrite Function und zeitlich begrenzte Download-URLs bereitgestellt.

## Funktionen

### Öffentliche Informationsseiten

- Startseite mit Einführung und Überblick
- Ausführliche Seite über den Shaykh
- Unterrichtsübersicht
- Darstellung offizieller Kanäle, sobald diese verfügbar sind
- Kontaktbereich
- Impressum und Datenschutzerklärung

### Artikel

- Laden veröffentlichter Artikel aus Appwrite
- Eigene Detailseite für jeden Artikel
- Slug-basierte URLs
- Suche innerhalb veröffentlichter Beiträge
- Filterung nach Kategorie und Sprache
- Sortierung nach Datum, Titel und Lesezeit
- Automatische Berechnung der Lesezeit
- Automatische Erstellung eines Auszugs, wenn keiner hinterlegt wurde
- Sichere Darstellung von HTML-Inhalten mit DOMPurify

### Durous

- Laden veröffentlichter Audio-Durous aus Appwrite
- Sortierung nach Unterrichtsdatum
- Anzeige von Reihe, Unterrichtsnummer, Kategorie und Sprache
- Anzeige der Audiodauer
- Sicheres Abrufen einer zeitlich begrenzten Audio-URL
- Download der Audioaufnahme
- Unterstützung verschiedener Audio-MIME-Typen

### Unterrichtshinweise

- Dynamische Hinweise aus Appwrite
- Unterrichtsausfälle
- Ortsänderungen
- Terminänderungen
- Allgemeine Hinweise
- Gültigkeitszeitraum mit `validFrom` und `validUntil`
- Automatisches Ausblenden abgelaufener oder noch nicht gültiger Hinweise

### Kontaktformular

- Name
- E-Mail-Adresse
- Anliegen
- Nachricht
- Zustimmung zur Datenschutzerklärung
- Formularstatus für Versand, Erfolg und Fehler
- Begrenzung der Nachricht auf 2.000 Zeichen
- Versand an ein separates Backend

## Seiten und Routen

| Route | Beschreibung |
| --- | --- |
| `/` | Startseite |
| `/shaykh` | Informationen über den Shaykh |
| `/durous` | Durous, Audioarchiv und Unterrichtshinweise |
| `/duruus` | Alternative Schreibweise und Weiterführung zur Durous-Seite |
| `/artikel` | Übersicht aller veröffentlichten Artikel |
| `/artikel/:slug` | Detailseite eines Artikels |
| `/kontakt` | Kontaktformular |
| `/datenschutz` | Datenschutzerklärung |
| `/impressum` | Impressum |

## Technologien

### Frontend

- React 19
- React DOM 19
- React Router DOM 7
- Vite 8
- JavaScript mit ES Modules
- Modular aufgebaute CSS-Dateien

### Backend und Daten

- Appwrite Web SDK
- Appwrite TablesDB
- Appwrite Functions
- Externes Kontaktformular-Backend
- Externer Objektspeicher für Audio-Dateien über die Filebase-Integration

### Sicherheit und Inhaltsdarstellung

- DOMPurify zur Bereinigung von HTML-Inhalten
- Veröffentlichung ausschließlich von Datensätzen mit dem Status `published`
- Zeitlich begrenzte Audio-URLs
- Keine geheimen Appwrite-Schlüssel im Frontend
- Konfiguration über Vite-Umgebungsvariablen

### Hosting

- Vercel
- Eigene Domain über `shaykh-sayed.de`
- SPA-Rewrite über `vercel.json`

## Projektstruktur

```text
.
├── public/
├── src/
│   ├── appwrite/
│   │   ├── appwrite.js
│   │   ├── articleService.js
│   │   ├── duruusService.js
│   │   └── noticesService.js
│   ├── pages/
│   │   ├── Articles/
│   │   ├── Contact/
│   │   ├── Datenschutz/
│   │   ├── Duruus/
│   │   ├── Home/
│   │   ├── Impressum/
│   │   ├── Shaykh/
│   │   └── common/
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── .env
├── eslint.config.js
├── index.html
├── package.json
├── vercel.json
└── vite.config.js
```

Die einzelnen Seiten besitzen eigene Komponenten und Styles. Wiederverwendete Bereiche wie Header, Footer, Kontaktformular, Unterrichtsplan und offizielle Kanäle befinden sich im gemeinsamen Seitenbereich.

## Lokale Installation

### Voraussetzungen

- Node.js in einer aktuellen LTS-Version
- npm
- Ein erreichbares Appwrite-Projekt
- Zugriff auf die benötigten Appwrite-Tabellen

### Repository klonen

```bash
git clone https://github.com/SoufianElfouzari/Shaykh-Sayed-Ibn-Basyuni-Website.git
cd Shaykh-Sayed-Ibn-Basyuni-Website
```

### Abhängigkeiten installieren

```bash
npm install
```

### Umgebungsvariablen anlegen

Erstelle im Hauptverzeichnis eine Datei namens `.env`.

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=DEINE_PROJECT_ID
VITE_APPWRITE_DATABASE_ID=DEINE_DATABASE_ID
VITE_APPWRITE_ARTICLES_TABLE_ID=shaykhsayedarticles
VITE_APPWRITE_DURUUS_TABLE_ID=shaykhduruus
VITE_APPWRITE_NOTICES_TABLE_ID=shaykhsayedappointments
VITE_APPWRITE_FILEBASE_FUNCTION_ID=filebase-audio-manager
```

Danach kann die Entwicklungsumgebung gestartet werden:

```bash
npm run dev
```

Vite zeigt anschließend die lokale Adresse im Terminal an.

## Umgebungsvariablen

| Variable | Erforderlich | Beschreibung |
| --- | --- | --- |
| `VITE_APPWRITE_ENDPOINT` | Ja | Appwrite API Endpoint |
| `VITE_APPWRITE_PROJECT_ID` | Ja | ID des Appwrite-Projekts |
| `VITE_APPWRITE_DATABASE_ID` | Empfohlen | ID der verwendeten Datenbank |
| `VITE_APPWRITE_ARTICLES_TABLE_ID` | Empfohlen | Tabelle für Artikel |
| `VITE_APPWRITE_DURUUS_TABLE_ID` | Empfohlen | Tabelle für Audio-Durous |
| `VITE_APPWRITE_NOTICES_TABLE_ID` | Empfohlen | Tabelle für Unterrichtshinweise |
| `VITE_APPWRITE_FILEBASE_FUNCTION_ID` | Empfohlen | Appwrite Function für Audio-URLs |

Für mehrere IDs existieren im Code derzeit Standardwerte. Für eine saubere Trennung zwischen Entwicklung und Produktion sollten dennoch alle IDs über Umgebungsvariablen gesetzt werden.

Wichtig: Variablen mit dem Präfix `VITE_` werden in den Browser-Build übernommen und sind öffentlich einsehbar. Dort dürfen niemals API-Schlüssel, Administrator-Schlüssel, SMTP-Passwörter oder andere Geheimnisse gespeichert werden.

## Appwrite-Konfiguration

Das Frontend verwendet `TablesDB` für das Lesen veröffentlichter Inhalte und `Functions` für die Erzeugung von Audio-Download-URLs.

### Plattformen

Im Appwrite-Projekt müssen die verwendeten Domains als Web-Plattform eingetragen sein, zum Beispiel:

```text
localhost
www.shaykh-sayed.de
shaykh-sayed.de
```

### Berechtigungen

Öffentliche Besucher benötigen ausschließlich Leserechte auf veröffentlichte Inhalte. Schreib-, Änderungs- und Löschrechte sollten nur einem geschützten Verwaltungsbereich oder vertrauenswürdigen Server-Funktionen gewährt werden.

Empfohlene Trennung:

- Öffentliche Rolle: Lesen veröffentlichter Inhalte
- Redaktion oder Administration: Erstellen, Bearbeiten, Veröffentlichen und Löschen
- Appwrite Function: Zugriff auf benötigte Audio- und Speicherdienste

## Datenmodell

Die folgenden Felder werden vom aktuellen Frontend erwartet.

### Tabelle `shaykhsayedarticles`

| Feld | Typ | Beschreibung |
| --- | --- | --- |
| `slug` | String | Eindeutiger URL-Slug |
| `title` | String | Titel des Artikels |
| `excerpt` | String | Optionaler Kurztext |
| `contentHtml` | String | Vollständiger Artikelinhalt als HTML |
| `coverImageUrl` | String | Optionale URL eines Titelbildes |
| `status` | String | Zum Beispiel `draft` oder `published` |
| `publishedAt` | DateTime | Veröffentlichungsdatum |

Ein Artikel wird im öffentlichen Bereich nur angezeigt, wenn:

- `status` genau `published` ist
- ein Titel vorhanden ist
- ein Slug vorhanden ist

Autor, Standardsprache und Standardkategorie werden derzeit im Frontend festgelegt.

### Tabelle `shaykhduruus`

| Feld | Typ | Beschreibung |
| --- | --- | --- |
| `title` | String | Titel des Dars |
| `series` | String | Unterrichtsreihe |
| `lessonNumber` | Integer | Nummer innerhalb der Reihe |
| `category` | String | Fach oder Kategorie |
| `language` | String | Sprache des Unterrichts |
| `lessonDate` | DateTime | Datum des Unterrichts |
| `durationSeconds` | Integer | Audiodauer in Sekunden |
| `description` | String | Beschreibung |
| `audioObjectKey` | String | Schlüssel der Audiodatei im Objektspeicher |
| `audioFileName` | String | Ursprünglicher oder gewünschter Dateiname |
| `audioMimeType` | String | Zum Beispiel `audio/mpeg` |
| `audioSizeBytes` | Integer | Dateigröße in Bytes |
| `status` | String | Zum Beispiel `draft` oder `published` |
| `publishedAt` | DateTime | Veröffentlichungsdatum |

Ein Dars wird nur angezeigt, wenn:

- `status` genau `published` ist
- ein Titel vorhanden ist
- eine Unterrichtsreihe vorhanden ist
- ein `audioObjectKey` vorhanden ist

### Tabelle `shaykhsayedappointments`

| Feld | Typ | Beschreibung |
| --- | --- | --- |
| `title` | String | Überschrift des Hinweises |
| `message` | String | Vollständiger Hinweistext |
| `noticeType` | String | Art des Hinweises |
| `affectedDars` | String | Betroffener Unterricht |
| `status` | String | Zum Beispiel `draft` oder `published` |
| `validFrom` | DateTime | Beginn der Sichtbarkeit |
| `validUntil` | DateTime | Ende der Sichtbarkeit |
| `publishedAt` | DateTime | Veröffentlichungsdatum |

Unterstützte Arten:

| Wert | Darstellung |
| --- | --- |
| `cancelled` | Unterricht entfällt |
| `location_changed` | Ortsänderung |
| `time_changed` | Terminänderung |
| `general` | Allgemeiner Hinweis |

Ein Hinweis wird nur angezeigt, wenn er veröffentlicht ist und innerhalb seines Gültigkeitszeitraums liegt.

## Audioverwaltung

Audio-Dateien werden über eine Appwrite Function mit der Standard-ID `filebase-audio-manager` abgerufen.

Das Frontend sendet sinngemäß folgende Anfrage an die Function:

```json
{
  "action": "createDownload",
  "objectKey": "pfad/zur/audio-datei.mp3",
  "contentType": "audio/mpeg"
}
```

Die Function muss eine erfolgreiche JSON-Antwort zurückgeben:

```json
{
  "success": true,
  "downloadUrl": "https://zeitlich-begrenzte-url.example",
  "expiresIn": 3600,
  "objectKey": "pfad/zur/audio-datei.mp3"
}
```

Die dauerhafte Speicheradresse und geheime Zugangsdaten gehören ausschließlich in die serverseitige Function. Das Frontend erhält nur eine zeitlich begrenzte URL.

## Kontaktformular

Das Kontaktformular sendet JSON per `POST` an das konfigurierte Backend.

Aktuell verwendeter Endpoint:

```text
https://shaykhsayeddev.pythonanywhere.com/api/contact
```

Gesendetes Format:

```json
{
  "name": "Vor- und Nachname",
  "email": "name@example.de",
  "subject": "allgemeine-anfrage",
  "message": "Nachricht"
}
```

Mögliche Anliegen im Frontend:

- Allgemeine Frage
- Frage zum Unterricht
- Hinweis zur Website
- Organisatorisches Anliegen
- Termin für Heirat vereinbaren
- Sonstiges

Das Backend sollte mindestens folgende Punkte umsetzen:

- Serverseitige Validierung aller Eingaben
- Prüfung einer gültigen E-Mail-Adresse
- Begrenzung der Eingabelängen
- CORS-Freigabe nur für erlaubte Domains
- Rate Limiting
- Schutz gegen Spam und automatisierte Anfragen
- Sichere SMTP-Konfiguration über Server-Umgebungsvariablen
- Keine Ausgabe interner Fehler oder Zugangsdaten an den Browser

## Sicherheit

### Keine Geheimnisse im Repository

Folgende Daten dürfen weder in Git noch in Vite-Variablen gespeichert werden:

- Appwrite API Keys
- SMTP-Passwörter
- Filebase Access Keys
- Filebase Secret Keys
- Private Tokens
- Administrator-Zugangsdaten

### HTML-Bereinigung

Artikel können HTML-Inhalte enthalten. Vor der Darstellung werden diese mit DOMPurify bereinigt. Diese Bereinigung darf nicht entfernt werden, solange HTML aus einer Datenbank dargestellt wird.

### Appwrite-Berechtigungen

Clientseitige Filter wie `status === "published"` ersetzen keine Datenbankberechtigungen. Nicht veröffentlichte Inhalte sollten zusätzlich über Appwrite Permissions vor öffentlichem Lesen geschützt sein.

### Audio

Direkte, dauerhaft öffentliche Audio-URLs sollten vermieden werden. Die bestehende Function-Lösung mit kurzlebigen URLs reduziert die unkontrollierte Weitergabe der Speicheradresse und schützt geheime Zugangsdaten.

## SEO

Das Projekt enthält eine für Suchmaschinen vorbereitete öffentliche Struktur und wurde für die Indexierung überarbeitet.

Empfohlene Punkte für weitere Pflege:

- Eindeutige Seitentitel und Meta-Beschreibungen
- Canonical URLs
- Open Graph Metadaten
- Twitter Card Metadaten
- `robots.txt`
- `sitemap.xml`
- Strukturierte Daten, soweit sachlich passend
- Aussagekräftige Überschriftenhierarchie
- Alt-Texte für inhaltlich relevante Bilder
- Stabile Slugs für veröffentlichte Artikel

Beim Ändern veröffentlichter Artikel-Slugs sollten Weiterleitungen eingerichtet werden, damit bestehende Links nicht ins Leere führen.

## Deployment

Die Anwendung ist für Vercel vorbereitet.

### Build-Einstellungen

| Einstellung | Wert |
| --- | --- |
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

### SPA-Rewrite

React Router verwendet clientseitige Routen. Damit ein direkter Aufruf oder Neuladen von Unterseiten nicht zu einem 404-Fehler führt, enthält `vercel.json` eine Weiterleitung aller Routen auf `index.html`.

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Vercel-Umgebungsvariablen

Alle benötigten `VITE_APPWRITE_*` Variablen müssen zusätzlich im Vercel-Projekt unter den Environment Variables eingetragen werden. Nach Änderungen ist ein neues Deployment erforderlich.

## Verfügbare Befehle

### Entwicklungsserver

```bash
npm run dev
```

### Produktions-Build

```bash
npm run build
```

### Produktions-Build lokal prüfen

```bash
npm run preview
```

### ESLint ausführen

```bash
npm run lint
```

Vor einem Deployment sollten mindestens folgende Befehle erfolgreich durchlaufen:

```bash
npm run lint
npm run build
```

## Inhaltliche Verantwortung

Die Website unterscheidet zwischen religiösen Inhalten und technischer Umsetzung.

- Religiöse Artikel, Aussagen, Unterrichtsinhalte und fachliche Veröffentlichungen stammen vom Shaykh oder werden nur nach entsprechender Freigabe veröffentlicht.
- Die technische Entwicklung, Gestaltung, Wartung und Bereitstellung der Website erfolgt durch Soufian El-Fouzari.
- Technische Änderungen dürfen den Sinn religiöser Inhalte nicht verändern.
- Entwürfe dürfen nicht unbeabsichtigt als veröffentlichte Inhalte erscheinen.

## Entwicklung

Entwickelt und betreut von:

**Soufian El-Fouzari**

GitHub:

https://github.com/SoufianElfouzari

Repository:

https://github.com/SoufianElfouzari/Shaykh-Sayed-Ibn-Basyuni-Website

## Lizenz und Nutzung

Für dieses Repository ist derzeit keine eigenständige Open-Source-Lizenz dokumentiert.

Daraus folgt nicht automatisch eine freie Erlaubnis zur Wiederverwendung, Veränderung oder Weiterveröffentlichung des Codes oder der Inhalte. Insbesondere religiöse Texte, Audioaufnahmen, Namen, Logos, Gestaltungselemente und redaktionelle Inhalte dürfen nicht ohne Zustimmung übernommen oder anderweitig veröffentlicht werden.

Für Nutzungsanfragen sollte vorab die Erlaubnis des Rechteinhabers eingeholt werden.