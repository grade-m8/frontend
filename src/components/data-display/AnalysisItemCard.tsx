import type { AnalysisItem } from "@/types/audit.ts";
import { cn } from "@/lib/utils";

export interface AnalysisItemCardProps {
  item: AnalysisItem;
}

export function AnalysisItemCard({ item }: AnalysisItemCardProps) {
  const isPositive = item.points > 0;
  const formattedPoints = isPositive
    ? `+${item.points} pts`
    : `${item.points} pts`;

  return (
    <div
      className={cn(
        "flex flex-row items-start justify-between gap-4 pl-4 py-0 border-l-4 transition-all",
        isPositive ? "border-l-teal-400" : "border-l-danger-500",
      )}
    >
      {/* Columna de texto */}
      <div className="flex flex-1 flex-col gap-1">
        <h3 className="text-base font-bold text-neutral-900">{item.title}</h3>
        <p className="text-sm text-neutral-650 leading-relaxed">
          {item.description}
        </p>
      </div>

      {/* Badge de puntos */}
      <div
        className={cn(
          "shrink-0 text-sm font-medium tracking-tight whitespace-nowrap px-2 py-0.5 rounded-md",
          isPositive
            ? "text-teal-700 bg-transparent"
            : "bg-danger-100 text-danger-800",
        )}
      >
        {formattedPoints}
      </div>
    </div>
  );
}
