import { parseInput } from "../utils/utils";
import { categoriesAmounts, matchCategoriesCounts, sliceStart } from "./utils";

class ExceededBallCategoryError extends Error {
  constructor(category: string) {
    super(`Max amount of ${category} balls exceeded`);
  }
}

// Time complexity: O(n), where n is the length of the input line; Space complexity: O(1)
function parseLine(line: string | undefined, id: number): boolean {
  if (!line) throw new Error(`Input line ${id} is missing a line`);

  try {
    matchCategoriesCounts(sliceStart(line, id), (digit, category) => {
      if (categoriesAmounts[category] < digit) throw new ExceededBallCategoryError(category);
    });
  } catch (error) {
    if (error instanceof ExceededBallCategoryError) return false;
    throw error;
  }

  return true;
}

export default async function main() {
  const lines = await parseInput("2");
  let sum = 0;

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const id = lineIndex + 1; // All games are in order, the game ID is lineIndex + 1
    sum += parseLine(lines.at(lineIndex), id) ? id : 0;
  }

  return sum;
}

console.log(2.1, await main());
