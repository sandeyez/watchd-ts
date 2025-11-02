import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db/index.server";

import * as schema from "./db/schemas";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  logger: {
    disabled: false,
    disableColors: false,
    level: "error",
    log: (level, message, ...args) => {
      console.log(`[${level}] ${message}`, ...args);
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      mapProfileToUser: (profile) => ({
        firstName: profile.given_name,
        lastName: profile.family_name,
      }),
    },
  },
  user: {
    additionalFields: {
      firstName: {
        type: "string",
      },
      lastName: {
        type: "string",
      },
    },
  },
});
