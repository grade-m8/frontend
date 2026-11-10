import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { replaceQuestions } from "@/services/examService.ts";
import { getApiErrorMessage } from "@/services/error.ts";
import { Plus, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Question } from "@/types/exam.ts";
import { WizardStepper } from "@/components/layout/WizardStepper.tsx";
import QuestionCard from "@/components/forms/QuestionCard.tsx";
import { ExamSummaryBanner } from "@/components/data-display/ExamSummaryBanner.tsx";
import { toast } from "@/components/handler/toastHandler.tsx";
import { type ExamLoadError, useExam } from "@/hooks/useExam.ts";

function createDraftQuestion(): Question {
  return {
    questionId: crypto.randomUUID(),
    title: "",
    prompt: "",
    order: 1,
    points: 0,
    idealAnswer: "",
  };
}

// Un borrador se considera "vacío" si el docente no llegó a escribir nada;
// se descarta al cancelar en vez de dejar una pregunta fantasma en la lista.
function isEmptyDraft(question: Question): boolean {
  return question.prompt.trim() === "" && question.idealAnswer.trim() === "";
}

const EDITING_QUESTION_IN_PROGRESS_MESSAGE =
  "Confirmá o cancelá la pregunta que estás editando.";

// Devuelve el primer motivo por el que el examen no se puede publicar, o null
// si está listo. Exige título, enunciado, puntos y respuesta ideal en cada
// pregunta: QuestionEditForm valida los mismos campos al confirmar, así que
// esto funciona como red de seguridad (por ejemplo, preguntas que lleguen del
// backend sin título).
function getPublishError(
  questions: Question[],
  editingQuestionId: string | null,
): string | null {
  if (questions.length === 0) {
    return "Agregá al menos una pregunta antes de publicar.";
  }
  if (editingQuestionId !== null) {
    return EDITING_QUESTION_IN_PROGRESS_MESSAGE;
  }
  const hasIncomplete = questions.some(
    (q) =>
      q.title.trim() === "" ||
      q.prompt.trim() === "" ||
      q.idealAnswer.trim() === "" ||
      !(q.points > 0),
  );
  if (hasIncomplete) {
    return "Hay preguntas incompletas: revisá título, enunciado, puntos y respuesta ideal.";
  }
  if (questions.reduce((sum, q) => sum + q.points, 0) <= 0) {
    return "El puntaje total del examen debe ser mayor a 0.";
  }
  return null;
}

const LOAD_ERROR_MESSAGES: Record<ExamLoadError, string> = {
  "not-found": "El examen solicitado no existe.",
  forbidden: "No tenés permisos para acceder a este examen.",
  unauthenticated: "Tu sesión expiró. Iniciá sesión nuevamente.",
  unknown: "No se pudo cargar el examen. Intentá nuevamente.",
};

