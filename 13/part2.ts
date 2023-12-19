import { parseInput } from "../utils/utils";
import { findNewReflecting, linesToGrid } from "./utils";

export default async function main() {
  const lines = await parseInput("13");
  const grids = linesToGrid(lines);

  let sum = 0;
  for (const grid of grids) {
    const newReflecting = findNewReflecting(grid);
    console.log(newReflecting);
    if (newReflecting) {
      const offset = parseInt(newReflecting.slice(1));
      if (newReflecting.startsWith("x")) sum += offset * 100;
      else sum += offset;
    }
  }

  return sum;
}

console.log(13.2, await main());
