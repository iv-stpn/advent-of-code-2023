import { parseInput } from "../utils/utils";
import { getFinalSequenceNumber } from "./utils";

export default async function main() {
  const lines = await parseInput("9");
  const sequences = lines.map((line) => line.split(" ").map((num) => parseInt(num)));
  let sum = 0;
  for (const sequence of sequences) sum += getFinalSequenceNumber(sequence, [], false);
  return sum;
}

console.log(9.2, await main());
