import { parseInput } from "../utils/utils";
import { getFunctionSolutionCount, parseConfig } from "./utils";

export default async function main() {
  const lines = await parseInput("6");
  const [times, distances] = parseConfig(lines);

  const problems: [number, number][] = times.map((time, idx) => [parseInt(time), parseInt(distances[idx])]);
  const solutionCounts = problems.map(getFunctionSolutionCount);

  return solutionCounts.reduce((product, solutionCount) => product * solutionCount, 1);
}

console.log(6.1, await main());
