import { QuestionEditForm } from "@/components/forms/QuestionEditForm";
import { QuestionReadView } from "@/components/forms/QuestionReadView";
import type { Question } from "@/types/exam.ts";
import { useState } from "react";

export interface QuestionCardProps {
  question: Question;
  index: number;
  isEditing: boolean;
  onEdit: (questionId: string) => void;
  onDelete: (questionId: string) => void;
  onSave: (updateQuestion: Question) => void;
  onCancel: () => void;
}

export default function QuestionCard(props: QuestionCardProps) {
  const { question, index, isEditing, onDelete, onSave, onCancel } = props;
  const [editMode, setEditMode] = useState<boolean>(isEditing);
  const handleReadEdit = () => setEditMode(true);

  if (editMode) {
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
      onEdit={handleReadEdit}
      onDelete={onDelete}
    />
  );
}
