import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DEFAULT_QUESTION_TYPE } from "@/lib/questionTypes";
import type { Question } from "@/types/exam.ts";
import { WizardStepper } from "@/components/layout/WizardStepper.tsx";
import QuestionCard from "@/components/forms/QuestionCard.tsx";
import { ExamSummaryBanner } from "@/components/data-display/ExamSummaryBanner.tsx";
import { toast } from "@/components/handler/toastHandler.tsx";

// TODO: reemplazar por el hook real que trae el examen (useExam(examId) o
// similar). Se asume que expone al menos title/subject/semester/questions.
function useExamDraft(examId: string | undefined) {
  const [exam, setExam] = useState({
    examId: examId ?? "",
    title: "",
    subject: "",
    semester: "",
    questions: [] as Question[],
  });
  return { exam, setExam };
}

function createDraftQuestion(): Question {
  return {
    questionId: crypto.randomUUID(),
    title: "",
    prompt: "",
    order: 1,
    points: 0,
    type: DEFAULT_QUESTION_TYPE,
    idealAnswer: "",
  };
}

// Un borrador se considera "vacío" si el docente no llegó a escribir nada;
// se descarta al cancelar en vez de dejar una pregunta fantasma en la lista.
function isEmptyDraft(question: Question): boolean {
  return question.prompt.trim() === "" && question.idealAnswer.trim() === "";
}

// Devuelve el primer motivo por el que el examen no se puede publicar, o null
// si está listo. No valida `title`: QuestionEditForm todavía no expone ese
// campo, así que exigirlo haría imposible publicar.
function getPublishError(
  questions: Question[],
  editingQuestionId: string | null,
): string | null {
  if (questions.length === 0) {
    return "Agregá al menos una pregunta antes de publicar.";
  }
  if (editingQuestionId !== null) {
    return "Confirmá o cancelá la pregunta que estás editando.";
  }
  const hasIncomplete = questions.some(
    (q) =>
      q.prompt.trim() === "" || q.idealAnswer.trim() === "" || !(q.points > 0),
  );
  if (hasIncomplete) {
    return "Hay preguntas incompletas: revisá enunciado, puntos y respuesta ideal.";
  }
  if (questions.reduce((sum, q) => sum + q.points, 0) <= 0) {
    return "El puntaje total del examen debe ser mayor a 0.";
  }
  return null;
}

export function ExamQuestionsEditor() {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();

  //TODO: reemplazar por el hook real
  const { exam, setExam } = useExamDraft(examId);
  const { questions } = exam;
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(
    null,
  );

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  const setQuestions = (updater: (prev: Question[]) => Question[]) =>
    setExam((prev) => ({ ...prev, questions: updater(prev.questions) }));

  const handleAddQuestion = () => {
    const draft = createDraftQuestion();
    setQuestions((prev) => [...prev, draft]);
    setEditingQuestionId(draft.questionId);
  };

  const handleSaveQuestion = (updated: Question) => {
    setQuestions((prev) =>
      prev.map((q) => (q.questionId === updated.questionId ? updated : q)),
    );
    setEditingQuestionId(null);
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

  const handleDeleteQuestion = (questionId: string) => {
    setQuestions((prev) => prev.filter((q) => q.questionId !== questionId));
    setEditingQuestionId((current) =>
      current === questionId ? null : current,
    );
  };

  const handleBack = () => {
    navigate(`/teacher/exams/${examId}/config`);
  };

  const handlePublish = () => {
    const publishError = getPublishError(questions, editingQuestionId);
    if (publishError) {
      toast.error(publishError);
      return;
    }

    // TODO: persistir vía el endpoint real antes de navegar.
    console.log("Guardar y publicar", { exam, totalPoints });
  };

  return (
    <div className="mx-auto mt-3.5 px-4 pb-12">
      <WizardStepper currentStep="questions" />

      <h1 className="text-h1 mt-4 mb-6 font-bold text-neutral-900">
        Editor de Preguntas
      </h1>

      <ExamSummaryBanner
        title={exam.title ? exam.title : "Titulo"}
        subtitle=""
        totalQuestions={exam.questions.length}
        totalPoints={totalPoints}
      />

      <div className="mt-6 flex flex-col gap-4">
        {questions.map((question, index) => (
          <QuestionCard
            key={question.questionId}
            question={question}
            index={index + 1}
            isEditing={editingQuestionId === question.questionId}
            onEdit={setEditingQuestionId}
            onCancel={() => handleCancelEdit(question.questionId)}
            onSave={handleSaveQuestion}
            onDelete={handleDeleteQuestion}
          />
        ))}

        <button
          type="button"
          onClick={handleAddQuestion}
          className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-neutral-300 bg-white/50 py-6 text-center transition-colors hover:border-neutral-500 hover:bg-white"
        >
          <Plus className="size-5 text-neutral-650" />
          <span className="label-micro text-neutral-650">
            Agregar nueva pregunta
          </span>
        </button>
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-neutral-300 pt-6">
        <Button variant="outline" onClick={handleBack}>
          Volver a las rúbricas
        </Button>
        <Button className="font-bold" onClick={handlePublish}>
          Guardar y publicar
        </Button>
      </div>
    </div>
  );
}
