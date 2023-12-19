import { parseInput } from "../utils/utils";
import { hash } from "./utils";

const hashmap: Record<string, number> = {};
const boxes: Record<number, [string, number][]> = {};

const hashMemo = (key: string) => {
  if (key in hashmap) return hashmap[key];
  const value = hash(key);
  hashmap[key] = value;
  return value;
};

const updateBox = (box: number, label: string, count: number | null) => {
  if (box in boxes) {
    if (count) {
      const data = boxes[box].find((data) => data[0] === label);
      if (data) data[1] = count;
      else boxes[box].push([label, count]);
    } else boxes[box] = boxes[box].filter((data) => data[0] !== label);
  } else if (count) {
    boxes[box] = [[label, count]];
  }
};

export default async function main() {
  const lines = await parseInput("15");
  const strings = lines[0].split(",");
  for (const string of strings) {
    const [label, count] = string.split(/[-=]/);
    const box = hashMemo(label);
    updateBox(box, label, count ? parseInt(count) : null);
  }

  return Object.entries(boxes).reduce((sum, [box, data]) => {
    for (let dataIdx = 0; dataIdx < data.length; dataIdx++) {
      const [_, count] = data[dataIdx];
      sum += (parseInt(box) + 1) * (dataIdx + 1) * count;
    }
    return sum;
  }, 0);
}

console.log(15.2, await main());
