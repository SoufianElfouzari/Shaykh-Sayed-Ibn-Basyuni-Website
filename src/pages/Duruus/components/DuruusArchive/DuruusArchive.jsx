import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  downloadDarsAudio,
  getDarsAudioUrl,
  getPublishedDuruus,
} from "../../../../appwrite/duruusService";

import "./DuruusArchive.css";

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
  if (!value) {
    return "Datum offen";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Datum offen";
  }

  return new Intl.DateTimeFormat(
    "de-DE",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    },
  ).format(date);
}

function normalizeText(value) {
  return String(value || "")
    .toLocaleLowerCase("de-DE")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getDateTimestamp(value) {
  if (!value) {
    return 0;
  }

  const timestamp =
    new Date(value).getTime();

  if (Number.isNaN(timestamp)) {
    return 0;
  }

  return timestamp;
}

function DuruusArchive() {
  const audioRef = useRef(null);

  const [recordings, setRecordings] =
    useState([]);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [
    activeCategory,
    setActiveCategory,
  ] = useState("Alle");

  const [
    activeLanguage,
    setActiveLanguage,
  ] = useState("Alle");

  const [sortBy, setSortBy] =
    useState("newest");

  const [
    activeRecording,
    setActiveRecording,
  ] = useState(null);

  const [audioUrl, setAudioUrl] =
    useState("");

  const [isPlaying, setIsPlaying] =
    useState(false);

  const [
    isLoadingRecordings,
    setIsLoadingRecordings,
  ] = useState(true);

  const [
    isLoadingAudio,
    setIsLoadingAudio,
  ] = useState(false);

  const [
    downloadingRecordingId,
    setDownloadingRecordingId,
  ] = useState(null);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [
    audioErrorMessage,
    setAudioErrorMessage,
  ] = useState("");

  useEffect(() => {
    let isCurrentRequest = true;

    async function loadRecordings() {
      setIsLoadingRecordings(true);
      setErrorMessage("");

      try {
        const loadedRecordings =
          await getPublishedDuruus();

        if (!isCurrentRequest) {
          return;
        }

        setRecordings(
          loadedRecordings,
        );
      } catch (error) {
        console.error(
          "Duruus konnten nicht geladen werden:",
          error,
        );

        if (!isCurrentRequest) {
          return;
        }

        setRecordings([]);

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Die Duruus konnten nicht geladen werden.",
        );
      } finally {
        if (isCurrentRequest) {
          setIsLoadingRecordings(false);
        }
      }
    }

    loadRecordings();

    return () => {
      isCurrentRequest = false;
    };
  }, []);

  const categories = useMemo(() => {
    return [
      "Alle",
      ...new Set(
        recordings
          .map(
            (recording) =>
              recording.category,
          )
          .filter(Boolean),
      ),
    ];
  }, [recordings]);

  const languages = useMemo(() => {
    return [
      "Alle",
      ...new Set(
        recordings
          .map(
            (recording) =>
              recording.language,
          )
          .filter(Boolean),
      ),
    ];
  }, [recordings]);

  const filteredRecordings =
    useMemo(() => {
      const normalizedSearch =
        normalizeText(
          searchTerm.trim(),
        );

      const results =
        recordings.filter(
          (recording) => {
            const categoryMatches =
              activeCategory ===
                "Alle" ||
              recording.category ===
                activeCategory;

            const languageMatches =
              activeLanguage ===
                "Alle" ||
              recording.language ===
                activeLanguage;

            const searchableContent =
              normalizeText(
                [
                  recording.title,
                  recording.series,
                  recording.category,
                  recording.language,
                  recording.description,
                ].join(" "),
              );

            const searchMatches =
              normalizedSearch.length ===
                0 ||
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

      return [...results].sort(
        (first, second) => {
          if (sortBy === "oldest") {
            return (
              getDateTimestamp(
                first.date,
              ) -
              getDateTimestamp(
                second.date,
              )
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
            getDateTimestamp(
              second.date,
            ) -
            getDateTimestamp(
              first.date,
            )
          );
        },
      );
    }, [
      recordings,
      searchTerm,
      activeCategory,
      activeLanguage,
      sortBy,
    ]);

  const groupedRecordings =
    useMemo(() => {
      return filteredRecordings.reduce(
        (groups, recording) => {
          if (!groups[recording.series]) {
            groups[recording.series] = {
              title: recording.series,
              category:
                recording.category,
              recordings: [],
            };
          }

          groups[
            recording.series
          ].recordings.push(
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

    const handleError = () => {
      setIsPlaying(false);

      setAudioErrorMessage(
        "Die Aufnahme konnte nicht abgespielt werden.",
      );
    };

    audio.addEventListener(
      "play",
      handlePlay,
    );

    audio.addEventListener(
      "pause",
      handlePause,
    );

    audio.addEventListener(
      "ended",
      handleEnded,
    );

    audio.addEventListener(
      "error",
      handleError,
    );

    return () => {
      audio.removeEventListener(
        "play",
        handlePlay,
      );

      audio.removeEventListener(
        "pause",
        handlePause,
      );

      audio.removeEventListener(
        "ended",
        handleEnded,
      );

      audio.removeEventListener(
        "error",
        handleError,
      );
    };
  }, [
    activeRecording,
    audioUrl,
  ]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !audioUrl) {
      return;
    }

    audio.load();
  }, [audioUrl]);

  const resetFilters = () => {
    setSearchTerm("");
    setActiveCategory("Alle");
    setActiveLanguage("Alle");
    setSortBy("newest");
  };

  const startRecording =
    async (recording) => {
      setIsLoadingAudio(true);
      setAudioErrorMessage("");

      try {
        const signedAudioUrl =
          await getDarsAudioUrl(
            recording,
          );

        setActiveRecording(
          recording,
        );

        setAudioUrl(
          signedAudioUrl,
        );

        setIsPlaying(false);

        window.setTimeout(
          async () => {
            const audio =
              audioRef.current;

            if (!audio) {
              return;
            }

            try {
              await audio.play();
            } catch (error) {
              console.error(
                "Die Aufnahme konnte nicht automatisch abgespielt werden:",
                error,
              );

              setAudioErrorMessage(
                "Die Aufnahme wurde geladen. Drücke erneut auf Play, um sie abzuspielen.",
              );
            }
          },
          100,
        );
      } catch (error) {
        console.error(
          "Audio-URL konnte nicht geladen werden:",
          error,
        );

        setAudioErrorMessage(
          error instanceof Error
            ? error.message
            : "Die Aufnahme konnte nicht geladen werden.",
        );
      } finally {
        setIsLoadingAudio(false);
      }
    };

  const toggleRecording =
    async (recording) => {
      if (isLoadingAudio) {
        return;
      }

      const currentAudio =
        audioRef.current;

      const isCurrentRecording =
        activeRecording?.id ===
        recording.id;

      if (
        isCurrentRecording &&
        currentAudio &&
        audioUrl
      ) {
        if (currentAudio.paused) {
          try {
            await currentAudio.play();
          } catch (error) {
            console.error(
              "Die Aufnahme konnte nicht abgespielt werden:",
              error,
            );

            setAudioErrorMessage(
              "Die Aufnahme konnte nicht abgespielt werden.",
            );
          }
        } else {
          currentAudio.pause();
        }

        return;
      }

      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }

      await startRecording(
        recording,
      );
    };

  const handleDownload =
    async (recording) => {
      if (
        downloadingRecordingId !==
        null
      ) {
        return;
      }

      setDownloadingRecordingId(
        recording.id,
      );

      setAudioErrorMessage("");

      try {
        await downloadDarsAudio(
          recording,
        );
      } catch (error) {
        console.error(
          "Die Aufnahme konnte nicht heruntergeladen werden:",
          error,
        );

        setAudioErrorMessage(
          error instanceof Error
            ? error.message
            : "Die Aufnahme konnte nicht heruntergeladen werden.",
        );
      } finally {
        setDownloadingRecordingId(
          null,
        );
      }
    };

  const closePlayer = () => {
    const audio =
      audioRef.current;

    if (audio) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }

    setActiveRecording(null);
    setAudioUrl("");
    setIsPlaying(false);
    setIsLoadingAudio(false);
    setAudioErrorMessage("");
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
              <span>
                Unterrichtsarchiv.
              </span>
            </h2>

            <p className="sib-duruus-archive-description">
              Durchsuche alle veröffentlichten
              Duruus und Unterrichtsreihen nach
              Thema, Sprache oder Titel.
            </p>
          </div>
        </header>

        {isLoadingRecordings && (
          <div
            className="sib-duruus-archive-empty"
            aria-live="polite"
          >
            <span aria-hidden="true">
              <EmptyIcon />
            </span>

            <h3>
              Duruus werden geladen
            </h3>

            <p>
              Die veröffentlichten Aufnahmen
              werden aus Appwrite geladen.
            </p>
          </div>
        )}

        {!isLoadingRecordings &&
          errorMessage && (
            <div
              className="sib-duruus-archive-empty"
              role="alert"
            >
              <span aria-hidden="true">
                <EmptyIcon />
              </span>

              <h3>
                Duruus konnten nicht geladen
                werden
              </h3>

              <p>{errorMessage}</p>
            </div>
          )}

        {!isLoadingRecordings &&
          !errorMessage && (
            <>
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
                      setSearchTerm(
                        event.target.value,
                      )
                    }
                    placeholder="Unterricht oder Thema suchen"
                    aria-label="Unterrichtsarchiv durchsuchen"
                  />

                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() =>
                        setSearchTerm("")
                      }
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
                      setActiveLanguage(
                        event.target.value,
                      )
                    }
                  >
                    {languages.map(
                      (language) => (
                        <option
                          key={language}
                          value={language}
                        >
                          {language}
                        </option>
                      ),
                    )}
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
                      setSortBy(
                        event.target.value,
                      )
                    }
                  >
                    {sortOptions.map(
                      (option) => (
                        <option
                          key={
                            option.value
                          }
                          value={
                            option.value
                          }
                        >
                          {option.label}
                        </option>
                      ),
                    )}
                  </select>
                </div>
              </div>

              <nav
                className="sib-duruus-archive-categories"
                aria-label="Unterrichtskategorien"
              >
                {categories.map(
                  (category) => {
                    const count =
                      category === "Alle"
                        ? recordings.length
                        : recordings.filter(
                            (
                              recording,
                            ) =>
                              recording.category ===
                              category,
                          ).length;

                    return (
                      <button
                        key={category}
                        type="button"
                        className={
                          activeCategory ===
                          category
                            ? "sib-duruus-archive-category sib-duruus-archive-category-active"
                            : "sib-duruus-archive-category"
                        }
                        onClick={() =>
                          setActiveCategory(
                            category,
                          )
                        }
                      >
                        <span>
                          {category}
                        </span>

                        <strong>
                          {count}
                        </strong>
                      </button>
                    );
                  },
                )}
              </nav>

              <div className="sib-duruus-archive-result-info">
                <p>
                  <strong>
                    {
                      filteredRecordings.length
                    }
                  </strong>{" "}
                  {filteredRecordings.length ===
                  1
                    ? "Aufnahme"
                    : "Aufnahmen"}{" "}
                  gefunden
                </p>

                {(searchTerm ||
                  activeCategory !==
                    "Alle" ||
                  activeLanguage !==
                    "Alle") && (
                  <button
                    type="button"
                    onClick={resetFilters}
                  >
                    Filter zurücksetzen
                  </button>
                )}
              </div>

              {audioErrorMessage && (
                <div
                  role="alert"
                  style={{
                    marginBottom: "22px",
                    padding: "14px 18px",
                    border:
                      "1px solid rgba(180, 45, 45, 0.2)",
                    borderRadius: "10px",
                    background:
                      "rgba(180, 45, 45, 0.05)",
                    color: "#8f2525",
                    fontSize: "14px",
                  }}
                >
                  {audioErrorMessage}
                </div>
              )}

              {filteredRecordings.length >
              0 ? (
                <div className="sib-duruus-series-list">
                  {Object.values(
                    groupedRecordings,
                  ).map(
                    (
                      group,
                      groupIndex,
                    ) => (
                      <section
                        key={group.title}
                        className="sib-duruus-series"
                        style={{
                          "--sib-series-index":
                            groupIndex,
                        }}
                      >
                        <header className="sib-duruus-series-header">
                          <div>
                            <p className="sib-duruus-series-category">
                              {
                                group.category
                              }
                            </p>

                            <h3>
                              {group.title}
                            </h3>
                          </div>

                          <p className="sib-duruus-series-count">
                            {
                              group
                                .recordings
                                .length
                            }{" "}
                            {group
                              .recordings
                              .length === 1
                              ? "Unterricht"
                              : "Unterrichte"}
                          </p>
                        </header>

                        <div className="sib-duruus-series-lessons">
                          {group.recordings.map(
                            (
                              recording,
                            ) => {
                              const isActive =
                                activeRecording?.id ===
                                recording.id;

                              const isLoadingThisAudio =
                                isLoadingAudio &&
                                isActive;

                              const isDownloading =
                                downloadingRecordingId ===
                                recording.id;

                              return (
                                <article
                                  key={
                                    recording.id
                                  }
                                  className={`sib-duruus-lesson ${
                                    isActive
                                      ? "sib-duruus-lesson-active"
                                      : ""
                                  }`}
                                >
                                  <button
                                    type="button"
                                    className="sib-duruus-lesson-play"
                                    disabled={
                                      isLoadingAudio
                                    }
                                    onClick={() =>
                                      toggleRecording(
                                        recording,
                                      )
                                    }
                                    aria-label={
                                      isActive &&
                                      isPlaying
                                        ? `${recording.title} pausieren`
                                        : `${recording.title} abspielen`
                                    }
                                  >
                                    {isLoadingThisAudio ? (
                                      <span>
                                        ...
                                      </span>
                                    ) : isActive &&
                                      isPlaying ? (
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
                                        ).padStart(
                                          2,
                                          "0",
                                        )}
                                      </p>

                                      <time
                                        dateTime={
                                          recording.date ||
                                          undefined
                                        }
                                      >
                                        {formatDate(
                                          recording.date,
                                        )}
                                      </time>
                                    </div>

                                    <h4>
                                      {
                                        recording.title
                                      }
                                    </h4>

                                    {recording.description && (
                                      <p className="sib-duruus-lesson-description">
                                        {
                                          recording.description
                                        }
                                      </p>
                                    )}

                                    <div className="sib-duruus-lesson-meta">
                                      <span>
                                        {
                                          recording.language
                                        }
                                      </span>

                                      <span
                                        aria-hidden="true"
                                      ></span>

                                      <span>
                                        {
                                          recording.duration
                                        }
                                      </span>
                                    </div>
                                  </div>

                                  <div className="sib-duruus-lesson-actions">
                                    <button
                                      type="button"
                                      className="sib-duruus-lesson-listen"
                                      disabled={
                                        isLoadingAudio
                                      }
                                      onClick={() =>
                                        toggleRecording(
                                          recording,
                                        )
                                      }
                                    >
                                      {isLoadingThisAudio
                                        ? "Wird geladen..."
                                        : isActive &&
                                            isPlaying
                                          ? "Pausieren"
                                          : "Anhören"}
                                    </button>

                                    <button
                                      type="button"
                                      className="sib-duruus-lesson-download"
                                      disabled={
                                        isDownloading
                                      }
                                      onClick={() =>
                                        handleDownload(
                                          recording,
                                        )
                                      }
                                      aria-label={`${recording.title} herunterladen`}
                                    >
                                      {isDownloading ? (
                                        <span>
                                          ...
                                        </span>
                                      ) : (
                                        <DownloadIcon />
                                      )}
                                    </button>
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

                  <h3>
                    Keine Aufnahmen gefunden
                  </h3>

                  <p>
                    Für diese Suche oder
                    Filterauswahl sind aktuell
                    keine passenden Duruus
                    vorhanden.
                  </p>

                  <button
                    type="button"
                    onClick={resetFilters}
                  >
                    Alle Aufnahmen anzeigen
                  </button>
                </div>
              )}
            </>
          )}
      </div>

      {activeRecording && (
        <div className="sib-duruus-player">
          <div className="sib-duruus-player-container">
            <button
              type="button"
              className="sib-duruus-player-main-control"
              disabled={
                isLoadingAudio ||
                !audioUrl
              }
              onClick={() =>
                toggleRecording(
                  activeRecording,
                )
              }
              aria-label={
                isPlaying
                  ? "Aufnahme pausieren"
                  : "Aufnahme abspielen"
              }
            >
              {isLoadingAudio ? (
                <span>...</span>
              ) : isPlaying ? (
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

            {audioUrl ? (
              <audio
                ref={audioRef}
                src={audioUrl}
                controls
                preload="metadata"
              >
                Dein Browser unterstützt
                keine Audiowiedergabe.
              </audio>
            ) : (
              <div
                style={{
                  flex: 1,
                  fontSize: "13px",
                  color:
                    "rgba(255, 255, 255, 0.7)",
                }}
              >
                Aufnahme wird geladen...
              </div>
            )}

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