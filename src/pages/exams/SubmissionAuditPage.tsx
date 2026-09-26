import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Cpu, FileText, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils.ts";
import { AnalysisItemCard } from "@/components/data-display/AnalysisItemCard.tsx";
import type { AnswerDetail } from "@/types/audit.ts";
import type { Question } from "@/types/exam.ts";

// TODO: [Integración 4.1.3] reemplazar mocks por submissionService.
const MOCK_EXAM_TITLE = "Primer Parcial - Análisis Estructural";
const MOCK_STUDENT_ID = "88492";
const MOCK_STUDENT_NAME = "Martín Gómez";
const MOCK_RESOLUTION_TIME = "45 min";

const MOCK_QUESTIONS: Pick<
  Question,
  "questionId" | "title" | "order" | "points"
>[] = [
  {
    questionId: "q1",
    title: "Pregunta 1: Método de las Fuerzas",
    order: 1,
    points: 100,
  },
  {
    questionId: "q2",
    title: "Pregunta 2: Deformaciones y Flechas",
    order: 2,
    points: 100,
  },
  {
    questionId: "q3",
    title: "Pregunta 3: Teorema de Castigliano",
    order: 3,
    points: 100,
  },
];

const MOCK_ANSWER_DETAILS_MAP: Record<string, AnswerDetail> = {
  q1: {
    question: {
      questionId: "q1",
      order: 1,
      title: "Pregunta 1: Método de las Fuerzas",
      prompt:
        "Dado el pórtico hiperestático con carga puntual y distribuida, determine las reacciones de vínculo y diagramas de solicitaciones mediante el método de las fuerzas.",
      points: 100,
      idealAnswer:
        "El estudiante debe seleccionar el sistema fundamental eliminando la redundante estática en el apoyo central, plantear la ecuación de compatibilidad geométrica delta_10 + X1 * delta_11 = 0, y calcular los diagramas finales por superposición de efectos.",
    },
    answer: {
      questionId: "q1",
      text: "Selecciono como redundante la reacción vertical en B. Planteo el sistema fundamental isostático con la carga distribuida q. Para el estado '0', calculo momentos flectores M0. Para el estado '1', aplico carga unitaria virtual en B. Calculo desplazamientos por el método de trabajo virtual...",
      submittedAt: "2026-09-26T10:30:00.000Z",
      gradingStatus: "graded",
      gradingAttempts: 1,
      aiScore: 85,
      finalScore: 85,
      aiFeedback:
        "Buen planteo conceptual. Hubo un error de cálculo menor en la integral de desplazamiento delta_10, pero el procedimiento posterior de equilibrio estático es coherente.",
      teacherEdited: false,
      gradedAt: "2026-09-26T10:35:00.000Z",
    },
    analysisItems: [
      {
        itemId: "item-1",
        criterionId: "c1",
        title: "Metodología y Sistema Fundamental",
        description:
          "El estudiante identifica correctamente la hiperestaticidad del sistema y aplica el método de las fuerzas de manera adecuada para encontrar la reacción redundante.",
        points: 50,
        source: "ai",
        order: 1,
        createdAt: "2026-09-26T10:35:00.000Z",
      },
      {
        itemId: "item-2",
        criterionId: "c2",
        title: "Error de Cálculo en Desplazamiento",
        description:
          "En el cálculo del desplazamiento Δ10, hay un error en el término de la carga puntual P. La fórmula utilizada asume la carga en el centro del vano, pero según el enunciado x_p = L/3.",
        points: 0,
        source: "ai",
        order: 2,
        createdAt: "2026-09-26T10:35:00.000Z",
      },
      {
        itemId: "item-3",
        criterionId: "c3",
        title: "Procedimiento y Equilibrio Final",
        description:
          "A pesar del error en el valor numérico de la redundante, la sustitución en las ecuaciones de equilibrio estático para encontrar las restantes reacciones es coherente con su resultado intermedio.",
        points: 35,
        source: "ai",
        order: 3,
        createdAt: "2026-09-26T10:35:00.000Z",
      },
    ],
  },
  q2: {
    question: {
      questionId: "q2",
      order: 2,
      title: "Pregunta 2: Deformaciones y Flechas",
      prompt:
        "Calcule la flecha máxima en una viga simplemente apoyada sometida a una carga uniforme q mediante integración directa de la elástica.",
      points: 100,
      idealAnswer:
        "Plantear EI * y'' = -M(x). Integrar dos veces e imponer las condiciones de contorno y(0) = 0 e y(L) = 0 para obtener la flecha máxima f_max = (5*q*L^4)/(384*E*I) en x = L/2.",
    },
    answer: {
      questionId: "q2",
      text: "Planteo la ecuación diferencial de la elástica EI y''(x) = - (q*x/2)*(L - x). Integro una vez para obtener la pendiente y dos veces para la flecha. Evaluando en los apoyos x=0 y x=L obtengo las constantes C1 y C2. El punto medio x=L/2 da la flecha máxima...",
      submittedAt: "2026-09-26T10:30:00.000Z",
      gradingStatus: "grading",
      gradingAttempts: 1,
      teacherEdited: false,
    },
    analysisItems: [],
  },
  q3: {
    question: {
      questionId: "q3",
      order: 3,
      title: "Pregunta 3: Teorema de Castigliano",
      prompt:
        "Explique los fundamentos del segundo teorema de Castigliano y aplíquelo para determinar el desplazamiento vertical en el extremo libre de una ménsula con carga puntual P.",
      points: 100,
      idealAnswer:
        "Definir la energía de deformación U = integral(M^2/(2EI) dx). Derivar respecto a P: delta = dU/dP = integral(M/EI * dM/dP dx). Para ménsula M = -P(L-x), dM/dP = -(L-x), integrando resulta delta = P*L^3/(3EI).",
    },
    answer: {
      questionId: "q3",
      text: "La energía de deformación total por flexión es U = 1/2 * integral(M^2/EI dx). Al derivar respecto a la fuerza puntual en el punto de aplicación obtenemos el desplazamiento...",
      submittedAt: "2026-09-26T10:30:00.000Z",
      gradingStatus: "failed",
      gradingAttempts: 3,
      lastGradingError:
        "Tiempo de espera agotado al conectar con el servicio del modelo de IA.",
      teacherEdited: false,
    },
    analysisItems: [],
  },
};

