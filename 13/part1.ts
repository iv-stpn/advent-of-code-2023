import { parseInput } from "../utils/utils";

export default async function main() {
  const lines = await parseInput("13");
  console.log(lines);
  // Solution code here...
  return 0;
};

console.log(13.1, await main());
