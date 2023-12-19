// Utils of part 10

import { AFTER_X, AFTER_Y, BEFORE_X, BEFORE_Y, invertOffset, Offset } from "../utils/utils";

type CharDirection = Set<Offset>;
export const charMap: Record<string, CharDirection> = {
  "|": new Set([BEFORE_Y, AFTER_Y]),
  "7": new Set([BEFORE_X, AFTER_Y]),
  "J": new Set([BEFORE_Y, BEFORE_X]),
  "-": new Set([BEFORE_X, AFTER_X]),
  "F": new Set([AFTER_Y, AFTER_X]),
  "L": new Set([BEFORE_Y, AFTER_X]),
};

const printCharMap: Record<string, string> = {
  "|": "│",
  "7": "┐",
  "J": "┘",
  "-": "─",
  "F": "┌",
  "L": "└",
};

export const chars = Object.keys(charMap).join("");
export function printGrid(lines: string[], nodes: [number, number][] = [], highlights: [number, number][] = []) {
  const grid = lines.map((line) => line.split(""));
  for (const [lineIdx, colIdx] of nodes) {
    grid[lineIdx][colIdx] = `\x1b[31m${printCharMap[grid[lineIdx][colIdx]]}\x1b[0m`;
  }

  for (const [lineIdx, colIdx] of highlights) {
    if (lineIdx < 0 || lineIdx >= grid.length || colIdx < 0 || colIdx >= grid[lineIdx].length) continue;
    grid[lineIdx][colIdx] = `\x1b[33mX\x1b[0m`;
  }

  console.log(grid.map((line) => line.join("")).join("\n"));
}

function getStart(lines: string[]): [number, number] {
  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines.at(lineIdx);
    if (!line) throw new Error(`Invalid input, line ${lineIdx} is empty.`);
    for (let colIdx = 0; colIdx < line.length; colIdx++) {
      if (line[colIdx] === "S") {
        return [lineIdx, colIdx];
      }
    }
  }
  throw new Error("No start found.");
}

function parseStart(start: [number, number], lines: string[]): CharDirection {
  const sides: Offset[] = [];
  if (start[0] > 0) {
    const previous = lines[start[0] - 1][start[1]];
    if (chars.includes(previous) && charMap[previous].has(AFTER_Y)) sides.push(AFTER_Y);
  }

  if (start[0] < lines.length - 1) {
    const next = lines[start[0] + 1][start[1]];
    if (chars.includes(next) && charMap[next].has(BEFORE_Y)) sides.push(BEFORE_Y);
  }

  if (start[1] > 0) {
    const previous = lines[start[0]][start[1] - 1];
    if (chars.includes(previous) && charMap[previous].has(AFTER_X)) sides.push(AFTER_X);
  }

  if (start[1] < lines[start[0]].length - 1) {
    const next = lines[start[0]][start[1] + 1];
    if (chars.includes(next) && charMap[next].has(BEFORE_X)) sides.push(BEFORE_X);
  }

  if (sides.length < 2) throw new Error("Not enough connecting sides found for start.");
  if (sides.length > 2) throw new Error("Too many connecting sides found for start.");

  return new Set(sides.map(invertOffset));
}

const outChar = "O";
const inChar = "I";

function isNode(node: [number, number], nodes: [number, number][]): boolean {
  return nodes.some(([lineIdx, colIdx]) => lineIdx === node[0] && colIdx === node[1]);
}

type State = typeof outChar | typeof inChar;
export const isState = (value: string): value is State => value === outChar || value === inChar;

export function followOffset(
  initialNode: [number, number],
  offset: [number, number],
  lines: string[],
  nodes: [number, number][],
): State {
  let [lineIdx, colIdx] = initialNode;
  if (!nodes.some((node) => node[0] === lineIdx && node[1] === colIdx)) {
    throw new Error(`Invalid initial node at ${[lineIdx, colIdx]}.`);
  }

  let currentChar = lines[lineIdx][colIdx];
  let previous = invertOffset([...charMap[currentChar]][0]);

  do {
    if (!nodes.some((node) => node[0] === lineIdx && node[1] === colIdx)) {
      throw new Error(`Invalid node ${currentChar} at ${[lineIdx, colIdx]} with offset ${offset}.`);
    }

    const offsetChar = lines.at(lineIdx + offset[0])?.charAt(colIdx + offset[1]);
    // printGrid(lines, nodes, [[lineIdx, colIdx], [lineIdx + offset[0], colIdx + offset[1]]]);
    if (!offsetChar || offsetChar === outChar) return outChar;
    else if (offsetChar === inChar) return inChar;

    const invertPrevious = invertOffset(previous);
    const directions = [...charMap[currentChar]];

    if (invertPrevious[0] === directions[0][0] && invertPrevious[1] === directions[0][1]) {
      previous = directions[1];
    } else if (invertPrevious[0] === directions[1][0] && invertPrevious[1] === directions[1][1]) {
      previous = directions[0];
    } else {
      throw new Error(`Not connecting: Invalid previous ${previous} for ${lineIdx},${colIdx}, ${directions}`);
    }

    // Rotate offset
    if ((offset[0] === 0 && previous[0] === 0) || (offset[1] === 0 && previous[1] === 0)) {
      if (currentChar === "J" || currentChar === "F") offset = [offset[1], offset[0]];
      else if (currentChar === "7" || currentChar === "L") offset = [-offset[1], -offset[0]];
    }

    lineIdx += previous[0];
    colIdx += previous[1];

    currentChar = lines[lineIdx][colIdx];
  } while (initialNode[0] !== lineIdx || initialNode[1] !== colIdx);

  return inChar;
}

