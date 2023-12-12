import { parseInput } from "../utils/utils";
import { getDestination, parseConfig } from "./utils";

export default async function main() {
  const lines = await parseInput("5");
  const [[first, ...others], mapSets] = parseConfig(lines);

  let minDestination = getDestination(first, mapSets);
  for (const other of others) {
    const destination = getDestination(other, mapSets);
    if (destination < minDestination) minDestination = destination;
  }

  console.log(
    JSON.stringify([getDestination(first, mapSets), ...others.map((value) => getDestination(value, mapSets))], null, 2),
  );

  return minDestination;
}

console.log(5.1, await main());
