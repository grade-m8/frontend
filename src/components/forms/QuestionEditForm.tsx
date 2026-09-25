import { useState } from "react";
import { ChevronDown, Trash2 } from "lucide-react";
import { AICallout } from "@/components/data-display/AICallout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DEFAULT_QUESTION_TYPE,
  QUESTION_TYPE_OPTIONS,
} from "@/lib/questionTypes";
import type { Question, QuestionType } from "@/types/exam.ts";
import type { QuestionCardProps } from "@/components/forms/QuestionCard";
import { Badge } from "@/components/ui/badge.tsx";

type QuestionEditFormProps = Pick<
  QuestionCardProps,
  "question" | "index" | "onSave" | "onDelete" | "onCancel"
>;

const ERROR_CLASS =
  "aria-invalid:border-danger-500 aria-invalid:ring-3 aria-invalid:ring-danger-500/20 dark:aria-invalid:border-danger-500 dark:aria-invalid:ring-danger-500/20";
const INPUT_CLASS = `h-10 rounded-md border border-b-2 border-neutral-900 bg-card px-3 text-body text-neutral-900 outline-none focus-visible:border-teal-600 ${ERROR_CLASS}`;
const SELECT_CLASS =
  "h-11 w-full cursor-pointer appearance-none rounded-md border border-b-2 border-neutral-900 bg-card px-3 pr-10 text-body text-neutral-900 outline-none";
const TEXTAREA_CLASS = `min-h-[90px] w-full resize-y rounded-md border border-neutral-300 bg-card p-3 text-body text-neutral-900 outline-none placeholder:text-neutral-650 focus-visible:ring-3 focus-visible:ring-ring/50 ${ERROR_CLASS}`;

function sanitizePointsInput(raw: string): string {
  const digitsAndDots = raw.replace(/[^\d.]/g, "");
  const firstDot = digitsAndDots.indexOf(".");
  if (firstDot === -1) return digitsAndDots;
  return (
    digitsAndDots.slice(0, firstDot + 1) +
    digitsAndDots.slice(firstDot + 1).replace(/\./g, "")
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-sm text-danger-500">
      {message}
    </p>
  );
}

function validateQuestion(draft: Question): Record<string, string> {
  const errors: Record<string, string> = {};
  if (draft.prompt.trim() === "")
    errors.prompt = "El enunciado no puede quedar vacío";
  if (!(draft.points > 0)) errors.points = "El puntaje debe ser mayor a 0";
  if (draft.idealAnswer.trim() === "")
    errors.idealAnswer = "La respuesta ideal no puede quedar vacía";
  return errors;
}

export function QuestionEditForm({
  question,
  index,
  onSave,
  onDelete,
  onCancel,
}: QuestionEditFormProps) {
  const [draft, setDraft] = useState<Question>(question);
  const [submitted, setSubmitted] = useState(false);
  const [pointsInput, setPointsInput] = useState(
    question.points === 0 ? "" : String(question.points),
  );

  const { questionId } = question;
  const errors = validateQuestion(draft);
  const visibleErrors: Record<string, string> = submitted ? errors : {};

  const updateDraft = (changes: Partial<Question>) =>
    setDraft((prev) => ({ ...prev, ...changes }));

  const handlePointsChange = (raw: string) => {
    const cleaned = sanitizePointsInput(raw);
    setPointsInput(cleaned);
    updateDraft({
      points: cleaned === "" || cleaned === "." ? 0 : Number(cleaned),
    });
  };

  const handleConfirm = () => {
    setSubmitted(true);
    if (Object.keys(errors).length > 0) return;
    onSave({
      ...draft,
      type: draft.type ?? DEFAULT_QUESTION_TYPE,
      title: draft.title.trim() || `Pregunta ${index}`,
    });
  };

  return (
    <div className="flex flex-col gap-6 rounded-lg border-2 border-teal-600 p-6 shadow-hard bg-surface-card">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <div className="flex items-center gap-3">
          <Badge className="flex items-center rounded bg-teal-900 px-2 py-1  font-bold text-white">
            P{index}
          </Badge>
          <span className="label-micro text-neutral-650">
            Editando pregunta…
          </span>
        </div>
        <div className="flex flex-row gap-2">
          <Label
            htmlFor={`question-points-${questionId}`}
            className="label-micro text-neutral-900"
          >
            Puntos
          </Label>
          <Input
            id={`question-points-${questionId}`}
            inputMode="numeric"
            value={pointsInput}
            onChange={(e) => handlePointsChange(e.target.value)}
            placeholder="0"
            aria-invalid={!!visibleErrors.points}
            aria-describedby={
              visibleErrors.points
                ? `question-points-error-${questionId}`
                : undefined
            }
            className={`${INPUT_CLASS} w-20 text-center font-bold`}
          />
          <FieldError
            id={`question-points-error-${questionId}`}
            message={visibleErrors.points}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label
          htmlFor={`question-title-${questionId}`}
          className="label-micro text-neutral-900"
        >
          Título de la pregunta
        </Label>
        <Input
          id={`question-title-${questionId}`}
          value={draft.title}
          onChange={(e) => updateDraft({ title: e.target.value })}
          placeholder="Título de la pregunta"
          className={INPUT_CLASS}
        />
        <Label
          htmlFor={`question-prompt-${questionId}`}
          className="label-micro text-neutral-900"
        >
          Enunciado de la pregunta
        </Label>
        <textarea
          id={`question-prompt-${questionId}`}
          value={draft.prompt}
          onChange={(e) => updateDraft({ prompt: e.target.value })}
          placeholder="Escriba la pregunta aquí..."
          aria-invalid={!!visibleErrors.prompt}
          aria-describedby={
            visibleErrors.prompt
              ? `question-prompt-error-${questionId}`
              : undefined
          }
          className={TEXTAREA_CLASS}
        />
        <FieldError
          id={`question-prompt-error-${questionId}`}
          message={visibleErrors.prompt}
        />
      </div>

      <div className="flex items-center gap-3">
        <Label
          htmlFor={`question-type-${questionId}`}
          className="label-micro text-neutral-900"
        >
          Tipo:
        </Label>
        <div className="relative w-56">
          <select
            id={`question-type-${questionId}`}
            value={draft.type ?? DEFAULT_QUESTION_TYPE}
            onChange={(e) =>
              updateDraft({ type: e.target.value as QuestionType })
            }
            className={SELECT_CLASS}
          >
            {QUESTION_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-neutral-650" />
        </div>
      </div>

      <AICallout
        mode="edit"
        value={draft.idealAnswer}
        onChange={(idealAnswer) => updateDraft({ idealAnswer })}
        error={visibleErrors.idealAnswer}
      />

      <div className="flex justify-end gap-3 pt-2">
        <Button
          variant="outline"
          size="lg"
          onClick={onCancel}
          className="border-teal-700 text-teal-700 hover:bg-teal-50"
        >
          Cancelar
        </Button>
        <Button
          variant="destructive"
          size="lg"
          onClick={() => onDelete(questionId)}
        >
          <Trash2 className="size-4" />
          Eliminar
        </Button>
        <Button size="lg" onClick={handleConfirm}>
          Confirmar
        </Button>
      </div>
    </div>
  );
}
