import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { SubmissionCard } from "@/components/data-display/SubmissionCard";
import { Button } from "@/components/ui/button";
import { getExam } from "@/services/examService.ts";
import { listSubmissionsForExam } from "@/services/submissionService.ts";
import { getApiErrorMessage } from "@/services/error.ts";
import { toast } from "@/components/handler/toastHandler.tsx";
import type { Submission } from "@/types/submission";

const MOCK_APPROVE_DELAY_MS = 600;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type LoadResult =
  | {
      status: "success";
      examId: string | undefined;
      examTitle: string;
      submissions: Submission[];
    }
  | { status: "not-found"; examId: string | undefined }
  | { status: "error"; examId: string | undefined };

export function ExamSubmissionsPage() {
  // La ruta siempre trae examId: /teacher/exams/:examId/submissions.
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();

  const [loaded, setLoaded] = useState<LoadResult | null>(null);
  const [isApproving, setIsApproving] = useState(false);

  const current = loaded && loaded.examId === examId ? loaded : null;
  const isLoading = current === null;
  const notFound = current?.status === "not-found";
  const hasError = current?.status === "error";
  const examTitle =
    current?.status === "success" ? current.examTitle : undefined;
  const submissions = current?.status === "success" ? current.submissions : [];

  const loadData = useCallback(() => {
    setLoaded(null);
    Promise.all([
      getExam(examId as string),
      listSubmissionsForExam(examId as string),
    ])
      .then(([examDetail, submissionList]) => {
        setLoaded({
          status: "success",
          examId,
          examTitle: examDetail.exam.title,
          submissions: submissionList,
        });
      })
      .catch((err: unknown) => {
        const code = err instanceof Error ? err.message : "";
        if (code === "NOT_PROFESSOR_EXAM" || code === "permission-denied") {
          navigate("/403");
          return;
        }
        if (
          code === "EXAM_NOT_FOUND" ||
          code === "exam-not-found" ||
          code === "not-found"
        ) {
          setLoaded({ status: "not-found", examId });
          return;
        }
        setLoaded({ status: "error", examId });
        toast.error(getApiErrorMessage(err));
      });
  }, [examId, navigate]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  const pendingCount = submissions.filter(
    (s) => s.status === "awaiting_approval",
  ).length;

  const handleApproveAll = async () => {
    setIsApproving(true);
    try {
      await wait(MOCK_APPROVE_DELAY_MS);
      setLoaded((prev) =>
        prev && prev.status === "success"
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
        title={examTitle ?? ""}
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
        ) : notFound ? (
          <div className="mt-4 border border-dashed border-neutral-300 py-16 text-center">
            <p className="text-body font-bold text-neutral-900">
              El examen no existe.
            </p>
          </div>
        ) : hasError ? (
          <div className="mt-4 flex flex-col items-center gap-4 border border-dashed border-danger-500 py-16 text-center">
            <p className="text-body font-bold text-neutral-900">
              No se pudieron cargar las entregas.
            </p>
            <Button variant="outline" onClick={loadData}>
              Reintentar
            </Button>
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
