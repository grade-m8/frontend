import { Plus, SlidersHorizontal, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RubricCriterionCard } from "@/components/forms/RubricCriterionCard";
import type { RubricCriterion } from "@/types/exam";

interface RubricCriteriaListProps {
  criteria: RubricCriterion[];
  onAddCriterion: (criterion: RubricCriterion) => void;
  onUpdateCriterion: (
    criterionId: string,
    changes: Partial<RubricCriterion>,
  ) => void;
  onRemoveCriterion: (criterionId: string) => void;
  showErrors: boolean;
}

export function RubricCriteriaList({
  criteria,
  onAddCriterion,
  onUpdateCriterion,
  onRemoveCriterion,
  showErrors,
}: RubricCriteriaListProps) {
  // TODO: Al conectar con el backend, estos criterios se enviarán mediante la
  // Callable Function replaceCriteria({ examId, criteria })
  const handleAddCriterion = () => {
    const nextOrder =
      criteria.reduce((max, c) => Math.max(max, c.order ?? 0), -1) + 1;

    onAddCriterion({
      criterionId: crypto.randomUUID(),
      title: "",
      weight: "medium",
      weightPercentage: 20,
      guidance: "",
      order: nextOrder,
    });
  };

  return (
    <section className="flex flex-col gap-6 border border-neutral-300 bg-neutral-50 p-6">
      <div className="flex items-center justify-between border-b border-neutral-300 pb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-teal-800" />
          <h2 className="text-h2 font-semibold text-neutral-900">
            Rúbricas Semánticas
          </h2>
        </div>
        <Badge
          variant="outline"
          className="h-5.5 gap-2 rounded-xs border-teal-700 bg-teal-700/20 px-3 py-1 font-label tracking-label text-teal-800"
        >
          <Sparkles />
          Motor IA Activado
        </Badge>
      </div>
      <p className="text-body text-neutral-700">
        Establezca los criterios de evaluación. Instruya a la IA sobre qué
        buscar exactamente en las respuestas del alumno.
      </p>
      {criteria.map((criterion) => (
        <RubricCriterionCard
          key={criterion.criterionId}
          criterion={criterion}
          onUpdate={onUpdateCriterion}
          onRemove={onRemoveCriterion}
          canRemove={criteria.length > 1}
          showErrors={showErrors}
        />
      ))}
      <button
        type="button"
        onClick={handleAddCriterion}
        className="flex w-full flex-col items-center justify-center gap-2 border-2 border-dashed border-neutral-500 py-4 text-center transition-colors hover:border-teal-700 cursor-pointer"
      >
        <Plus className="h-5 w-5 text-neutral-700" />
        <span className="text-body font-bold text-neutral-700">
          Añadir Nuevo Criterio
        </span>
      </button>
    </section>
  );
}
