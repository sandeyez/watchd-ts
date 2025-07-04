export class Noun {
  constructor(
    public singular: string,
    public plural: string
  ) {}

  public toString(amount: number, includeAmount = true): string {
    const noun = amount === 1 ? this.singular : this.plural;
    return includeAmount ? `${amount} ${noun}` : noun;
  }
}

/**
 * Normalizes a string for search purposes by converting it to lowercase,
 * trimming whitespace, removing diacritics (accents), and stripping out
 * non-alphanumeric characters. This helps in performing case-insensitive,
 * accent-insensitive, and punctuation-agnostic searches.
 *
 * @param val - The input string to be normalized.
 * @returns The normalized string, ready for search comparison.
 *
 * @date 04-07-2025
 */
export function normalizeString(val: string): string {
  // Convert to lowercase and trim leading/trailing whitespace
  let normalized = val.toLowerCase().trim();

  // Normalize Unicode characters to their decomposed form (NFD) and remove diacritics.
  // This helps in treating 'é' and 'e' as the same character for search.
  // \u0300-\u036f is the Unicode range for combining diacritical marks.
  normalized = normalized.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Remove any characters that are not letters (a-z), numbers (0-9), or spaces.
  // This will get rid of punctuation, special symbols, etc., while keeping spaces.
  // Adjust this regex if you need to retain more specific characters (e.g., hyphens).
  normalized = normalized.replace(/[^a-z0-9\s]/g, "");

  return normalized;
}
