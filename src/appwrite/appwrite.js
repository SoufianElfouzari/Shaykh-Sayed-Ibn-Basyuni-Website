import {
  Client,
  Functions,
  TablesDB,
} from "appwrite";

const endpoint =
  import.meta.env.VITE_APPWRITE_ENDPOINT;

const projectId =
  import.meta.env.VITE_APPWRITE_PROJECT_ID;

export const appwriteDatabaseId =
  import.meta.env.VITE_APPWRITE_DATABASE_ID ||
  "6a657b6000399ba8cc42";

export const appwriteArticlesTableId =
  import.meta.env
    .VITE_APPWRITE_ARTICLES_TABLE_ID ||
  "shaykhsayedarticles";

export const appwriteDuruusTableId =
  import.meta.env
    .VITE_APPWRITE_DURUUS_TABLE_ID ||
  "shaykhduruus";

export const appwriteNoticesTableId =
  import.meta.env
    .VITE_APPWRITE_NOTICES_TABLE_ID ||
  "shaykhsayedappointments";

export const appwriteFilebaseFunctionId =
  import.meta.env
    .VITE_APPWRITE_FILEBASE_FUNCTION_ID ||
  "filebase-audio-manager";

if (!endpoint) {
  throw new Error(
    "VITE_APPWRITE_ENDPOINT fehlt in der .env-Datei.",
  );
}

if (!projectId) {
  throw new Error(
    "VITE_APPWRITE_PROJECT_ID fehlt in der .env-Datei.",
  );
}

export const appwriteClient = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId);

export const tablesDB = new TablesDB(
  appwriteClient,
);

export const functions = new Functions(
  appwriteClient,
);