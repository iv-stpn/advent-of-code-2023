// Utils of part 13

export function linesToGrid(lines: string[]): string[][] {
  lines.push("");

  const grids = [];
  let currentGrid: string[] = [];
  for (const line of lines) {
    if (line === "" || line === "\n") {
      grids.push(currentGrid);
      currentGrid = [];
    } else currentGrid.push(line);
  }

  return grids;
}

export function findReflecting(grid: string[], old = "") {
  for (let offset = 1; offset < grid.length; offset++) {
    if (isReflecting(grid, offset, "x") && old !== `x${offset}`) return `x${offset}`;
  }
  for (let offset = 1; offset < grid[0].length; offset++) {
    if (isReflecting(grid, offset, "y") && old !== `y${offset}`) return `y${offset}`;
  }
  return null;
}

export function findNewReflecting(grid: string[]) {
  const copy = grid.map(line => line);
  const reflecting = findReflecting(grid);
  if (!reflecting) return null;

  for (let lineIdx = 0; lineIdx < grid.length; lineIdx++) {
    for (let colIdx = 0; colIdx < grid[lineIdx].length; colIdx++) {
      // Flip
      const newChar = copy[lineIdx][colIdx] === "#" ? "." : "#";
      copy[lineIdx] = copy[lineIdx].slice(0, colIdx) + newChar + copy[lineIdx].slice(colIdx + 1);

      const newReflecting = findReflecting(copy, reflecting);
      if (newReflecting) return newReflecting;

      // Clean up
      copy[lineIdx] = grid[lineIdx];
    }
  }
}

export function isReflecting(grid: string[], offset: number, axis: "x" | "y") {
  if (axis === "x") {
    const diff = offset < grid.length / 2 ? offset : grid.length - offset;

    for (let colIdx = 0; colIdx < grid[offset].length; colIdx++) {
      for (let lineIdx = 0; lineIdx < diff; lineIdx++) {
        if (grid[(offset - 1) - lineIdx][colIdx] !== grid[offset + lineIdx][colIdx]) return false;
      }
    }
    return true;
  } else {
    const diff = offset < grid[0].length / 2 ? offset : grid[0].length - offset;

    for (let lineIdx = 0; lineIdx < grid.length; lineIdx++) {
      for (let colIdx = 0; colIdx < diff; colIdx++) {
        if (grid[lineIdx][(offset - 1) - colIdx] !== grid[lineIdx][offset + colIdx]) return false;
      }
    }
    return true;
  }
}
