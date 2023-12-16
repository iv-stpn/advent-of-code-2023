export async function parseInput(folder: string, filename = "input.txt") {
  return (await Bun.file(`${folder}/${filename}`).text()).trim().split("\n");
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
