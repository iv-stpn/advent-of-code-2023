// Utils of part 6

import { isInteger } from "../utils/utils";

const startStringLength = 9; // "Distance:"
export function parseConfig(lines: string[]): [string[], string[]] {
  if (lines.length !== 2) throw new Error(`Invalid config: there should be 2 lines, got ${lines.length} lines`);
  const [times, distances] = lines.map(line => line.slice(startStringLength).trim().split(/ +/));

  return [times, distances];
}

// For each second, we accumulate 1mm/s of speed. We then have to travel a given distance in a shorter time than the specified time minus the time we spent accelerating.
// distance / accumulatedSpeed < baseTime - time [accumulatedSpeed = time * rate of acceleration = time * 1 = time]
// distance / time < baseTime - time
// <=> distance < (baseTime - time) * time
// <=> distance < baseTime * time - time^2
// <=> time^2 - baseTime * time + distance > 0
// Solve for time with only positive, real, integer solutions

const a = 1;
export function getFunctionSolutionCount([bestTime, distance]: [number, number]): number {
  const b = -bestTime;
  const c = distance;
  const delta = (b * b) - 4 * a * c;

  if (delta < 0) throw new Error(`No solution for ${bestTime} and ${distance}`);

  const sqrtDelta = Math.sqrt(delta);
  const solution1 = (-b - sqrtDelta) / (2 * a);
  const solution2 = (-b + sqrtDelta) / (2 * a);

  if (solution1 < 0 && solution2 < 0) throw new Error(`No solution for ${bestTime} and ${distance}`);
  if (solution1 === solution2 && isInteger(solution1)) return 1;

  const min = isInteger(solution1) ? solution1 + 1 : Math.ceil(solution1);
  const max = isInteger(solution2) ? solution2 : Math.floor(solution2) + 1;

  return max - min;
}
