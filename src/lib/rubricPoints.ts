import type { RubricCriterion } from "@/types/exam.ts";

type WeightedCriterion = Pick<
  RubricCriterion,
  "criterionId" | "weightPercentage"
>;

/**
 * Share (0..1, unrounded) of each criterion over the sum of all weights.
 * If the weights sum to 0 or less, every criterion gets an equal share.
 * Same formula as the backend.
 */
export function computeCriterionShares(
  criteria: WeightedCriterion[],
): Map<string, number> {
  const shares = new Map<string, number>();
  if (criteria.length === 0) return shares;

  const totalWeight = criteria.reduce((sum, c) => sum + c.weightPercentage, 0);

  for (const criterion of criteria) {
    shares.set(
      criterion.criterionId,
      totalWeight > 0
        ? criterion.weightPercentage / totalWeight
        : 1 / criteria.length,
    );
  }
  return shares;
}

/**
 * Max points the AI can award to each criterion: question points × share,
 * rounded to 2 decimals.
 */
export function computeCriterionMaxPoints(
  questionPoints: number,
  criteria: WeightedCriterion[],
): Map<string, number> {
  const maxPoints = new Map<string, number>();

  for (const [criterionId, share] of computeCriterionShares(criteria)) {
    maxPoints.set(criterionId, Math.round(questionPoints * share * 100) / 100);
  }
  return maxPoints;
}
