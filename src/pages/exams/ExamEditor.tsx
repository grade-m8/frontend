import { useState } from "react";
import { WizardStepper } from "@/components/layout/WizardStepper";
import { ExamGeneralInfoForm } from "@/components/forms/ExamGeneralInfoForm";
import type { ExamConfigFormState } from "@/types/exam";

const INITIAL_STATE: ExamConfigFormState = {
  generalInfo: {
    title: "",
    subjectId: "",
    durationMinutes: 0,
    passingPercentage: 0,
  },
  rubricCriteria: [],
  isValid: false,
  isDirty: false,
};

export function ExamConfigPage() {
  const [formState, setFormState] =
    useState<ExamConfigFormState>(INITIAL_STATE);

  return (
    <div className="flex flex-col gap-8 px-6 py-8">
      <WizardStepper currentStep="config" />
      <div className="flex flex-col gap-2">
        <h1 className="text-display tracking-display font-bold text-neutral-900">
          Configuración del Examen IA
        </h1>
        <p className="max-w-4xl text-body text-neutral-700">
          Define los parámetros base y las directrices semánticas que el motor
          de evaluación utilizará para analizar las respuestas abiertas. La
          precisión en las rúbricas garantiza una evaluación más justa y
          técnica.
        </p>
      </div>
      <ExamGeneralInfoForm
        values={formState.generalInfo}
        onChange={(fields) =>
          setFormState((prev) => ({
            ...prev,
            generalInfo: { ...prev.generalInfo, ...fields },
            isDirty: true,
          }))
        }
      />
    </div>
  );
}
