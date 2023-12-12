import { parseInput } from "../utils/utils";

export default async function main() {
  const lines = await parseInput("9");
  console.log(lines);
  // Solution code here...
  return 0;
};

console.log(9.2, await main());

