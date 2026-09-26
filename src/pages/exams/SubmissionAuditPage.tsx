import { useState } from "react";
import { useParams } from "react-router-dom";
import type { AnswerDetail } from "@/types/audit.ts";
import type { Question } from "@/types/exam.ts";

// TODO: [Integración 4.1.3] reemplazar mocks por submissionService.
const MOCK_EXAM_TITLE = "Primer Parcial - Análisis Estructural";
const MOCK_STUDENT_ID = "88492";
const MOCK_STUDENT_NAME = "Martín Gómez";

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

const MOCK_ANSWER_DETAIL: AnswerDetail = {
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
};

export function SubmissionAuditPage() {
  const { submissionId } = useParams<{ submissionId: string }>();

  // TODO: [Integración 4.1.3] reemplazar mocks por submissionService.
  const [examTitle] = useState<string>(MOCK_EXAM_TITLE);
  const [studentId] = useState<string>(MOCK_STUDENT_ID);
  const [studentName] = useState<string>(MOCK_STUDENT_NAME);
  const [questions] =
    useState<Pick<Question, "questionId" | "title" | "order" | "points">[]>(
      MOCK_QUESTIONS,
    );
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>(
    MOCK_QUESTIONS[0]?.questionId ?? "",
  );
  const [detail, setDetail] = useState<AnswerDetail | null>(MOCK_ANSWER_DETAIL);

  void {
    submissionId,
    examTitle,
    studentId,
    studentName,
    questions,
    selectedQuestionId,
    setSelectedQuestionId,
    detail,
    setDetail,
  };

  return (
    <div className="min-h-screen">
      {/*HEADER*/}
      <header className="w-full flex items-center justify-between p-6 bg-card border border-neutral-300">
        {/*EXAM INFO*/}
        <div className="flex flex-col gap-1">
          <div>
            <span className="inline-flex items-center w-fit px-2 py-1 bg-neutral-100 text-neutral-900 font-label text-xs font-medium uppercase tracking-[1.2px] leading-none">
              AUDITORÍA Y REVISIÓN
            </span>
          </div>
          <h2 className="pt-1 text-h2 font-bold text-neutral-900">
            {examTitle}
          </h2>
          <p className="text-body text-neutral-650 font-normal">
            Estudiante: {studentName} (Legajo: {studentId})
          </p>
        </div>
        {/*Points*/}
        <div className="flex flex-col items-end gap-1">
          <span className="font-label text-xs font-medium uppercase tracking-[1.2px] leading-none text-neutral-650 text-right">
            CALIFICACIÓN SUGERIDA (IA)
          </span>

          <div className="flex items-baseline justify-end">
            <span className="text-[48px] font-bold leading-[1.1] tracking-[-0.96px] text-teal-700 text-right">
              {detail?.answer.aiScore ?? 85}
            </span>
            <span className="pl-2 text-h2 font-semibold text-neutral-650 text-right">
              / 100
            </span>
          </div>
        </div>
      </header>
      {/*BODY*/}
      <div></div>
    </div>
  );
}
