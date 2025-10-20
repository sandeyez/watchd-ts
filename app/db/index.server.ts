// src/db.ts
import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import ws from "ws";

import * as schema from "./schemas";

neonConfig.webSocketConstructor = ws;

const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle({ client: sql, schema });
