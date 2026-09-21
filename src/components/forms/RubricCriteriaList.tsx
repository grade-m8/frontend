import { SlidersHorizontal } from "lucide-react";

export function RubricCriteriaList() {
  return (
    <section className="flex flex-col gap-6 border border-neutral-300 bg-neutral-50 p-6">
      <div className="flex items-center gap-2 border-b border-neutral-300 pb-4">
        <SlidersHorizontal className="h-5 w-5 text-teal-800" />
        <h2 className="text-h2 font-semibold text-neutral-900">
          Rúbricas Semánticas
        </h2>
      </div>
      <p className="text-body text-neutral-700">
        Establezca los criterios de evaluación. Instruya a la IA sobre qué
        buscar exactamente en las respuestas del alumno.
      </p>
    </section>
  );
}
