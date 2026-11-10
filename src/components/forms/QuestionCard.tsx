import { QuestionEditForm } from "@/components/forms/QuestionEditForm";
import { QuestionReadView } from "@/components/forms/QuestionReadView";
import type { Question, RubricCriterion } from "@/types/exam.ts";

export interface QuestionCardProps {
  question: Question;
  index: number;
  isEditing: boolean;
  onEdit: (questionId: string) => void;
  onDelete: (questionId: string) => void;
  onSave: (updateQuestion: Question) => void;
  onCancel: () => void;
  criteria?: RubricCriterion[];
  disabled?: boolean;
}

export default function QuestionCard({
  question,
  index,
  isEditing,
  onEdit,
  onDelete,
  onSave,
  onCancel,
  criteria,
  disabled = false,
}: QuestionCardProps) {
  // En modo solo lectura nunca se muestra el formulario de edición.
  if (isEditing && !disabled) {
    return (
      <QuestionEditForm
        question={question}
        index={index}
        onDelete={onDelete}
        onSave={onSave}
        onCancel={onCancel}
        criteria={criteria}
      />
    );
  }

  return (
    <QuestionReadView
      question={question}
      index={index}
      onEdit={() => onEdit(question.questionId)}
      onDelete={onDelete}
      criteria={criteria}
      disabled={disabled}
    />
  );
}
