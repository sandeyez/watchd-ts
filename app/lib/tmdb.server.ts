// app/utils/tmdb.server.ts
import { TMDB } from "tmdb-ts";

// Declare a global variable to hold the TMDB instance.
// This ensures a single instance across the Node.js process.
declare global {
  var __tmdb: TMDB | undefined;
}

function getTmdbSingleton(): TMDB {
  if (!global.__tmdb) {
    const accessToken = process.env.TMDB_ACCESS_TOKEN;

    if (!accessToken) {
      throw new Error("TMDB_ACCESS_TOKEN environment variable is not set.");
    }

    global.__tmdb = new TMDB(accessToken);
  }
  return global.__tmdb;
}

export const tmdb = getTmdbSingleton();
