import { useState } from "react";
import type { AnalysisItemInput } from "@/types/audit.ts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface AnalysisEditorProps {
  initialItems: AnalysisItemInput[];
  maxPoints: number;
  isSaving?: boolean;
  onSave: (items: AnalysisItemInput[]) => void;
  onCancel: () => void;
}

// Los puntos se editan como texto para distinguir "vacío" de "0".
type EditableItem = Omit<AnalysisItemInput, "points"> & { points: string };

const TITLE_ERROR = "El título es obligatorio.";
const POINTS_ERROR = "Ingresá un puntaje de 0 o más.";

// Tolerancia para que sumas como 0.1 + 0.2 no superen 0.3 por redondeo.
const TOTAL_TOLERANCE = 1e-9;

const isValidPoints = (value: string) => {
  const points = Number(value);
  return value.trim() !== "" && Number.isFinite(points) && points >= 0;
};

export function AnalysisEditor({
  initialItems,
  maxPoints,
  onSave,
  onCancel,
}: AnalysisEditorProps) {
  const [items, setItems] = useState<EditableItem[]>(() =>
    initialItems.map((item) => ({ ...item, points: String(item.points) })),
  );

  const updateField = (
    criterionId: string,
    field: "title" | "description" | "points",
    value: string,
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item.criterionId === criterionId ? { ...item, [field]: value } : item,
      ),
    );
  };

  const total = items.reduce(
    (sum, item) => sum + (Number(item.points) || 0),
    0,
  );

  const isOverMax = total > maxPoints + TOTAL_TOLERANCE;
  const hasItemErrors = items.some(
    (item) => item.title.trim() === "" || !isValidPoints(item.points),
  );
  const hasErrors = hasItemErrors || isOverMax;

  const handleSave = () => {
    onSave(
      items.map((item) => ({
        criterionId: item.criterionId,
        title: item.title.trim(),
        description: item.description.trim(),
        points: Number(item.points),
      })),
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {items.map((item) => {
        const titleId = `analysis-title-${item.criterionId}`;
        const pointsId = `analysis-points-${item.criterionId}`;
        const descriptionId = `analysis-description-${item.criterionId}`;
        const titleErrorId = `${titleId}-error`;
        const pointsErrorId = `${pointsId}-error`;
        const titleError = item.title.trim() === "" ? TITLE_ERROR : null;
        const pointsError = isValidPoints(item.points) ? null : POINTS_ERROR;

        return (
          <div
            key={item.criterionId}
            className="flex flex-col gap-3 pl-4 border-l-4 border-l-teal-400"
          >
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex flex-1 flex-col gap-1.5">
                <Label htmlFor={titleId}>Criterio</Label>
                <Input
                  id={titleId}
                  value={item.title}
                  aria-invalid={titleError ? true : undefined}
                  aria-describedby={titleError ? titleErrorId : undefined}
                  onChange={(e) =>
                    updateField(item.criterionId, "title", e.target.value)
                  }
                />
                {titleError && (
                  <p id={titleErrorId} className="text-sm text-danger-500">
                    {titleError}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5 sm:w-28">
                <Label htmlFor={pointsId}>Puntos</Label>
                <Input
                  id={pointsId}
                  type="number"
                  min={0}
                  step="any"
                  value={item.points}
                  aria-invalid={pointsError ? true : undefined}
                  aria-describedby={pointsError ? pointsErrorId : undefined}
                  onChange={(e) =>
                    updateField(item.criterionId, "points", e.target.value)
                  }
                />
                {pointsError && (
                  <p id={pointsErrorId} className="text-sm text-danger-500">
                    {pointsError}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={descriptionId}>Justificación</Label>
              <textarea
                id={descriptionId}
                rows={3}
                value={item.description}
                onChange={(e) =>
                  updateField(item.criterionId, "description", e.target.value)
                }
                className="w-full resize-y rounded-md border border-neutral-900 bg-neutral-50 p-3 font-sans text-sm text-neutral-900 outline-none transition-colors focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20"
              />
            </div>
          </div>
        );
      })}

      <div className="flex flex-col gap-4 border-t border-neutral-650 pt-6">
        <div className="flex flex-col gap-1">
          <p
            className={`text-sm font-medium ${
              isOverMax ? "text-danger-600" : "text-neutral-900"
            }`}
          >
            Total: {total} / {maxPoints} pts
          </p>
          {isOverMax && (
            <p className="text-sm text-danger-500">
              El total no puede superar {maxPoints} puntos.
            </p>
          )}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            className="h-13 sm:px-6"
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            className="h-13 flex-1 rounded-none bg-teal-700 font-bold tracking-wider text-white uppercase hover:bg-teal-800"
            disabled={hasErrors}
            onClick={handleSave}
          >
            Guardar cambios
          </Button>
        </div>
      </div>
    </div>
  );
}
