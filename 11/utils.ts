// Utils of part 11

import { range } from "../utils/utils";

type ParsedGrid = [points: [number, number][], emptyLines: number[], emptyColumns: number[]];
export function parseGrid(lines: string[]): ParsedGrid {
  const points: [number, number][] = [];
  const emptyLines: number[] = range(0, lines.length);
  const emptyColumns: number[] = range(0, lines[0].length);

  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[y].length; x++) {
      if (lines[y][x] === "#") {
        points.push([y, x]);
        if (emptyLines.includes(y)) emptyLines.splice(emptyLines.indexOf(y), 1);
        if (emptyColumns.includes(x)) emptyColumns.splice(emptyColumns.indexOf(x), 1);
      }
    }
  }

  return [points, emptyLines, emptyColumns];
}