export function QuestionEditorPage() {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isSavingAndContinuing, setIsSavingAndContinuing] = useState(false);
  const [isNavigatingBack, setIsNavigatingBack] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const isBusy =
    isPublishing || isSavingDraft || isSavingAndContinuing || isNavigatingBack;

  const {
    exam,
    criteria,
    questions: fetchedQuestions,
    isLoading,
    error,
  } = useExam(examId);
  // Un examen publicado o cerrado no admite cambios (el backend responde 409
  // EXAM_NOT_EDITABLE), así que el editor pasa a modo solo lectura.
  const isReadOnly = !!exam && exam.status !== "draft";
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(
    null,
  );
  const hydratedExamIdRef = useRef<string | undefined>(undefined);

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty || editingQuestionId !== null) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty, editingQuestionId]);

  const handleAddQuestion = () => {
    if (isReadOnly) return;
    const draft = createDraftQuestion();
    setQuestions((prev) => [...prev, draft]);
    if (editingQuestionId != null) handleCancelEdit(editingQuestionId);
    setEditingQuestionId(draft.questionId);
    setIsDirty(true);
  };

  const handleSaveQuestion = (updated: Question) => {
    setQuestions((prev) =>
      prev.map((q) => (q.questionId === updated.questionId ? updated : q)),
    );
    setEditingQuestionId(null);
    setIsDirty(true);
    toast.success("Pregunta guardada");
  };

  const handleCancelEdit = (questionId: string) => {
    setQuestions((prev) =>
      prev.filter((q) => {
        if (q.questionId !== questionId) return true;
        return !isEmptyDraft(q);
      }),
    );
    setEditingQuestionId(null);
  };

  const handleEdit = (questionId: string) => {
    if (editingQuestionId != null) handleCancelEdit(editingQuestionId);
    setEditingQuestionId(questionId);
  };

  const handleDeleteQuestion = (questionId: string) => {
    setQuestions((prev) => prev.filter((q) => q.questionId !== questionId));
    setEditingQuestionId((current) =>
      current === questionId ? null : current,
    );
    setIsDirty(true);
  };

  const buildDraftPayload = () => {
    return questions
      .filter((q) => !isEmptyDraft(q))
      .map((q, i) => ({
        order: i + 1,
        title: q.title,
        prompt: q.prompt,
        points: Number(q.points),
        idealAnswer: q.idealAnswer,
      }));
  };

  const handleSaveAndContinue = async () => {
    if (isBusy || !examId) return;
    if (editingQuestionId !== null) {
      toast.error(EDITING_QUESTION_IN_PROGRESS_MESSAGE);
      return;
    }
    setIsSavingAndContinuing(true);
    try {
      const payload = buildDraftPayload();
      const updatedQuestions = await replaceQuestions(examId, {
        questions: payload,
        publish: false,
      });
      const sortedQuestions = [...updatedQuestions].sort(
        (a, b) => a.order - b.order,
      );
      setQuestions(sortedQuestions);
      setIsDirty(false);
      toast.success("Borrador guardado exitosamente.");
    } catch (err) {
      toast.error(getApiErrorMessage(err));
    } finally {
      setIsSavingAndContinuing(false);
    }
  };

  const handleBack = async () => {
    if (isBusy || !examId) return;
    if (editingQuestionId !== null) {
      toast.error(EDITING_QUESTION_IN_PROGRESS_MESSAGE);
      return;
    }
    setIsNavigatingBack(true);
    try {
      const payload = buildDraftPayload();
      await replaceQuestions(examId, { questions: payload, publish: false });
      setIsDirty(false);
      navigate(`/teacher/exams/${examId}/config`);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
      setIsNavigatingBack(false);
    }
  };

  const handleSaveDraft = async () => {
    if (isBusy || !examId) return;
    if (editingQuestionId !== null) {
      toast.error(EDITING_QUESTION_IN_PROGRESS_MESSAGE);
      return;
    }
    setIsSavingDraft(true);
    try {
      const payload = buildDraftPayload();
      await replaceQuestions(examId, { questions: payload, publish: false });
      setIsDirty(false);
      toast.success("Borrador guardado exitosamente.");
      const destination = exam?.subjectId
        ? `/materias/${exam.subjectId}/examenes`
        : "/materias";
      navigate(destination);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
      setIsSavingDraft(false);
    }
  };

  const handlePublish = async () => {
    if (isPublishing || isReadOnly) return;
    if (isBusy) return;
    const publishError = getPublishError(questions, editingQuestionId);
    if (publishError) {
      toast.error(publishError);
      return;
    }
    const payload = questions.map((q, i) => ({
      order: i + 1,
      title: q.title,
      prompt: q.prompt,
      points: Number(q.points),
      idealAnswer: q.idealAnswer,
    }));

    if (!examId) return;

    setIsPublishing(true);
    try {
      await replaceQuestions(examId, { questions: payload, publish: true });
      setIsDirty(false);
      toast.success(
        "¡Examen publicado exitosamente! Ya se encuentra disponible.",
      );
      const destination = exam?.subjectId
        ? `/materias/${exam.subjectId}/examenes`
        : "/materias";
      navigate(destination);
    } catch (err) {
      toast.error(getApiErrorMessage(err));
      setIsPublishing(false);
    }
  };

  useEffect(() => {
    if (!exam || hydratedExamIdRef.current === exam.examId) {
      return;
    }
    hydratedExamIdRef.current = exam.examId;
    const sortedQuestions = [...(fetchedQuestions ?? [])].sort(
      (a, b) => a.order - b.order,
    );
    setQuestions(sortedQuestions);
    setIsDirty(false);
  }, [exam, fetchedQuestions, setQuestions]);

  useEffect(() => {
    if (!error) return;
    toast.error(LOAD_ERROR_MESSAGES[error]);
    navigate("/materias", { replace: true });
  }, [error, navigate]);

  if (isLoading) {
    return (
      <div
        className="flex h-screen flex-col items-center justify-center gap-4
  text-neutral-500"
      >
        <Loader2 className="h-8 w-8 animate-spin" />
        <p>Cargando examen…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-3.5 px-4 pb-12">
      <WizardStepper
        currentStep="questions"
        onStepClick={(stepId) => {
          if (stepId === "config") {
            handleBack();
          }
        }}
      />

      <h1 className="text-h1 mt-4 mb-6 font-bold text-neutral-900">
        Editor de Preguntas
      </h1>

      {isReadOnly && (
        <div className="mb-6 border border-neutral-300 bg-neutral-50 p-4 text-sm font-semibold text-neutral-800">
          Este examen ya se encuentra{" "}
          {exam.status === "closed" ? "cerrado" : "publicado"} y no permite
          modificaciones.
        </div>
      )}

      <ExamSummaryBanner
        title={exam?.title ?? ""}
        totalQuestions={questions.length}
        totalPoints={totalPoints}
      />

      <div className="mt-6 flex flex-col gap-4">
        {questions.map((question, index) => (
          <QuestionCard
            key={question.questionId}
            question={question}
            index={index + 1}
            isEditing={editingQuestionId === question.questionId}
            onEdit={() => handleEdit(question.questionId)}
            onCancel={() => handleCancelEdit(question.questionId)}
            onSave={handleSaveQuestion}
            onDelete={handleDeleteQuestion}
            criteria={criteria ?? []}
            disabled={isReadOnly}
          />
        ))}

        <button
          type="button"
          onClick={handleAddQuestion}
          disabled={isReadOnly || isBusy}
          className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-neutral-300 bg-white/50 py-6 text-center transition-colors hover:border-neutral-500 hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-neutral-300 disabled:hover:bg-white/50"
        >
          <Plus className="size-5 text-neutral-650" />
          <span className="label-micro text-neutral-650">
            Agregar nueva pregunta
          </span>
        </button>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-neutral-300 pt-6">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={isPublishing || isBusy}
          className="h-12 min-w-[186px] gap-2 px-6 text-base font-bold cursor-pointer"
        >
          {isNavigatingBack && <Loader2 className="h-4 w-4 animate-spin" />}
          {isNavigatingBack
            ? "Guardando y volviendo…"
            : "Volver a las rúbricas"}
        </Button>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={handleSaveAndContinue}
            disabled={isBusy}
            className="h-12 min-w-[180px] gap-2 px-6 text-base font-bold cursor-pointer"
          >
            {isSavingAndContinuing && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            {isSavingAndContinuing ? "Guardando…" : "Guardar y seguir editando"}
          </Button>
          <Button
            variant="outline"
            onClick={handleSaveDraft}
            disabled={isBusy}
            className="h-12 min-w-[180px] gap-2 px-6 text-base font-bold cursor-pointer"
          >
            {isSavingDraft && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSavingDraft ? "Guardando y saliendo…" : "Guardar y salir"}
          </Button>
          {!isReadOnly && (
            <Button
              className="h-12 min-w-[366px] gap-2 text-base font-bold cursor-pointer"
              onClick={handlePublish}
              disabled={isBusy}
            >
              {isPublishing && <Loader2 className="h-4 w-4 animate-spin" />}
              {isPublishing ? "Publicando…" : "Guardar y publicar"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
