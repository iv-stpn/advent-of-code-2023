import { matchNumber, parseInput } from "../utils/utils";
import { matchFirstAndLast } from "./utils";

// Time complexity: O(n), where n is the length of the input line; Space complexity: O(1)
function parseLine(line: string): number {
  let [firstDigit, secondDigit] = matchFirstAndLast(line, (line, idx) => matchNumber(line.at(idx)));

  if (firstDigit === null && secondDigit === null) throw new Error(`Input line ${line} is missing a digit`);
  if (secondDigit === null) secondDigit = firstDigit;
  if (firstDigit === null) firstDigit = secondDigit;

  const number = parseInt(`${firstDigit}${secondDigit}`);
  return number;
}

export default async function main() {
  const lines = await parseInput("1");
  return lines.reduce((sum, line) => sum + parseLine(line), 0);
}

console.log(1.1, await main());
