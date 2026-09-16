import { ArrowRight } from "lucide-react";
import type { WizardStepId, WizardStepItem } from "@/types/wizard";

const DEFAULT_STEPS: WizardStepItem[] = [
  {
    id: "config",
    stepNumber: 1,
    label: "Configuración y Rúbricas",
    status: "active",
  },
  {
    id: "questions",
    stepNumber: 2,
    label: "Preguntas y Contenido",
    status: "disabled",
  },
];

interface WizardStepperProps {
  currentStep: WizardStepId;
  steps?: WizardStepItem[];
}

export function WizardStepper({
  currentStep,
  steps = DEFAULT_STEPS,
}: WizardStepperProps) {
  return (
    <div className="flex items-center gap-4">
      {steps.map((step, index) => {
        const isActive = step.id === currentStep;

        return (
          <div key={step.id} className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {isActive ? (
                <div className="flex h-6 w-6 items-center justify-center rounded-full border border-teal-800 bg-teal-700">
                  <span className="label-micro font-bold text-teal-100">
                    {step.stepNumber}
                  </span>
                </div>
              ) : (
                <div className="flex h-6 w-6 items-center justify-center rounded-full border border-neutral-500">
                  <span className="label-micro text-neutral-500">
                    {step.stepNumber}
                  </span>
                </div>
              )}
              <span
                className={`label-micro font-bold ${isActive ? "text-teal-800" : "text-neutral-500"}`}
              >
                {step.label}
              </span>
            </div>

            {index < steps.length - 1 && (
              <ArrowRight className="h-3 w-3 text-neutral-300" />
            )}
          </div>
        );
      })}
    </div>
  );
}
