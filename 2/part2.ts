import { parseInput } from "../utils/utils";
import { Category, matchCategoriesCounts, sliceStart } from "./utils";

type Counter = { [category in Category]: number };

function initMinCounter(): Counter {
  return { "r": 0, "g": 0, "b": 0 };
}

// Time complexity: O(n), where n is the length of the input line; Space complexity: O(1)
function parseLine(line: string | undefined, id: number): Counter {
  if (!line) throw new Error(`Invalid input line ${id}`);
  const counter = initMinCounter();
  matchCategoriesCounts(
    sliceStart(line, id),
    (digit, category) => counter[category] = Math.max(counter[category], digit),
  );

  return counter;
}

export default async function main() {
  const lines = await parseInput("2");
  let sum = 0;

  for (let idx = 0; idx < lines.length; idx++) {
    const id = idx + 1; // All games are in order, the game ID is i + 1
    const counter = parseLine(lines.at(idx), id);
    sum += Object.values(counter).reduce((product, value) => product * value, 1);
  }

  return sum;
}

console.log(2.2, await main());