export function SubmissionAuditPage() {
  const { submissionId } = useParams<{ submissionId: string }>();
  const navigate = useNavigate();

  // TODO: [Integración 4.1.3] reemplazar mocks por submissionService.
  const [examTitle] = useState<string>(MOCK_EXAM_TITLE);
  const [studentId] = useState<string>(MOCK_STUDENT_ID);
  const [studentName] = useState<string>(MOCK_STUDENT_NAME);
  const [resolutionTime] = useState<string>(MOCK_RESOLUTION_TIME);
  const [questions] =
    useState<Pick<Question, "questionId" | "title" | "order" | "points">[]>(
      MOCK_QUESTIONS,
    );
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>(
    MOCK_QUESTIONS[0]?.questionId ?? "",
  );
  const [detail, setDetail] = useState<AnswerDetail | null>(
    MOCK_ANSWER_DETAILS_MAP[MOCK_QUESTIONS[0]?.questionId] ?? null,
  );

  function handleSelectQuestion(questionId: string): void {
    setSelectedQuestionId(questionId);
    setDetail(MOCK_ANSWER_DETAILS_MAP[questionId] ?? null);
    // TODO: [Integración 4.1.3] fetchAnswerDetail(submissionId, questionId)
  }

  void {
    submissionId,
    examTitle,
    studentId,
    studentName,
    questions,
    selectedQuestionId,
    handleSelectQuestion,
    detail,
    setDetail,
  };

  const isGrading =
    detail?.answer.gradingStatus === "pending" ||
    detail?.answer.gradingStatus === "queued" ||
    detail?.answer.gradingStatus === "grading";
  const isFailed = detail?.answer.gradingStatus === "failed";
  const isGraded = detail?.answer.gradingStatus === "graded";

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
            <span className="inline-flex items-center w-fit px-2 py-1 bg-neutral-100 text-neutral-900 font-label text-xs font-medium uppercase tracking-[1.2px] leading-none">
              AUDITORÍA Y REVISIÓN
            </span>
          </div>
          <h2 className="pt-1 text-h2 font-bold text-neutral-900 truncate">
            {examTitle}
          </h2>
          <p className="text-body text-neutral-650 font-normal">
            Alumno: {studentId} ({studentName})
          </p>
        </div>
        {/*Points*/}
        <div className="flex flex-col sm:items-end gap-1 shrink-0">
          <span className="font-label text-xs font-medium uppercase tracking-[1.2px] leading-none text-neutral-650 sm:text-right">
            CALIFICACIÓN SUGERIDA (IA)
          </span>

          <div className="flex items-baseline sm:justify-end">
            <span className="text-[48px] font-bold leading-[1.1] tracking-[-0.96px] text-teal-700 sm:text-right">
              {detail?.answer.aiScore ?? "—"}
            </span>
            <span className="pl-2 text-h2 font-semibold text-neutral-650 sm:text-right">
              / {detail?.question.points ?? 100}
            </span>
          </div>
        </div>
      </header>

      {/*QUESTION SELECTOR BAR*/}
      <div className="w-full px-6 pt-6 pb-2 flex items-center gap-3">
        <span className="font-label text-xs font-semibold uppercase tracking-[1.2px] text-neutral-650">
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
                    "px-4 py-2 text-xs font-label uppercase tracking-[0.6px] border transition-all cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-teal-700",
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
              <div className="font-label text-xs font-medium tracking-[0.6px] text-neutral-650">
                Tiempo de resolución: {resolutionTime}
              </div>
            </div>
          </div>

          {/* Contenido de Student Submission (w-full flex flex-col gap-4 pr-2) */}
          <div className="w-full flex flex-col gap-4 pr-2 overflow-y-auto max-h-[434px]">
            <p className="font-sans font-normal text-body leading-[26px] text-neutral-900 whitespace-pre-wrap break-words">
              {detail?.answer.text ?? "Sin respuesta registrada."}
            </p>
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
            {isGrading && (
              <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
                <Loader2 className="w-8 h-8 text-teal-700 animate-spin" />
                <p className="text-sm font-medium text-neutral-800">
                  La IA está corrigiendo esta respuesta…
                </p>
                <span className="font-label text-xs text-neutral-650">
                  Esto puede tomar unos segundos
                </span>
              </div>
            )}

            {isFailed && (
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
            )}

            {isGraded && (
              <>
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
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
