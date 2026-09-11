export type CriterionWeight = "high" | "medium" | "low";

export interface RubricCriterion {
  criterionId: string;
  title: string;
  weight: CriterionWeight;
  weightPercentage: number;
  guidance: string;
  order: number;
}
