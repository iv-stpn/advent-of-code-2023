// Utils of part 7

import { groupByCount } from "../utils/utils";

function getValue(char: string, jokerMode = false): number {
  if (char === "A") return 12;
  if (char === "K") return 11;
  if (char === "Q") return 10;
  if (char === "J") return jokerMode ? 0 : 9;
  if (char === "T") return jokerMode ? 9 : 8;
  return parseInt(char) - (jokerMode ? 1 : 2);
}

const valuesMapLength = 13; // Base of the number system

export function parseCard(line: string, calculateScore: (card: string) => number): [value: number, score: number] {
  const [card, score] = line.split(" ");
  return [calculateScore(card), parseInt(score)];
}

function getHandType(labels: number[]) {
  if (labels.includes(5)) return 7;
  if (labels.includes(4)) return 6;
  if (labels.includes(3) && labels.includes(2)) return 5;
  if (labels.includes(3)) return 4;
  if (labels.filter((count) => count === 2).length > 1) return 3;
  if (labels.includes(2)) return 2;
  return 1;
}

const cardLength = 5; // "AAAAA"
export function calculateCardScore(card: string, jokerMode = false): number {
  let labelCounts: number[];

  const labels = groupByCount(card.split(""), label => label);
  if (jokerMode && labels["J"]) {
    const { J: jokerCount, ...otherLabels } = labels;

    const [first, ...rest] = Object.entries(otherLabels).toSorted(([, count1], [, count2]) => count2 - count1);
    const firstCount = first ? first[1] : 0;
    const restCounts = rest.map(([, count]) => count);

    labelCounts = [firstCount + jokerCount, ...restCounts];
  } else {
    labelCounts = Object.entries(labels).map(([, count]) => count);
  }

  let value = getHandType(labelCounts) * Math.pow(valuesMapLength, cardLength);
  for (let i = cardLength - 1; i >= 0; i--) {
    value += getValue(card[(cardLength - 1) - i], jokerMode) * Math.pow(valuesMapLength, i);
  }

  return value;
}
