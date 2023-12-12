import { parseInput } from "../utils/utils";
import { parseDigitsAndMatchAfterSeparator, sliceStart } from "./utils";

function initCounts(lineCount: number) {
  const counts: Record<number, number> = {};
  for (let i = 1; i < lineCount + 1; i++) counts[i] = 1;
  return counts;
}

export default async function main() {
  const lines = await parseInput("4");
  const counts = initCounts(lines.length);

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines.at(lineIdx);
    if (!line) throw new Error(`Invalid input, line ${lineIdx} is empty.`);

    let offsetNext = 1;
    parseDigitsAndMatchAfterSeparator(sliceStart(line), (digits, number) => {
      if (digits.includes(number)) {
        if ((lineIdx + offsetNext) in counts) counts[lineIdx + offsetNext] += counts[lineIdx];
        offsetNext++;
      }
    });
  }

  return Object.values(counts).reduce((sum, current) => sum + current, 0);
}

console.log(4.2, await main());
