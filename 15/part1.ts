import { parseInput } from "../utils/utils";
import { hash } from "./utils";

export default async function main() {
  const lines = await parseInput("15");
  const strings = lines[0].split(",");
  return strings.reduce((sum, string) => sum + hash(string), 0);
}

console.log(15.1, await main());
