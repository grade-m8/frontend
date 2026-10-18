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
                  onChange={(e) =>
                    updateField(item.criterionId, "title", e.target.value)
                  }
                />
              </div>
              <div className="flex flex-col gap-1.5 sm:w-28">
                <Label htmlFor={pointsId}>Puntos</Label>
                <Input
                  id={pointsId}
                  type="number"
                  min={0}
                  step="any"
                  value={item.points}
                  onChange={(e) =>
                    updateField(item.criterionId, "points", e.target.value)
                  }
                />
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
        <p className="text-sm font-medium text-neutral-900">
          Total: {total} / {maxPoints} pts
        </p>
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
            onClick={handleSave}
          >
            Guardar cambios
          </Button>
        </div>
      </div>
    </div>
  );
}
