// Canonical, route-specific SEO copy shared by the browser and SSR.
// Titles describe the page topic. Site identity belongs to the URL, WebSite
// structured data and og:site_name, not to a repeated title suffix.
export const routeMetadata = {
  "/": {
    title: "Islam lernen mit Quran & Sunnah | Unterricht & Fatwa",
    description: "Islam lernen auf Deutsch: Entdecke Unterrichte zu Fiqh, Aqidah und Hadith, lies islamische Artikel und stelle deine Fragen an einen Shaykh.",
  },
  "/shaykh": {
    title: "Islamischer Lehrer in Kassel | Biografie & Ausbildung",
    description: "Islam lernen beim Lehrer: Erfahre mehr über seinen wissenschaftlichen Werdegang, das Studium an der Al-Azhar und seine Schwerpunkte in Fiqh, Aqidah und Hadith.",
  },
  "/durous": {
    title: "Islamische Unterrichte auf Deutsch | Fiqh & Hadith",
    description: "Islam lernen durch deutschsprachige Durus: Höre Unterrichte zu Fiqh und Hadith, entdecke Audioaufnahmen und prüfe aktuelle Unterrichtszeiten in Kassel.",
  },
  "/artikel": {
    title: "Islamische Artikel lesen | Fiqh, Aqidah & Hadith",
    description: "Islam lernen durch fundierte Artikel auf Deutsch: Lies Beiträge zu Fiqh, Aqidah, Hadith und weiteren islamischen Wissenschaften auf Grundlage von Quran und Sunnah.",
  },
  "/kontakt": {
    title: "Fragen zum Islam stellen | Kontakt & Fatwa-Anfrage",
    description: "Du möchtest eine Fatwa anfragen, eine Frage zum Islam stellen oder einen Unterricht besuchen? Nutze das Kontaktformular und sende dein Anliegen.",
  },
  "/impressum": {
    title: "Impressum | Rechtliche Informationen",
    description: "Impressum der Website zum Islam lernen: Hier findest du rechtliche Angaben, Kontaktinformationen und die Verantwortlichkeiten dieser Website.",
  },
  "/datenschutz": {
    title: "Datenschutz | Informationen zur Datenverarbeitung",
    description: "Datenschutz der Website zum Islam lernen: Informationen zur Verarbeitung personenbezogener Daten und zu deinen Rechten bei der Nutzung dieser Website.",
  },
};

export const notFoundMetadata = {
  title: "Seite nicht gefunden | Islam lernen",
  description: "Die angeforderte Seite ist nicht verfügbar. Entdecke stattdessen islamische Unterrichte und Artikel zu Quran, Sunnah und Fiqh.",
};

export function getRouteMetadata(pathname, page = 1) {
  if (pathname === "/artikel" && Number.isSafeInteger(page) && page > 1) {
    return {
      title: `Islamische Artikel lesen | Archiv Seite ${page}`,
      description: `Weitere islamische Artikel auf Seite ${page} entdecken: Vertiefe dein Wissen über Fiqh, Aqidah, Hadith und islamische Wissenschaften nach Quran und Sunnah.`,
    };
  }
  return routeMetadata[pathname] || null;
}
