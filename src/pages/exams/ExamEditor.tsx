import { useState } from "react";
import { WizardStepper } from "@/components/layout/WizardStepper";
import { ExamGeneralInfoForm } from "@/components/forms/ExamGeneralInfoForm";
import { RubricCriteriaList } from "@/components/forms/RubricCriteriaList";
import type { ExamConfigFormState, RubricCriterion } from "@/types/exam";

const SUGGESTED_CRITERIA: RubricCriterion[] = [
  {
    criterionId: crypto.randomUUID(),
    title: "Rigor Técnico y Precisión",
    weight: "high",
    weightPercentage: 40,
    guidance:
      "El alumno debe utilizar la nomenclatura correcta. Se penalizará severamente el uso de términos ambiguos.",
    order: 0,
  },
  {
    criterionId: crypto.randomUUID(),
    title: "Claridad y Estructura",
    weight: "medium",
    weightPercentage: 20,
    guidance: "La explicación debe fluir lógicamente.",
    order: 1,
  },
];

const INITIAL_STATE: ExamConfigFormState = {
  generalInfo: {
    title: "",
    subjectId: "",
    durationMinutes: 0,
    passingPercentage: 0,
  },
  rubricCriteria: SUGGESTED_CRITERIA,
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
      <RubricCriteriaList
        criteria={formState.rubricCriteria}
        onAddCriterion={(criterion) =>
          setFormState((prev) => ({
            ...prev,
            rubricCriteria: [...prev.rubricCriteria, criterion],
            isDirty: true,
          }))
        }
        onUpdateCriterion={(id, changes) =>
          setFormState((prev) => ({
            ...prev,
            rubricCriteria: prev.rubricCriteria.map((c) =>
              c.criterionId === id ? { ...c, ...changes } : c,
            ),
            isDirty: true,
          }))
        }
        onRemoveCriterion={(id) =>
          setFormState((prev) => ({
            ...prev,
            rubricCriteria: prev.rubricCriteria.filter(
              (c) => c.criterionId !== id,
            ),
            isDirty: true,
          }))
        }
      />
    </div>
  );
}
