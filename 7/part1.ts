import { parseInput } from "../utils/utils";
import { calculateCardScore, parseCard } from "./utils";

export default async function main() {
  const lines = await parseInput("7");
  const cards = lines.map((line) => parseCard(line, calculateCardScore));
  cards.sort(([score1], [score2]) => score1 - score2);

  return cards.reduce((sum, [_, value], idx) => sum + value * (idx + 1), 0);
}

console.log(7.1, await main());
