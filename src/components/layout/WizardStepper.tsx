import { ArrowRight } from "lucide-react";

export function WizardStepper() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-700 text-xs font-bold text-white">
          1
        </div>
        <span className="text-sm font-bold uppercase tracking-wider text-neutral-900">
          Configuración y Rúbricas
        </span>
      </div>

      <ArrowRight className="h-4 w-4 text-neutral-400" />

      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-full border border-neutral-300 text-xs font-bold text-neutral-500">
          2
        </div>
        <span className="text-sm font-bold uppercase tracking-wider text-neutral-500">
          Preguntas y Contenido
        </span>
      </div>
    </div>
  );
}
