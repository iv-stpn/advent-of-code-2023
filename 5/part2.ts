import { parseInput } from "../utils/utils";
import { getDestination, parseConfig } from "./utils";

// This approach is naive; it probably could be optimized by

// 1. Find which number ranges are not covered by the maps and use them as reference for the initial minimum
// 2. Reverse the map by starting from the smallest range in the last map and hitting the ranges that could correspond.
// Repeat 2. for the next smallest range, and so on.

export default async function main() {
  const lines = await parseInput("5");
  const [initial, mapSets] = parseConfig(lines, false);
  if (initial.length % 2 !== 0) throw new Error("Initial length must be even");
  const chunks = initial.reduce<[number, number][]>((chunks, value, idx) => {
    if (idx % 2 === 0) chunks.push([value, initial[idx + 1]]);
    return chunks;
  }, []);

  let minDestination = Infinity;
  for (const [start, offset] of chunks) {
    for (let value = start; value < start + offset; value++) {
      const destination = getDestination(value, mapSets);
      if (destination < minDestination) minDestination = destination;
    }
  }

  return minDestination;
}

console.log(5.2, await main());
