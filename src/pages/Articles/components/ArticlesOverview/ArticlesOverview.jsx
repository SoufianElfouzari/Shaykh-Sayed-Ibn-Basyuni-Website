import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link } from "react-router-dom";
import "./ArticlesOverview.css";

export const articleEntries = [
  {
    id: 1,
    slug: "die-bedeutung-des-wissens",
    title:
      "Die Bedeutung des Wissens und der aufrichtigen Absicht",
    excerpt:
      "Eine Einführung in die Stellung des islamischen Wissens, die Bedeutung der richtigen Absicht und den verantwortungsvollen Weg des Lernenden.",
    category: "Allgemein",
    language: "Deutsch",
    publishedAt: "2026-07-21",
    updatedAt: "2026-07-23",
    readingTime: 8,
    author: "Shaykh Sayed Ibn Basyuni",
    featured: true,
    tags: [
      "Wissen",
      "Absicht",
      "Talab al-Ilm",
    ],
    introduction:
      "Das Streben nach islamischem Wissen gehört zu den bedeutenden Wegen, durch die ein Muslim seine Religion besser versteht und seine Handlungen auf eine klare Grundlage stellt. Dabei hängt der Nutzen des Wissens nicht allein von der Menge des Gelernten ab. Entscheidend sind ebenso die Absicht, die Vorgehensweise und die praktische Umsetzung.",
    keyPoints: [
      "Wissen wird mit einer aufrichtigen Absicht gesucht.",
      "Grundlagen gehen den weiterführenden Themen voraus.",
      "Gelerntes Wissen soll sich in den Handlungen zeigen.",
    ],
    sections: [
      {
        id: "stellung-des-wissens",
        title: "Die Stellung des Wissens",
        paragraphs: [
          "Islamisches Wissen hilft dem Menschen dabei, zwischen richtig und falsch zu unterscheiden. Es vermittelt die Grundlagen des Glaubens, der Gottesdienste und des guten Verhaltens.",
          "Der Lernende sollte sich deshalb nicht ausschließlich mit einzelnen Informationen beschäftigen. Er benötigt ein geordnetes Verständnis, bei dem die grundlegenden Themen zuerst erlernt und anschließend schrittweise vertieft werden.",
        ],
      },
      {
        id: "aufrichtige-absicht",
        title: "Die aufrichtige Absicht",
        paragraphs: [
          "Das Wissen wird nicht gesucht, um vor anderen Menschen hervorzutreten oder Diskussionen zu gewinnen. Der Lernende bemüht sich darum, Allah zufriedenzustellen, die eigene Unwissenheit zu beseitigen und anderen Menschen auf richtige Weise zu nutzen.",
          "Die Absicht sollte regelmäßig überprüft werden. Sie kann sich während des Lernens verändern und benötigt deshalb Aufmerksamkeit und Aufrichtigkeit.",
        ],
      },
      {
        id: "wissen-und-handeln",
        title: "Die Verbindung zwischen Wissen und Handeln",
        paragraphs: [
          "Der eigentliche Nutzen des Wissens zeigt sich in seiner Umsetzung. Kenntnisse über das Gebet, das Verhalten oder die Rechte anderer Menschen sollen das tägliche Leben verändern.",
          "Der Lernende sollte deshalb nach jeder Unterrichtseinheit prüfen, welche Erkenntnisse er verstanden hat und welche davon praktisch umgesetzt werden können.",
        ],
      },
    ],
    conclusion:
      "Ein erfolgreicher Weg des Lernens verbindet eine aufrichtige Absicht, eine klare Reihenfolge und die praktische Umsetzung. Dadurch wird das Wissen nicht lediglich gesammelt, sondern zu einer Grundlage für das eigene Leben.",
  },
  {
    id: 2,
    slug: "grundlagen-der-hadithwissenschaft",
    title:
      "Grundlagen für das Verständnis der Hadithwissenschaft",
    excerpt:
      "Was ist ein Hadith, welche Bedeutung besitzt die Überlieferungskette und warum unterscheiden die Gelehrten zwischen verschiedenen Arten von Überlieferungen?",
    category: "Hadith",
    language: "Deutsch",
    publishedAt: "2026-07-18",
    updatedAt: "2026-07-18",
    readingTime: 11,
    author: "Shaykh Sayed Ibn Basyuni",
    featured: true,
    tags: [
      "Hadith",
      "Mustalah al-Hadith",
      "Isnad",
    ],
    introduction:
      "Die Hadithwissenschaft beschäftigt sich mit den überlieferten Aussagen, Handlungen und Bestätigungen des Propheten. Sie untersucht sowohl den Inhalt einer Überlieferung als auch den Weg, über den sie weitergegeben wurde.",
    keyPoints: [
      "Ein Hadith besteht aus Überlieferungskette und Text.",
      "Nicht jede überlieferte Aussage besitzt denselben Rang.",
      "Die Bewertung verlangt Wissen über Überlieferer und Überlieferungswege.",
    ],
    sections: [
      {
        id: "bestandteile-eines-hadith",
        title: "Die Bestandteile eines Hadith",
        paragraphs: [
          "Ein Hadith besteht grundsätzlich aus dem Isnad und dem Matn. Der Isnad bezeichnet die Kette der Personen, die eine Aussage überliefert haben. Der Matn ist der eigentliche Text der Überlieferung.",
          "Beide Bestandteile werden untersucht. Eine bekannte oder überzeugend klingende Aussage genügt nicht, wenn ihr Überlieferungsweg nicht bestätigt werden kann.",
        ],
      },
      {
        id: "bewertung-der-ueberlieferung",
        title: "Die Bewertung einer Überlieferung",
        paragraphs: [
          "Bei der Bewertung wird unter anderem geprüft, ob die Überlieferungskette verbunden ist und ob die beteiligten Überlieferer zuverlässig und genau waren.",
          "Darüber hinaus vergleichen die Gelehrten verschiedene Überlieferungswege miteinander. Dadurch können Fehler, Abweichungen oder zusätzliche Formulierungen erkannt werden.",
        ],
      },
      {
        id: "schrittweises-lernen",
        title: "Der schrittweise Einstieg",
        paragraphs: [
          "Ein Anfänger sollte zuerst die grundlegenden Begriffe und Kategorien erlernen. Danach kann er sich mit ausführlicheren Fragen der Überliefererkritik und der vergleichenden Isnadanalyse beschäftigen.",
          "Die praktische Anwendung an ausgewählten Beispielen hilft dabei, die theoretischen Begriffe besser zu verstehen.",
        ],
      },
    ],
    conclusion:
      "Die Hadithwissenschaft ist eine geordnete und genaue Disziplin. Ein solides Verständnis beginnt mit den Grundbegriffen und wird anschließend durch praktische Beispiele und das Studium der Aussagen der Gelehrten vertieft.",
  },
  {
    id: 3,
    slug: "aufrichtigkeit-im-gottesdienst",
    title:
      "Aufrichtigkeit im Gottesdienst und im täglichen Leben",
    excerpt:
      "Warum die Absicht nicht nur am Anfang einer Handlung wichtig ist und wie der Muslim seine Aufrichtigkeit regelmäßig überprüfen kann.",
    category: "Aqidah",
    language: "Deutsch",
    publishedAt: "2026-07-15",
    updatedAt: "2026-07-16",
    readingTime: 7,
    author: "Shaykh Sayed Ibn Basyuni",
    featured: false,
    tags: [
      "Aqidah",
      "Ikhlas",
      "Gottesdienst",
    ],
    introduction:
      "Aufrichtigkeit bedeutet, eine Handlung für Allah auszuführen und nicht nach dem Lob oder der Anerkennung der Menschen zu suchen. Sie betrifft das Gebet, das Lernen, die Unterstützung anderer Menschen und alle weiteren guten Handlungen.",
    keyPoints: [
      "Die Absicht wird vor, während und nach einer Handlung geprüft.",
      "Aufrichtigkeit ist eine fortlaufende Aufgabe.",
      "Gute Handlungen sollen nicht von der Anerkennung anderer abhängen.",
    ],
    sections: [
      {
        id: "bedeutung-der-aufrichtigkeit",
        title: "Die Bedeutung der Aufrichtigkeit",
        paragraphs: [
          "Eine äußerlich gute Handlung benötigt eine richtige innere Ausrichtung. Der Muslim bemüht sich darum, seine Handlung nicht für Ansehen, Lob oder eine besondere Stellung auszuführen.",
          "Dies bedeutet nicht, dass jede Freude über eine gute Reaktion der Menschen die Handlung ungültig macht. Entscheidend ist, weshalb die Handlung begonnen und fortgeführt wurde.",
        ],
      },
      {
        id: "absicht-ueberpruefen",
        title: "Die Absicht regelmäßig überprüfen",
        paragraphs: [
          "Die Absicht kann sich im Verlauf einer Handlung verändern. Deshalb sollte der Mensch sein Herz beobachten und sich fragen, ob er dieselbe Handlung auch ohne Aufmerksamkeit und Anerkennung fortsetzen würde.",
          "Diese Selbstprüfung soll nicht zu ständigen Zweifeln führen. Sie dient dazu, die eigene Ausrichtung zu verbessern und die Handlung bewusst für Allah fortzuführen.",
        ],
      },
    ],
    conclusion:
      "Aufrichtigkeit ist kein einmal erreichter Zustand, sondern eine fortlaufende Arbeit des Herzens. Sie wird durch Selbstprüfung, Du'a und die bewusste Ausrichtung der eigenen Handlungen gestärkt.",
  },
  {
    id: 4,
    slug: "die-stellung-des-gebets",
    title:
      "Die Stellung des Gebets und die Vorbereitung darauf",
    excerpt:
      "Eine zusammenfassende Betrachtung der Bedeutung des Gebets, seiner Vorbereitung und der notwendigen Aufmerksamkeit während der Verrichtung.",
    category: "Fiqh",
    language: "Deutsch",
    publishedAt: "2026-07-12",
    updatedAt: "2026-07-12",
    readingTime: 9,
    author: "Shaykh Sayed Ibn Basyuni",
    featured: false,
    tags: [
      "Fiqh",
      "Gebet",
      "Gottesdienst",
    ],
    introduction:
      "Das Gebet gehört zu den regelmäßigsten Handlungen im Leben eines Muslims. Es besitzt feste Zeiten, Voraussetzungen und Bestandteile. Gleichzeitig ist es eine persönliche Verbindung zwischen dem Diener und seinem Schöpfer.",
    keyPoints: [
      "Die Vorbereitung beginnt vor dem eigentlichen Gebet.",
      "Voraussetzungen und Säulen müssen unterschieden werden.",
      "Aufmerksamkeit und Demut benötigen bewusste Übung.",
    ],
    sections: [
      {
        id: "vorbereitung-auf-das-gebet",
        title: "Die Vorbereitung auf das Gebet",
        paragraphs: [
          "Zu einer guten Vorbereitung gehören die rechtzeitige Gebetswaschung, saubere Kleidung, die Beachtung der Gebetszeit und die Ausrichtung zur Qiblah.",
          "Wer erst unmittelbar vor dem Gebet alle notwendigen Dinge erledigt, beginnt häufig unruhig. Eine frühzeitige Vorbereitung hilft dabei, mit größerer Sammlung in das Gebet einzutreten.",
        ],
      },
      {
        id: "voraussetzungen-und-saeulen",
        title: "Voraussetzungen und Säulen",
        paragraphs: [
          "Die Voraussetzungen des Gebets müssen bereits vor dem Beginn erfüllt sein. Die Säulen sind hingegen Bestandteile innerhalb des Gebets selbst.",
          "Diese Unterscheidung ist wichtig, weil das Auslassen einer Voraussetzung oder Säule andere Folgen haben kann als das Auslassen einer empfohlenen Handlung.",
        ],
      },
      {
        id: "aufmerksamkeit-im-gebet",
        title: "Aufmerksamkeit während des Gebets",
        paragraphs: [
          "Aufmerksamkeit entsteht nicht ausschließlich durch einen kurzen inneren Entschluss. Sie wird durch das Verständnis der gesprochenen Worte, eine ruhige Verrichtung und die Reduzierung von Ablenkungen unterstützt.",
          "Auch wenn Gedanken abschweifen, kehrt der Betende immer wieder bewusst zum Gebet zurück.",
        ],
      },
    ],
    conclusion:
      "Das Gebet verbindet rechtliche Regeln mit innerer Hingabe. Eine sorgfältige Vorbereitung und das Verständnis seiner Bestandteile helfen dabei, es ruhig und bewusst zu verrichten.",
  },
  {
    id: 5,
    slug: "adab-beim-lernen-des-quran",
    title:
      "Adab und Beständigkeit beim Lernen des Quran",
    excerpt:
      "Hinweise zur richtigen Haltung gegenüber dem Quran, zur regelmäßigen Wiederholung und zu einem realistischen Lernplan.",
    category: "Quran",
    language: "Deutsch",
    publishedAt: "2026-07-08",
    updatedAt: "2026-07-09",
    readingTime: 6,
    author: "Shaykh Sayed Ibn Basyuni",
    featured: false,
    tags: [
      "Quran",
      "Tajwid",
      "Adab",
    ],
    introduction:
      "Das Lernen des Quran benötigt Respekt, Regelmäßigkeit und Geduld. Große Ziele werden nicht durch unregelmäßige intensive Phasen erreicht, sondern durch eine beständige Verbindung mit dem Quran.",
    keyPoints: [
      "Regelmäßigkeit ist wichtiger als ein unrealistisches Pensum.",
      "Neue Abschnitte benötigen fortlaufende Wiederholung.",
      "Korrektur durch einen Lehrer verhindert dauerhafte Fehler.",
    ],
    sections: [
      {
        id: "realistischer-lernplan",
        title: "Ein realistischer Lernplan",
        paragraphs: [
          "Der Lernplan sollte zur verfügbaren Zeit und zum aktuellen Niveau passen. Ein kleiner Abschnitt, der sicher gelernt und wiederholt wird, ist nützlicher als eine große Menge, die schnell verloren geht.",
          "Feste Zeiten erleichtern die Beständigkeit. Besonders geeignet sind ruhige Tageszeiten, in denen die Konzentration noch nicht durch viele Aufgaben beansprucht wurde.",
        ],
      },
      {
        id: "wiederholung-und-korrektur",
        title: "Wiederholung und Korrektur",
        paragraphs: [
          "Neue Verse sollten mit bereits gelernten Abschnitten verbunden werden. Ohne regelmäßige Wiederholung werden selbst sicher gelernte Stellen mit der Zeit schwächer.",
          "Die Rezitation vor einem qualifizierten Lehrer hilft dabei, Aussprache- und Tajwidfehler frühzeitig zu erkennen.",
        ],
      },
    ],
    conclusion:
      "Der Weg mit dem Quran wird durch kleine, beständige Schritte aufgebaut. Ein klarer Plan, regelmäßige Wiederholung und zuverlässige Korrektur bilden dafür eine stabile Grundlage.",
  },
  {
    id: 6,
    slug: "grundlagen-der-arabischen-sprache",
    title:
      "Warum die Grundlagen der arabischen Sprache entscheidend sind",
    excerpt:
      "Eine Einführung in die Bedeutung von Wortarten, Satzstrukturen und regelmäßiger Anwendung beim Erlernen der arabischen Sprache.",
    category: "Arabisch",
    language: "Deutsch",
    publishedAt: "2026-07-05",
    updatedAt: "2026-07-05",
    readingTime: 8,
    author: "Shaykh Sayed Ibn Basyuni",
    featured: false,
    tags: [
      "Arabisch",
      "Nahw",
      "Wortschatz",
    ],
    introduction:
      "Die arabische Sprache eröffnet einen direkteren Zugang zu vielen islamischen Quellen. Ihr Studium sollte nicht ausschließlich aus dem Auswendiglernen einzelner Wörter bestehen, sondern Wortschatz, Grammatik, Lesen, Hören und Anwendung miteinander verbinden.",
    keyPoints: [
      "Wortschatz und Grammatik werden gemeinsam gelernt.",
      "Einfache Sätze bilden die Grundlage für komplexere Texte.",
      "Regelmäßige Anwendung festigt das Gelernte.",
    ],
    sections: [
      {
        id: "wortarten-verstehen",
        title: "Die grundlegenden Wortarten",
        paragraphs: [
          "Zu Beginn werden Nomen, Verben und Partikel unterschieden. Diese Einteilung hilft dabei, die Funktion eines Wortes innerhalb eines Satzes zu erkennen.",
          "Der Lernende sollte die Begriffe nicht nur theoretisch kennen, sondern sie in kurzen Sätzen wiederholt bestimmen.",
        ],
      },
      {
        id: "vom-satz-zum-text",
        title: "Vom einfachen Satz zum vollständigen Text",
        paragraphs: [
          "Kurze Nominal- und Verbalsätze bilden eine wichtige Grundlage. Sobald ihre Struktur verstanden wurde, können schrittweise längere Texte gelesen und untersucht werden.",
          "Dabei sollte der Lernende nicht jedes unbekannte Wort sofort isoliert übersetzen. Zuerst wird versucht, die allgemeine Struktur und den Zusammenhang zu erkennen.",
        ],
      },
      {
        id: "regelmaessige-anwendung",
        title: "Regelmäßige Anwendung",
        paragraphs: [
          "Eine Sprache wird durch wiederholte Anwendung gefestigt. Dazu gehören das Lesen kurzer Texte, das Hören verständlicher Inhalte und das eigene Formulieren einfacher Sätze.",
          "Auch wenige tägliche Minuten können langfristig einen deutlichen Unterschied bewirken, wenn sie kontinuierlich genutzt werden.",
        ],
      },
    ],
    conclusion:
      "Ein geordneter Spracherwerb verbindet klare Grundlagen mit regelmäßiger Anwendung. Dadurch entwickelt sich das Verständnis schrittweise von einzelnen Wörtern hin zu vollständigen Texten.",
  },
  {
    id: 7,
    slug: "verantwortung-beim-weitergeben-von-wissen",
    title:
      "Verantwortung beim Weitergeben islamischen Wissens",
    excerpt:
      "Warum nicht jede gelernte Information sofort weitergegeben werden sollte und welche Verantwortung mit dem Unterrichten verbunden ist.",
    category: "Adab",
    language: "Deutsch",
    publishedAt: "2026-06-29",
    updatedAt: "2026-06-30",
    readingTime: 10,
    author: "Shaykh Sayed Ibn Basyuni",
    featured: false,
    tags: [
      "Adab",
      "Unterricht",
      "Verantwortung",
    ],
    introduction:
      "Die Weitergabe islamischen Wissens ist eine verantwortungsvolle Aufgabe. Eine ungenaue Formulierung, eine fehlende Einschränkung oder eine nicht überprüfte Aussage kann zu Missverständnissen führen.",
    keyPoints: [
      "Aussagen werden vor der Weitergabe überprüft.",
      "Der Wissensstand der Zuhörer wird berücksichtigt.",
      "Unwissenheit wird offen eingestanden.",
    ],
    sections: [
      {
        id: "pruefung-der-information",
        title: "Informationen vor der Weitergabe prüfen",
        paragraphs: [
          "Nicht jede verbreitete Aussage besitzt eine zuverlässige Grundlage. Vor der Weitergabe sollte geprüft werden, woher eine Information stammt und in welchem Zusammenhang sie genannt wurde.",
          "Besonders kurze Ausschnitte aus längeren Unterrichten können missverstanden werden, wenn wichtige Erklärungen und Einschränkungen fehlen.",
        ],
      },
      {
        id: "zielgruppe-beruecksichtigen",
        title: "Die Zuhörer berücksichtigen",
        paragraphs: [
          "Eine Erklärung muss zum Wissensstand der Zuhörer passen. Fortgeschrittene Einzelheiten können Anfänger überfordern, während eine zu allgemeine Darstellung wichtige Fragen offenlassen kann.",
          "Gutes Unterrichten bedeutet deshalb nicht nur, richtige Informationen zu besitzen, sondern sie auch in einer passenden Reihenfolge zu vermitteln.",
        ],
      },
      {
        id: "ich-weiss-es-nicht",
        title: "Die Bedeutung von „Ich weiß es nicht“",
        paragraphs: [
          "Es gehört zur wissenschaftlichen Ehrlichkeit, eine Frage nicht ohne ausreichendes Wissen zu beantworten. Eine spätere geprüfte Antwort ist besser als eine schnelle Vermutung.",
          "Das Eingeständnis der eigenen Grenze vermindert nicht den Wert eines Lehrenden. Es schützt vielmehr ihn und seine Zuhörer vor fehlerhaften Aussagen.",
        ],
      },
    ],
    conclusion:
      "Die Weitergabe von Wissen benötigt Prüfung, Klarheit und Bescheidenheit. Wer diese Verantwortung berücksichtigt, schützt die Inhalte und die Menschen, die von ihnen lernen.",
  },
  {
    id: 8,
    slug: "beständigkeit-auf-dem-weg-des-lernens",
    title:
      "Beständigkeit auf dem Weg des Lernens",
    excerpt:
      "Wie realistische Ziele, regelmäßige Wiederholung und eine klare Lernstruktur vor Überforderung und Abbruch schützen.",
    category: "Allgemein",
    language: "Deutsch",
    publishedAt: "2026-06-24",
    updatedAt: "2026-06-24",
    readingTime: 7,
    author: "Shaykh Sayed Ibn Basyuni",
    featured: false,
    tags: [
      "Talab al-Ilm",
      "Lernplan",
      "Beständigkeit",
    ],
    introduction:
      "Viele Lernende beginnen mit großen Zielen und einem sehr hohen täglichen Pensum. Nach kurzer Zeit entsteht jedoch Überforderung. Ein erfolgreicher Lernweg benötigt deshalb einen realistischen Aufbau.",
    keyPoints: [
      "Das Lernpensum muss dauerhaft umsetzbar sein.",
      "Wiederholung ist ein fester Teil des Lernens.",
      "Fortschritt wird über längere Zeiträume beurteilt.",
    ],
    sections: [
      {
        id: "realistische-ziele",
        title: "Realistische Ziele setzen",
        paragraphs: [
          "Ein Ziel sollte konkret und erreichbar sein. Statt mehrere umfangreiche Bücher gleichzeitig zu beginnen, kann zunächst ein grundlegendes Werk vollständig bearbeitet werden.",
          "Die tägliche Lernzeit wird so gewählt, dass sie auch an gewöhnlichen Tagen eingehalten werden kann.",
        ],
      },
      {
        id: "wiederholung-einplanen",
        title: "Wiederholung fest einplanen",
        paragraphs: [
          "Neues Wissen benötigt Wiederholung. Ohne sie entsteht schnell der Eindruck von Fortschritt, obwohl viele frühere Inhalte bereits vergessen wurden.",
          "Ein Teil der Lernzeit sollte deshalb ausschließlich für frühere Notizen, Begriffe und Texte reserviert werden.",
        ],
      },
      {
        id: "fortschritt-bewerten",
        title: "Fortschritt richtig bewerten",
        paragraphs: [
          "Fortschritt zeigt sich nicht ausschließlich an der Menge abgeschlossener Bücher oder Unterrichtseinheiten. Auch ein besseres Verständnis und eine sicherere Anwendung gehören dazu.",
          "Der Lernende sollte seinen Weg über Wochen und Monate betrachten und sich nicht von einzelnen schwächeren Tagen entmutigen lassen.",
        ],
      },
    ],
    conclusion:
      "Beständiges Lernen entsteht durch realistische Ziele, regelmäßige Wiederholung und Geduld. Kleine Schritte, die dauerhaft fortgeführt werden, führen langfristig zu einem stabileren Ergebnis.",
  },
];

