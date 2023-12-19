// Utils of part 12

export function parseLine(line: string): [string, number[]] {
  const [initial, expectedGroups] = line.split(" ");
  return [initial, expectedGroups.split(",").map(group => parseInt(group, 10))];
}

// Old isInvalid
export function isInvalid(state: string, expectedGroups: number[], memo: Record<string, boolean>) {
  const closedIdx = state.indexOf("?");
  if (closedIdx === -1) return false;

  // If there is a # mismatch in any group before the first ?, it's invalid
  const closed = state.slice(0, closedIdx);
  const closedGroups = closed.match(/(#+)\.+/g)?.map(group => group.split("").filter(char => char != ".").length) ?? [];
  for (let i = 0; i < closedGroups.length; i++) if (closedGroups[i] !== expectedGroups[i]) return true;
  if (closedGroups.length === expectedGroups.length) return false; // Valid and complete

  // If there are more # in the next starting group than expected, it's invalid
  const startingGroup = RegExp(/#+$/).exec(closed)?.[0]?.length ?? 0;
  if (startingGroup > expectedGroups[closedGroups.length]) return true;

  const key = `${closedIdx},${closedGroups.length},${startingGroup}`;
  if (key in memo) return memo[key];

  // Ensure with a regex that the remaining # can be distributed in the remaining groups
  const remainingGroups = expectedGroups.slice(closedGroups.length + 1);
  const innerGroups = remainingGroups.map(group => `[.?]+[#?]{${group}}`).join("");

  const expectedStart = startingGroup > 0
    ? `[#?]{${expectedGroups[closedGroups.length] - startingGroup}}`
    : startingGroup === expectedGroups[closedGroups.length]
    ? ""
    : `[.?]*[#?]{${expectedGroups[closedGroups.length]}}`;
  const regex = new RegExp(`^${expectedStart}${innerGroups}[.?]*$`);

  const isInvalid = !regex.test(state.slice(closedIdx));
  memo[key] = isInvalid;
  return isInvalid;
}

// Optimized isInvalid
export type State = [state: string, idx: number, currentGroupIdx: number, currentGroupSize: number];
export function isInvalidOptimized(state: State, expectedGroups: number[]) {
  const [initial, currentIdx, currentGroupIdx, currentGroupSize] = state;
  return currentGroupSize + (initial[currentIdx] === "#" ? 1 : 0) > expectedGroups[currentGroupIdx];
}

export function isComplete(state: string, expectedGroups: number[]) {
  // We don't check for ? here, as any ? remaining would just have to be replaced by .
  const groups = state.match(/#+/g)?.map(group => group.length) ?? [];
  return groups.length === expectedGroups.length && expectedGroups.every((group, idx) => group === groups[idx]);
}

export function isCompleteOptimized(state: State, expectedGroups: number[]) {
  const [currentState, currentIdx, currentGroupIdx, currentGroupSize] = state;
  const remaining = currentState.slice(currentIdx);
  return currentGroupIdx === expectedGroups.length - 1 && currentGroupSize === expectedGroups[currentGroupIdx]
    && !remaining.includes("#");
}

export function next(state: string, candidate: string) {
  const nextEmpty = state.indexOf("?");
  if (nextEmpty === -1) return null;
  return state.slice(0, nextEmpty) + candidate + state.slice(nextEmpty + 1);
}

export function recursiveWithCountMemoize(
  state: State,
  expectedGroups: number[],
  memo: Record<string, number>,
): number {
  const [initial, currentIdx, currentGroup, currentGroupSize] = state;
  const key = `${currentIdx},${currentGroup},${currentGroupSize}`;
  if (key in memo) return memo[key];

  if (currentIdx === initial.length) {
    if (currentGroup === expectedGroups.length - 1 && currentGroupSize === expectedGroups[currentGroup]) return 1;
    if (currentGroup === expectedGroups.length && currentGroupSize === 0) return 1;
    return 0;
  }

  let count = 0;
  for (const candidate of ["#", "."]) {
    if (initial[currentIdx] === "?" || initial[currentIdx] === candidate) {
      if (candidate === ".") {
        if (currentGroupSize === 0) {
          const next: State = [initial, currentIdx + 1, currentGroup, 0];
          count += recursiveWithCountMemoize(next, expectedGroups, memo);
        }
        if (currentGroup >= expectedGroups.length) continue;
        if (currentGroupSize !== expectedGroups[currentGroup]) continue;
        const next: State = [initial, currentIdx + 1, currentGroup + 1, 0];
        count += recursiveWithCountMemoize(next, expectedGroups, memo);
      }

      const next: State = [initial, currentIdx + 1, currentGroup, currentGroupSize + 1];
      count += recursiveWithCountMemoize(next, expectedGroups, memo);
    }
  }

  memo[key] = count;
  return count;
}
