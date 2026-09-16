import { ArrowRight } from "lucide-react";

export function WizardStepper() {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-full border border-teal-800 bg-teal-700">
          <span className="label-micro font-bold text-teal-100">1</span>
        </div>
        <span className="label-micro font-bold text-teal-800">
          Configuración y Rúbricas
        </span>
      </div>

      <ArrowRight className="h-3 w-3 text-neutral-300" />

      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-full border border-neutral-500">
          <span className="label-micro text-neutral-500">2</span>
        </div>
        <span className="label-micro text-neutral-500">
          Preguntas y Contenido
        </span>
      </div>
    </div>
  );
}
