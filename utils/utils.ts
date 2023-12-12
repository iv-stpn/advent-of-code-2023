export async function parseInput(folder: string, filename = "input.txt") {
  return (await Bun.file(`${folder}/${filename}`).text()).trim().split("\n");
}

export function range(start: number, end: number): number[] {
  const result = [];
  for (let i = start; i < end; i++) result.push(i); // end is not included
  return result;
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
