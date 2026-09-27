import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Cpu,
  FileText,
  Loader2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils.ts";
import { AnalysisItemCard } from "@/components/data-display/AnalysisItemCard.tsx";
import type { Question } from "@/types/exam.ts";
import { getSubmission } from "@/services/auditService.ts";
import { getExam } from "@/services/examService.ts";
import { useAnswerDetail } from "@/hooks/useAnswerDetail.ts";
import { toast } from "@/components/handler/toastHandler.tsx";
import { getApiErrorMessage } from "@/services/error.ts";

export function SubmissionAuditPage() {
  const { submissionId } = useParams<{ submissionId: string }>();
  const navigate = useNavigate();

  const [examTitle, setExamTitle] = useState<string>("");
  const [studentId, setStudentId] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>("");

  const [isLoadingInitial, setIsLoadingInitial] = useState<boolean>(true);
  const [initialError, setInitialError] = useState<
    "not-found" | "generic" | null
  >(null);

  const { detail, isLoading: isLoadingAnswer } = useAnswerDetail(
    submissionId,
    selectedQuestionId,
  );

  const loadInitialData = useCallback(async () => {
    if (!submissionId) {
      setInitialError("not-found");
      setIsLoadingInitial(false);
      return;
    }

    setIsLoadingInitial(true);
    setInitialError(null);

    try {
      const submissionData = await getSubmission(submissionId);
      setStudentId(submissionData.submission.studentId);

      const examData = await getExam(submissionData.submission.examId);
      setExamTitle(examData.exam.title);

      const sortedQuestions = (examData.questions ?? [])
        .slice()
        .sort((a, b) => a.order - b.order);
      setQuestions(sortedQuestions);

      if (sortedQuestions.length > 0) {
        setSelectedQuestionId(sortedQuestions[0].questionId);
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "";
      if (
        errorMsg === "NOT_SUBMISSION_OWNER" ||
        errorMsg === "permission-denied" ||
        errorMsg === "forbidden" ||
        errorMsg.includes("403")
      ) {
        navigate("/403");
        return;
      }

      if (
        errorMsg === "SUBMISSION_NOT_FOUND" ||
        errorMsg === "EXAM_NOT_FOUND" ||
        errorMsg === "not-found" ||
        errorMsg.includes("404")
      ) {
        setInitialError("not-found");
        return;
      }

      toast.error(getApiErrorMessage(err));
      setInitialError("generic");
    } finally {
      setIsLoadingInitial(false);
    }
  }, [submissionId, navigate]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadInitialData();
  }, [loadInitialData]);

  function handleSelectQuestion(questionId: string): void {
    setSelectedQuestionId(questionId);
  }

  if (isLoadingInitial) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-10 h-10 text-teal-700 animate-spin mb-4" />
        <p className="text-sm font-medium text-neutral-800">
          Cargando entrega y evaluación...
        </p>
      </div>
    );
  }

  if (initialError === "not-found") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-12 h-12 text-neutral-400 mb-4" />
        <h2 className="text-h2 font-bold text-neutral-900 mb-2">
          La entrega no existe.
        </h2>
        <p className="text-body text-neutral-600 mb-6">
          No se encontró la entrega solicitada o fue eliminada.
        </p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-xs font-label uppercase tracking-label font-bold hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>
      </div>
    );
  }

  if (initialError === "generic") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-12 h-12 text-danger-600 mb-4" />
        <h2 className="text-h2 font-bold text-neutral-900 mb-2">
          Error al cargar la entrega
        </h2>
        <p className="text-body text-neutral-600 mb-6">
          Ocurrió un problema al obtener los datos. Por favor, intentá
          nuevamente.
        </p>
        <button
          type="button"
          onClick={() => loadInitialData()}
          className="px-4 py-2 bg-teal-700 text-white text-xs font-label uppercase tracking-label font-bold hover:bg-teal-800 transition-colors cursor-pointer"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const isGrading =
    detail?.answer.gradingStatus === "pending" ||
    detail?.answer.gradingStatus === "queued" ||
    detail?.answer.gradingStatus === "grading";
  const isFailed = detail?.answer.gradingStatus === "failed";
  const isGraded = detail?.answer.gradingStatus === "graded";

  const currentQuestion = questions.find(
    (q) => q.questionId === selectedQuestionId,
  );
  const maxPoints = detail?.question.points ?? currentQuestion?.points ?? "—";

  return (
    <div className="min-h-screen bg-background">
      {/*HEADER*/}
      <header className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-card border border-neutral-300">
        {/*EXAM INFO*/}
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-xs font-medium text-neutral-650 hover:text-neutral-900 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Volver a entregas
            </button>
            <span className="text-neutral-300">|</span>
            <span className="inline-flex items-center w-fit px-2 py-1 bg-neutral-100 text-neutral-900 font-label text-xs font-medium uppercase tracking-label-wide leading-none">
              AUDITORÍA Y REVISIÓN
            </span>
          </div>
          <h2
            title={examTitle}
            className="pt-1 text-h2 font-bold text-neutral-900 truncate"
          >
            {examTitle || "Examen"}
          </h2>
          <p className="text-body text-neutral-650 font-normal">
            Alumno: {studentId}
          </p>
        </div>
        {/*Points*/}
        <div className="flex flex-col sm:items-end gap-1 shrink-0">
          <span className="font-label text-xs font-medium uppercase tracking-label-wide leading-none text-neutral-650 sm:text-right">
            CALIFICACIÓN SUGERIDA (IA)
          </span>

          <div className="flex items-baseline sm:justify-end">
            <span className="text-display-lg font-bold leading-none tracking-display text-teal-700 sm:text-right">
              {detail?.answer.aiScore ?? "—"}
            </span>
            <span className="pl-2 text-h2 font-semibold text-neutral-650 sm:text-right">
              / {maxPoints}
            </span>
          </div>
        </div>
      </header>

      {/*QUESTION SELECTOR BAR*/}
      <div className="w-full px-6 pt-6 pb-2 flex items-center gap-3">
        <span className="font-label text-xs font-semibold uppercase tracking-label-wide text-neutral-650">
          PREGUNTAS:
        </span>
        <div
          role="tablist"
          aria-label="Preguntas del examen"
          className="flex items-center gap-2 flex-wrap"
        >
          {questions
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((q) => {
              const isSelected = q.questionId === selectedQuestionId;
              return (
                <button
                  key={q.questionId}
                  role="tab"
                  aria-selected={isSelected}
                  type="button"
                  onClick={() => handleSelectQuestion(q.questionId)}
                  className={cn(
                    "px-4 py-2 text-xs font-label uppercase tracking-label border transition-all cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-teal-700",
                    isSelected
                      ? "bg-teal-700 text-white border-teal-800 font-bold shadow-sm"
                      : "bg-card text-neutral-650 hover:text-neutral-900 hover:bg-neutral-100 border-neutral-300 font-medium",
                  )}
                >
                  P{q.order}
                </button>
              );
            })}
        </div>
      </div>

      {/*BODY*/}
      <main className="grid grid-cols-12 gap-4 p-6">
        {/*Student Submission (Column 1-7)*/}
        <section className="col-span-12 lg:col-span-7 min-h-[500px] p-6 bg-neutral-100 border border-neutral-300 flex flex-col">
          {/* Header de Student Submission */}
          <div className="w-full pb-4">
            <div className="w-full flex items-center justify-between pb-4 border-b border-neutral-650">
              <h3 className="flex items-center gap-2 text-h3 font-bold text-neutral-900">
                <FileText className="w-4 h-5 text-neutral-900" />
                <span>Respuesta del Estudiante</span>
              </h3>
            </div>
          </div>

          {/* Contenido de Student Submission */}
          <div className="w-full flex flex-col gap-4 pr-2 overflow-y-auto max-h-[434px]">
            {isLoadingAnswer ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 text-neutral-500 animate-spin" />
              </div>
            ) : (
              <p className="font-sans font-normal text-body leading-[26px] text-neutral-900 whitespace-pre-wrap break-words">
                {detail?.answer.text ?? "Sin respuesta registrada."}
              </p>
            )}
          </div>
        </section>

        {/*AI feedback (Column 8-12)*/}
        <section className="col-span-12 lg:col-span-5 min-h-[500px] p-6 bg-neutral-100 border border-neutral-300 flex flex-col">
          {/* Header de Análisis de IA */}
          <div className="w-full pb-4">
            <div className="w-full flex items-center justify-between pb-4 border-b border-neutral-650">
              <h3 className="flex items-center gap-2 text-h3 font-bold text-teal-700">
                <Cpu className="w-5 h-5 text-teal-700" />
                <span>Análisis de la IA</span>
              </h3>
            </div>
          </div>

          {/* Contenido de Análisis de IA según estado de corrección */}
          <div
            aria-live="polite"
            className="w-full flex flex-col gap-4 overflow-y-auto max-h-[434px] pr-2"
          >
            {isLoadingAnswer ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-6 h-6 text-teal-700 animate-spin" />
              </div>
            ) : isGrading ? (
              <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
                <Loader2 className="w-8 h-8 text-teal-700 animate-spin" />
                <p className="text-sm font-medium text-neutral-800">
                  La IA está corrigiendo esta respuesta…
                </p>
                <span className="font-label text-xs text-neutral-650">
                  Esto puede tomar unos segundos
                </span>
              </div>
            ) : isFailed ? (
              <div className="flex flex-col items-center justify-center py-12 text-center gap-3 p-4 bg-danger-50 border border-danger-200">
                <AlertCircle className="w-8 h-8 text-danger-600 shrink-0" />
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-bold text-danger-900">
                    La IA no pudo corregir esta respuesta.
                  </p>
                  {detail?.answer.lastGradingError && (
                    <p className="text-xs text-danger-700 font-mono mt-1">
                      {detail.answer.lastGradingError}
                    </p>
                  )}
                </div>
              </div>
            ) : isGraded ? (
              <>
                {/* aiFeedback en bloque destacado */}
                {detail?.answer.aiFeedback && (
                  <div className="border-l-4 border-teal-600 bg-teal-50/40 p-4 rounded-r-md">
                    <div className="flex flex-row gap-2 items-center">
                      <Sparkles className="h-4 w-4 shrink-0 text-teal-700" />
                      <h4 className="text-sm font-bold text-teal-800 tracking-label-wide uppercase">
                        Feedback General de la IA
                      </h4>
                    </div>
                    <p className="mt-2 text-sm text-neutral-800 leading-relaxed whitespace-pre-wrap">
                      {detail.answer.aiFeedback}
                    </p>
                  </div>
                )}

                {/* Lista de AnalysisItemCards */}
                {detail?.analysisItems && detail.analysisItems.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {detail.analysisItems.map((item) => (
                      <AnalysisItemCard key={item.itemId} item={item} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-neutral-650 italic">
                    No hay criterios de análisis disponibles para esta pregunta.
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-neutral-650 italic">
                No hay información de evaluación disponible.
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
