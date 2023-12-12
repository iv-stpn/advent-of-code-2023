import { parseInput } from "../utils/utils";
import { parseDigitsAndMatchAfterSeparator, sliceStart } from "./utils";

export default async function main() {
  const lines = await parseInput("4");
  let sum = 0;
  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines.at(lineIdx);
    if (!line) throw new Error(`Invalid input, line ${lineIdx} is empty.`);

    let pointValue = 0;
    parseDigitsAndMatchAfterSeparator(sliceStart(line), (digits, number) => {
      if (digits.includes(number)) pointValue = pointValue ? pointValue * 2 : 1;
    });
    sum += pointValue;
  }
  return sum;
}

console.log(4.1, await main());
