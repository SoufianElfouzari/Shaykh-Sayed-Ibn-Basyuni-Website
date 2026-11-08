import { fixtureResponse } from "./data.mjs";

// Node --import preload. Supabase REST never reaches the network in tests.
const realFetch = globalThis.fetch;
globalThis.fetch = (input, init) => {
  const url = typeof input === "string" || input instanceof URL ? input : input?.url;
  const mocked = url ? fixtureResponse(url) : null;
  if (mocked) return Promise.resolve(mocked);
  if (url && /supabase\.co/.test(new URL(url).hostname)) {
    throw new Error("Unexpected Supabase request: " + url);
  }
  return realFetch(input, init);
};
