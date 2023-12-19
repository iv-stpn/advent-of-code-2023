import { parseInput } from "../utils/utils";
import { ItemType, Operator, parseRules, RuleStep } from "./utils";

type Range = [low: number, high: number];
type AllowedRangeQueue = [rules: RuleStep[], Record<ItemType, Range>][];

const getRule = (rules: Record<string, RuleStep[]>, ruleName: string): RuleStep[] => {
  if (!(ruleName in rules)) throw new Error(`Rule ${ruleName} not found`);
  return rules[ruleName];
};

export default async function main() {
  const lines = await parseInput("19");
  const rules = parseRules(lines);

  function filterRange(range: Range, operator: Operator, value: number, strict: boolean = false): Range {
    if (operator === "<") return [range[0], Math.min(range[1], value - (strict ? 1 : 0))];
    if (operator === ">") return [Math.max(range[0], value + (strict ? 1 : 0)), range[1]];
    throw new Error(`Invalid operator ${operator}`);
  }

  const validRanges: Record<ItemType, Range>[] = [];

  const queue: AllowedRangeQueue = [[getRule(rules, "in"), { x: [1, 4000], m: [1, 4000], a: [1, 4000], s: [1, 4000] }]];

  while (queue.length) {
    const current = queue.shift();
    if (!current) throw new Error("Queue is empty");

    const [currentRules, ranges] = current;
    for (const rule of currentRules) {
      if (typeof rule === "string") {
        if (rule === "A") validRanges.push(ranges);
        else if (rule !== "R") queue.push([getRule(rules, rule), ranges]);
        break; // Should be the last rule
      }

      const { itemType, operator, value, nextRule } = rule;
      const newRange = filterRange(ranges[itemType], operator, value, true);
      if (newRange[0] < newRange[1]) {
        const newRanges = { ...ranges, [itemType]: newRange };
        if (nextRule === "A") validRanges.push(newRanges);
        else if (nextRule !== "R") queue.push([getRule(rules, nextRule), newRanges]);
      }

      const oppositeRange = filterRange(ranges[itemType], operator === "<" ? ">" : "<", value);
      ranges[itemType] = oppositeRange;

      if (oppositeRange[0] > oppositeRange[1]) continue;
    }
  }

  return validRanges.reduce((acc, range) => {
    const { x, m, a, s } = range;
    return acc + (x[1] - x[0] + 1) * (m[1] - m[0] + 1) * (a[1] - a[0] + 1) * (s[1] - s[0] + 1);
  }, 0);
}

console.log(19.2, await main());
