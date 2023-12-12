import { parseInput } from "../utils/utils";

export default async function main() {
  const lines = await parseInput("7");
  console.log(lines);
  // Solution code here...
  return 0;
};

console.log(7.2, await main());

