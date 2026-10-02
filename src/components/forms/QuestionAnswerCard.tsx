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
        <Card className="relative flex w-full flex-col gap-6 overflow-hidden rounded-none border border-[#E0E0E0] bg-[#FAF9F8] p-6 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] ring-0">
          {/* 2.1 Indicador en la esquina superior derecha */}
          <Badge
            variant="outline"
            className="absolute top-0 right-0 h-auto rounded-none border-t-0 border-r-0 border-b border-l border-[#707978] bg-[#E2DFDE] px-3 py-1 font-label text-[12px] font-medium leading-[12px] tracking-[0.6px] text-[#636262]"
          >
            Pregunta {position} de {total}
          </Badge>

          {/* 2.2 Contenedor del contenido */}
          <div className="flex flex-col gap-4">
            {/* 1. Header / Título */}
            <div className="w-full pr-32">
              <h2 className="font-sans text-[24px] font-semibold leading-[31.2px] tracking-normal text-[#1A1C1C]">
                {position}. {question.title}
              </h2>
            </div>

            {/* 2. Description / Consigna */}
            <div className="w-full max-w-[896px] pb-[0.6px]">
              <p className="font-sans text-[18px] font-normal leading-[28.8px] tracking-normal text-[#5F5E5E] whitespace-pre-wrap">
                {question.prompt}
              </p>
            </div>

            {/* 3. Tag / Chip */}
            <div className="w-full pt-2">
              <Badge
                variant="outline"
                className="inline-flex h-[22px] w-fit items-center rounded-none border border-[#BFC8C8] bg-[#E3E2E1] px-2 py-1 font-label text-[12px] font-medium leading-[12px] tracking-[0.6px] text-[#404848]"
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
          className={`h-[434px] min-h-[434px] w-full resize-y rounded-md border p-6 font-sans text-body text-neutral-900 outline-none transition-colors placeholder:text-neutral-500 focus:ring-2 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-500 ${
            error
              ? "border-danger-500 bg-[#FAF9F8] focus:border-danger-500 focus:ring-danger-200"
              : "border-[#0A0A0A] bg-[#FAF9F8] focus:border-teal-700 focus:ring-teal-700/20"
          }`}
        />

        {error && (
          <p id={errorId} className="text-xs font-medium text-danger-600">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
