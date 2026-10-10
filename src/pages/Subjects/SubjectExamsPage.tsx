import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2, Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { ExamCard } from "@/components/data-display/ExamCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth.ts";
import { getSubject } from "@/services/subjectService.ts";
import { listActiveExams, listOwnedExams } from "@/services/examService.ts";
import { getApiErrorMessage } from "@/services/error.ts";
import { toast } from "@/components/handler/toastHandler.tsx";
import { formatDate } from "@/lib/date.ts";
import type { Exam, ExamStatus } from "@/types/exam.ts";
import { listMyStatusForSubject } from "@/services/studentStatusService.ts";
import { getStudentExamCta } from "@/lib/studentExamCta.ts";
import type {
  MyExamSubmissionStatus,
  StudentExamCta,
} from "@/types/studentSubmission.ts";

const EXAM_STATUS_LABELS: Record<ExamStatus, string> = {
  draft: "BORRADOR",
  published: "PUBLICADO",
  closed: "CERRADO",
};

export default function SubjectExamsPage() {
  // La ruta siempre trae subjectId: /materias/:subjectId/examenes.
  const { subjectId } = useParams<{ subjectId: string }>();
  const { role } = useAuth();
  const navigate = useNavigate();

  type LoadResult =
    | {
        status: "success";
        subjectId: string | undefined;
        subjectName: string;
        exams: Exam[];
        myStatuses: Map<string, MyExamSubmissionStatus>;
      }
    | { status: "error"; subjectId: string | undefined };

  const [loaded, setLoaded] = useState<LoadResult | null>(null);

  const [reloadKey, setReloadKey] = useState(0);

  const current = loaded && loaded.subjectId === subjectId ? loaded : null;
  const isLoading = current === null;
  const hasError = current?.status === "error";
  const subjectName =
    current?.status === "success" ? current.subjectName : undefined;
  const exams = current?.status === "success" ? current.exams : undefined;
  const myStatuses =
    current?.status === "success" ? current.myStatuses : undefined;

  useEffect(() => {
    if (!role) return;

    let cancelled = false;

    const listExams = role === "Student" ? listActiveExams : listOwnedExams;
    const statusPromise =
      role === "Student"
        ? listMyStatusForSubject(subjectId as string)
        : Promise.resolve<MyExamSubmissionStatus[]>([]);

    Promise.all([
      getSubject(subjectId as string),
      listExams(subjectId as string),
      statusPromise,
    ])
      .then(([subject, examList, statusList]) => {
        if (cancelled) return;
        setLoaded({
          status: "success",
          subjectId,
          subjectName: subject.name,
          exams: examList,
          myStatuses: new Map<string, MyExamSubmissionStatus>(
            statusList.map((s) => [s.examId, s]),
          ),
        });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setLoaded({ status: "error", subjectId });
        toast.error(getApiErrorMessage(err));
      });

    return () => {
      cancelled = true;
    };
  }, [subjectId, role, reloadKey]);

  const handleCreateExam = () => {
    navigate(`/teacher/exams/new?subjectId=${subjectId}`);
  };

  const handleGoToExam = (examId: string) => {
    navigate(`/teacher/exams/${examId}/submissions`);
  };

  const handleStudentAction = (examId: string, cta: StudentExamCta) => {
    switch (cta.kind) {
      case "take":
        navigate(`/student/exams/${examId}/take`);
        break;
      case "review":
        if (cta.submissionId) {
          navigate(`/student/submissions/${cta.submissionId}`);
        }
        break;
      case "waiting":
        break;
    }
  };

  const handleRetry = () => {
    setLoaded(null);
    setReloadKey((k) => k + 1);
  };

  const isStudent = role === "Student";

  return (
    <>
      <PageHeader
        title={subjectName ?? ""}
        subtitle="Resumen de evaluaciones y métricas académicas en tiempo real"
        actions={
          !isStudent && (
            <Button className="gap-2 h-12 font-bold" onClick={handleCreateExam}>
              <Plus className="h-4 w-4" />
              Crear nuevo examen
            </Button>
          )
        }
      />
      <div className="px-6">
        <SectionHeader title="Exámenes Recientes" />
        {isLoading ? (
          <div className="mt-4 flex items-center justify-center gap-2 py-16 text-body text-neutral-700">
            <Loader2 className="h-5 w-5 animate-spin" />
            Cargando exámenes…
          </div>
        ) : hasError ? (
          <div className="mt-4 border border-dashed border-danger-500 py-16 text-center">
            <p className="text-body font-bold text-neutral-900">
              No se pudieron cargar los exámenes.
            </p>
            <Button className="mt-4" onClick={handleRetry}>
              Reintentar
            </Button>
          </div>
        ) : !exams || exams.length === 0 ? (
          <div className="mt-4 border border-dashed border-neutral-300 py-16 text-center">
            <p className="text-body font-bold text-neutral-900">
              No hay exámenes registrados
            </p>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 pb-12 md:grid-cols-2 lg:grid-cols-3">
            {exams.map((exam) => {
              const cta = isStudent
                ? getStudentExamCta(myStatuses?.get(exam.examId))
                : undefined;

              return (
                <ExamCard
                  key={exam.examId}
                  title={exam.title}
                  studentCount="—"
                  date={formatDate(exam.scheduledAt)}
                  durationMinutes={exam.durationMinutes}
                  status={cta?.statusLabel ?? EXAM_STATUS_LABELS[exam.status]}
                  actionLabel={cta?.label}
                  actionDisabled={cta?.kind === "waiting"}
                  onActionClick={
                    cta
                      ? () => handleStudentAction(exam.examId, cta)
                      : () => handleGoToExam(exam.examId)
                  }
                />
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
