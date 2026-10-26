import type { RubricCriterion } from "@/types/exam.ts";
import { CriterionPointsBreakdown } from "@/components/data-display/CriterionPointsBreakdown.tsx";

interface RubricWeightSummaryProps {
  criteria: RubricCriterion[];
}

export default function RubricWeightSummary({
  criteria,
}: RubricWeightSummaryProps) {
  return (
    <div className="flex flex-col gap-2">
      <CriterionPointsBreakdown criteria={criteria} variant="full" />
      <p className="text-xs text-neutral-650">
        El peso indica la importancia relativa: el puntaje de cada pregunta se
        reparte en proporción a estos porcentajes.
      </p>
    </div>
  );
}
