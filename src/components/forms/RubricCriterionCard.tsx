import { useState } from "react";
import { ChevronDown, Info, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CriterionWeight, RubricCriterion } from "@/types/exam";

interface RubricCriterionCardProps {
  criterion: RubricCriterion;
  onUpdate: (criterionId: string, changes: Partial<RubricCriterion>) => void;
  onRemove: (criterionId: string) => void;
  canRemove: boolean;
}

const WEIGHT_OPTIONS: {
  value: CriterionWeight;
  name: string;
  percentage: number;
}[] = [
  { value: "high", name: "Alto", percentage: 40 },
  { value: "medium", name: "Medio", percentage: 20 },
  { value: "low", name: "Bajo", percentage: 10 },
];

const LABEL_CLASS = "label-micro text-neutral-650";
const ERROR_CLASS =
  "aria-invalid:border-danger-500 aria-invalid:ring-3 aria-invalid:ring-danger-500/20 dark:aria-invalid:border-danger-500 dark:aria-invalid:ring-danger-500/20";
const UNDERLINE_CLASS = `h-10.5 rounded-none border-0 border-b-2 border-neutral-200 bg-transparent px-0 py-2 text-base text-neutral-900 focus-visible:border-teal-700 focus-visible:ring-0 md:text-base dark:bg-transparent ${ERROR_CLASS}`;
const SELECT_CLASS =
  "h-10.5 w-full cursor-pointer appearance-none rounded-none border-0 border-b-2 border-neutral-200 bg-transparent py-2 pr-10 text-base text-neutral-900 outline-none focus-visible:border-teal-700";
const TEXTAREA_CLASS = `h-24 w-full resize-y border border-neutral-650 bg-card p-3 text-base text-neutral-900 outline-none placeholder:text-muted-foreground focus-visible:border-teal-700 focus-visible:ring-3 focus-visible:ring-ring/50 ${ERROR_CLASS}`;

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-sm text-danger-500">
      {message}
    </p>
  );
}

export function RubricCriterionCard({
  criterion,
  onUpdate,
  onRemove,
  canRemove,
}: RubricCriterionCardProps) {
  const { criterionId } = criterion;
  const [touched, setTouched] = useState({ title: false, guidance: false });

  const titleError =
    touched.title && criterion.title.trim() === ""
      ? "El criterio no puede quedar vacío"
      : undefined;
  const guidanceError =
    touched.guidance && criterion.guidance.trim() === ""
      ? "La descripción no puede quedar vacía"
      : undefined;

  const handleWeightChange = (value: string) => {
    const option = WEIGHT_OPTIONS.find((o) => o.value === value);
    if (!option) return;
    onUpdate(criterionId, {
      weight: option.value,
      weightPercentage: option.percentage,
    });
  };

  return (
    <div className="relative flex flex-col gap-4 border border-neutral-650 bg-card p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-6 md:pr-[8%]">
        <div className="flex flex-1 flex-col gap-2">
          <Label
            htmlFor={`criterion-title-${criterionId}`}
            className={LABEL_CLASS}
          >
            Criterio de evaluación
          </Label>
          <Input
            id={`criterion-title-${criterionId}`}
            value={criterion.title}
            onChange={(e) => onUpdate(criterionId, { title: e.target.value })}
            onBlur={() => setTouched((prev) => ({ ...prev, title: true }))}
            placeholder="Ej. Rigor Técnico y Precisión"
            aria-invalid={!!titleError}
            aria-describedby={
              titleError ? `criterion-title-error-${criterionId}` : undefined
            }
            className={`${UNDERLINE_CLASS} font-bold`}
          />
          <FieldError
            id={`criterion-title-error-${criterionId}`}
            message={titleError}
          />
        </div>
        <div className="flex flex-col gap-2 md:w-69">
          <Label
            htmlFor={`criterion-weight-${criterionId}`}
            className={LABEL_CLASS}
          >
            Peso relativo
          </Label>
          <div className="relative">
            <select
              id={`criterion-weight-${criterionId}`}
              value={criterion.weight}
              onChange={(e) => handleWeightChange(e.target.value)}
              className={SELECT_CLASS}
            >
              {WEIGHT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.name} ({option.percentage}%)
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-2 h-5 w-5 -translate-y-1/2 text-neutral-650" />
          </div>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon-xs"
        aria-label="Eliminar criterio"
        onClick={() => onRemove(criterionId)}
        disabled={!canRemove}
        className="absolute top-3.5 right-3.5 text-neutral-650"
      >
        <Trash2 className="size-4" />
      </Button>

      <div className="flex flex-col gap-2">
        <Label
          htmlFor={`criterion-guidance-${criterionId}`}
          className={`${LABEL_CLASS} gap-1`}
        >
          Descripción detallada para IA
          <Info className="h-3 w-3" />
        </Label>
        <textarea
          id={`criterion-guidance-${criterionId}`}
          value={criterion.guidance}
          onChange={(e) => onUpdate(criterionId, { guidance: e.target.value })}
          onBlur={() => setTouched((prev) => ({ ...prev, guidance: true }))}
          placeholder="Ej. El alumno debe utilizar la nomenclatura correcta..."
          aria-invalid={!!guidanceError}
          aria-describedby={
            guidanceError
              ? `criterion-guidance-error-${criterionId}`
              : undefined
          }
          className={TEXTAREA_CLASS}
        />
        <FieldError
          id={`criterion-guidance-error-${criterionId}`}
          message={guidanceError}
        />
      </div>
    </div>
  );
}
