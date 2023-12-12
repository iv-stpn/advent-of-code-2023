import { matchNumber } from "../utils/matchers";

export const emptyChar = ".";
export function matchSpecialCharacter(char: string | undefined): boolean {
  if (!char) return false;
  return char !== emptyChar && !matchNumber(char);
}

export type Condition = (start: number, end: number, lines: string[], lineIndex: number) => boolean;
export type OnMatch = (number: number, followsCondition: boolean) => void;

export function matchNumbersWithCondition(lines: string[], lineIdx: number, condition: Condition, onNumber: OnMatch) {
  let currentDigit = "";
  let start = 0;
  const line = lines.at(lineIdx);
  if (!line) return;

  for (let idx = 0; idx < line.length; idx++) {
    const char = line.at(idx);
    if (matchNumber(char)) {
      if (!currentDigit) start = idx;
      currentDigit += char;
    } else if (currentDigit !== "") {
      onNumber(parseInt(currentDigit), condition(start, idx, lines, lineIdx));
      currentDigit = "";
      start = idx + 1;
    }
  }

  if (currentDigit !== "") onNumber(parseInt(currentDigit), condition(start, line.length, lines, lineIdx));
}
