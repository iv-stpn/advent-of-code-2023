import { parseInput } from "../utils/utils";

export default async function main() {
  const lines = await parseInput("19");
  console.log(lines);
  // Solution code here...
  return 0;
};

console.log(19.2, await main());

