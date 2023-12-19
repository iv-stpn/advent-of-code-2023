import { AFTER_X, AFTER_Y, BEFORE_X, BEFORE_Y, parseInput } from "../utils/utils";
import { accumulateTravel, uniqueNodes } from "./utils";

// The naive solution is to run the part1 solution for each line and each column.
// The solution could be optimized with a BFS approach.
export default async function main() {
  const lines = await parseInput("16");

  let max = 0;
  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    console.log(lineIdx, lines.length);
    const first: [number, number] = [lineIdx, 0];
    let nodes = uniqueNodes(accumulateTravel(lines, [[first, AFTER_X]], first, AFTER_X));
    if (max < nodes.length) max = nodes.length;

    const last: [number, number] = [lineIdx, lines[0].length - 1];
    nodes = uniqueNodes(accumulateTravel(lines, [[last, BEFORE_X]], last, BEFORE_X));
    if (max < nodes.length) max = nodes.length;
  }

  for (let colIndex = 1; colIndex < lines[0].length - 1; colIndex++) {
    console.log(colIndex, lines[0].length);
    const first: [number, number] = [0, colIndex];
    let nodes = uniqueNodes(accumulateTravel(lines, [[first, AFTER_Y]], first, AFTER_Y));
    if (max < nodes.length) max = nodes.length;

    const last: [number, number] = [lines[0].length - 1, colIndex];
    nodes = uniqueNodes(accumulateTravel(lines, [[last, BEFORE_Y]], last, BEFORE_Y));
    if (max < nodes.length) max = nodes.length;
  }

  return max;
}

console.log(16.2, await main());
