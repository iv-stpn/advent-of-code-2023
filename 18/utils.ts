export function shoelaceArea(nodes: [number, number][]) {
  let sum = 0;
  for (let idx = 0; idx < nodes.length - 1; idx++) {
    sum += nodes[idx][0] * nodes[idx + 1][1];
    sum -= nodes[idx][1] * nodes[idx + 1][0];
  }

  return Math.abs(sum) / 2;
}
