// Utils of part 19

export type Operator = "<" | ">";
const isOperator = (value: string): value is Operator => ["<", ">"].includes(value);

export type RuleStep = string | { itemType: ItemType; operator: Operator; value: number; nextRule: string };
export type ItemType = "x" | "m" | "a" | "s";
export type Item = Record<ItemType, number>;

const isItemType = (value: string): value is ItemType => ["x", "m", "a", "s"].includes(value);

export function parseItem(line: string): Item {
  const item: Item = { x: 0, m: 0, a: 0, s: 0 };
  const items = line.slice(1, -1).split(",").map(item => item.split("="));
  for (const [type, value] of items) {
    if (!isItemType(type)) throw new Error(`${line}: Invalid item type ${type}`);
    item[type] = parseInt(value);
    if (isNaN(item[type])) throw new Error(`${line}: Invalid item value ${value}`);
  }

  return item;
}

export function parseRuleStep(step: string): RuleStep {
  const [condition, nextRule] = step.split(":");
  if (nextRule) {
    const itemType = condition[0];
    if (!isItemType(itemType)) throw new Error(`Invalid item type ${itemType}`);
    const operator = condition[1];
    if (!isOperator(operator)) throw new Error(`Invalid operator ${operator}`);
    const value = parseInt(condition.slice(2));
    return { itemType, operator, value, nextRule };
  }
  return condition;
}

export function parseRules(lines: string[]): Record<string, RuleStep[]> {
  const rules: Record<string, RuleStep[]> = {};

  for (const line of lines) {
    if (line && !line.startsWith("{")) {
      const [name, rulesString] = line.slice(0, -1).split("{");
      rules[name] = rulesString.split(",").map(parseRuleStep);
    }
  }

  return rules;
}

export function parseConfigAndGetNextRules(lines: string[]): [Record<string, (item: Item) => boolean>, Item[]] {
  const rules: Record<string, (item: Item) => boolean> = {};
  const items: Item[] = [];

  function processNextRule(rule: string, item: Item) {
    if (rule === "A") return true;
    if (rule === "R") return false;
    if (rule in rules) return rules[rule](item);
    throw new Error(`Rule ${rule} not found`);
  }

  for (const line of lines) {
    if (line.startsWith("{")) items.push(parseItem(line));
    else if (line) {
      const [name, rulesString] = line.slice(0, -1).split("{");
      const ruleSteps = rulesString.split(",").map(parseRuleStep);

      rules[name] = (item) => {
        for (const ruleStep of ruleSteps) {
          if (typeof ruleStep === "string") return processNextRule(ruleStep, item);

          const { itemType, operator, value, nextRule } = ruleStep;
          if (operator === "<" && item[itemType] < value) return processNextRule(nextRule, item);
          if (operator === ">" && item[itemType] > value) return processNextRule(nextRule, item);
        }
        throw new Error(`No final rule found for ${name}`);
      };
    }
  }

  return [rules, items];
}
