import { parseInput } from "../utils/utils";
import { parseGraph } from "./utils";

export default async function main() {
  const lines = await parseInput("10");
  return parseGraph(lines);
}

console.log(10.1, await main());
