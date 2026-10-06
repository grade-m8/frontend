import type { StudentQuestion } from "@/types/exam.ts";
import { Card } from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge.tsx";

export interface QuestionAnswerCardProps {
  question: StudentQuestion;
  position: number;
  total: number;
  answer: string;
  onAnswerChange: (text: string) => void;
  disabled?: boolean;
  error?: string;
}

export function QuestionAnswerCard({
  question,
  position,
  total,
  answer,
  onAnswerChange,
  disabled = false,
  error,
}: QuestionAnswerCardProps) {
  const textareaId = `answer-${question.questionId}`;
  const errorId = `error-${question.questionId}`;

  return (
    <div className="flex w-full flex-col">
      {/* 1. Contenedor exterior de la tarjeta (padding-bottom: 24px) */}
      <div className="w-full pb-6">
        {/* 2. Tarjeta de la pregunta */}
        <Card className="relative flex w-full flex-col gap-6 overflow-hidden rounded-none border border-neutral-200 bg-neutral-50 p-6 shadow-soft ring-0">
          {/* 2.1 Indicador en la esquina superior derecha */}
          <Badge
            variant="outline"
            className="absolute top-0 right-0 h-auto rounded-none border-t-0 border-r-0 border-b border-l border-neutral-500 bg-neutral-200 px-3 py-1 font-label text-label font-medium tracking-label text-neutral-600"
          >
            Pregunta {position} de {total}
          </Badge>

          {/* 2.2 Contenedor del contenido */}
          <div className="flex flex-col gap-4">
            {/* 1. Header / Título */}
            <div className="w-full pr-32">
              <h2 className="font-sans text-h2 font-semibold text-neutral-900">
                {position}. {question.title}
              </h2>
            </div>

            {/* 2. Description / Consigna */}
            <div className="w-full max-w-4xl">
              <p className="font-sans text-h3 font-normal text-neutral-600 whitespace-pre-wrap">
                {question.prompt}
              </p>
            </div>

            {/* 3. Tag / Chip */}
            <div className="w-full pt-2">
              <Badge
                variant="outline"
                className="inline-flex h-5.5 w-fit items-center rounded-none border border-neutral-300 bg-neutral-200 px-2 py-1 font-label text-label font-medium tracking-label text-neutral-700"
              >
                Valor: {question.points} pts
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* 4. Cuadro de respuesta (Accesible y controlado) */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor={textareaId} className="sr-only">
          Respuesta para la pregunta {position}: {question.title}
        </label>

        <textarea
          id={textareaId}
          rows={12}
          value={answer}
          disabled={disabled}
          onChange={(e) => onAnswerChange(e.target.value)}
          placeholder="Ingrese su análisis detallado aquí…"
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`min-h-72 w-full resize-y rounded-md border p-6 font-sans text-body text-neutral-900 outline-none transition-colors placeholder:text-neutral-500 focus:ring-2 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-500 ${
            error
              ? "border-danger-500 bg-neutral-50 focus:border-danger-500 focus:ring-danger-200"
              : "border-neutral-900 bg-neutral-50 focus:border-teal-700 focus:ring-teal-700/20"
          }`}
        />

        {error && (
          <p id={errorId} className="text-sm font-medium text-danger-500">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
