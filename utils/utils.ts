export async function parseInput(folder: string, filename = "input.txt") {
  return (await Bun.file(`${folder}/${filename}`).text()).trim().split("\n");
}

const numbers = "1234567890";
export const matchNumber = (char: string | undefined) => char && numbers.includes(char) ? char : null;

export const BEFORE_X: [0, -1] = [0, -1];
export const AFTER_X: [0, 1] = [0, 1];
export const BEFORE_Y: [-1, 0] = [-1, 0];
export const AFTER_Y: [1, 0] = [1, 0];

export const offsets = [BEFORE_X, AFTER_X, BEFORE_Y, AFTER_Y];
export type Offset = typeof offsets[number];

export function invertOffset(direction: Offset): Offset {
  if (direction === BEFORE_X) return AFTER_X;
  if (direction === AFTER_X) return BEFORE_X;
  if (direction === BEFORE_Y) return AFTER_Y;
  if (direction === AFTER_Y) return BEFORE_Y;
  throw new Error("Invalid side.");
}

export function isInteger(number: number) {
  return number === Math.floor(number);
}

export function range(start: number, end: number): number[] {
  const result = [];
  for (let i = start; i < end; i++) result.push(i); // end is not included
  return result;
}

export function groupByCount<T>(array: T[], key: (item: T) => string | number): { [key: string | number]: number } {
  const groups: { [key: string | number]: number } = {};
  for (const item of array) {
    const group = key(item);
    if (!groups[group]) groups[group] = 0;
    groups[group]++;
  }
  return groups;
}

export function gcd(a: number, b: number) {
  a = Math.abs(a);
  b = Math.abs(b);
  if (b > a) {
    const temp = a;
    a = b;
    b = temp;
  }

  while (true) {
    if (b == 0) return a;
    a %= b;
    if (a == 0) return b;
    b %= a;
  }
}

export function lcm(a: number, b: number) {
  return a * b / gcd(a, b);
}

export function combinations<T>(array: T[], size = 2): T[][] {
  if (size === 1) return array.map(item => [item]);
  return array.flatMap((item, idx) =>
    combinations(array.slice(idx + 1), size - 1).map(combination => [item, ...combination])
  );
}

export function groupBy<T>(array: T[], key: (item: T) => string | number): { [key: string | number]: T[] } {
  const groups: { [key: string | number]: T[] } = {};
  for (const item of array) {
    const group = key(item);
    if (!groups[group]) groups[group] = [];
    groups[group].push(item);
  }
  return groups;
}

export function groupByMultiple<T>(
  array: T[],
  keys: (item: T) => (string | number)[],
): { [key: string | number]: T[] } {
  const groups: { [key: string | number]: T[] } = {};
  for (const item of array) {
    for (const key of keys(item)) {
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    }
  }
  return groups;
}

export type GridCondition = (lines: string[], lineIdx: number, colIdx: number) => boolean;
export type GridMatch = (lines: string[], lineIdx: number, colIdx: number) => void;

export function iterateGrid(lines: string[], condition: GridCondition, onMatch: GridMatch) {
  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines.at(lineIdx);
    if (!line) throw new Error(`Invalid input, line ${lineIdx} is empty.`);

    for (let colIdx = 0; colIdx < line.length; colIdx++) {
      if (condition(lines, lineIdx, colIdx)) onMatch(lines, lineIdx, colIdx);
    }
  }
}

export function countOccurences(string: string, char: string): number {
  let count = 0;
  for (let i = 0; i < string.length; i++) if (string.charAt(i) === char) count++;
  return count;
}

export function backtrackToLeaves<R, T, C>(
  state: T,
  candidates: C[],
  initialResult: R,
  next: (state: T, candidate: C) => T | null,
  reject: (state: T) => boolean,
  accept: (state: T) => boolean,
  accumulate: (state: T, result: R) => R,
): R {
  function backtrack(state: T, candidates: C[]) {
    if (reject(state)) return;
    if (accept(state)) {
      initialResult = accumulate(state, initialResult);
      return;
    }

    for (const candidate of candidates) {
      const nextState = next(state, candidate);
      if (!nextState) continue;
      backtrack(nextState, candidates);
    }
  }

  backtrack(state, candidates);
  return initialResult;
}

export function manhattanDistance([y1, x1]: [number, number], [y2, x2]: [number, number]) {
  return Math.abs(y1 - y2) + Math.abs(x1 - x2);
}

export function floodfill(
  start: [number, number],
  lines: string[],
  nodes: [number, number][],
  char: string,
  invalid?: (char: string) => boolean,
) {
  const queue = [start];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) throw new Error("Invalid queue.");

    if (visited.has(current.join(","))) continue;
    visited.add(current.join(","));

    const line = lines[current[0]];
    if (invalid?.(line[current[1]]) || nodes.some(([line, col]) => line === start[0] && col === start[1])) continue;
    lines[current[0]] = line.substring(0, current[1]) + char + line.substring(current[1] + 1);

    if (current[0] + 1 < lines.length && !invalid?.(lines[current[0] + 1][current[1]])) {
      queue.push([current[0] + 1, current[1]]);
    }
    if (current[0] - 1 > 0 && !invalid?.(lines[current[0] - 1][current[1]])) queue.push([current[0] - 1, current[1]]);
    if (current[1] + 1 < line.length && !invalid?.(line[current[1] + 1])) queue.push([current[0], current[1] + 1]);
    if (current[1] - 1 > 0 && !invalid?.(line[current[1] - 1])) queue.push([current[0], current[1] - 1]);
  }
}
