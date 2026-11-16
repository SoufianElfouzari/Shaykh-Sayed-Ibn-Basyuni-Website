import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

import {
  downloadDarsAudio,
  getDarsAudioUrl,
  getPublishedDuruus,
} from "../../../../supabase/duruusService";

import { useSsrData } from "../../../../SsrDataContext";

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

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 10.75V16" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      <circle cx="12" cy="7.5" r="1.15" fill="currentColor" />
    </svg>
  );
}

function DescriptionInline({ text }) {
  return String(text || "")
    .split(/(\*\*[^*\n]+\*\*)/g)
    .map((part, index) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <strong key={index}>{part.slice(2, -2)}</strong>
      ) : (
        <span key={index}>{part}</span>
      ),
    );
}

function DescriptionText({ text }) {
  const lines = String(text || "").replace(/\r\n?/g, "\n").split("\n");
  const sections = [];
  let paragraph = [];
  let list = [];
  let listType = null;

  function flushParagraph() {
    if (paragraph.length) {
      sections.push({ type: "paragraph", lines: paragraph });
      paragraph = [];
    }
  }

  function flushList() {
    if (list.length) {
      sections.push({ type: listType, lines: list });
      list = [];
      listType = null;
    }
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    const bullet = line.match(/^[-*•]\s+(.+)$/);
    const numbered = line.match(/^\d+[.)]\s+(.+)$/);

    if (heading) {
      flushParagraph();
      flushList();
      sections.push({ type: "heading", text: heading[2] });
    } else if (bullet || numbered) {
      flushParagraph();
      const type = bullet ? "ul" : "ol";
      if (listType && listType !== type) flushList();
      listType = type;
      list.push((bullet || numbered)[1]);
    } else {
      flushList();
      paragraph.push(line);
    }
  }

  flushParagraph();
  flushList();

  return (
    <div className="sib-archive-modal-prose">
      {sections.map((section, index) => {
        if (section.type === "heading") {
          return <h4 key={index}><DescriptionInline text={section.text} /></h4>;
        }
        if (section.type === "ul" || section.type === "ol") {
          const items = section.lines.map((item, itemIndex) => (
            <li key={itemIndex}><DescriptionInline text={item} /></li>
          ));
          return section.type === "ul"
            ? <ul key={index}>{items}</ul>
            : <ol key={index}>{items}</ol>;
        }
        return (
          <p key={index}>
            {section.lines.map((line, lineIndex) => (
              <span key={lineIndex}>
                {lineIndex > 0 && <br />}
                <DescriptionInline text={line} />
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}

function DuruusArchive() {
  const { duruus: initialDuruus } = useSsrData();
  const audioRef = useRef(null);
  const detailModalRef = useRef(null);
  const detailCloseRef = useRef(null);
  const [detailRecording, setDetailRecording] = useState(null);

  const [recordings, setRecordings] =
    useState(initialDuruus || []);

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
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

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
  ] = useState(!initialDuruus);

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
    if (Array.isArray(initialDuruus)) return undefined;
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
          "Durous konnten nicht geladen werden:",
          error,
        );

        if (!isCurrentRequest) {
          return;
        }

        setRecordings([]);

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Die Durous konnten nicht geladen werden.",
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
  }, [initialDuruus]);

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

  useEffect(() => {
    if (!detailRecording) return undefined;

    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    detailCloseRef.current?.focus();

    const handleModalKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setDetailRecording(null);
        return;
      }
      if (event.key !== "Tab" || !detailModalRef.current) return;

      const focusable = Array.from(
        detailModalRef.current.querySelectorAll(
          'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleModalKeyDown);
    return () => {
      document.removeEventListener("keydown", handleModalKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus();
      }
    };
  }, [detailRecording]);

  const seriesList = Object.values(groupedRecordings);
  const currentSeries = seriesList.find((group) => group.title === selectedSeries) || seriesList[0] || null;
  const formatClock = (seconds) => {
    if (!Number.isFinite(seconds)) return "0:00";
    const total = Math.floor(seconds);
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const secs = String(total % 60).padStart(2, "0");
    return hours ? `${hours}:${String(minutes).padStart(2, "0")}:${secs}` : `${minutes}:${secs}`;
  };
  const seekBy = (seconds) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, Math.min(audioRef.current.duration || 0, audioRef.current.currentTime + seconds));
  };
  const changeRate = () => {
    const next = playbackRate === 1 ? 1.25 : playbackRate === 1.25 ? 1.5 : playbackRate === 1.5 ? 2 : 1;
    setPlaybackRate(next);
    if (audioRef.current) audioRef.current.playbackRate = next;
  };
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
    <>
    <section className="sib-duruus-archive sib-duruus-redesign" id="unterrichtsarchiv" aria-labelledby="sib-duruus-archive-title">
      <div className="sib-duruus-archive-container">
        <header className="sib-archive-intro">
          <p className="sib-archive-eyebrow">Islamisches Wissen</p>
          <h2 id="sib-duruus-archive-title" className="sib-archive-heading">Unterricht &amp; <span>Audioarchiv</span></h2>
          <p className="sib-archive-subtitle">Unterrichtsreihen und Aufnahmen von Dr. Shaykh Sayed Ibn Basyuni</p>
        </header>
        {isLoadingRecordings ? <p className="sib-archive-status" role="status">Die Unterrichte werden geladen...</p> : errorMessage ? <p className="sib-archive-status" role="alert">{errorMessage}</p> : (
          <>
            <div className="sib-archive-toolbar">
              <nav className="sib-archive-categories" aria-label="Unterrichtskategorien">
                {categories.map((category) => <button key={category} type="button" className={activeCategory === category ? "sib-archive-pill is-active" : "sib-archive-pill"} aria-pressed={activeCategory === category} onClick={() => setActiveCategory(category)}>{category}</button>)}
              </nav>
              <div className="sib-archive-search">
                <SearchIcon />
                <input type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Thema oder Unterricht suchen" aria-label="Unterricht suchen" />
                {searchTerm && <button type="button" aria-label="Suche löschen" onClick={() => setSearchTerm("")}><CloseIcon /></button>}
              </div>
            </div>
            {audioErrorMessage && <p className="sib-archive-error" role="alert">{audioErrorMessage}</p>}
            {currentSeries ? (
              <div className="sib-archive-layout">
                <div className="sib-archive-sidebar">
                  <h3>Unterrichtsreihen</h3>
                  <div className="sib-archive-series-nav">
                    {seriesList.map((group) => <button key={group.title} type="button" className={currentSeries.title === group.title ? "sib-archive-series-button is-active" : "sib-archive-series-button"} onClick={() => setSelectedSeries(group.title)} aria-pressed={currentSeries.title === group.title}>
                      <span className="sib-archive-book" aria-hidden="true">▤</span>
                      <span className="sib-archive-series-copy"><strong>{group.title}</strong><small>{group.recordings.length} {group.recordings.length === 1 ? "Aufnahme" : "Aufnahmen"}</small></span>
                      <span aria-hidden="true" className="sib-archive-chevron">›</span>
                    </button>)}
                  </div>
                </div>
                <div className="sib-archive-lessons">
                  <div className="sib-archive-series-header">
                    <h3>{currentSeries.title}</h3>
                    <span className="sib-archive-series-tag">{currentSeries.category}</span>
                  </div>
                  <p className="sib-archive-series-summary">{currentSeries.recordings.length} {currentSeries.recordings.length === 1 ? "veröffentlichte Unterrichtseinheit" : "veröffentlichte Unterrichtseinheiten"}</p>
                  <div className="sib-archive-recording-list">
                    {[...currentSeries.recordings].sort((a,b) => (Number(a.lessonNumber) || 0) - (Number(b.lessonNumber) || 0)).map((recording) => {
                      const active = activeRecording?.id === recording.id;
                      return (
                        <article
                          className={active ? "sib-archive-recording is-active" : "sib-archive-recording"}
                          key={recording.id}
                          id={`aufnahme-${recording.id}`}
                        >
                          <button
                            type="button"
                            className="sib-archive-recording-open"
                            onClick={() => setDetailRecording(recording)}
                            aria-label={`Details zu ${recording.title} anzeigen`}
                          />
                          <button
                            type="button"
                            className="sib-archive-play"
                            disabled={isLoadingAudio}
                            onClick={() => toggleRecording(recording)}
                            aria-label={active && isPlaying ? `${recording.title} pausieren` : `${recording.title} abspielen`}
                          >
                            {active && isPlaying ? <PauseIcon /> : <PlayIcon />}
                          </button>
                          <span className="sib-archive-number">
                            {String(recording.lessonNumber || "").padStart(2, "0")}
                          </span>
                          <div className="sib-archive-recording-info">
                            <h4>{recording.title}</h4>
                            <span>{formatDate(recording.date)}{recording.duration ? ` · ${recording.duration}` : ""}</span>
                          </div>
                          <div className="sib-archive-recording-actions">
                            <button
                              type="button"
                              className="sib-archive-info"
                              onClick={() => setDetailRecording(recording)}
                              aria-label={`Informationen zu ${recording.title} öffnen`}
                              title="Details zur Aufnahme"
                            >
                              <InfoIcon />
                            </button>
                            <button
                              type="button"
                              className="sib-archive-download"
                              onClick={() => handleDownload(recording)}
                              disabled={downloadingRecordingId === recording.id}
                              aria-label={`${recording.title} herunterladen`}
                              title="Aufnahme herunterladen"
                            >
                              {downloadingRecordingId === recording.id ? <span aria-hidden="true">...</span> : <DownloadIcon />}
                            </button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : <div className="sib-archive-status"><h3>{recordings.length ? "Keine passenden Aufnahmen" : "Noch keine Unterrichte veröffentlicht"}</h3><p>{recordings.length ? "Versuche einen anderen Suchbegriff oder eine andere Kategorie." : "Neue Aufnahmen erscheinen hier, sobald sie veröffentlicht wurden."}</p>{recordings.length > 0 && <button type="button" onClick={resetFilters}>Filter zurücksetzen</button>}</div>}
          </>
        )}
        {activeRecording && <div className="sib-archive-player">
          <button type="button" className="sib-archive-player-play" onClick={() => toggleRecording(activeRecording)} aria-label={isPlaying ? "Pausieren" : "Abspielen"} disabled={!audioUrl || isLoadingAudio}>{isPlaying ? <PauseIcon /> : <PlayIcon />}</button>
          <div className="sib-archive-player-controls">
            <strong>{activeRecording.title}</strong>
            <div className="sib-archive-player-timeline"><button type="button" onClick={() => seekBy(-15)} aria-label="15 Sekunden zurück">↶15</button><span>{formatClock(currentTime)}</span><input aria-label="Wiedergabeposition" type="range" min="0" max={audioDuration || 1} value={Math.min(currentTime, audioDuration || 1)} onChange={(event) => { if(audioRef.current) audioRef.current.currentTime = Number(event.target.value); setCurrentTime(Number(event.target.value)); }} /><span>{formatClock(audioDuration)}</span><button type="button" onClick={() => seekBy(15)} aria-label="15 Sekunden vor">15↷</button></div>
          </div>
          <button type="button" className="sib-archive-rate" onClick={changeRate} aria-label="Wiedergabegeschwindigkeit ändern">{playbackRate}x</button>
          <button type="button" className="sib-archive-player-close" onClick={closePlayer} aria-label="Player schließen"><CloseIcon /></button>
          <audio ref={audioRef} src={audioUrl || undefined} preload="metadata" onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)} onLoadedMetadata={(event) => {setAudioDuration(event.currentTarget.duration || 0);event.currentTarget.playbackRate=playbackRate;}} onDurationChange={(event) => setAudioDuration(event.currentTarget.duration || 0)} />
        </div>}
      </div>
    </section>
    {detailRecording && typeof document !== "undefined" && createPortal(
      <div
        className="sib-archive-modal-backdrop"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) setDetailRecording(null);
        }}
      >
        <div
          className="sib-archive-modal"
          ref={detailModalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="sib-archive-modal-title"
          aria-describedby="sib-archive-modal-subtitle"
        >
          <div className="sib-archive-modal-top">
            <p className="sib-archive-modal-eyebrow">Islamisches Wissen · Unterrichtsaufnahme</p>
            <button
              ref={detailCloseRef}
              type="button"
              className="sib-archive-modal-close"
              onClick={() => setDetailRecording(null)}
              aria-label="Details schließen"
            >
              <CloseIcon />
            </button>
          </div>
          <div className="sib-archive-modal-content">
            <p className="sib-archive-modal-series">{detailRecording.series}</p>
            <h3 id="sib-archive-modal-title">{detailRecording.title}</h3>
            <p id="sib-archive-modal-subtitle" className="sib-archive-modal-lesson">
              {detailRecording.lessonNumber != null
                ? `Unterricht ${String(detailRecording.lessonNumber).padStart(2, "0")}`
                : "Unterrichtsaufnahme"}
            </p>
            <div className="sib-archive-modal-meta">
              {detailRecording.category && <span><strong>Wissensgebiet</strong>{detailRecording.category}</span>}
              {detailRecording.date && <span><strong>Datum</strong>{formatDate(detailRecording.date)}</span>}
              {detailRecording.duration && <span><strong>Dauer</strong>{detailRecording.duration}</span>}
              {detailRecording.language && <span><strong>Sprache</strong>{detailRecording.language}</span>}
            </div>
            <div className="sib-archive-modal-description">
              <h4>Über diesen Unterricht</h4>
              {String(detailRecording.description || "").trim()
                ? <DescriptionText text={detailRecording.description} />
                : <p className="sib-archive-modal-no-description">Zu dieser Aufnahme wurde noch keine Beschreibung veröffentlicht.</p>}
            </div>
          </div>
          <div className="sib-archive-modal-footer">
            <button
              type="button"
              className="sib-archive-modal-listen"
              onClick={() => toggleRecording(detailRecording)}
              disabled={isLoadingAudio}
            >
              {activeRecording?.id === detailRecording.id && isPlaying ? <PauseIcon /> : <PlayIcon />}
              {activeRecording?.id === detailRecording.id && isPlaying ? "Pausieren" : "Unterricht anhören"}
            </button>
            <button
              type="button"
              className="sib-archive-modal-download"
              onClick={() => handleDownload(detailRecording)}
              disabled={downloadingRecordingId !== null}
            >
              <DownloadIcon />
              {downloadingRecordingId === detailRecording.id ? "Wird heruntergeladen..." : "Herunterladen"}
            </button>
          </div>
          {audioErrorMessage && <p className="sib-archive-modal-audio-error" role="alert">{audioErrorMessage}</p>}
        </div>
      </div>,
      document.body,
    )}
  </>
  );
}

export default DuruusArchive;
