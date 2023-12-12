import { matchNumber } from "../utils/matchers";

type Map = [start: number, end: number, offset: number];
type MapSet = Map[];

const startStringLength = 7; // "seeds: ", where %d is the card ID

const isMap = (numbers: number[]): numbers is Map => numbers.length === 3;

export function parseConfig(lines: string[], sortInitial = true): [initial: number[], allMaps: MapSet[]] {
  const mapSets: MapSet[] = [];
  const [initialLine, ...mapLines] = lines;

  // Since lines are just space-separated numbers, no need to do a custom parser, we can just split
  const initial = initialLine.slice(startStringLength).split(" ").map((digits) => parseInt(digits));
  if (sortInitial) initial.sort((a, b) => a - b); // Sort the initial array, so we can use binary search later

  let lastMapSet: MapSet = [];
  for (const mapLine of mapLines) {
    if (mapLine === "") continue;
    else if (matchNumber(mapLine.charAt(0))) {
      const map = mapLine.split(" ").map((digits) => parseInt(digits));
      if (!isMap(map)) throw new Error(`Invalid map: ${map}`);

      const offset = map[0] - map[1];
      const end = map[1] + map[2] - 1;
      lastMapSet.push([map[1], end, offset]);
    } else {
      lastMapSet = [];
      mapSets.push(lastMapSet);
    }
  }

  for (const mapSet of mapSets) mapSet.sort(([start1], [start2]) => start1 - start2);
  return [initial, mapSets];
}

export function binarySearch(mapSet: MapSet, value: number, start = 0): number {
  let end = mapSet.length - 1;

  while (start <= end) {
    const middle = Math.floor((start + end) / 2);
    const [mapStart, mapEnd] = mapSet[middle];

    if (value >= mapStart && value <= mapEnd) return middle;
    else if (value > mapEnd) start = middle + 1;
    else end = middle - 1;
  }

  return -1;
}

export function getDestination(value: number, mapSets: MapSet[]): number {
  let current = value;
  for (const mapSet of mapSets) {
    const mapIdx = binarySearch(mapSet, current);
    if (mapIdx === -1) continue;

    current = current + mapSet[mapIdx][2]; // Add the offset
  }

  return current;
}
