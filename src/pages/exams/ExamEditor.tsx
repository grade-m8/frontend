import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
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

function validateGeneralInfo(info: ExamConfigFormState["generalInfo"]) {
  const errors: Record<string, string> = {};
  if (info.title.trim() === "") errors.title = "El título es obligatorio";
  if (info.subjectId === "") errors.subjectId = "Seleccioná una materia";
  if (info.durationMinutes <= 0)
    errors.durationMinutes = "La duración debe ser mayor a 0";
  if (info.passingPercentage < 1 || info.passingPercentage > 100)
    errors.passingPercentage = "Debe estar entre 1 y 100";
  return errors;
}

export function ExamConfigPage() {
  const [formState, setFormState] =
    useState<ExamConfigFormState>(INITIAL_STATE);
  const [generalInfoErrors, setGeneralInfoErrors] = useState<
    Record<string, string>
  >({});
  const navigate = useNavigate();

  const handleContinue = () => {
    const errors = validateGeneralInfo(formState.generalInfo);
    setGeneralInfoErrors(errors);

    const hasInvalidCriterion = formState.rubricCriteria.some(
      (c) => c.title.trim() === "" || c.guidance.trim() === "",
    );

    if (Object.keys(errors).length > 0 || hasInvalidCriterion) {
      return;
    }

    // TODO: navegar al Paso 2 ("Preguntas y Contenido") una vez que esa ruta exista
    return;
  };

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
        errors={generalInfoErrors}
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
      <div className="flex justify-end gap-4 border-t border-neutral-300 pt-6">
        <Button variant="outline" onClick={() => navigate("/materias")}>
          Cancelar
        </Button>
        <Button onClick={handleContinue}>
          Continuar al editor de preguntas
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
