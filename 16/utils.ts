// Utils of part 16

import { AFTER_X, AFTER_Y, BEFORE_X, BEFORE_Y, Offset } from "../utils/utils";

export function highlightGridNodes(size: [number, number], nodes: [number, number][] = []) {
  const grid = [];
  for (let lineIdx = 0; lineIdx < size[0]; lineIdx++) {
    const line = [];
    for (let colIdx = 0; colIdx < size[1]; colIdx++) line.push(".");
    grid.push(line);
  }

  for (const [lineIdx, colIdx] of nodes) {
    grid[lineIdx][colIdx] = "#";
  }

  return grid.map((line) => line.join(""));
}

export function accumulateTravel(
  lines: string[],
  nodes: [[number, number], Offset][] = [[[0, 0], AFTER_X]],
  current = [0, 0],
  offset: Offset = AFTER_X,
) {
  const next: [number, number] = [current[0] + offset[0], current[1] + offset[1]];
  if (
    next[0] >= 0 && next[0] < lines.length && next[1] >= 0 && next[1] < lines[next[0]].length
    && !nodes.some(([[line, col], direction]) => line === next[0] && col === next[1] && direction === offset)
  ) {
    nodes.push([next, offset]);
    if (lines[next[0]][next[1]] === "|") {
      accumulateTravel(lines, nodes, next, AFTER_Y);
      accumulateTravel(lines, nodes, next, BEFORE_Y);
    } else if (lines[next[0]][next[1]] === "-") {
      accumulateTravel(lines, nodes, next, AFTER_X);
      accumulateTravel(lines, nodes, next, BEFORE_X);
    } else if (lines[next[0]][next[1]] === "\\") {
      const nextOffset = offset === AFTER_X
        ? AFTER_Y
        : offset === BEFORE_X
        ? BEFORE_Y
        : offset === AFTER_Y
        ? AFTER_X
        : BEFORE_X;
      accumulateTravel(lines, nodes, next, nextOffset);
    } else if (lines[next[0]][next[1]] === "/") {
      const nextOffset = offset === AFTER_X
        ? BEFORE_Y
        : offset === BEFORE_X
        ? AFTER_Y
        : offset === AFTER_Y
        ? BEFORE_X
        : AFTER_X;
      accumulateTravel(lines, nodes, next, nextOffset);
    } else {
      accumulateTravel(lines, nodes, next, offset);
    }
  }

  return nodes;
}

export function uniqueNodes(nodes: [[number, number], Offset][]): [number, number][] {
  return nodes.map(([[lineIdx, colIdx]]) => `${lineIdx},${colIdx}`).filter(
    (value, index, arr) => arr.indexOf(value) === index,
  ).map((value) => {
    const [x, y] = value.split(",");
    return [parseInt(x), parseInt(y)];
  });
}
