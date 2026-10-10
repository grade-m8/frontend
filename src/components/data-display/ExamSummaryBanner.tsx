import { Card } from "@/components/ui/card.tsx";

export interface ExamSummaryBannerProps {
  title: string;
  subtitle?: string;
  totalQuestions: number;
  totalPoints: number;
}

export function ExamSummaryBanner({
  title,
  subtitle,
  totalQuestions,
  totalPoints,
}: ExamSummaryBannerProps) {
  return (
    <Card className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 rounded-none border border-neutral-200 bg-neutral-100 p-6 ring-0 shadow-none">
      <div className="flex flex-col min-w-0">
        <h2
          title={title}
          className="text-h2 font-bold text-neutral-900 truncate"
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-neutral-650 mt-1">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <div className="flex flex-col items-center justify-center min-w-[120px] border border-neutral-300 bg-card px-4 py-3 text-center">
          <span className="text-micro uppercase tracking-wider text-neutral-600 font-bold">
            PREGUNTAS
          </span>
          <span className="text-h2 font-bold text-neutral-900 mt-1">
            {totalQuestions}
          </span>
        </div>

        <div className="flex flex-col items-center justify-center min-w-[120px] border border-neutral-300 bg-card px-4 py-3 text-center">
          <span className="text-micro uppercase tracking-wider text-neutral-600 font-bold">
            PUNTOS TOTALES
          </span>
          <span className="text-h2 font-bold text-neutral-900 mt-1">
            {totalPoints}
          </span>
        </div>
      </div>
    </Card>
  );
}
