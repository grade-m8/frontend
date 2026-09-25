import { QuestionEditForm } from "@/components/forms/QuestionEditForm";
import { QuestionReadView } from "@/components/forms/QuestionReadView";
import type { Question } from "@/types/exam.ts";

export interface QuestionCardProps {
  question: Question;
  index: number;
  isEditing: boolean;
  onEdit: (questionId: string) => void;
  onDelete: (questionId: string) => void;
  onSave: (updateQuestion: Question) => void;
  onCancel: () => void;
}

export default function QuestionCard({
  question,
  index,
  isEditing,
  onEdit,
  onDelete,
  onSave,
  onCancel,
}: QuestionCardProps) {
  if (isEditing) {
    return (
      <QuestionEditForm
        question={question}
        index={index}
        onDelete={onDelete}
        onSave={onSave}
        onCancel={onCancel}
      />
    );
  }

  return (
    <QuestionReadView
      question={question}
      index={index}
      onEdit={() => onEdit(question.questionId)}
      onDelete={onDelete}
    />
  );
}
