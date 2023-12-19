import { HeapQueue } from "../utils/heapq";
import { invertOffset, Offset, offsets } from "../utils/utils";

type Vertex = { cost: number; x: number; y: number; offset: Offset | null; offsetStep: number };
const serialize = ({ x, y, offset, offsetStep }: Vertex) => `${x},${y},${offset},${offsetStep}`;
const isOffset = (offset1: Offset, offset2: Offset) => offset1[0] === offset2[0] && offset1[1] === offset2[1];

export function findSmallestCost(grid: number[][], part2 = false) {
  const heapq = new HeapQueue<Vertex>((a, b) => a.cost - b.cost);
  heapq.push({ cost: 0, x: 0, y: 0, offset: null, offsetStep: 0 });
  const visited = new Set<string>();

  while (heapq.elements.length) {
    const current = heapq.pop();
    if (!current) continue;

    const key = serialize(current);
    if (visited.has(key)) continue;
    visited.add(key);

    if (current.x === grid[0].length - 1 && current.y === grid.length - 1 && current.offsetStep >= 4) {
      return current.cost;
    }

    const currentOffset = current.offset;
    const allowedNeighbors = currentOffset
      ? offsets.filter((offset) => !isOffset(offset, invertOffset(currentOffset)))
      : offsets;

    for (const offset of allowedNeighbors) {
      const y = current.y + offset[0];
      const x = current.x + offset[1];

      if (x < 0 || x >= grid[0].length || y < 0 || y >= grid.length) continue;

      const offsetStep = currentOffset && isOffset(offset, currentOffset) ? current.offsetStep + 1 : 1;
      if (
        part2
          ? offsetStep > 10 || currentOffset && (!isOffset(offset, currentOffset) && current.offsetStep < 4)
          : offsetStep > 3
      ) continue;

      const cost = current.cost + grid[y][x];
      const vertex = { cost, x, y, offset, offsetStep };
      const key = serialize(vertex);
      if (visited.has(key)) continue;
      heapq.push(vertex);
    }
  }

  return -1;
}
