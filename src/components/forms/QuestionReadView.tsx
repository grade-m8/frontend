import { Pencil, Trash2 } from "lucide-react";
import { AICallout } from "@/components/data-display/AICallout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getQuestionTypeOption } from "@/lib/questionTypes";
import type { QuestionCardProps } from "@/components/forms/QuestionCard";

type QuestionReadViewProps = Pick<
  QuestionCardProps,
  "question" | "index" | "onEdit" | "onDelete"
>;

export function QuestionReadView({
  question,
  index,
  onEdit,
  onDelete,
}: QuestionReadViewProps) {
  const typeOption = getQuestionTypeOption(question);

  return (
    <div className="border border-neutral-300 rounded-lg p-6 bg-surface-card shadow-soft space-y-4">
      <div className="flex items-start justify-between gap-4 border-b border-neutral-200 pb-4">
        <div className="flex flex-wrap items-center gap-3">
          <Badge
            variant="outline"
            className="h-6 rounded-md border-neutral-200 bg-neutral-100 px-2 font-label tracking-label text-neutral-900"
          >
            P{index}
          </Badge>
          <h3 className="text-body font-bold text-neutral-900">
            {question.title.trim() === ""
              ? "Pregunta sin título"
              : question.title}
          </h3>
          <Badge
            variant="outline"
            className="h-5.5 rounded-sm border-neutral-200 bg-card px-2 py-0.5 font-sans text-micro tracking-label text-neutral-650 uppercase"
          >
            {typeOption.badge}
          </Badge>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="text-sm font-semibold text-neutral-700">
            {question.points} Puntos
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Editar pregunta"
            onClick={() => onEdit(question.questionId)}
            className="text-neutral-650"
          >
            <Pencil className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Eliminar pregunta"
            onClick={() => onDelete(question.questionId)}
            className="text-danger-500"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-micro uppercase tracking-wider text-neutral-500 font-bold">
          Prompt / Enunciado
        </span>
        <p className="text-sm font-medium text-neutral-800 leading-relaxed">
          {question.prompt}
        </p>
      </div>

      <AICallout mode="view" value={question.idealAnswer} />
    </div>
  );
}
