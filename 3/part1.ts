import { parseInput } from "../utils/utils";
import { matchNumbersWithCondition, matchSpecialCharacter } from "./utils";

function stringHasSpecialCharacters(str: string): boolean {
  for (const char of str) if (matchSpecialCharacter(char)) return true;
  return false;
}

const checkLine = (start: number, end: number, line: string | undefined, checkBefore: boolean, checkAfter: boolean) => {
  if (!line) return false;
  if (stringHasSpecialCharacters(line.slice(start, end))) return true;
  if (checkBefore && matchSpecialCharacter(line.at(start - 1))) return true;
  if (checkAfter && matchSpecialCharacter(line.at(end))) return true;
};

// Time complexity: O(n), where n is the length of the input line; Space complexity: O(1)
function parseLine(lines: string[], lineIdx: number): number {
  let count = 0;
  matchNumbersWithCondition(
    lines,
    lineIdx,
    (start, end, lines, lineIdx) => {
      const line = lines.at(lineIdx);
      if (!line) return false;

      const checkBefore = start !== 0;
      const checkAfter = end !== line.length - 1; // We can assume each line has the same length

      if (checkBefore && matchSpecialCharacter(line.at(start - 1))) return true; // Check previous character
      if (checkAfter && matchSpecialCharacter(line.at(end))) return true; // Check next character

      if (checkLine(start, end, lines.at(lineIdx - 1), checkBefore, checkAfter)) return true; // Check previous line
      if (checkLine(start, end, lines.at(lineIdx + 1), checkBefore, checkAfter)) return true; // Check next line

      return false;
    },
    (number, followsCondition) => {
      if (followsCondition) count += number;
    },
  );

  return count;
}

export default async function main() {
  const lines = await parseInput("3");
  let sum = 0;
  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) sum += parseLine(lines, lineIdx);
  return sum;
}

console.log(3.1, await main());
