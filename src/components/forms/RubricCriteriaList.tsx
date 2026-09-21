import { SlidersHorizontal, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function RubricCriteriaList() {
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
    </section>
  );
}
