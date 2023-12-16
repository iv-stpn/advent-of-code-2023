import { parseInput } from "../utils/utils";
import { getFunctionSolutionCount, parseConfig } from "./utils";

export default async function main() {
  const lines = await parseInput("6");
  const [times, distances] = parseConfig(lines);

  return getFunctionSolutionCount([
    parseInt(times.reduce((product, current) => product + current, "")),
    parseInt(distances.reduce((product, current) => product + current, "")),
  ]);
}

console.log(6.2, await main());
