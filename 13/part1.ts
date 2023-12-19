import { parseInput } from "../utils/utils";
import { findReflecting, linesToGrid } from "./utils";

export default async function main() {
  const lines = await parseInput("13");
  const grids = linesToGrid(lines);

  let sum = 0;
  for (const grid of grids) {
    const reflecting = findReflecting(grid);
    if (reflecting) {
      const offset = parseInt(reflecting.slice(1));
      if (reflecting.startsWith("x")) sum += offset * 100;
      else sum += offset;
    }
  }

  return sum;
}

console.log(13.1, await main());
