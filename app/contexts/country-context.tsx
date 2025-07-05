import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { CountryCode } from "tmdb-ts";

/**
 * The shape of the country context value.
 */
interface CountryContextValue {
  countryCode: CountryCode | null;
  loading: boolean;
  error: string | null;
}

/**
 * Default context value before the provider fetches data.
 */
const CountryContext = createContext<CountryContextValue>({
  countryCode: null,
  loading: true,
  error: null,
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
    return data.country || null;
  } catch {
    return null;
  }
}

/**
 * Provides the user's country code to the React component tree.
 *
 * @param children - The React children to wrap with the provider.
 * @returns JSX.Element
 */
export function CountryProvider({ children }: { children: ReactNode }) {
  const [countryCode, setCountryCode] = useState<CountryCode | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any | null>(null);

  // Only fetch once on mount
  useEffect(() => {
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
  }, []);

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
