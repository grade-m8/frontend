import { useState } from "react";
import type { AnalysisItemInput } from "@/types/audit.ts";
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

export function AnalysisEditor({ initialItems }: AnalysisEditorProps) {
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
    </div>
  );
}
