import { matchNumber } from "../utils/matchers";
import { groupByMultiple } from "../utils/utils";

export const numberStringsMap = {
  "one": "1",
  "two": "2",
  "three": "3",
  "four": "4",
  "five": "5",
  "six": "6",
  "seven": "7",
  "eight": "8",
  "nine": "9",
};

const numberStrings = Object.keys(numberStringsMap);
const longestNumberString = Math.max(...numberStrings.map(string => string.length));
const smallestNumberString = Math.min(...numberStrings.map(string => string.length));

const numberStringsByLength = groupByMultiple(
  numberStrings,
  string => Array.from({ length: (longestNumberString + 1) - string.length }).map((_, idx) => idx + string.length),
) as { [key: number]: (keyof typeof numberStringsMap)[] };

export const matchNumberString = (line: string, lineIndex: number) => {
  const numberMatch = matchNumber(line.at(lineIndex));
  if (numberMatch) return numberMatch;

  const remaining = line.slice(lineIndex);
  if (remaining.length < smallestNumberString) return null;

  const numberStrings = remaining.length < longestNumberString
    ? numberStringsByLength[remaining.length]
    : numberStringsByLength[longestNumberString];

  for (const numberString of numberStrings) {
    if (remaining.startsWith(numberString)) return numberStringsMap[numberString];
  }

  return null;
};

// To optimize, we go through the string from both ends at the same time.
export function matchFirstAndLast(text: string, matcher: (line: string, idx: number) => string | null) {
  let foundInFirstHalf = false;
  let foundInSecondHalf = false;

  let frontMatch: string | null = null;
  let backMatch: string | null = null;

  for (let charIdx = 0; charIdx < text.length / 2; charIdx++) {
    if (foundInFirstHalf && foundInSecondHalf) break;

    const firstHalfMatch = matcher(text, charIdx);
    if (firstHalfMatch && foundInFirstHalf) backMatch = firstHalfMatch;
    else if (firstHalfMatch) {
      frontMatch = firstHalfMatch;
      foundInFirstHalf = true;
      if (foundInSecondHalf) break;
    }

    const secondHalfMatch = matcher(text, text.length - 1 - charIdx);
    if (secondHalfMatch && foundInSecondHalf) frontMatch = secondHalfMatch;
    else if (secondHalfMatch) {
      backMatch = secondHalfMatch;
      foundInSecondHalf = true;
    }
  }

  return [frontMatch, backMatch];
}
