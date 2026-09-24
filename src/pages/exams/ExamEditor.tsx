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
import type { ReplaceCriteriaDto } from "@/types/examDto.ts";
import {
  createExam,
  replaceCriteria,
  updateExam,
} from "@/services/examService.ts";
import { getApiErrorMessage } from "@/services/error.ts";

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

// Se listan los campos explícitamente en vez de descartar `criterionId`: el
// backend no filtra nada al crear (`create` hace `{...input}` y lo persiste
// tal cual), así que cualquier campo de UI que se agregue a `RubricCriterion`
// terminaría en Firestore sin que nadie lo note.
function toCriteriaDto(criteria: RubricCriterion[]): ReplaceCriteriaDto {
  return {
    criteria: criteria.map((c, index) => ({
      title: c.title,
      weight: c.weight,
      weightPercentage: c.weightPercentage,
      guidance: c.guidance,
      order: index + 1,
    })),
  };
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
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleContinue = async () => {
    setSubmitted(true);
    const errors = validateGeneralInfo(formState.generalInfo);
    setGeneralInfoErrors(errors);

    const hasNoCriteria = formState.rubricCriteria.length === 0;
    const hasIncompleteCriterion = formState.rubricCriteria.some(
      (c) => c.title.trim() === "" || c.guidance.trim() === "",
    );

    if (
      Object.keys(errors).length > 0 ||
      hasNoCriteria ||
      hasIncompleteCriterion
    ) {
      return;
    }

    const {
      title,
      subjectId,
      durationMinutes,
      passingPercentage,
      scheduledAt,
    } = formState.generalInfo;
    const criteriaDto = toCriteriaDto(formState.rubricCriteria);

    setIsSubmitting(true);
    try {
      // TODO: `/teacher/exams/:examId/questions` todavía no existe en
      // AppRouter.tsx, así que por ahora estos navigate() rebotan a `/`.
      if (examId) {
        // `subjectId` no se envía: la materia es inmutable una vez creado el
        // examen, y el backend lo filtra de todos modos.
        await Promise.all([
          updateExam(examId, {
            title,
            durationMinutes,
            passingPercentage,
            scheduledAt,
          }),
          replaceCriteria(examId, criteriaDto),
        ]);
        toast.success("Examen actualizado correctamente");
        navigate(`/teacher/exams/${examId}/questions`);
      } else {
        const newExam = await createExam({
          title,
          subjectId,
          durationMinutes,
          passingPercentage,
          scheduledAt,
        });
        await replaceCriteria(newExam.examId, criteriaDto);
        toast.success("Examen creado correctamente");
        navigate(`/teacher/exams/${newExam.examId}/questions`);
      }
    } catch (err) {
      toast.error(
        getApiErrorMessage(
          err,
          "No se pudo guardar el examen. Intentá nuevamente.",
        ),
      );
      // Sólo acá: en el camino feliz navegamos y el componente se desmonta,
      // así que rehabilitar el botón antes sólo abriría lugar a un doble click.
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
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
        <Button
          variant="outline"
          onClick={() => navigate("/materias")}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button onClick={handleContinue} disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSubmitting ? "Guardando..." : "Continuar al editor de preguntas"}
          {!isSubmitting && <ArrowRight className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
