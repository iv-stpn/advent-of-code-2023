import { combinations, manhattanDistance, parseInput } from "../utils/utils";
import { parseGrid } from "./utils";

const growthFactor = 1000000;
export default async function main() {
  const lines = await parseInput("11");
  let [points, emptyLines, emptyColumns] = parseGrid(lines);

  points = points.map(([y, x]) => [
    y + emptyLines.filter(emptyLine => emptyLine < y).length * (growthFactor - 1),
    x + emptyColumns.filter(emptyColumn => emptyColumn < x).length * (growthFactor - 1),
  ]);

  return combinations(points).reduce((sum, [p1, p2]) => sum + manhattanDistance(p1, p2), 0);
}

console.log(11.2, await main());
