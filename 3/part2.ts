import { iterateGrid, matchNumber, parseInput } from "../utils/utils";
import { emptyChar } from "./utils";

type Side = "left" | "right" | null;
function extractDigits(line: string, position: number, digits: string = "", side: Side = null): string {
  const char = line.charAt(position);
  if (matchNumber(char)) {
    if (side === "left") return extractDigits(line, position - 1, char + digits, side);
    if (side === "right") return extractDigits(line, position + 1, digits + char, side);

    // Side is null.
    const nextDigits = extractDigits(line, position + 1, char + digits, "right");
    return extractDigits(line, position - 1, nextDigits, "left");
  }

  return digits;
}

const extractNumber = (line: string, position: number) => parseInt(extractDigits(line, position));

function parseLineNumbers(line: string, idx: number, checkBefore: boolean, checkAfter: boolean): number[] {
  // The possible configurations are n1 . n2, n1 n1 ., . n1 n1, n1 n1 n1, . . ., . . n1, . n1 ., n1 . .
  // Where n1 and n2 are different consecutive numbers.
  // As such, we either check if a dot is surrounded by two numbers, or we parse the left-most number.

  const char = line.charAt(idx);
  if (checkBefore && checkAfter) {
    const leftCharIsNumber = matchNumber(line.charAt(idx - 1));
    const rightCharIsNumber = matchNumber(line.charAt(idx + 1));

    if (leftCharIsNumber && rightCharIsNumber && char === emptyChar) {
      return [extractNumber(line, idx - 1), extractNumber(line, idx + 1)];
    }

    // Extract the left-most number.
    if (leftCharIsNumber) return [extractNumber(line, idx - 1)];
    if (matchNumber(char)) return [extractNumber(line, idx)];
    if (rightCharIsNumber) return [extractNumber(line, idx + 1)];

    return [];
  }

  // Extract the left-most number.
  if (checkAfter) {
    if (matchNumber(line.charAt(idx - 1))) return [extractNumber(line, idx - 1)];
    if (matchNumber(char)) return [extractNumber(line, idx)];
  } else if (checkBefore) {
    if (matchNumber(char)) return [extractNumber(line, idx)];
    if (matchNumber(line.charAt(idx + 1))) return [extractNumber(line, idx + 1)];
  }

  return [];
}

function parseTwoSurroundingProduct(lines: string[], lineIdx: number, colIdx: number): number {
  const line = lines.at(lineIdx);
  if (!line) throw new Error(`Invalid input, line ${lineIdx} is empty.`);

  const previousLine = lines.at(lineIdx - 1);
  const nextLine = lines.at(lineIdx + 1);

  const checkBefore = colIdx > 0;
  const checkAfter = colIdx < line.length - 1;

  const numbers = [];

  if (previousLine) numbers.push(...parseLineNumbers(previousLine, colIdx, checkBefore, checkAfter));
  if (nextLine) numbers.push(...parseLineNumbers(nextLine, colIdx, checkBefore, checkAfter));
  if (checkBefore && matchNumber(line.charAt(colIdx - 1))) numbers.push(extractNumber(line, colIdx - 1));
  if (checkAfter && matchNumber(line.charAt(colIdx + 1))) numbers.push(extractNumber(line, colIdx + 1));

  // We need at two numbers to calculate the product. We waste some computation extracting other cases, but it's not a big deal.
  if (numbers.length === 2) return numbers[0] * numbers[1];

  return 0;
}

export default async function main() {
  const lines = await parseInput("3");
  let sum = 0;

  iterateGrid(
    lines,
    (lines, lineIdx, colIdx) => lines.at(lineIdx)?.charAt(colIdx) === "*",
    (lines, lineIdx, colIdx) => sum += parseTwoSurroundingProduct(lines, lineIdx, colIdx),
  );

  return sum;
}

console.log(3.2, await main());
