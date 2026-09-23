import { useState } from "react";
import { ChevronDown, Pencil, Trash2 } from "lucide-react";
import { AICallout } from "@/components/data-display/AICallout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Question, QuestionType } from "@/types/exam.ts";

interface Props {
  question: Question;
  index: number;
  isEditing: boolean;
  onEdit: (questionId: string) => void;
  onDelete: (questionId: string) => void;
  onSave: (updateQuestion: Question) => void;
  onCancel: () => void;
}

const DEFAULT_QUESTION_TYPE: QuestionType = "essay";

// `type` es opcional en Question. Sumar entradas acá alcanza para extender
// tanto el select del formulario como el badge de la vista de lectura.
const QUESTION_TYPE_OPTIONS: {
  value: QuestionType;
  label: string;
  badge: string;
}[] = [{ value: "essay", label: "Desarrollo (Ensayo)", badge: "DESARROLLO" }];

const LABEL_CLASS = "label-micro text-neutral-650";
const ERROR_CLASS =
  "aria-invalid:border-danger-500 aria-invalid:ring-3 aria-invalid:ring-danger-500/20 dark:aria-invalid:border-danger-500 dark:aria-invalid:ring-danger-500/20";
const INPUT_CLASS = `h-10 rounded-md border-neutral-300 bg-white px-3 text-base text-neutral-900 focus-visible:border-teal-600 md:text-base ${ERROR_CLASS}`;
const SELECT_CLASS =
  "h-10 w-full cursor-pointer appearance-none rounded-md border border-neutral-300 bg-white px-3 pr-10 text-base text-neutral-900 outline-none focus-visible:border-teal-600";
const TEXTAREA_CLASS = `min-h-[90px] w-full resize-y rounded-md border border-neutral-300 bg-white p-3 text-base text-neutral-900 outline-none placeholder:text-muted-foreground focus-visible:border-teal-600 focus-visible:ring-3 focus-visible:ring-ring/50 ${ERROR_CLASS}`;
const PROMPT_LABEL_CLASS =
  "text-micro font-bold tracking-wider text-neutral-500 uppercase";

function parseDigits(raw: string): number {
  const digits = raw.replace(/\D/g, "");
  return digits === "" ? 0 : Number(digits);
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-sm text-danger-500">
      {message}
    </p>
  );
}

function questionTypeOf(question: Question) {
  const type = question.type ?? DEFAULT_QUESTION_TYPE;
  return (
    QUESTION_TYPE_OPTIONS.find((option) => option.value === type) ??
    QUESTION_TYPE_OPTIONS[0]
  );
}

function validateQuestion(draft: Question): Record<string, string> {
  const errors: Record<string, string> = {};
  if (draft.prompt.trim() === "")
    errors.prompt = "El enunciado no puede quedar vacío";
  if (!(draft.points > 0)) errors.points = "El puntaje debe ser mayor a 0";
  if (draft.idealAnswer.trim() === "")
    errors.idealAnswer = "La respuesta ideal no puede quedar vacía";
  return errors;
}

function QuestionReadView({
  question,
  index,
  onEdit,
  onDelete,
}: Pick<Props, "question" | "index" | "onEdit" | "onDelete">) {
  const typeOption = questionTypeOf(question);

  return (
    <div className="space-y-4 rounded-lg border border-neutral-300 bg-card p-6 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <Badge
            variant="outline"
            className="h-6 rounded-md border-neutral-300 bg-neutral-100 px-2 font-label tracking-label text-neutral-700"
          >
            P{index}
          </Badge>
          <h3 className="text-body font-bold text-neutral-900">
            {question.title.trim() === ""
              ? "Pregunta sin título"
              : question.title}
          </h3>
          <Badge
            variant="outline"
            className="h-5.5 rounded-xs border-teal-700 bg-teal-700/20 px-2 py-1 font-label tracking-label text-teal-800"
          >
            {typeOption.badge}
          </Badge>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="text-sm font-semibold text-neutral-700">
            {question.points} Puntos
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Editar pregunta"
            onClick={() => onEdit(question.questionId)}
            className="text-neutral-650"
          >
            <Pencil className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Eliminar pregunta"
            onClick={() => onDelete(question.questionId)}
            className="text-danger-500"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className={PROMPT_LABEL_CLASS}>Prompt / Enunciado</span>
        <p className="text-sm leading-relaxed font-medium whitespace-pre-wrap text-neutral-800">
          {question.prompt}
        </p>
      </div>

      <AICallout mode="view" value={question.idealAnswer} />
    </div>
  );
}

