import { parseInput } from "../utils/utils";

export default async function main() {
  const lines = await parseInput("17");
  console.log(lines);
  // Solution code here...
  return 0;
};

console.log(17.2, await main());

