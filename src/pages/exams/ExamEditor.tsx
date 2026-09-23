import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WizardStepper } from "@/components/layout/WizardStepper";
import { ExamGeneralInfoForm } from "@/components/forms/ExamGeneralInfoForm";
import { RubricCriteriaList } from "@/components/forms/RubricCriteriaList";
import type { Exam, ExamConfigFormState, RubricCriterion } from "@/types/exam";
import { useExam, type ExamLoadError } from "@/hooks/useExam.ts";
import { toast } from "@/components/handler/toastHandler.tsx";

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

const EMPTY_GENERAL_INFO: ExamConfigFormState["generalInfo"] = {
  title: "",
  subjectId: "",
  durationMinutes: 0,
  passingPercentage: 0,
};

const CREATION_INITIAL_STATE: ExamConfigFormState = {
  generalInfo: EMPTY_GENERAL_INFO,
  rubricCriteria: SUGGESTED_CRITERIA,
  isValid: false,
  isDirty: false,
};

const EDITION_INITIAL_STATE: ExamConfigFormState = {
  generalInfo: EMPTY_GENERAL_INFO,
  rubricCriteria: [],
  isValid: false,
  isDirty: false,
};

// `subjectName` no viene en `Exam`: el <select> de ExamGeneralInfoForm ya
// resuelve el nombre matcheando `subjectId` contra la lista de materias.
const extractExamGeneralInfo = (
  exam: Exam,
): ExamConfigFormState["generalInfo"] => ({
  title: exam.title,
  subjectId: exam.subjectId,
  durationMinutes: exam.durationMinutes,
  passingPercentage: exam.passingPercentage,
  scheduledAt: exam.scheduledAt,
});

const LOAD_ERROR_MESSAGES: Record<ExamLoadError, string> = {
  "not-found": "El examen solicitado no existe.",
  forbidden: "No tenés permisos para acceder a este examen.",
  unauthenticated: "Tu sesión expiró. Iniciá sesión nuevamente.",
  unknown: "No se pudo cargar el examen. Intentá nuevamente.",
};

function validateGeneralInfo(info: ExamConfigFormState["generalInfo"]) {
  const errors: Record<string, string> = {};
  if (info.title.trim() === "") errors.title = "El título es obligatorio";
  if (info.subjectId === "") errors.subjectId = "Seleccioná una materia";
  if (!Number.isInteger(info.durationMinutes) || info.durationMinutes <= 0)
    errors.durationMinutes = "La duración debe ser un número entero mayor a 0";
  if (info.passingPercentage < 1 || info.passingPercentage > 100)
    errors.passingPercentage = "Debe estar entre 1 y 100";
  return errors;
}

export function ExamConfigPage() {
  const { examId } = useParams<{ examId: string }>();
  const isEditMode = !!examId;

  const { exam, criteria, isLoading, error } = useExam(examId);
  const [formState, setFormState] = useState<ExamConfigFormState>(() =>
    isEditMode ? EDITION_INITIAL_STATE : CREATION_INITIAL_STATE,
  );
  const [generalInfoErrors, setGeneralInfoErrors] = useState<
    Record<string, string>
  >({});
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const hydratedExamIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!exam || hydratedExamIdRef.current === exam.examId) {
      return;
    }
    hydratedExamIdRef.current = exam.examId;
    setFormState({
      generalInfo: extractExamGeneralInfo(exam),
      rubricCriteria: criteria ?? [],
      isValid: false,
      isDirty: false,
    });
  }, [exam, criteria]);

  useEffect(() => {
    if (!error) return;
    toast.error(LOAD_ERROR_MESSAGES[error]);
    // `replace` para que "atrás" no devuelva al examen inaccesible.
    navigate("/materias", { replace: true });
  }, [error, navigate]);

  const handleContinue = () => {
    setSubmitted(true);
    const errors = validateGeneralInfo(formState.generalInfo);
    setGeneralInfoErrors(errors);

    const hasInvalidCriterion = formState.rubricCriteria.length === 0;

    if (Object.keys(errors).length > 0 || hasInvalidCriterion) {
      return;
    }

    if (isEditMode) {
      // TODO: Al presionar continuar en modo edición:
      // - Invocar `updateExam({ examId, patch })` y `replaceCriteria({ examId, criteria })`.
      // TODO: Navegar a `/teacher/exams/${examId}/questions` una vez que esa ruta exista
    } else {
      // TODO: Al presionar continuar en modo creación:
      // - Invocar `createExam(createExamDto)` para obtener el `examId` generado.
      // - Invocar `replaceCriteria({ examId, criteria })` para guardar los criterios de rúbrica.
      // TODO: Navegar a `/teacher/exams/new/questions` una vez que esa ruta exista
    }
  };

  if (isLoading || error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 text-neutral-500">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p>Cargando el examen...</p>
      </div>
    );
  }

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
        isEditMode={isEditMode}
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
        showErrors={submitted}
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
