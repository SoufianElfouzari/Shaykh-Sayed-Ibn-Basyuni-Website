import {
  Query,
} from "appwrite";

import {
  appwriteDatabaseId,
  appwriteDuruusTableId,
  appwriteFilebaseFunctionId,
  functions,
  tablesDB,
} from "./appwrite";

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

function parseInteger(value) {
  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {
    return Math.trunc(value);
  }

  const parsedValue = Number.parseInt(
    String(value || ""),
    10,
  );

  if (Number.isNaN(parsedValue)) {
    return 0;
  }

  return parsedValue;
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

function formatDuration(
  durationSeconds,
) {
  const totalSeconds = Math.max(
    0,
    parseInteger(durationSeconds),
  );

  if (totalSeconds === 0) {
    return "Dauer unbekannt";
  }

  const hours = Math.floor(
    totalSeconds / 3600,
  );

  const minutes = Math.floor(
    (totalSeconds % 3600) / 60,
  );

  const seconds =
    totalSeconds % 60;

  if (hours > 0 && minutes > 0) {
    return `${hours} ${
      hours === 1
        ? "Stunde"
        : "Stunden"
    } ${minutes} ${
      minutes === 1
        ? "Minute"
        : "Minuten"
    }`;
  }

  if (hours > 0) {
    return `${hours} ${
      hours === 1
        ? "Stunde"
        : "Stunden"
    }`;
  }

  if (minutes > 0 && seconds > 0) {
    return `${minutes} ${
      minutes === 1
        ? "Minute"
        : "Minuten"
    } ${seconds} ${
      seconds === 1
        ? "Sekunde"
        : "Sekunden"
    }`;
  }

  if (minutes > 0) {
    return `${minutes} ${
      minutes === 1
        ? "Minute"
        : "Minuten"
    }`;
  }

  return `${seconds} ${
    seconds === 1
      ? "Sekunde"
      : "Sekunden"
  }`;
}

function mapDarsRow(row) {
  const data = getRowData(row);

  const lessonDate =
    parseDate(data.lessonDate);

  const publishedAt =
    parseDate(data.publishedAt);

  const updatedAt =
    parseDate(data.$updatedAt) ||
    parseDate(row?.$updatedAt);

  const durationSeconds =
    parseInteger(
      data.durationSeconds,
    );

  return {
    id:
      row?.$id ||
      data.$id ||
      data.id,

    title:
      String(data.title || "").trim(),

    series:
      String(data.series || "").trim(),

    lessonNumber:
      parseInteger(
        data.lessonNumber,
      ),

    category:
      String(
        data.category || "",
      ).trim(),

    language:
      String(
        data.language || "",
      ).trim(),

    date:
      lessonDate?.toISOString() ||
      null,

    lessonDate:
      lessonDate?.toISOString() ||
      null,

    durationSeconds,

    duration:
      formatDuration(
        durationSeconds,
      ),

    description:
      String(
        data.description || "",
      ).trim(),

    audioObjectKey:
      String(
        data.audioObjectKey || "",
      ).trim(),

    audioFileName:
      String(
        data.audioFileName || "",
      ).trim(),

    audioMimeType:
      String(
        data.audioMimeType ||
          "audio/mpeg",
      ).trim(),

    audioSizeBytes:
      parseInteger(
        data.audioSizeBytes,
      ),

    status:
      String(
        data.status || "draft",
      ).trim(),

    publishedAt:
      publishedAt?.toISOString() ||
      null,

    updatedAt:
      updatedAt?.toISOString() ||
      null,
  };
}

function sortDuruusByDate(
  firstRecording,
  secondRecording,
) {
  const firstDate =
    firstRecording.lessonDate
      ? new Date(
          firstRecording.lessonDate,
        ).getTime()
      : 0;

  const secondDate =
    secondRecording.lessonDate
      ? new Date(
          secondRecording.lessonDate,
        ).getTime()
      : 0;

  return secondDate - firstDate;
}

function decodeFunctionResponse(
  execution,
) {
  const responseBody = String(
    execution?.responseBody || "",
  ).trim();

  if (
    execution?.status &&
    execution.status !== "completed"
  ) {
    throw new Error(
      execution.errors ||
        "Die Filebase Function ist fehlgeschlagen.",
    );
  }

  const responseStatusCode = Number(
    execution?.responseStatusCode,
  );

  if (
    Number.isFinite(
      responseStatusCode,
    ) &&
    (
      responseStatusCode < 200 ||
      responseStatusCode >= 300
    )
  ) {
    throw new Error(
      responseBody ||
        `Die Filebase Function antwortete mit Status ${responseStatusCode}.`,
    );
  }

  if (!responseBody) {
    throw new Error(
      "Die Filebase Function hat keine Antwort zurückgegeben.",
    );
  }

  let decodedResponse;

  try {
    decodedResponse =
      JSON.parse(responseBody);
  } catch {
    throw new Error(
      `Ungültige Antwort der Filebase Function: ${responseBody}`,
    );
  }

  if (
    !decodedResponse ||
    typeof decodedResponse !==
      "object" ||
    Array.isArray(decodedResponse)
  ) {
    throw new Error(
      "Die Antwort der Filebase Function besitzt ein ungültiges Format.",
    );
  }

  if (
    decodedResponse.success !== true
  ) {
    throw new Error(
      decodedResponse.message ||
        "Die Filebase-Anfrage ist fehlgeschlagen.",
    );
  }

  return decodedResponse;
}

export async function getPublishedDuruus() {
  const response =
    await tablesDB.listRows({
      databaseId:
        appwriteDatabaseId,

      tableId:
        appwriteDuruusTableId,

      queries: [
        Query.equal(
          "status",
          "published",
        ),
        Query.limit(100),
      ],

      total: false,
      ttl: 60,
    });

  return response.rows
    .map(mapDarsRow)
    .filter((recording) => {
      return (
        recording.status ===
          "published" &&
        recording.title.length > 0 &&
        recording.series.length > 0 &&
        recording.audioObjectKey
          .length > 0
      );
    })
    .sort(sortDuruusByDate);
}

export async function createDuruusDownloadUrl(
  recording,
) {
  if (
    !recording?.audioObjectKey
  ) {
    throw new Error(
      "Für diese Aufnahme wurde kein Audio Object Key gespeichert.",
    );
  }

  const execution =
    await functions.createExecution({
      functionId:
        appwriteFilebaseFunctionId,

      body: JSON.stringify({
        action: "createDownload",

        objectKey:
          recording.audioObjectKey,

        contentType:
          recording.audioMimeType ||
          "audio/mpeg",
      }),

      async: false,
    });

  const response =
    decodeFunctionResponse(
      execution,
    );

  const downloadUrl = String(
    response.downloadUrl || "",
  ).trim();

  if (!downloadUrl) {
    throw new Error(
      "Die Filebase Function hat keine Download-URL zurückgegeben.",
    );
  }

  return {
    downloadUrl,

    expiresIn:
      parseInteger(
        response.expiresIn,
      ),

    objectKey:
      String(
        response.objectKey ||
          recording.audioObjectKey,
      ),
  };
}

export async function getDuruusAudioUrl(
  recording,
) {
  const result =
    await createDuruusDownloadUrl(
      recording,
    );

  return result.downloadUrl;
}

export async function getDarsAudioUrl(
  recording,
) {
  return getDuruusAudioUrl(
    recording,
  );
}

export async function downloadDuruusAudio(
  recording,
) {
  const {
    downloadUrl,
  } =
    await createDuruusDownloadUrl(
      recording,
    );

  const anchor =
    document.createElement("a");

  anchor.href =
    downloadUrl;

  anchor.download =
    recording.audioFileName ||
    `${recording.title}.mp3`;

  anchor.rel =
    "noopener noreferrer";

  document.body.appendChild(
    anchor,
  );

  anchor.click();
  anchor.remove();
}

export async function downloadDarsAudio(
  recording,
) {
  return downloadDuruusAudio(
    recording,
  );
}