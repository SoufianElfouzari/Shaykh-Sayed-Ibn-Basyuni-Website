import {
  Query,
} from "appwrite";

import {
  appwriteDatabaseId,
  appwriteNoticesTableId,
  tablesDB,
} from "./appwrite";

const NOTICE_TYPE_LABELS = {
  cancelled: "Unterricht entfällt",
  location_changed: "Ortsänderung",
  time_changed: "Terminänderung",
  general: "Allgemeiner Hinweis",
};

function getRowData(row) {
  if (
    row?.data &&
    typeof row.data === "object" &&
    !Array.isArray(row.data)
  ) {
    return {
      ...row,
      ...row.data,
    };
  }

  return row ?? {};
}

function parseDate(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function mapNoticeRow(row) {
  const data = getRowData(row);

  const noticeType = String(
    data.noticeType || "general",
  ).trim();

  const validFrom = parseDate(
    data.validFrom,
  );

  const validUntil = parseDate(
    data.validUntil,
  );

  const publishedAt = parseDate(
    data.publishedAt,
  );

  return {
    id:
      row?.$id ||
      data.$id ||
      data.id,

    title:
      String(
        data.title || "",
      ).trim(),

    message:
      String(
        data.message || "",
      ).trim(),

    noticeType,

    type:
      NOTICE_TYPE_LABELS[
        noticeType
      ] ||
      NOTICE_TYPE_LABELS.general,

    affectedDars:
      String(
        data.affectedDars || "",
      ).trim(),

    status:
      String(
        data.status || "draft",
      ).trim(),

    validFrom:
      validFrom
        ? validFrom.toISOString()
        : null,

    validUntil:
      validUntil
        ? validUntil.toISOString()
        : null,

    publishedAt:
      publishedAt
        ? publishedAt.toISOString()
        : null,
  };
}

function isNoticeVisible(
  notice,
) {
  if (
    notice.status !== "published"
  ) {
    return false;
  }

  const now = Date.now();

  if (notice.validFrom) {
    const validFromTimestamp =
      new Date(
        notice.validFrom,
      ).getTime();

    if (
      Number.isFinite(
        validFromTimestamp,
      ) &&
      validFromTimestamp > now
    ) {
      return false;
    }
  }

  if (notice.validUntil) {
    const validUntilTimestamp =
      new Date(
        notice.validUntil,
      ).getTime();

    if (
      Number.isFinite(
        validUntilTimestamp,
      ) &&
      validUntilTimestamp < now
    ) {
      return false;
    }
  }

  return true;
}

function sortNotices(
  firstNotice,
  secondNotice,
) {
  const firstTimestamp =
    firstNotice.validFrom
      ? new Date(
          firstNotice.validFrom,
        ).getTime()
      : 0;

  const secondTimestamp =
    secondNotice.validFrom
      ? new Date(
          secondNotice.validFrom,
        ).getTime()
      : 0;

  return (
    secondTimestamp -
    firstTimestamp
  );
}

export async function getActivePublishedNotices() {
  const response =
    await tablesDB.listRows({
      databaseId:
        appwriteDatabaseId,

      tableId:
        appwriteNoticesTableId,

      queries: [
        Query.limit(100),
      ],

      total: false,
      ttl: 0,
    });

  console.log(
    "Geladene Hinweis-Rows:",
    response.rows,
  );

  const mappedNotices =
    response.rows.map(
      mapNoticeRow,
    );

  console.log(
    "Gemappte Hinweise:",
    mappedNotices,
  );

  const visibleNotices =
    mappedNotices
      .filter((notice) => {
        return (
          notice.title.length > 0 &&
          notice.message.length > 0 &&
          isNoticeVisible(
            notice,
          )
        );
      })
      .sort(sortNotices);

  console.log(
    "Sichtbare Hinweise:",
    visibleNotices,
  );

  return visibleNotices;
}