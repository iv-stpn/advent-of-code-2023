import { parseInput } from "../utils/utils";
import { chars, followOffset, invertDirection, isState, offsets, parseGraph, printGrid, propagateNode } from "./utils";

export default async function main() {
  const lines = await parseInput("10");
  const [, nodes] = parseGraph(lines);

  const columnCount = lines[0].length;
  for (let charIdx = 0; charIdx < columnCount; charIdx++) {
    if (!nodes.some(([lineIdx, colIdx]) => lineIdx === 0 && colIdx === charIdx)) {
      propagateNode([0, charIdx], lines, nodes, "O");
    }

    if (!nodes.some(([lineIdx, colIdx]) => lineIdx === lines.length - 1 && colIdx === columnCount - charIdx)) {
      propagateNode([0, columnCount - charIdx], lines, nodes, "O");
    }
  }

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    if (!nodes.some(([nodeLineIdx, nodeCharIdx]) => nodeLineIdx === lineIdx && nodeCharIdx === 0)) {
      propagateNode([lineIdx, 0], lines, nodes, "O");
    }

    if (!nodes.some(([nodeLineIdx, nodeCharIdx]) => nodeLineIdx === lineIdx && nodeCharIdx === columnCount - 1)) {
      propagateNode([lineIdx, columnCount - 1], lines, nodes, "O");
    }
  }

  for (let lineIdx = 1; lineIdx < lines.length; lineIdx++) {
    const line = lines.at(lineIdx);
    if (!line) throw new Error(`Invalid input, line ${lineIdx} is empty.`);
    for (let charIdx = 1; charIdx < lines[lineIdx].length; charIdx++) {
      const char = line.charAt(charIdx);
      if (isState(char) || nodes.some((node) => node[0] === lineIdx && node[1] === charIdx)) continue;
      console.log("Finding a state for", lineIdx, charIdx);

      // The current node must be surrounded by a loop node, otherwise it would have been propagated
      for (const offset of offsets) {
        const offsetLineIdx = lineIdx + offset[0];
        const offsetCharIdx = charIdx + offset[1];

        const offsetChar = lines.at(offsetLineIdx)?.charAt(offsetCharIdx);
        if (offsetChar && chars.includes(offsetChar)) {
          const state = followOffset([offsetLineIdx, offsetCharIdx], invertDirection(offset), lines, nodes);
          console.log(`Found ${state} at ${lineIdx}, ${charIdx}`);
          propagateNode([lineIdx, charIdx], lines, nodes, state);
          break;
          // return;
        }
      }
    }
  }

  printGrid(lines, nodes);

  return lines.reduce((acc, line) => acc + line.split("").filter((char) => char === "I").length, 0);
}

console.log(10.2, await main());
