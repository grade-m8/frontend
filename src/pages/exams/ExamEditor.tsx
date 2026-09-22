import { WizardStepper } from "@/components/layout/WizardStepper";

export function ExamConfigPage() {
  return (
    <div className="p-6">
      <WizardStepper currentStep="config" />
      <h1 className="mt-6 text-h1 font-bold text-neutral-900">
        Configuración del Examen IA
      </h1>
      <p className="mt-2 max-w-4xl text-sm text-neutral-650">
        Define los parámetros base y las directrices semánticas que el motor de
        evaluación utilizará para analizar las respuestas abiertas. La precisión
        en las rúbricas garantiza una evaluación más justa y técnica.
      </p>
    </div>
  );
}
