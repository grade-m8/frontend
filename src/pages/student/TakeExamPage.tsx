import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader.tsx";
import { QuestionAnswerCard } from "@/components/forms/QuestionAnswerCard.tsx";
import { ExamNavigationFooter } from "@/components/forms/ExamNavigationFooter.tsx";
import { Button } from "@/components/ui/button.tsx";
import { toast } from "@/components/handler/toastHandler.tsx";
import { getApiErrorMessage } from "@/services/error.ts";
import {
  getMySubmission,
  getStudentExam,
  saveAnswer,
  startOrResumeSubmission,
  submitExam,
} from "@/services/studentExamService.ts";
import type { StudentExamDetail } from "@/types/studentExam.ts";
import type { Submission } from "@/types/submission.ts";

export function TakeExamPage() {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();

  // Estados solicitados por el ticket
  const [detail, setDetail] = useState<StudentExamDetail | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [savedAnswers, setSavedAnswers] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Estado para errores de carga inicial
  const [loadError, setLoadError] = useState<
    "not_available" | "generic" | null
  >(null);

  const [reloadKey, setReloadKey] = useState<number>(0);

  useEffect(() => {
    if (!examId) return;

    let isCancelled = false;

    Promise.all([getStudentExam(examId), startOrResumeSubmission(examId)])
      .then(async ([examDetail, initialSub]) => {
        if (isCancelled) return;

        setDetail(examDetail);

        if (initialSub.status === "in_progress") {
          // Recuperar respuestas existentes de la entrega
          const { submission: currentSub, answers: savedList } =
            await getMySubmission(initialSub.submissionId);

          if (isCancelled) return;

          setSubmission(currentSub);
          const restoredAnswers: Record<string, string> = {};
          savedList.forEach((ans) => {
            restoredAnswers[ans.questionId] = ans.text;
          });
          setAnswers(restoredAnswers);
          setSavedAnswers(restoredAnswers);
        } else {
          // Si ya no está en progreso, guardamos la entrega para conocer su estado
          setSubmission(initialSub);
        }
      })
      .catch((err: unknown) => {
        if (isCancelled) return;
        const errorCode = err instanceof Error ? err.message : "";
        if (
          errorCode === "EXAM_NOT_FOUND" ||
          errorCode === "exam-not-found" ||
          errorCode === "EXAM_NOT_PUBLISHED"
        ) {
          setLoadError("not_available");
        } else {
          setLoadError("generic");
          toast.error(getApiErrorMessage(err));
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [examId, reloadKey]);

  const handleRetry = () => {
    setIsLoading(true);
    setLoadError(null);
    setReloadKey((prev) => prev + 1);
  };

  // Preguntas ordenadas por order
  const questions = useMemo(() => {
    if (!detail) return [];
    return [...detail.questions].sort((a, b) => a.order - b.order);
  }, [detail]);

  const currentQuestion = questions[currentIndex];

  // pendingCount del pie = cantidad de preguntas con respuesta vacía (espacios cuentan como vacía)
  const pendingCount = useMemo(() => {
    return questions.filter((q) => {
      const text = answers[q.questionId] ?? "";
      return text.trim() === "";
    }).length;
  }, [questions, answers]);

  const handleAnswerChange = (text: string) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.questionId]: text,
    }));
    if (submitError) {
      setSubmitError(null);
    }
  };

  // Guarda la respuesta actual si difiere de savedAnswers
  const saveCurrentAnswerIfNeeded = async (): Promise<boolean> => {
    if (!currentQuestion || !submission) return true;
    const currentText = answers[currentQuestion.questionId] ?? "";
    const lastSavedText = savedAnswers[currentQuestion.questionId] ?? "";

    if (currentText === lastSavedText) {
      return true;
    }

    setIsSaving(true);
    try {
      await saveAnswer(
        submission.submissionId,
        currentQuestion.questionId,
        currentText,
      );
      setSavedAnswers((prev) => ({
        ...prev,
        [currentQuestion.questionId]: currentText,
      }));
      return true;
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err));
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < questions.length - 1;

  const handlePrevious = async () => {
    if (!canGoPrevious || isSaving || isSubmitting) return;
    const ok = await saveCurrentAnswerIfNeeded();
    if (ok) {
      setSubmitError(null);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = async () => {
    if (!canGoNext || isSaving || isSubmitting) return;
    const ok = await saveCurrentAnswerIfNeeded();
    if (ok) {
      setSubmitError(null);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleConfirmSubmit = async () => {
    if (isSubmitting || !submission || !detail) return;

    // Validación: si hay respuestas vacías, se bloquea la entrega
    if (pendingCount > 0) {
      const currentText = (
        answers[currentQuestion?.questionId ?? ""] ?? ""
      ).trim();
      if (!currentText) {
        setSubmitError("Respuesta obligatoria");
      }
      toast.error(
        getApiErrorMessage(
          new Error("QUESTIONS_UNANSWERED"),
          "Tenés que responder todas las preguntas antes de entregar.",
        ),
      );
      return;
    }

    // Guarda la respuesta de la pregunta actual si cambió
    const ok = await saveCurrentAnswerIfNeeded();
    if (!ok) return;

    setIsSubmitting(true);
    try {
      const updatedSub = await submitExam(submission.submissionId);
      setSubmission(updatedSub);
      toast.success("Examen entregado. La IA lo está corrigiendo.");
      navigate(`/materias/${detail.exam.subjectId}/examenes`);
    } catch (err: unknown) {
      const errorCode = err instanceof Error ? err.message : "";
      if (errorCode === "SUBMISSION_ALREADY_SUBMITTED") {
        setSubmission((prev) =>
          prev ? { ...prev, status: "submitted" } : null,
        );
      }
      toast.error(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1. Estado de carga
  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center gap-2 text-body text-neutral-700">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span>Cargando examen…</span>
      </div>
    );
  }

  // 2. Errores de carga: no disponible
  if (loadError === "not_available") {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-4 px-4 py-24 text-center">
        <h2 className="text-h3 font-bold text-neutral-900">
          El examen no está disponible.
        </h2>
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="h-10 px-6 font-semibold"
        >
          Volver
        </Button>
      </div>
    );
  }

  // 3. Errores de carga: genéricos con reintento
  if (loadError === "generic" || !detail) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-4 px-4 py-24 text-center">
        <p className="text-body font-medium text-neutral-700">
          Ocurrió un error al cargar el examen.
        </p>
        <Button
          onClick={handleRetry}
          className="h-10 bg-teal-700 px-6 font-semibold text-white hover:bg-teal-800"
        >
          Reintentar
        </Button>
      </div>
    );
  }

  // 4. Si el examen ya fue entregado (estado distinto de in_progress)
  if (submission && submission.status !== "in_progress") {
    const subjectId = detail.exam.subjectId;
    return (
      <div className="w-full">
        <PageHeader title={detail.exam.title.toUpperCase()} />
        <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-4 px-4 py-24 text-center">
          <h2 className="text-h3 font-bold text-neutral-900">
            Este examen ya fue entregado.
          </h2>
          <Button
            onClick={() => navigate(`/materias/${subjectId}/examenes`)}
            className="h-10 bg-teal-700 px-6 font-semibold text-white hover:bg-teal-800"
          >
            Volver a la materia
          </Button>
        </div>
      </div>
    );
  }

  const examTitle = detail.exam.title.toUpperCase();

  // 5. Examen en curso
  return (
    <div className="w-full">
      <PageHeader title={examTitle} />

      <main className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6">
        {currentQuestion && (
          <QuestionAnswerCard
            question={currentQuestion}
            position={currentIndex + 1}
            total={questions.length}
            answer={answers[currentQuestion.questionId] ?? ""}
            onAnswerChange={handleAnswerChange}
            disabled={isSaving || isSubmitting}
            error={submitError ?? undefined}
          />
        )}

        <ExamNavigationFooter
          canGoPrevious={canGoPrevious}
          canGoNext={canGoNext}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onConfirmSubmit={handleConfirmSubmit}
          isBusy={isSaving}
          isSubmitting={isSubmitting}
          pendingCount={pendingCount}
        />
      </main>
    </div>
  );
}
