import { parseInput } from "../utils/utils";

export default async function main() {
  const lines = await parseInput("18");
  console.log(lines);
  // Solution code here...
  return 0;
};

console.log(18.1, await main());
