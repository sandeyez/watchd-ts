/**
 * Randomly shuffles the elements of an array in place using the Fisher-Yates algorithm.
 *
 * @param array - The array to be shuffled. The original array is mutated.
 * @returns The same array instance, now shuffled.
 *
 * @author Sander van Werkhooven <sander@jojoschool.nl>
 * @author GPT-4.1 (OpenAI)
 */
export function shuffleArray<T>(array: T[]): T[] {
  // Start from the end of the array and swap each element with a random earlier element
  for (let i = array.length - 1; i > 0; i--) {
    // Pick a random index from 0 to i (inclusive)
    const j = Math.floor(Math.random() * (i + 1));
    // Swap elements at indices i and j
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
