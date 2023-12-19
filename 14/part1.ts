import { iterateGrid, parseInput } from "../utils/utils";
import { slideNorth } from "./utils";

export default async function main() {
  const lines = await parseInput("14");
  console.log(lines.join("\n"));
  console.log();

  const slidGrid = slideNorth(lines);
  console.log(slidGrid.join("\n"));

  let sum = 0;
  iterateGrid(
    slidGrid,
    (grid, lineIdx, colIdx) => grid[lineIdx][colIdx] === "O",
    (grid, lineIdx) => sum += grid.length - lineIdx,
  );

  return sum;
}

console.log(14.1, await main());
