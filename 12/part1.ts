import { backtrackToLeaves, parseInput, totalStepCount } from "../utils/utils";
import { isComplete, isInvalid, next, parseLine } from "./utils";

export default async function main() {
  const lines = await parseInput("12");

  let solutionCount = 0;
  const results: string[] = [];
  for (const line of lines) {
    const memoization = {};
    const [initial, expectedGroups] = parseLine(line);
    const solutions = backtrackToLeaves(
      initial,
      ["#", "."],
      results,
      next,
      state => isInvalid(state, expectedGroups, memoization),
      state => isComplete(state, expectedGroups),
      (state, result) => [...result, state],
    );

    console.log(initial, solutions.length, solutions.length, totalStepCount);
    console.log();
    solutionCount += solutions.length;
  }

  return solutionCount;
}

console.log(12.1, await main());
