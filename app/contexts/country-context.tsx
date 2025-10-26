import { db } from "@/db/index.server";
import { userMetadata } from "@/db/schemas";
import { authMiddleware } from "@/middleware/auth-middleware";
import { createServerFn } from "@tanstack/react-start";
import { createContext, useContext, useEffect, useState } from "react";

import type { ReactNode } from "react";

import type { CountryCode } from "tmdb-ts";
import { CountryCodes } from "tmdb-ts";
import z from "zod";

/**
 * The shape of the country context value.
 */
interface CountryContextValue {
  countryCode: CountryCode | null;
  loading: boolean;
  error: unknown | null;
}

/**
 * Default context value before the provider fetches data.
 */
const CountryContext = createContext<CountryContextValue>({
  countryCode: null,
  loading: true,
  error: null,
});

type Props = {
  children: ReactNode;

  countryCode: string | null;
  countryCodeLastUpdatedAt: Date | null;
};

/**
 * Provides the user's country code to the React component tree.
 *
 * @param children - The React children to wrap with the provider.
 * @returns JSX.Element
 */
export function CountryProvider({
  children,
  countryCode: initialCountryCode,
  countryCodeLastUpdatedAt: initialCountryCodeLastUpdatedAt,
}: Props) {
  const [countryCode, setCountryCode] = useState<CountryCode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown | null>(null);

  // Only fetch once on mount
  useEffect(() => {
    if (
      initialCountryCode &&
      isCountryCode(initialCountryCode) &&
      !isCountryCodeExpired(initialCountryCode, initialCountryCodeLastUpdatedAt)
    ) {
      setCountryCode(initialCountryCode);
      setLoading(false);
      return;
    }

    const abortController = new AbortController();

    getUserCountryByIP(abortController.signal)
      .then((code) => {
        setCountryCode(code);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      abortController.abort();
    };
  }, [initialCountryCode, initialCountryCodeLastUpdatedAt]);

  return (
    <CountryContext.Provider value={{ countryCode, loading, error }}>
      {children}
    </CountryContext.Provider>
  );
}

/**
 * Custom hook to access the user's country code from context.
 *
 * @returns CountryContextValue - { countryCode, loading, error }
 */
export function useCountry() {
  return useContext(CountryContext);
}

export const logCountryCodeToServer = createServerFn({
  method: "POST",
})
  .inputValidator(
    z.object({
      countryCode: z.enum(CountryCodes, {
        message: "Invalid country code",
      }),
    })
  )
  .middleware([authMiddleware])
  .handler(async ({ data, context }) => {
    const { countryCode } = data;

    console.log("Logging country code to server", countryCode);

    await db
      .insert(userMetadata)
      .values({
        userId: context.userId,
        countryCode,
        countryCodeLastUpdatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: userMetadata.userId,
        set: {
          countryCode,
          countryCodeLastUpdatedAt: new Date(),
        },
      });
  });

/**
 * Fetches the user's country using an IP-based geolocation API.
 * Uses the free ipapi.co service as an example.
 *
 * @returns Promise<string | null> - The country code (e.g., 'NL') or null if failed.
 */
async function getUserCountryByIP(
  signal: AbortSignal
): Promise<CountryCode | null> {
  try {
    const res = await fetch("https://ipapi.co/json/", {
      signal,
    });

    if (!res.ok) return null;

    const data = await res.json();

    if (!data.country) return null;

    logCountryCodeToServer({
      data: {
        countryCode: data.country,
      },
    });

    return data.country;
  } catch {
    return null;
  }
}

function isCountryCodeExpired(
  countryCode: CountryCode | null,
  countryCodeLastUpdatedAt: Date | null
): boolean {
  if (!countryCode || !countryCodeLastUpdatedAt) return true;

  return countryCodeLastUpdatedAt.getTime() < Date.now() - 1000 * 60 * 60 * 24;
}

function isCountryCode(countryCode: string): countryCode is CountryCode {
  return CountryCodes.includes(countryCode as CountryCode);
}
