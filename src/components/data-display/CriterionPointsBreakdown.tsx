import { Badge } from "@/components/ui/badge";
import {
  computeCriterionMaxPoints,
  computeCriterionShares,
} from "@/lib/rubricPoints";
import type { RubricCriterion } from "@/types/exam.ts";

export interface CriterionPointsBreakdownProps {
  criteria: RubricCriterion[];
  questionPoints?: number; // si viene y es > 0, muestra los puntos además del %
  variant?: "full" | "compact"; // por defecto "full"
}

const EMPTY_TITLE = "Criterio sin título";

function formatNumber(value: number): string {
  return value.toLocaleString("es-AR", { maximumFractionDigits: 2 });
}

export function CriterionPointsBreakdown({
  criteria,
  questionPoints,
  variant = "full",
}: CriterionPointsBreakdownProps) {
  if (criteria.length === 0) return null;

  const sorted = [...criteria].sort((a, b) => a.order - b.order);
  const shares = computeCriterionShares(sorted);
  const showPoints = questionPoints !== undefined && questionPoints > 0;
  const maxPoints = showPoints
    ? computeCriterionMaxPoints(questionPoints, sorted)
    : null;

  if (variant === "compact") {
    return (
      <div className="flex flex-wrap gap-2">
        {sorted.map((criterion) => {
          const title = criterion.title.trim() || EMPTY_TITLE;
          const percentage = Math.round(
            (shares.get(criterion.criterionId) ?? 0) * 100,
          );
          const points = maxPoints?.get(criterion.criterionId) ?? 0;
          return (
            <Badge
              key={criterion.criterionId}
              variant="outline"
              className="max-w-full"
            >
              {title} ·{" "}
              {showPoints
                ? `hasta ${formatNumber(points)} pts`
                : `${formatNumber(percentage)} %`}
            </Badge>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 border border-neutral-300 bg-neutral-50 p-5">
      <h4 className="label-micro text-neutral-650">
        Reparto del puntaje según la rúbrica
      </h4>

      <ul className="flex flex-col divide-y divide-neutral-300">
        {sorted.map((criterion) => {
          const hasTitle = criterion.title.trim() !== "";
          const title = hasTitle ? criterion.title : EMPTY_TITLE;
          const percentage = Math.round(
            (shares.get(criterion.criterionId) ?? 0) * 100,
          );
          const points = maxPoints?.get(criterion.criterionId) ?? 0;
          return (
            <li
              key={criterion.criterionId}
              className="flex flex-col gap-1.5 py-3 first:pt-0 last:pb-0"
            >
              <div className="flex items-baseline justify-between gap-4 text-sm">
                <span
                  className={`min-w-0 break-words ${
                    hasTitle
                      ? "font-bold text-neutral-900"
                      : "italic text-neutral-650"
                  }`}
                >
                  {title}
                </span>
                <span className="shrink-0 text-neutral-900">
                  {formatNumber(percentage)} %
                  {showPoints && (
                    <span className="text-neutral-650">
                      {" "}
                      · hasta {formatNumber(points)} pts
                    </span>
                  )}
                </span>
              </div>
              <div
                role="meter"
                aria-valuenow={percentage}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Peso de ${title}`}
                className="h-1.5 w-full bg-neutral-200"
              >
                <div
                  className="h-full bg-teal-700"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>

      <p className="text-xs text-neutral-650">
        La IA no puede asignar a un criterio más puntos que su máximo.
      </p>
    </div>
  );
}
