import { parseInput } from "../utils/utils";
import { matchFirstAndLast, matchNumberString } from "./utils";

// Time complexity: O(n), where n is the length of the input line; Space complexity: O(1)
// Time complexity is still O(n) because we're still going through the entire input line once.
// If there was an arbitrary number of number strings, complexity would be time: O(n*m), space: O(m), where m is the number of number strings.
function parseLine(line: string): number {
  let [firstDigit, secondDigit] = matchFirstAndLast(line, matchNumberString);

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

console.log(1.2, await main());