const sortOptions = [
  {
    value: "newest",
    label: "Neueste zuerst",
  },
  {
    value: "oldest",
    label: "Älteste zuerst",
  },
  {
    value: "title",
    label: "Titel von A bis Z",
  },
  {
    value: "reading-time",
    label: "Kürzeste Lesezeit",
  },
];

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="11"
        cy="11"
        r="6.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M16 16L20 20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7 7L17 17"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M17 7L7 17"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12H19"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M15 8L19 12L15 16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function EmptyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="5"
        y="4"
        width="14"
        height="16"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M9 9H15"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <path
        d="M9 13H15"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <path
        d="M9 17H13"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function normalizeText(value) {
  return value
    .toLocaleLowerCase("de-DE")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function formatDate(value) {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`));
}

function ArticlesOverview() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] =
    useState("Alle");
  const [activeLanguage, setActiveLanguage] =
    useState("Alle");
  const [sortBy, setSortBy] = useState("newest");
  const [visibleCount, setVisibleCount] =
    useState(6);

  const categories = useMemo(() => {
    return [
      "Alle",
      ...new Set(
        articleEntries.map(
          (article) => article.category,
        ),
      ),
    ];
  }, []);

  const languages = useMemo(() => {
    return [
      "Alle",
      ...new Set(
        articleEntries.map(
          (article) => article.language,
        ),
      ),
    ];
  }, []);

  const filteredArticles = useMemo(() => {
    const normalizedSearch = normalizeText(
      searchTerm.trim(),
    );

    const matchingArticles = articleEntries.filter(
      (article) => {
        const categoryMatches =
          activeCategory === "Alle" ||
          article.category === activeCategory;

        const languageMatches =
          activeLanguage === "Alle" ||
          article.language === activeLanguage;

        const searchableContent = normalizeText(
          [
            article.title,
            article.excerpt,
            article.category,
            article.language,
            article.author,
            ...article.tags,
          ].join(" "),
        );

        const searchMatches =
          normalizedSearch.length === 0 ||
          searchableContent.includes(
            normalizedSearch,
          );

        return (
          categoryMatches &&
          languageMatches &&
          searchMatches
        );
      },
    );

    return [...matchingArticles].sort(
      (firstArticle, secondArticle) => {
        if (sortBy === "oldest") {
          return (
            new Date(firstArticle.publishedAt) -
            new Date(secondArticle.publishedAt)
          );
        }

        if (sortBy === "title") {
          return firstArticle.title.localeCompare(
            secondArticle.title,
            "de",
          );
        }

        if (sortBy === "reading-time") {
          return (
            firstArticle.readingTime -
            secondArticle.readingTime
          );
        }

        return (
          new Date(secondArticle.publishedAt) -
          new Date(firstArticle.publishedAt)
        );
      },
    );
  }, [
    searchTerm,
    activeCategory,
    activeLanguage,
    sortBy,
  ]);

  const visibleArticles =
    filteredArticles.slice(0, visibleCount);

  const activeFilterCount = [
    searchTerm.trim().length > 0,
    activeCategory !== "Alle",
    activeLanguage !== "Alle",
  ].filter(Boolean).length;

  useEffect(() => {
    setVisibleCount(6);
  }, [
    searchTerm,
    activeCategory,
    activeLanguage,
    sortBy,
  ]);

  const resetFilters = () => {
    setSearchTerm("");
    setActiveCategory("Alle");
    setActiveLanguage("Alle");
    setSortBy("newest");
  };

  return (
    <section
      className="sib-articles-overview"
      aria-labelledby="sib-articles-overview-title"
    >
      <div
        className="sib-articles-overview-decoration"
        aria-hidden="true"
      >
        <span className="sib-articles-overview-circle"></span>
        <span className="sib-articles-overview-word">
          Artikel
        </span>
      </div>

      <div className="sib-articles-overview-container">
        <header className="sib-articles-overview-header">
          <div className="sib-articles-overview-heading">
            <div className="sib-articles-overview-label-row">
              <span className="sib-articles-overview-label-line"></span>

              <p>Artikelarchiv</p>
            </div>

            <h2 id="sib-articles-overview-title">
              Alle veröffentlichten
              <span>Beiträge.</span>
            </h2>
          </div>

          <p className="sib-articles-overview-description">
            Durchsuche die veröffentlichten Artikel
            nach Thema, Kategorie oder Sprache und
            öffne jeden Beitrag auf seiner eigenen
            Artikelseite.
          </p>
        </header>

        <div className="sib-articles-overview-controls">
          <div className="sib-articles-overview-search">
            <span
              className="sib-articles-overview-search-icon"
              aria-hidden="true"
            >
              <SearchIcon />
            </span>

            <input
              type="search"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Artikel, Thema oder Begriff suchen"
              aria-label="Artikel durchsuchen"
            />

            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                aria-label="Suchbegriff löschen"
              >
                <CloseIcon />
              </button>
            )}
          </div>

          <div className="sib-articles-overview-control">
            <label htmlFor="article-language">
              Sprache
            </label>

            <select
              id="article-language"
              value={activeLanguage}
              onChange={(event) =>
                setActiveLanguage(event.target.value)
              }
            >
              {languages.map((language) => (
                <option
                  key={language}
                  value={language}
                >
                  {language}
                </option>
              ))}
            </select>
          </div>

          <div className="sib-articles-overview-control">
            <label htmlFor="article-sort">
              Sortierung
            </label>

            <select
              id="article-sort"
              value={sortBy}
              onChange={(event) =>
                setSortBy(event.target.value)
              }
            >
              {sortOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <nav
          className="sib-articles-overview-categories"
          aria-label="Artikelkategorien"
        >
          {categories.map((category) => {
            const categoryCount =
              category === "Alle"
                ? articleEntries.length
                : articleEntries.filter(
                    (article) =>
                      article.category === category,
                  ).length;

            return (
              <button
                key={category}
                type="button"
                className={
                  activeCategory === category
                    ? "sib-articles-overview-category sib-articles-overview-category-active"
                    : "sib-articles-overview-category"
                }
                onClick={() =>
                  setActiveCategory(category)
                }
              >
                <span>{category}</span>
                <strong>{categoryCount}</strong>
              </button>
            );
          })}
        </nav>

        <div className="sib-articles-overview-results">
          <p>
            <strong>
              {filteredArticles.length}
            </strong>{" "}
            {filteredArticles.length === 1
              ? "Artikel gefunden"
              : "Artikel gefunden"}
          </p>

          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={resetFilters}
            >
              Filter zurücksetzen
            </button>
          )}
        </div>

        {visibleArticles.length > 0 ? (
          <>
            <div className="sib-articles-overview-grid">
              {visibleArticles.map(
                (article, index) => (
                  <article
                    key={article.id}
                    className={`sib-article-card ${
                      article.featured
                        ? "sib-article-card-featured"
                        : ""
                    }`}
                    style={{
                      "--sib-article-card-index":
                        index,
                    }}
                  >
                    <Link
                      to={`/artikel/${article.slug}`}
                      className="sib-article-card-link"
                      aria-label={`${article.title} lesen`}
                    >
                      <div className="sib-article-card-top">
                        <span className="sib-article-card-category">
                          {article.category}
                        </span>

                        {article.featured && (
                          <span className="sib-article-card-featured-label">
                            Hervorgehoben
                          </span>
                        )}
                      </div>

                      <div className="sib-article-card-content">
                        <div className="sib-article-card-meta">
                          <time
                            dateTime={
                              article.publishedAt
                            }
                          >
                            {formatDate(
                              article.publishedAt,
                            )}
                          </time>

                          <span
                            aria-hidden="true"
                          ></span>

                          <p>
                            {article.readingTime} Min.
                            Lesezeit
                          </p>
                        </div>

                        <h3>{article.title}</h3>

                        <p className="sib-article-card-excerpt">
                          {article.excerpt}
                        </p>

                        <div className="sib-article-card-tags">
                          {article.tags
                            .slice(0, 3)
                            .map((tag) => (
                              <span key={tag}>
                                {tag}
                              </span>
                            ))}
                        </div>
                      </div>

                      <footer className="sib-article-card-footer">
                        <div>
                          <span>Von</span>
                          <strong>
                            {article.author}
                          </strong>
                        </div>

                        <span className="sib-article-card-action">
                          <span>Artikel lesen</span>

                          <span
                            className="sib-article-card-action-icon"
                            aria-hidden="true"
                          >
                            <ArrowIcon />
                          </span>
                        </span>
                      </footer>
                    </Link>
                  </article>
                ),
              )}
            </div>

            {visibleCount <
              filteredArticles.length && (
              <div className="sib-articles-overview-load-more">
                <button
                  type="button"
                  onClick={() =>
                    setVisibleCount(
                      (currentCount) =>
                        currentCount + 6,
                    )
                  }
                >
                  Weitere Artikel laden
                </button>

                <p>
                  {visibleArticles.length} von{" "}
                  {filteredArticles.length} Artikeln
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="sib-articles-overview-empty">
            <span aria-hidden="true">
              <EmptyIcon />
            </span>

            <h3>Keine Artikel gefunden</h3>

            <p>
              Für den Suchbegriff oder die gewählte
              Kategorie sind aktuell keine passenden
              Artikel vorhanden.
            </p>

            <button
              type="button"
              onClick={resetFilters}
            >
              Alle Artikel anzeigen
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default ArticlesOverview;