function QuestionEditForm({
  question,
  index,
  onDelete,
  onSave,
  onCancel,
}: Pick<Props, "question" | "index" | "onDelete" | "onSave" | "onCancel">) {
  // Este componente se monta de cero cada vez que se abre la edición, así que el
  // borrador siempre arranca de los datos persistidos y "Cancelar" los descarta.
  const [draft, setDraft] = useState<Question>(question);
  const [submitted, setSubmitted] = useState(false);

  const { questionId } = question;
  const errors = validateQuestion(draft);
  const visibleErrors: Record<string, string> = submitted ? errors : {};

  const updateDraft = (changes: Partial<Question>) =>
    setDraft((prev) => ({ ...prev, ...changes }));

  const handleConfirm = () => {
    setSubmitted(true);
    if (Object.keys(errors).length > 0) return;
    onSave({ ...draft, type: draft.type ?? DEFAULT_QUESTION_TYPE });
  };

  return (
    <div className="space-y-5 rounded-lg border-2 border-teal-600 bg-card p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-1 items-end gap-3">
          <span className="rounded bg-teal-900 px-2 py-1 text-sm font-bold text-white">
            P{index}
          </span>
          <div className="flex flex-1 flex-col gap-2">
            <Label
              htmlFor={`question-title-${questionId}`}
              className="label-micro text-teal-800"
            >
              Editando pregunta
            </Label>
            <Input
              id={`question-title-${questionId}`}
              value={draft.title}
              onChange={(e) => updateDraft({ title: e.target.value })}
              placeholder="Ej. Desarrollo Temático"
              className={`${INPUT_CLASS} font-bold`}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label
            htmlFor={`question-points-${questionId}`}
            className={LABEL_CLASS}
          >
            Puntos
          </Label>
          <Input
            id={`question-points-${questionId}`}
            inputMode="numeric"
            value={draft.points === 0 ? "" : draft.points}
            onChange={(e) =>
              updateDraft({ points: parseDigits(e.target.value) })
            }
            placeholder="0"
            aria-invalid={!!visibleErrors.points}
            aria-describedby={
              visibleErrors.points
                ? `question-points-error-${questionId}`
                : undefined
            }
            className={`${INPUT_CLASS} w-20 text-center font-bold`}
          />
          <FieldError
            id={`question-points-error-${questionId}`}
            message={visibleErrors.points}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label
          htmlFor={`question-prompt-${questionId}`}
          className={LABEL_CLASS}
        >
          Enunciado de la pregunta
        </Label>
        <textarea
          id={`question-prompt-${questionId}`}
          value={draft.prompt}
          onChange={(e) => updateDraft({ prompt: e.target.value })}
          placeholder="Escriba la pregunta aquí..."
          aria-invalid={!!visibleErrors.prompt}
          aria-describedby={
            visibleErrors.prompt
              ? `question-prompt-error-${questionId}`
              : undefined
          }
          className={TEXTAREA_CLASS}
        />
        <FieldError
          id={`question-prompt-error-${questionId}`}
          message={visibleErrors.prompt}
        />
      </div>

      <div className="flex flex-col gap-2 md:w-69">
        <Label htmlFor={`question-type-${questionId}`} className={LABEL_CLASS}>
          Tipo de pregunta
        </Label>
        <div className="relative">
          <select
            id={`question-type-${questionId}`}
            value={draft.type ?? DEFAULT_QUESTION_TYPE}
            onChange={(e) =>
              updateDraft({ type: e.target.value as QuestionType })
            }
            className={SELECT_CLASS}
          >
            {QUESTION_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-neutral-500" />
        </div>
      </div>

      <AICallout
        mode="edit"
        value={draft.idealAnswer}
        onChange={(idealAnswer) => updateDraft({ idealAnswer })}
        error={visibleErrors.idealAnswer}
      />

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="outline" size="lg" onClick={onCancel}>
          Cancelar
        </Button>
        <Button
          variant="destructive"
          size="lg"
          onClick={() => onDelete(questionId)}
        >
          <Trash2 className="size-4" />
          Eliminar
        </Button>
        <Button size="lg" onClick={handleConfirm}>
          Confirmar
        </Button>
      </div>
    </div>
  );
}

export default function QuestionCard(props: Props) {
  const { question, index, isEditing, onEdit, onDelete, onSave, onCancel } =
    props;

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
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
}
