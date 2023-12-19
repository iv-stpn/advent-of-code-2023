import { parseInput } from "../utils/utils";
import { shoelaceArea } from "./utils";

// Use a polygon area formula to calculate the inner area of the polygon. (https://en.wikipedia.org/wiki/Shoelace_formula)

// This formula calculates the inner area contained in the vertices, but we need to calculate the outer area.
// The inner area is the area of the shape described by a line passing through the middle of the vertices.

// The remaining area under the ouline for each passing square is equal to 1/2 in the case of a continuous line,
// 1/4 in the case of a clockwise turn and 3/4 in the case of a counter-clockwise turn.
// For the shape to be a closed polygon, there needs to be 4 more clockwise turns than counter-clockwise turns.

// As such, on average, the remaining area under the outline for each passing square is 1/2.
// We add 1 to the outer area to account for the 4 extra clockwise turns.

export default async function main() {
  const lines = await parseInput("18");
  let current: [number, number] = [0, 0];
  let nodes: [number, number][] = [current];

  let outerArea = 1;
  for (const line of lines) {
    const data = line.split(" ")[2].slice(2, -1);
    const direction = data.at(-1);
    const stepCount = parseInt(data.slice(0, -1), 16);

    if (direction === "0") current = [current[0], current[1] + stepCount];
    if (direction === "1") current = [current[0] + stepCount, current[1]];
    if (direction === "2") current = [current[0], current[1] - stepCount];
    if (direction === "3") current = [current[0] - stepCount, current[1]];
    outerArea += stepCount / 2;
    nodes.push(current);
  }

  const min = [Math.min(...nodes.map(([line]) => line)), Math.min(...nodes.map(([_, col]) => col))];
  nodes = nodes.map(([line, col]) => [line - min[0], col - min[1]]);

  return shoelaceArea(nodes) + outerArea;
}

console.log(18.2, await main());
