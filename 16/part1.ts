import { parseInput } from "../utils/utils";
import { accumulateTravel, displayGrid, uniqueNodes } from "./utils";

export default async function main() {
  const lines = await parseInput("16");
  const nodes = accumulateTravel(lines);

  const unique = uniqueNodes(nodes);

  displayGrid([lines.length, lines[0].length], unique);
  return unique.length;
}

console.log(16.1, await main());
