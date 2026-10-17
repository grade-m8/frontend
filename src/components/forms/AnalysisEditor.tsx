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

export function AnalysisEditor({ initialItems }: AnalysisEditorProps) {
  const [items, setItems] = useState<AnalysisItemInput[]>(initialItems);

  const updateTitle = (criterionId: string, title: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.criterionId === criterionId ? { ...item, title } : item,
      ),
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {items.map((item) => {
        const titleId = `analysis-title-${item.criterionId}`;

        return (
          <div
            key={item.criterionId}
            className="flex flex-col gap-3 pl-4 border-l-4 border-l-teal-400"
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={titleId}>Criterio</Label>
              <Input
                id={titleId}
                value={item.title}
                onChange={(e) => updateTitle(item.criterionId, e.target.value)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
