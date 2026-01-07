import type { Comparison, ComparisonMap } from "../types/NormativeData";

export function parseComparisons(comparisons: Comparison[]): ComparisonMap {
  return comparisons.reduce((acc, curr) => {
    acc[curr.VARIABLE] = curr;
    return acc;
  }, {} as ComparisonMap);
}
