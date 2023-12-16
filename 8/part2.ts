import { lcm, parseInput } from "../utils/utils";
import { parseConfig } from "./utils";

const maxSteps = 1000000000;
export default async function main() {
  const lines = await parseInput("8");
  const [directions, leftNodes, rightNodes] = parseConfig(lines);
  let stepCount = 0;

  const cycles: Record<string, number> = {};

  const initialNodes = Object.keys(leftNodes).filter((node) => node.endsWith("A"));
  const current = initialNodes.slice();
  while (!initialNodes.every((node) => node in cycles) && stepCount < maxSteps) {
    const direction = directions[stepCount % directions.length];
    stepCount++;
    for (let index = 0; index < current.length; index++) {
      current[index] = direction === "L" ? leftNodes[current[index]] : rightNodes[current[index]];
      if (current[index].endsWith("Z") && !(initialNodes[index] in cycles)) {
        console.log(`Found ${current[index]} (${initialNodes[index]}) after ${stepCount} steps`);
        cycles[initialNodes[index]] = stepCount;
      }
    }
  }

  if (stepCount === maxSteps) {
    throw new Error(
      `${JSON.stringify(initialNodes.filter((node) => !(node in cycles)))} not found after ${maxSteps} steps`,
    );
  }

  return Object.values(cycles).reduce((a, b) => lcm(a, b));
}

console.log(8.2, await main());
