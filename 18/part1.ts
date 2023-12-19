import { highlightGridNodes } from "../16/utils";
import { countOccurences, floodfill, parseInput } from "../utils/utils";

// Naive approach: find the grid nodes and floodfill from the center, then count the number of "#" in the grid.
export default async function main() {
  const lines = await parseInput("18");
  let nodes: [number, number][] = [];
  let current = [0, 0];
  for (const line of lines) {
    const [direction, steps] = line.split(" ");
    const stepCount = parseInt(steps, 10);
    if (direction === "R") {
      for (let colIdx = current[1]; colIdx < current[1] + stepCount; colIdx++) nodes.push([current[0], colIdx]);
      current = [current[0], current[1] + stepCount];
    }

    if (direction === "D") {
      for (let rowIdx = current[0]; rowIdx < current[0] + stepCount; rowIdx++) nodes.push([rowIdx, current[1]]);
      current = [current[0] + stepCount, current[1]];
    }

    if (direction === "L") {
      for (let colIdx = current[1]; colIdx > current[1] - stepCount; colIdx--) nodes.push([current[0], colIdx]);
      current = [current[0], current[1] - stepCount];
    }

    if (direction === "U") {
      for (let rowIdx = current[0]; rowIdx > current[0] - stepCount; rowIdx--) nodes.push([rowIdx, current[1]]);
      current = [current[0] - stepCount, current[1]];
    }
  }

  const min = [Math.min(...nodes.map(([line]) => line)), Math.min(...nodes.map(([_, col]) => col))];
  nodes = nodes.map(([line, col]) => [line - min[0], col - min[1]]);
  const size: [number, number] = [
    Math.max(...nodes.map(([line]) => line)) + 1,
    Math.max(...nodes.map(([_, col]) => col)) + 1,
  ];

  const grid = highlightGridNodes(size, nodes);
  floodfill([Math.floor(size[0] / 2), Math.floor(size[1] / 2)], grid, nodes, "#", (char) => char === "#");

  return grid.reduce((sum, line) => sum + countOccurences(line, "#"), 0);
}

console.log(18.1, await main());
