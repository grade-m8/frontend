import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { SubmissionCard } from "@/components/data-display/SubmissionCard";
import { Button } from "@/components/ui/button";
import type { Submission } from "@/types/submission";

const MOCK_LOAD_DELAY_MS = 600;
const MOCK_APPROVE_DELAY_MS = 600;

// TODO: [Integración 4.1.3] reemplazar mocks por submissionService
const MOCK_SUBMISSIONS_BY_EXAM: Record<string, Submission[]> = {
  e1: [
    {
      submissionId: "s1",
      examId: "e1",
      subjectId: "sub1",
      studentId: "alumno-001",
      teacherId: "t1",
      status: "in_progress",
      startedAt: "2026-09-29T10:00:00.000Z",
      totalPossible: 10,
      answeredCount: 1,
      gradedCount: 0,
      questionCount: 4,
    },
    {
      submissionId: "s2",
      examId: "e1",
      subjectId: "sub1",
      studentId: "alumno-002",
      teacherId: "t1",
      status: "submitted",
      startedAt: "2026-09-29T10:00:00.000Z",
      submittedAt: "2026-09-29T10:40:00.000Z",
      totalPossible: 10,
      answeredCount: 4,
      gradedCount: 0,
      questionCount: 4,
    },
    {
      submissionId: "s3",
      examId: "e1",
      subjectId: "sub1",
      studentId: "alumno-003",
      teacherId: "t1",
      status: "grading",
      startedAt: "2026-09-29T10:00:00.000Z",
      submittedAt: "2026-09-29T10:40:00.000Z",
      totalScore: 3,
      totalPossible: 10,
      answeredCount: 4,
      gradedCount: 2,
      questionCount: 4,
    },
    {
      submissionId: "s4",
      examId: "e1",
      subjectId: "sub1",
      studentId: "alumno-004",
      teacherId: "t1",
      status: "awaiting_approval",
      startedAt: "2026-09-29T10:00:00.000Z",
      submittedAt: "2026-09-29T10:40:00.000Z",
      totalScore: 8,
      totalPossible: 10,
      answeredCount: 4,
      gradedCount: 4,
      questionCount: 4,
    },
    {
      submissionId: "s5",
      examId: "e1",
      subjectId: "sub1",
      studentId: "alumno-005",
      teacherId: "t1",
      status: "reviewed",
      startedAt: "2026-09-29T10:00:00.000Z",
      submittedAt: "2026-09-29T10:40:00.000Z",
      totalScore: 9,
      totalPossible: 10,
      answeredCount: 4,
      gradedCount: 4,
      questionCount: 4,
      teacherReviewedAt: "2026-09-29T12:00:00.000Z",
      teacherReviewedBy: "t1",
    },
    {
      submissionId: "s6",
      examId: "e1",
      subjectId: "sub1",
      studentId: "alumno-006",
      teacherId: "t1",
      status: "error",
      startedAt: "2026-09-29T10:00:00.000Z",
      submittedAt: "2026-09-29T10:40:00.000Z",
      totalScore: 1,
      totalPossible: 10,
      answeredCount: 4,
      gradedCount: 1,
      questionCount: 4,
    },
  ],
};

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function ExamSubmissionsPage() {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();

  // TODO: [Integración 4.1.3] reemplazar mocks por submissionService
  const [examTitle] = useState("Primer Parcial");
  const [loaded, setLoaded] = useState<{
    examId: string;
    submissions: Submission[];
  } | null>(null);
  const [isApproving, setIsApproving] = useState(false);

  const current = loaded && loaded.examId === examId ? loaded : null;
  const isLoading = current === null;
  const submissions = current?.submissions ?? [];

  useEffect(() => {
    void wait(MOCK_LOAD_DELAY_MS).then(() => {
      setLoaded({
        examId: examId ?? "",
        submissions: MOCK_SUBMISSIONS_BY_EXAM[examId ?? ""] ?? [],
      });
    });
  }, [examId]);

  const pendingCount = submissions.filter(
    (s) => s.status === "awaiting_approval",
  ).length;

  const handleApproveAll = async () => {
    setIsApproving(true);
    try {
      await wait(MOCK_APPROVE_DELAY_MS);
      setLoaded((prev) =>
        prev
          ? {
              ...prev,
              submissions: prev.submissions.map((s) =>
                s.status === "awaiting_approval"
                  ? { ...s, status: "reviewed" }
                  : s,
              ),
            }
          : prev,
      );
    } finally {
      setIsApproving(false);
    }
  };

  const handleOpenSubmission = (submissionId: string) => {
    navigate(`/teacher/submissions/${submissionId}`);
  };

  return (
    <>
      <PageHeader
        title={examTitle}
        subtitle="Entregas y corrección con IA"
        actions={
          <Button
            className="gap-2 h-12 font-bold cursor-pointer"
            onClick={handleApproveAll}
            disabled={pendingCount === 0 || isApproving}
          >
            {isApproving && <Loader2 className="h-4 w-4 animate-spin" />}
            Aprobar todas ({pendingCount})
          </Button>
        }
      />
      <div className="px-6">
        <SectionHeader title="Entregas" />
        {isLoading ? (
          <div className="mt-4 flex items-center justify-center gap-2 py-16 text-body text-neutral-700">
            <Loader2 className="h-5 w-5 animate-spin" />
            Cargando entregas…
          </div>
        ) : submissions.length === 0 ? (
          <div className="mt-4 border border-dashed border-neutral-300 py-16 text-center">
            <p className="text-body font-bold text-neutral-900">
              Todavía no hay entregas para este examen.
            </p>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 pb-12 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr">
            {submissions.map((submission) => (
              <SubmissionCard
                key={submission.submissionId}
                submission={submission}
                onOpen={handleOpenSubmission}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
