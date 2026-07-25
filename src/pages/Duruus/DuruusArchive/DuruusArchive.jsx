import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./DuruusArchive.css";

const archiveRecordings = [
  {
    id: 1,
    title: "Die Bedeutung der Hadithwissenschaft",
    series: "Einführung in Mustalah al-Hadith",
    lessonNumber: 1,
    category: "Mustalah al-Hadith",
    language: "Deutsch",
    date: "2026-07-24",
    duration: "58 Minuten",
    description:
      "Einführung in die Bedeutung der Hadithwissenschaft und ihre Stellung innerhalb der islamischen Wissenschaften.",
    audioUrl: "/audio/mustalah-al-hadith-01.mp3",
  },
  {
    id: 2,
    title: "Die verschiedenen Arten der Überlieferung",
    series: "Einführung in Mustalah al-Hadith",
    lessonNumber: 2,
    category: "Mustalah al-Hadith",
    language: "Deutsch",
    date: "2026-07-22",
    duration: "1 Stunde 4 Minuten",
    description:
      "Besprechung grundlegender Arten von Überlieferungen und ihrer Einordnung innerhalb der Hadithwissenschaft.",
    audioUrl: "/audio/mustalah-al-hadith-02.mp3",
  },
  {
    id: 3,
    title: "Der authentische Hadith",
    series: "Einführung in Mustalah al-Hadith",
    lessonNumber: 3,
    category: "Mustalah al-Hadith",
    language: "Deutsch",
    date: "2026-07-20",
    duration: "55 Minuten",
    description:
      "Erläuterung der Bedingungen eines authentischen Hadith und Einführung in die Bewertung der Überlieferungskette.",
    audioUrl: "/audio/mustalah-al-hadith-03.mp3",
  },
  {
    id: 4,
    title: "Die Grundlagen des islamischen Glaubens",
    series: "Grundlagen der Aqidah",
    lessonNumber: 1,
    category: "Aqidah",
    language: "Deutsch",
    date: "2026-07-18",
    duration: "49 Minuten",
    description:
      "Ein grundlegender Unterricht über die Bedeutung der Aqidah und ihre Stellung im Leben eines Muslims.",
    audioUrl: "/audio/aqidah-01.mp3",
  },
  {
    id: 5,
    title: "Der Glaube an Allah",
    series: "Grundlagen der Aqidah",
    lessonNumber: 2,
    category: "Aqidah",
    language: "Deutsch",
    date: "2026-07-16",
    duration: "1 Stunde 9 Minuten",
    description:
      "Erläuterung des Glaubens an Allah und ausgewählter Grundlagen des Tauhid.",
    audioUrl: "/audio/aqidah-02.mp3",
  },
  {
    id: 6,
    title: "Die Voraussetzungen des Gebets",
    series: "Fiqh des Gebets",
    lessonNumber: 1,
    category: "Fiqh",
    language: "Deutsch",
    date: "2026-07-14",
    duration: "46 Minuten",
    description:
      "Einführung in die Voraussetzungen des Gebets und die damit verbundenen grundlegenden Rechtsfragen.",
    audioUrl: "/audio/fiqh-gebet-01.mp3",
  },
  {
    id: 7,
    title: "Die Säulen des Gebets",
    series: "Fiqh des Gebets",
    lessonNumber: 2,
    category: "Fiqh",
    language: "Deutsch",
    date: "2026-07-12",
    duration: "52 Minuten",
    description:
      "Besprechung der Säulen des Gebets und der Folgen, wenn eine dieser Säulen ausgelassen wird.",
    audioUrl: "/audio/fiqh-gebet-02.mp3",
  },
  {
    id: 8,
    title: "Einführung in die Regeln des Tajwid",
    series: "Grundlagen des Tajwid",
    lessonNumber: 1,
    category: "Quran und Tajwid",
    language: "Arabisch",
    date: "2026-07-10",
    duration: "43 Minuten",
    description:
      "Einführung in die Grundlagen der korrekten Quranrezitation und die Bedeutung des Tajwid.",
    audioUrl: "/audio/tajwid-01.mp3",
  },
  {
    id: 9,
    title: "Die Artikulationsstellen der Buchstaben",
    series: "Grundlagen des Tajwid",
    lessonNumber: 2,
    category: "Quran und Tajwid",
    language: "Arabisch",
    date: "2026-07-08",
    duration: "48 Minuten",
    description:
      "Erläuterung ausgewählter Artikulationsstellen der arabischen Buchstaben mit praktischen Beispielen.",
    audioUrl: "/audio/tajwid-02.mp3",
  },
  {
    id: 10,
    title: "Die Wortarten im Arabischen",
    series: "Grundlagen der arabischen Sprache",
    lessonNumber: 1,
    category: "Arabisch",
    language: "Deutsch und Arabisch",
    date: "2026-07-06",
    duration: "57 Minuten",
    description:
      "Einführung in die grundlegenden Wortarten der arabischen Sprache: Nomen, Verb und Partikel.",
    audioUrl: "/audio/arabisch-01.mp3",
  },
  {
    id: 11,
    title: "Das bestimmte und unbestimmte Nomen",
    series: "Grundlagen der arabischen Sprache",
    lessonNumber: 2,
    category: "Arabisch",
    language: "Deutsch und Arabisch",
    date: "2026-07-04",
    duration: "50 Minuten",
    description:
      "Erläuterung des bestimmten und unbestimmten Nomens anhand einfacher arabischer Beispiele.",
    audioUrl: "/audio/arabisch-02.mp3",
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
    value: "series",
    label: "Nach Unterrichtsreihe",
  },
  {
    value: "title",
    label: "Titel von A bis Z",
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

function PlayIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M9 7L17 12L9 17V7Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M9 7V17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <path
        d="M15 7V17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 4V15"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M8 11L12 15L16 11"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M5 19H19"
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

function EmptyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="5"
        y="5"
        width="14"
        height="14"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M9 10H15"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <path
        d="M9 14H13"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function formatDate(value) {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function normalizeText(value) {
  return value
    .toLocaleLowerCase("de-DE")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function DuruusArchive() {
  const audioRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] =
    useState("Alle");
  const [activeLanguage, setActiveLanguage] =
    useState("Alle");
  const [sortBy, setSortBy] = useState("newest");

  const [activeRecording, setActiveRecording] =
    useState(null);
  const [isPlaying, setIsPlaying] =
    useState(false);

  const categories = useMemo(() => {
    return [
      "Alle",
      ...new Set(
        archiveRecordings.map(
          (recording) => recording.category,
        ),
      ),
    ];
  }, []);

  const languages = useMemo(() => {
    return [
      "Alle",
      ...new Set(
        archiveRecordings.map(
          (recording) => recording.language,
        ),
      ),
    ];
  }, []);

  const filteredRecordings = useMemo(() => {
    const normalizedSearch = normalizeText(
      searchTerm.trim(),
    );

    const results = archiveRecordings.filter(
      (recording) => {
        const categoryMatches =
          activeCategory === "Alle" ||
          recording.category === activeCategory;

        const languageMatches =
          activeLanguage === "Alle" ||
          recording.language === activeLanguage;

        const searchableContent = normalizeText(
          [
            recording.title,
            recording.series,
            recording.category,
            recording.language,
            recording.description,
          ].join(" "),
        );

        const searchMatches =
          normalizedSearch.length === 0 ||
          searchableContent.includes(normalizedSearch);

        return (
          categoryMatches &&
          languageMatches &&
          searchMatches
        );
      },
    );

    return [...results].sort((first, second) => {
      if (sortBy === "oldest") {
        return (
          new Date(first.date) -
          new Date(second.date)
        );
      }

      if (sortBy === "title") {
        return first.title.localeCompare(
          second.title,
          "de",
        );
      }

      if (sortBy === "series") {
        const seriesResult =
          first.series.localeCompare(
            second.series,
            "de",
          );

        if (seriesResult !== 0) {
          return seriesResult;
        }

        return (
          first.lessonNumber -
          second.lessonNumber
        );
      }

      return (
        new Date(second.date) -
        new Date(first.date)
      );
    });
  }, [
    searchTerm,
    activeCategory,
    activeLanguage,
    sortBy,
  ]);

  const groupedRecordings = useMemo(() => {
    return filteredRecordings.reduce(
      (groups, recording) => {
        if (!groups[recording.series]) {
          groups[recording.series] = {
            title: recording.series,
            category: recording.category,
            recordings: [],
          };
        }

        groups[recording.series].recordings.push(
          recording,
        );

        return groups;
      },
      {},
    );
  }, [filteredRecordings]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return undefined;
    }

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener(
        "pause",
        handlePause,
      );
      audio.removeEventListener(
        "ended",
        handleEnded,
      );
    };
  }, [activeRecording]);

  const resetFilters = () => {
    setSearchTerm("");
    setActiveCategory("Alle");
    setActiveLanguage("Alle");
    setSortBy("newest");
  };

  const toggleRecording = async (recording) => {
    const currentAudio = audioRef.current;

    if (
      activeRecording?.id === recording.id &&
      currentAudio
    ) {
      if (currentAudio.paused) {
        try {
          await currentAudio.play();
        } catch (error) {
          console.error(
            "Die Aufnahme konnte nicht abgespielt werden.",
            error,
          );
        }
      } else {
        currentAudio.pause();
      }

      return;
    }

    setActiveRecording(recording);
    setIsPlaying(false);

    window.setTimeout(async () => {
      const nextAudio = audioRef.current;

      if (!nextAudio) {
        return;
      }

      try {
        await nextAudio.play();
      } catch (error) {
        console.error(
          "Die Aufnahme konnte nicht abgespielt werden.",
          error,
        );
      }
    }, 0);
  };

  const closePlayer = () => {
    const audio = audioRef.current;

    if (audio) {
      audio.pause();
    }

    setActiveRecording(null);
    setIsPlaying(false);
  };

  return (
    <section
      className="sib-duruus-archive"
      id="unterrichtsarchiv"
      aria-labelledby="sib-duruus-archive-title"
    >
      <div className="sib-duruus-archive-container">
        <header className="sib-duruus-archive-header">
          <div className="sib-duruus-archive-label-row">
            <span
              className="sib-duruus-archive-label-line"
              aria-hidden="true"
            ></span>

            <p className="sib-duruus-archive-label">
              Alle verfügbaren Duruus
            </p>
          </div>

          <div className="sib-duruus-archive-header-content">
            <h2
              id="sib-duruus-archive-title"
              className="sib-duruus-archive-title"
            >
              Das vollständige
              <span>Unterrichtsarchiv.</span>
            </h2>

            <p className="sib-duruus-archive-description">
              Durchsuche alle veröffentlichten Duruus und
              Unterrichtsreihen nach Thema, Sprache oder Titel.
            </p>
          </div>
        </header>

        <div className="sib-duruus-archive-controls">
          <div className="sib-duruus-archive-search">
            <span
              className="sib-duruus-archive-search-icon"
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
              placeholder="Unterricht oder Thema suchen"
              aria-label="Unterrichtsarchiv durchsuchen"
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

          <div className="sib-duruus-archive-control">
            <label htmlFor="archive-language">
              Sprache
            </label>

            <select
              id="archive-language"
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

          <div className="sib-duruus-archive-control">
            <label htmlFor="archive-sort">
              Sortierung
            </label>

            <select
              id="archive-sort"
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
          className="sib-duruus-archive-categories"
          aria-label="Unterrichtskategorien"
        >
          {categories.map((category) => {
            const count =
              category === "Alle"
                ? archiveRecordings.length
                : archiveRecordings.filter(
                    (recording) =>
                      recording.category === category,
                  ).length;

            return (
              <button
                key={category}
                type="button"
                className={
                  activeCategory === category
                    ? "sib-duruus-archive-category sib-duruus-archive-category-active"
                    : "sib-duruus-archive-category"
                }
                onClick={() =>
                  setActiveCategory(category)
                }
              >
                <span>{category}</span>
                <strong>{count}</strong>
              </button>
            );
          })}
        </nav>

        <div className="sib-duruus-archive-result-info">
          <p>
            <strong>{filteredRecordings.length}</strong>{" "}
            {filteredRecordings.length === 1
              ? "Aufnahme"
              : "Aufnahmen"}{" "}
            gefunden
          </p>

          {(searchTerm ||
            activeCategory !== "Alle" ||
            activeLanguage !== "Alle") && (
            <button
              type="button"
              onClick={resetFilters}
            >
              Filter zurücksetzen
            </button>
          )}
        </div>

        {filteredRecordings.length > 0 ? (
          <div className="sib-duruus-series-list">
            {Object.values(groupedRecordings).map(
              (group, groupIndex) => (
                <section
                  key={group.title}
                  className="sib-duruus-series"
                  style={{
                    "--sib-series-index": groupIndex,
                  }}
                >
                  <header className="sib-duruus-series-header">
                    <div>
                      <p className="sib-duruus-series-category">
                        {group.category}
                      </p>

                      <h3>{group.title}</h3>
                    </div>

                    <p className="sib-duruus-series-count">
                      {group.recordings.length}{" "}
                      {group.recordings.length === 1
                        ? "Unterricht"
                        : "Unterrichte"}
                    </p>
                  </header>

                  <div className="sib-duruus-series-lessons">
                    {group.recordings.map(
                      (recording) => {
                        const isActive =
                          activeRecording?.id ===
                          recording.id;

                        return (
                          <article
                            key={recording.id}
                            className={`sib-duruus-lesson ${
                              isActive
                                ? "sib-duruus-lesson-active"
                                : ""
                            }`}
                          >
                            <button
                              type="button"
                              className="sib-duruus-lesson-play"
                              onClick={() =>
                                toggleRecording(recording)
                              }
                              aria-label={
                                isActive && isPlaying
                                  ? `${recording.title} pausieren`
                                  : `${recording.title} abspielen`
                              }
                            >
                              {isActive && isPlaying ? (
                                <PauseIcon />
                              ) : (
                                <PlayIcon />
                              )}
                            </button>

                            <div className="sib-duruus-lesson-content">
                              <div className="sib-duruus-lesson-top">
                                <p className="sib-duruus-lesson-number">
                                  Unterricht{" "}
                                  {String(
                                    recording.lessonNumber,
                                  ).padStart(2, "0")}
                                </p>

                                <time
                                  dateTime={recording.date}
                                >
                                  {formatDate(
                                    recording.date,
                                  )}
                                </time>
                              </div>

                              <h4>{recording.title}</h4>

                              <p className="sib-duruus-lesson-description">
                                {recording.description}
                              </p>

                              <div className="sib-duruus-lesson-meta">
                                <span>
                                  {recording.language}
                                </span>

                                <span
                                  aria-hidden="true"
                                ></span>

                                <span>
                                  {recording.duration}
                                </span>
                              </div>
                            </div>

                            <div className="sib-duruus-lesson-actions">
                              <button
                                type="button"
                                className="sib-duruus-lesson-listen"
                                onClick={() =>
                                  toggleRecording(
                                    recording,
                                  )
                                }
                              >
                                {isActive && isPlaying
                                  ? "Pausieren"
                                  : "Anhören"}
                              </button>

                              <a
                                href={recording.audioUrl}
                                download
                                className="sib-duruus-lesson-download"
                                aria-label={`${recording.title} herunterladen`}
                              >
                                <DownloadIcon />
                              </a>
                            </div>
                          </article>
                        );
                      },
                    )}
                  </div>
                </section>
              ),
            )}
          </div>
        ) : (
          <div className="sib-duruus-archive-empty">
            <span aria-hidden="true">
              <EmptyIcon />
            </span>

            <h3>Keine Aufnahmen gefunden</h3>

            <p>
              Für diese Suche oder Filterauswahl sind
              aktuell keine passenden Duruus vorhanden.
            </p>

            <button
              type="button"
              onClick={resetFilters}
            >
              Alle Aufnahmen anzeigen
            </button>
          </div>
        )}
      </div>

      {activeRecording && (
        <div className="sib-duruus-player">
          <div className="sib-duruus-player-container">
            <button
              type="button"
              className="sib-duruus-player-main-control"
              onClick={() =>
                toggleRecording(activeRecording)
              }
              aria-label={
                isPlaying
                  ? "Aufnahme pausieren"
                  : "Aufnahme abspielen"
              }
            >
              {isPlaying ? (
                <PauseIcon />
              ) : (
                <PlayIcon />
              )}
            </button>

            <div className="sib-duruus-player-information">
              <span>
                {activeRecording.series}
              </span>

              <strong>
                {activeRecording.title}
              </strong>
            </div>

            <audio
              ref={audioRef}
              src={activeRecording.audioUrl}
              controls
              preload="metadata"
            >
              Dein Browser unterstützt keine
              Audiowiedergabe.
            </audio>

            <button
              type="button"
              className="sib-duruus-player-close"
              onClick={closePlayer}
              aria-label="Audio-Player schließen"
            >
              <CloseIcon />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default DuruusArchive;