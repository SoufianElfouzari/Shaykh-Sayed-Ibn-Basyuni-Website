import { supabase } from "./client";

function durationLabel(seconds) {
  const total = Math.max(0, Number(seconds) || 0);
  if (!total) return "Dauer unbekannt";
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  if (hours && minutes) return `${hours} ${hours === 1 ? "Stunde" : "Stunden"} ${minutes} ${minutes === 1 ? "Minute" : "Minuten"}`;
  if (hours) return `${hours} ${hours === 1 ? "Stunde" : "Stunden"}`;
  if (minutes && secs) return `${minutes} Min ${secs} Sek`;
  if (minutes) return `${minutes} ${minutes === 1 ? "Minute" : "Minuten"}`;
  return `${secs} Sekunden`;
}

const mapDars = (row) => ({
  id: row.id,
  title: row.title,
  series: row.series,
  lessonNumber: row.lessonNumber || 0,
  category: row.category || "",
  language: row.language || "",
  date: row.lessonDate,
  lessonDate: row.lessonDate,
  durationSeconds: row.durationSeconds || 0,
  duration: durationLabel(row.durationSeconds),
  description: row.description || "",
  audioObjectKey: row.audioObjectKey || "",
  audioFileName: row.audioFileName || "",
  audioMimeType: row.audioMimeType || "audio/mpeg",
  audioSizeBytes: row.audioSizeBytes || 0,
  status: row.status,
  publishedAt: row.publishedAt,
  updatedAt: row.updated_at,
});

export async function getPublishedDuruus() {
  const { data, error } = await supabase
    .from("duruus")
    .select("*")
    .eq("status", "published")
    .order("lessonDate", { ascending: false })
    .range(0, 999);
  if (error) throw error;
  return (data || []).map(mapDars).filter((row) => row.title && row.series && row.audioObjectKey);
}

export async function createDuruusDownloadUrl(recording) {
  if (!recording?.audioObjectKey) {
    throw new Error("Für diese Aufnahme wurde kein Audio Object Key gespeichert.");
  }
  const { data, error } = await supabase.functions.invoke("filebase-audio-manager", {
    body: {
      action: "createDownload",
      objectKey: recording.audioObjectKey,
      contentType: recording.audioMimeType || "audio/mpeg",
    },
  });
  if (error) throw error;
  if (!data?.success || !data.downloadUrl) {
    throw new Error(data?.message || "Die Download-URL konnte nicht erzeugt werden.");
  }
  return { downloadUrl: data.downloadUrl, expiresIn: data.expiresIn || 0, objectKey: data.objectKey || recording.audioObjectKey };
}

export async function getDuruusAudioUrl(recording) {
  return (await createDuruusDownloadUrl(recording)).downloadUrl;
}

export const getDarsAudioUrl = getDuruusAudioUrl;

export async function downloadDuruusAudio(recording) {
  const { downloadUrl } = await createDuruusDownloadUrl(recording);
  const a = document.createElement("a");
  a.href = downloadUrl;
  a.download = recording.audioFileName || `${recording.title}.mp3`;
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export const downloadDarsAudio = downloadDuruusAudio;
