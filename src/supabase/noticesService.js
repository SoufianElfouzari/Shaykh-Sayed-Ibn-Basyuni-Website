import { supabase } from "./client";

const LABELS = {
  cancelled: "Unterricht entfällt",
  location_changed: "Ortsänderung",
  time_changed: "Terminänderung",
  general: "Allgemeiner Hinweis",
};

export async function getActivePublishedNotices() {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("notices")
    .select("*")
    .eq("status", "published")
    .or(`validFrom.is.null,validFrom.lte.${now}`)
    .or(`validUntil.is.null,validUntil.gte.${now}`)
    .order("validFrom", { ascending: false })
    .range(0, 999);

  if (error) throw error;
  return (data || [])
    .filter((row) => row.title && row.message)
    .map((row) => ({
      id: row.id,
      title: row.title,
      message: row.message,
      noticeType: row.noticeType,
      type: LABELS[row.noticeType] || LABELS.general,
      affectedDars: row.affectedDars || "",
      status: row.status,
      validFrom: row.validFrom,
      validUntil: row.validUntil,
      publishedAt: row.publishedAt,
    }));
}
