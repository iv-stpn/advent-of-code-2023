// Utils of part 8

type Direction = "R" | "L";

const isDirections = (directions: string[]): directions is Direction[] =>
  directions.every((direction) => direction === "R" || direction === "L");

export function parseConfig(lines: string[]): [Direction[], Record<string, string>, Record<string, string>] {
  const [directionsLine, _emptyLine, ...nodeLines] = lines;

  const directions = directionsLine.split("");
  if (!isDirections(directions)) throw new Error(`Invalid directions: ${directions}, expected only R or L`);

  const leftNodes: Record<string, string> = {};
  const rightNodes: Record<string, string> = {};

  // AAA = (BBB, CCC)
  for (const nodeLine of nodeLines) {
    const current = nodeLine.slice(0, 3);
    const nextLeft = nodeLine.slice(7, 10);
    const nextRight = nodeLine.slice(12, 15);

    leftNodes[current] = nextLeft;
    rightNodes[current] = nextRight;
  }
  return [directions, leftNodes, rightNodes];
}
