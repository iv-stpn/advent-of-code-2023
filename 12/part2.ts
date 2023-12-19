import { parseInput } from "../utils/utils";
import { parseLine, recursiveWithCountMemoize, State } from "./utils";

const repeatFactor = 5;
export default async function main() {
  const lines = await parseInput("12");

  let solutionCount = 0;
  for (const line of lines) {
    let [initial, expectedGroups] = parseLine(line);
    const initialState: State = [[initial, initial, initial, initial, initial].join("?"), 0, 0, 0];
    expectedGroups = [...expectedGroups, ...expectedGroups, ...expectedGroups, ...expectedGroups, ...expectedGroups];
    console.log(initialState, expectedGroups);
    solutionCount += recursiveWithCountMemoize(initialState, expectedGroups, {});
  }

  return solutionCount;
}
console.log(12.2, await main());
