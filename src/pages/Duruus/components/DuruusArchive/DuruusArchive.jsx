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
import BookIcon from "../../../common/BookIcon.jsx";

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

function FilterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 5h18l-7 8v5.5l-4 2V13L3 5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SortIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 19V5m0 0-4 4m4-4 4 4M17 5v14m0 0-4-4m4 4 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BookmarkIcon({ filled = false }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} aria-hidden="true">
      <path d="M6 3.5h12v17l-6-4.5-6 4.5v-17Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function SkipIcon({ forward = false }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d={forward ? "M20.5 6.5A11 11 0 1 0 26 16" : "M11.5 6.5A11 11 0 1 1 6 16"} stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d={forward ? "M20 2v7h7" : "M12 2v7H5"} stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
      <text x="16" y="21" textAnchor="middle" fontSize="10" fontWeight="800" fill="currentColor">15</text>
    </svg>
  );
}

function readLocalSetting(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const data = JSON.parse(window.localStorage.getItem(key) || "null");
    return data && typeof data === "object" ? data : fallback;
  } catch {
    return fallback;
  }
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
  const pendingResumeRef = useRef(null);
  const savedPositionRef = useRef(0);
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

  const [selectedSeries, setSelectedSeries] = useState(null);
  const [mobileSeriesOpen, setMobileSeriesOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [lessonView, setLessonView] = useState("all");
  const [ascending, setAscending] = useState(true);
  const [progressMap, setProgressMap] = useState({});
  const [bookmarks, setBookmarks] = useState([]);
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
    // Read browser-only preferences after hydration, preserving SSR markup.
    const frame = window.requestAnimationFrame(() => {
      setProgressMap(readLocalSetting("sib-duruus-progress-v1", {}));
      const storedBookmarks = readLocalSetting("sib-duruus-bookmarks-v1", []);
      setBookmarks(Array.isArray(storedBookmarks) ? storedBookmarks : []);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const rememberProgress = (recordingId, position, duration, complete = false) => {
    if (!recordingId) return;
    setProgressMap((previous) => {
      const next = {
        ...previous,
        [String(recordingId)]: {
          seconds: position,
          duration,
          complete,
          updatedAt: Date.now(),
        },
      };
      try {
        window.localStorage.setItem("sib-duruus-progress-v1", JSON.stringify(next));
      } catch {
        // Playback remains functional when storage is disabled.
      }
      return next;
    });
  };

  const toggleBookmark = (recordingId) => {
    setBookmarks((previous) => {
      const id = String(recordingId);
      const next = previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id];
      try {
        window.localStorage.setItem("sib-duruus-bookmarks-v1", JSON.stringify(next));
      } catch {
        // A bookmark still works within this session.
      }
      return next;
    });
  };

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

            return categoryMatches && searchMatches;
          },
        );

      return [...results].sort(
        (first, second) =>
          getDateTimestamp(second.date) - getDateTimestamp(first.date),
      );
    }, [
      recordings,
      searchTerm,
      activeCategory,
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
      if (activeRecording) {
        rememberProgress(activeRecording.id, audio.duration || 0, audio.duration || 0, true);
      }
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
  const seriesRecordings = currentSeries
    ? [...currentSeries.recordings]
        .filter((recording) => lessonView !== "open" || !progressMap[String(recording.id)]?.complete)
        .sort((first, second) => (ascending ? 1 : -1) *
          ((Number(first.lessonNumber) || 0) - (Number(second.lessonNumber) || 0)))
    : [];
  const continueRecording = currentSeries?.recordings
    .filter((recording) => {
      const progress = progressMap[String(recording.id)];
      return progress && progress.seconds > 10 && !progress.complete;
    })
    .sort((first, second) =>
      (progressMap[String(second.id)]?.updatedAt || 0) - (progressMap[String(first.id)]?.updatedAt || 0))[0];

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
    setLessonView("all");
    setFiltersOpen(false);
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
        savedPositionRef.current = 0;
        setCurrentTime(0);
        setAudioDuration(0);

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

  const handleResume = async (recording) => {
    const position = Number(progressMap[String(recording.id)]?.seconds) || 0;
    if (!position) return;
    if (activeRecording?.id === recording.id && audioRef.current) {
      audioRef.current.currentTime = Math.min(position, audioRef.current.duration || position);
      if (audioRef.current.paused) {
        try { await audioRef.current.play(); } catch { /* Autoplay may require another click. */ }
      }
      return;
    }
    pendingResumeRef.current = position;
    await toggleRecording(recording);
  };

  const handleTimeUpdate = (audio) => {
    const time = Number(audio.currentTime) || 0;
    setCurrentTime(time);
    if (!activeRecording || time < 1) return;
    if (Math.abs(time - savedPositionRef.current) < 5) return;
    savedPositionRef.current = time;
    rememberProgress(activeRecording.id, time, Number.isFinite(audio.duration) ? audio.duration : 0);
  };

  const handleMetadata = (audio) => {
    setAudioDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    audio.playbackRate = playbackRate;
    if (pendingResumeRef.current !== null) {
      audio.currentTime = Math.min(pendingResumeRef.current, Math.max(0, (audio.duration || pendingResumeRef.current) - 1));
      setCurrentTime(audio.currentTime);
      pendingResumeRef.current = null;
    }
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
    pendingResumeRef.current = null;
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
              <nav id="sib-archive-category-menu" className={filtersOpen ? "sib-archive-categories is-open" : "sib-archive-categories"} aria-label="Unterrichtskategorien">
                {categories.map((category) => <button key={category} type="button" className={activeCategory === category ? "sib-archive-pill is-active" : "sib-archive-pill"} aria-pressed={activeCategory === category} onClick={() => { setActiveCategory(category); setFiltersOpen(false); setSelectedSeries(null); }}>{category}</button>)}
              </nav>
              <div className="sib-archive-search">
                <SearchIcon />
                <input type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Unterricht suchen" aria-label="Unterricht suchen" />
                {searchTerm && <button type="button" aria-label="Suche löschen" onClick={() => setSearchTerm("")}><CloseIcon /></button>}
              </div>
              <button
                className={filtersOpen ? "sib-archive-mobile-filter is-active" : "sib-archive-mobile-filter"}
                type="button"
                aria-label="Unterrichtskategorien filtern"
                aria-expanded={filtersOpen}
                aria-controls="sib-archive-category-menu"
                onClick={() => setFiltersOpen((value) => !value)}
              >
                <FilterIcon />
              </button>
            </div>
            {audioErrorMessage && <p className="sib-archive-error" role="alert">{audioErrorMessage}</p>}
            {currentSeries ? (
              <div className="sib-archive-layout">
                <div className="sib-archive-sidebar">
                  <h3>Unterrichtsreihen</h3>
                  <button
                    type="button"
                    className="sib-archive-mobile-series-trigger"
                    aria-expanded={mobileSeriesOpen}
                    aria-controls="sib-archive-series-options"
                    onClick={() => setMobileSeriesOpen((value) => !value)}
                  >
                    <span className="sib-archive-book"><BookIcon /></span>
                    <span className="sib-archive-series-copy">
                      <strong>{currentSeries.title}</strong>
                      <small>{currentSeries.recordings.length} {currentSeries.recordings.length === 1 ? "Aufnahme" : "Aufnahmen"}</small>
                    </span>
                    <span className={mobileSeriesOpen ? "sib-archive-chevron is-open" : "sib-archive-chevron"}><ChevronIcon /></span>
                  </button>
                  <div id="sib-archive-series-options" className={mobileSeriesOpen ? "sib-archive-series-nav is-expanded" : "sib-archive-series-nav"}>
                    {seriesList.filter((group) => group.title !== currentSeries.title).map((group) => <button key={group.title} type="button" className={currentSeries.title === group.title ? "sib-archive-series-button is-active" : "sib-archive-series-button"} onClick={() => { setSelectedSeries(group.title); setMobileSeriesOpen(false); setLessonView("all"); }} aria-pressed={currentSeries.title === group.title}>
                      <span className="sib-archive-book" aria-hidden="true"><BookIcon /></span>
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
                  <div className="sib-archive-lesson-tabs">
                    <div className="sib-archive-lesson-tab-options" role="group" aria-label="Lektionen anzeigen">
                      <button className={lessonView === "all" ? "is-active" : ""} type="button" aria-pressed={lessonView === "all"} onClick={() => setLessonView("all")}>Alle Lektionen</button>
                      <button className={lessonView === "open" ? "is-active" : ""} type="button" aria-pressed={lessonView === "open"} onClick={() => setLessonView("open")}>Noch offen</button>
                    </div>
                    <button
                      type="button"
                      className="sib-archive-sort"
                      aria-label={ascending ? "Lektionen absteigend sortieren" : "Lektionen aufsteigend sortieren"}
                      title={ascending ? "Neueste Lektion zuerst" : "Erste Lektion zuerst"}
                      onClick={() => setAscending((value) => !value)}
                    ><SortIcon /></button>
                  </div>
                  {continueRecording && (
                    <div className="sib-archive-resume">
                      <div className="sib-archive-resume-copy">
                        <strong>Weiterlernen</strong>
                        <span>{continueRecording.title} · bei {formatClock(progressMap[String(continueRecording.id)]?.seconds || 0)} fortsetzen</span>
                      </div>
                      <button type="button" onClick={() => handleResume(continueRecording)} aria-label={`${continueRecording.title} fortsetzen`}><PlayIcon /></button>
                    </div>
                  )}
                  <div className="sib-archive-mobile-lessons-header">
                    <h3>Lektionen</h3><span>{seriesRecordings.length} {seriesRecordings.length === 1 ? "Aufnahme" : "Aufnahmen"}</span>
                  </div>
                  <div className="sib-archive-recording-list">
                    {seriesRecordings.map((recording) => {
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
                            <span>{formatDate(recording.date)}{recording.duration ? ` · ${recording.duration}` : ""}{active && isPlaying ? " · Wird abgespielt" : ""}</span>
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
                  {seriesRecordings.length === 0 && lessonView === "open" && (
                    <p className="sib-archive-all-complete">Alle Lektionen dieser Reihe wurden bereits angehört.</p>
                  )}
                </div>
              </div>
            ) : <div className="sib-archive-status"><h3>{recordings.length ? "Keine passenden Aufnahmen" : "Noch keine Unterrichte veröffentlicht"}</h3><p>{recordings.length ? "Versuche einen anderen Suchbegriff oder eine andere Kategorie." : "Neue Aufnahmen erscheinen hier, sobald sie veröffentlicht wurden."}</p>{recordings.length > 0 && <button type="button" onClick={resetFilters}>Filter zurücksetzen</button>}</div>}
          </>
        )}
        {activeRecording && <div className="sib-archive-player" aria-label="Audioplayer">
          <div className="sib-archive-player-heading">
            <strong>{String(activeRecording.lessonNumber || "").padStart(2, "0")} {activeRecording.title}</strong>
            <button type="button" className="sib-archive-player-close" onClick={closePlayer} aria-label="Audio-Player schließen"><CloseIcon /></button>
          </div>
          <div className="sib-archive-player-timeline">
            <span>{formatClock(currentTime)}</span>
            <input
              aria-label="Wiedergabeposition"
              type="range"
              min="0"
              max={audioDuration || 1}
              value={Math.min(currentTime, audioDuration || 1)}
              onChange={(event) => {
                const time = Number(event.target.value);
                if (audioRef.current) audioRef.current.currentTime = time;
                setCurrentTime(time);
              }}
            />
            <span>{formatClock(audioDuration || Number(activeRecording.durationSeconds) || 0)}</span>
          </div>
          <div className="sib-archive-player-actions">
            <button type="button" className="sib-archive-rate" onClick={changeRate} aria-label="Wiedergabegeschwindigkeit ändern">{playbackRate}x</button>
            <button type="button" className="sib-archive-player-skip" onClick={() => seekBy(-15)} aria-label="15 Sekunden zurück"><SkipIcon /></button>
            <button type="button" className="sib-archive-player-play" onClick={() => toggleRecording(activeRecording)} aria-label={isPlaying ? "Pausieren" : "Abspielen"} disabled={!audioUrl || isLoadingAudio}>{isPlaying ? <PauseIcon /> : <PlayIcon />}</button>
            <button type="button" className="sib-archive-player-skip" onClick={() => seekBy(15)} aria-label="15 Sekunden vor"><SkipIcon forward /></button>
            <button
              type="button"
              className={bookmarks.includes(String(activeRecording.id)) ? "sib-archive-player-bookmark is-active" : "sib-archive-player-bookmark"}
              onClick={() => toggleBookmark(activeRecording.id)}
              aria-label={bookmarks.includes(String(activeRecording.id)) ? "Lesezeichen entfernen" : "Lesezeichen setzen"}
              aria-pressed={bookmarks.includes(String(activeRecording.id))}
            ><BookmarkIcon filled={bookmarks.includes(String(activeRecording.id))} /></button>
          </div>
          <audio
            ref={audioRef}
            src={audioUrl || undefined}
            preload="metadata"
            onTimeUpdate={(event) => handleTimeUpdate(event.currentTarget)}
            onLoadedMetadata={(event) => handleMetadata(event.currentTarget)}
            onDurationChange={(event) => setAudioDuration(Number.isFinite(event.currentTarget.duration) ? event.currentTarget.duration : 0)}
          />
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
          {activeRecording?.id === detailRecording.id && audioUrl && (
            <div className="sib-archive-modal-playback" aria-label="Wiedergabesteuerung">
              <div className="sib-archive-modal-playback-progress">
                <span>{formatClock(currentTime)}</span>
                <input
                  type="range"
                  aria-label="Wiedergabeposition ändern"
                  min="0"
                  max={audioDuration || 1}
                  value={Math.min(currentTime, audioDuration || 1)}
                  onChange={(event) => {
                    const time = Number(event.target.value);
                    if (audioRef.current) audioRef.current.currentTime = time;
                    setCurrentTime(time);
                  }}
                />
                <span>{formatClock(audioDuration)}</span>
              </div>
              <div className="sib-archive-modal-playback-tools">
                <button type="button" onClick={() => seekBy(-15)} aria-label="15 Sekunden zurückspulen">15 Sek. zurück</button>
                <button type="button" onClick={() => seekBy(15)} aria-label="15 Sekunden vorspulen">15 Sek. vor</button>
                <button type="button" onClick={changeRate} aria-label="Wiedergabegeschwindigkeit ändern">{playbackRate}x</button>
              </div>
            </div>
          )}
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
