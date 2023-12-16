import { parseInput } from "../utils/utils";
import { parseConfig } from "./utils";

export default async function main() {
  const lines = await parseInput("8");
  const [directions, leftNodes, rightNodes] = parseConfig(lines);
  let stepCount = 0;

  let current = "AAA";
  while (current !== "ZZZ") {
    const direction = directions[stepCount % directions.length];
    current = direction === "L" ? leftNodes[current] : rightNodes[current];
    stepCount++;
  }

  return stepCount;
}

console.log(8.1, await main());
