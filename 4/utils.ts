import { matchNumber } from "../utils/matchers";

const startStringLength = 10; // "Card %3d: ", where %d is the card ID
export function sliceStart(line: string) {
  return line.slice(startStringLength); // The start string is always the same length
}

type OnMatch = (digits: number[], match: number) => void;
export function parseDigitsAndMatchAfterSeparator(string: string, onMatch: OnMatch, separator = "|") {
  const digits: number[] = [];

  let afterSeparator = false;
  let currentDigit = "";

  for (const char of string) {
    if (matchNumber(char)) currentDigit += char;
    else if (char === separator) afterSeparator = true;
    else if (char === " " && currentDigit) {
      if (afterSeparator) onMatch(digits, parseInt(currentDigit));
      else digits.push(parseInt(currentDigit));
      currentDigit = "";
    }
  }

  if (currentDigit) {
    if (afterSeparator) onMatch(digits, parseInt(currentDigit));
    else digits.push(parseInt(currentDigit));
  }
}
