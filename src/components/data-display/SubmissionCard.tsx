import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { SUBMISSION_STATUS_LABELS, type Submission } from "@/types/submission";

interface SubmissionCardProps {
  submission: Submission;
  onOpen: (submissionId: string) => void;
}

function getStatusClass(status: Submission["status"]) {
  if (status === "reviewed") return "border-teal-700 bg-teal-50 text-teal-700";
  if (status === "grading" || status === "awaiting_approval")
    return "border-blue-600 bg-blue-50 text-blue-600";
  if (status === "error")
    return "border-danger-500 bg-danger-50 text-danger-500";
  return "border-neutral-500 bg-neutral-100 text-neutral-700";
}

export function SubmissionCard({ submission, onOpen }: SubmissionCardProps) {
  const {
    submissionId,
    studentId,
    status,
    gradedCount,
    questionCount,
    totalScore,
    totalPossible,
  } = submission;

  return (
    <Card className="rounded-none border border-neutral-650 py-0 shadow-hard ring-0">
      <CardHeader className="flex flex-col items-stretch gap-4 px-6 pt-6 pb-4">
        <div className="flex items-start justify-between">
          <h3 className="text-h2 font-bold text-neutral-900">
            Alumno: {studentId}
          </h3>
          <Badge
            variant="outline"
            className={`label-micro h-auto rounded-none px-2 py-1 ${getStatusClass(status)}`}
          >
            {SUBMISSION_STATUS_LABELS[status]}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex items-end justify-between border-t border-b border-neutral-650 mx-6 px-0 py-6">
        <div className="space-y-0.5">
          <p className="label-micro text-neutral-650">CORREGIDAS</p>
          <p className="text-body font-medium text-neutral-900">
            {gradedCount} / {questionCount}
          </p>
        </div>
        <div className="space-y-0.5 text-right">
          <p className="label-micro text-neutral-650">NOTA</p>
          <p className="text-body font-bold text-teal-700">
            {totalScore ?? "—"} / {totalPossible}
          </p>
        </div>
      </CardContent>

      <CardFooter className="bg-card p-4">
        <Button
          onClick={() => onOpen(submissionId)}
          disabled={status === "in_progress"}
          className="h-13 w-full text-base font-bold hover:border-teal-700 hover:bg-card hover:text-teal-700"
        >
          Ver evaluación
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
