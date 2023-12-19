// Utils of part 14

import { getOccurenceCount } from "../utils/utils";

export function slideRowWise(lines: string[], direction: "left" | "right"): string[] {
  const pad = direction === "left"
    ? (string: string, length: number) => string.padEnd(length, ".")
    : (string: string, length: number) => string.padStart(length, ".");

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const lineChunks = lines[lineIdx].split("#");
    lines[lineIdx] = lineChunks.map(chunk => pad("O".repeat(getOccurenceCount(chunk, "O")), chunk.length)).join("#");
  }

  return lines;
}

export function symetry(lines: string[]) {
  const rotatedLines: string[] = [];
  for (const line of lines) {
    for (let charIdx = 0; charIdx < line.length; charIdx++) {
      rotatedLines[charIdx] = rotatedLines[charIdx]
        ? rotatedLines[charIdx] + line[charIdx]
        : line[charIdx];
    }
  }

  return rotatedLines;
}

export function slideColumnWise(lines: string[], direction: "up" | "down"): string[] {
  const rotatedLines = symetry(lines);
  const slidLines = slideRowWise(rotatedLines, direction === "up" ? "left" : "right");
  return symetry(slidLines);
}

export const slideNorth = (lines: string[]) => slideColumnWise(lines, "up");
export const slideSouth = (lines: string[]) => slideColumnWise(lines, "down");
export const slideWest = (lines: string[]) => slideRowWise(lines, "left");
export const slideEast = (lines: string[]) => slideRowWise(lines, "right");

export function cycle(lines: string[]): string[] {
  lines = slideNorth(lines);
  lines = slideWest(lines);
  lines = slideSouth(lines);
  lines = slideEast(lines);
  return lines;
}
