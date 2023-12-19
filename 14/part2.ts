import { iterateGrid, parseInput } from "../utils/utils";
import { cycle } from "./utils";

const limit = 1000000000;
export default async function main() {
  const lines = await parseInput("14");

  const previousGrids: string[] = [];

  let slidGrid: string[] = lines;
  for (let i = 0; i < limit; i++) {
    slidGrid = cycle(slidGrid);
    const serialized = slidGrid.join("\n");
    if (previousGrids.includes(serialized)) {
      const last = previousGrids.indexOf(serialized);
      const cycleLength = i - last;
      slidGrid = previousGrids[last + ((limit - i) % cycleLength) - 1].split("\n");
      break;
    }
    previousGrids.push(serialized);
  }

  let sum = 0;
  iterateGrid(
    slidGrid,
    (grid, lineIdx, colIdx) => grid[lineIdx][colIdx] === "O",
    (grid, lineIdx) => sum += grid.length - lineIdx,
  );

  return sum;
}

console.log(14.2, await main());
