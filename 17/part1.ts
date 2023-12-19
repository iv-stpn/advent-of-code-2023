import { parseInput } from "../utils/utils";
import { findSmallestCost } from "./utils";

export default async function main() {
  const lines = await parseInput("17");
  const cost = findSmallestCost(lines.map((line) => line.split("").map((char) => parseInt(char))));
  return cost;
}

console.log(17.1, await main());
