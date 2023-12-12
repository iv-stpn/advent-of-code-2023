import { matchNumber } from "../utils/matchers";

// We can match ball categories with only their first letter, since they're all unique.
export const categoriesAmounts = { "r": 12, "g": 13, "b": 14 };
export type Category = keyof typeof categoriesAmounts;

export const categories = Object.keys(categoriesAmounts);
export function isCategory(char: string): char is keyof typeof categoriesAmounts {
  return categories.includes(char);
}

const startStringLength = 7; // "Game %d: ", where %d is the game ID
export function sliceStart(line: string, id: number) {
  return line.slice(startStringLength + Math.floor(Math.log10(id)) + 1);
}

export function matchCategoriesCounts(string: string, onCount: (amount: number, category: Category) => void) {
  let currentDigit = "";
  let previousWasWhitespace = false;
  for (const char of string) {
    if (matchNumber(char)) currentDigit += char;
    else if (previousWasWhitespace && isCategory(char)) {
      onCount(parseInt(currentDigit), char);
      currentDigit = "";
    }
    previousWasWhitespace = char === " ";
  }
}
