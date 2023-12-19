import { parseInput } from "../utils/utils";
import { parseConfigAndGetNextRules } from "./utils";

export default async function main() {
  const lines = await parseInput("19");
  const [rules, items] = parseConfigAndGetNextRules(lines);

  const start = rules["in"];
  if (!start) throw new Error("No start rule found");

  return items.reduce(
    (acc, item) => acc + (start(item) ? Object.values(item).reduce((sum, curr) => sum + curr, 0) : 0),
    0,
  );
}

console.log(19.1, await main());