export function propagateNode(node: [number, number], lines: string[], nodes: [number, number][], state: State) {
  const queue = [node];

  while (queue.length > 0) {
    const [lineIdx, colIdx] = queue.shift()!;

    const line = lines[lineIdx];
    if (isState(line[colIdx]) || isNode([lineIdx, colIdx], nodes)) continue;
    lines[lineIdx] = line.substring(0, colIdx) + state + line.substring(colIdx + 1);

    if (lineIdx - 1 > 0 && !isState(lines[lineIdx - 1][colIdx])) queue.push([lineIdx - 1, colIdx]);
    if (lineIdx + 1 < lines.length && !isState(lines[lineIdx + 1][colIdx])) queue.push([lineIdx + 1, colIdx]);
    if (colIdx - 1 > 0 && !isState(line[colIdx - 1])) queue.push([lineIdx, colIdx - 1]);
    if (colIdx + 1 < line.length && !isState(line[colIdx + 1])) queue.push([lineIdx, colIdx + 1]);
  }
}

export function parseGraph(lines: string[]): [number, [number, number][]] {
  const start = getStart(lines);
  const startDirections = parseStart(start, lines);

  const startChar = Object.entries(charMap).find(([, directions]) => {
    const [direction1, direction2] = [...directions];
    const [startDirection1, startDirection2] = [...startDirections];
    return (
      (direction1[0] === startDirection1[0] && direction1[1] === startDirection1[1]
        && direction2[0] === startDirection2[0] && direction2[1] === startDirection2[1])
      || (direction1[0] === startDirection2[0] && direction1[1] === startDirection2[1]
        && direction2[0] === startDirection1[0] && direction2[1] === startDirection1[1])
    );
  })?.[0];
  if (!startChar) throw new Error("No start char found.");

  console.log("Start char", startChar, "at", start, "with directions", startDirections);
  lines[start[0]] = lines[start[0]].substring(0, start[1]) + startChar + lines[start[0]].substring(start[1] + 1);

  let [previous, next] = [...startDirections];

  const currentPrevious: [number, number] = [start[0] + previous[0], start[1] + previous[1]];
  const currentNext: [number, number] = [start[0] + next[0], start[1] + next[1]];

  const nodes: [number, number][] = [start, [...currentPrevious], [...currentNext]];

  let steps = 1;
  while (currentPrevious[0] !== currentNext[0] || currentPrevious[1] !== currentNext[1]) {
    const previousChar = lines[currentPrevious[0]][currentPrevious[1]];
    if (!chars.includes(previousChar)) throw new Error(`Invalid char ${previousChar} at ${currentPrevious}`);

    const previousConnections = [...charMap[previousChar]];
    const invertPrevious = invertOffset(previous);
    if (invertPrevious[0] === previousConnections[0][0] && invertPrevious[1] === previousConnections[0][1]) {
      previous = previousConnections[1];
    } else if (invertPrevious[0] === previousConnections[1][0] && invertPrevious[1] === previousConnections[1][1]) {
      previous = previousConnections[0];
    } else {
      throw new Error(`Not connecting: Invalid previous ${previous} for ${currentPrevious}, ${previousConnections}`);
    }

    currentPrevious[0] += previous[0];
    currentPrevious[1] += previous[1];

    const nextChar = lines[currentNext[0]][currentNext[1]];
    if (!chars.includes(nextChar)) throw new Error(`Invalid char ${nextChar} at ${currentNext}`);

    const nextConnections = [...charMap[nextChar]];
    const invertNext = invertOffset(next);
    if (invertNext[0] === nextConnections[0][0] && invertNext[1] === nextConnections[0][1]) {
      next = nextConnections[1];
    } else if (invertNext[0] === nextConnections[1][0] && invertNext[1] === nextConnections[1][1]) {
      next = nextConnections[0];
    } else {
      throw new Error(`Not connecting: Invalid next ${next} for ${currentNext}, ${nextConnections}`);
    }

    currentNext[0] += next[0];
    currentNext[1] += next[1];

    nodes.push([currentPrevious[0], currentPrevious[1]]);
    if (currentPrevious[0] !== currentNext[0] || currentPrevious[1] !== currentNext[1]) {
      nodes.push([currentNext[0], currentNext[1]]);
    }

    steps++;
  }

  return [steps, nodes];
}
