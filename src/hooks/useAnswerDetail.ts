import { useCallback, useEffect, useRef, useState } from "react";
import type { AnswerDetail } from "@/types/audit.ts";
import { getAnswerDetail } from "@/services/auditService.ts";
import { getApiErrorMessage } from "@/services/error.ts";

export function useAnswerDetail(
  submissionId: string | undefined,
  questionId: string | undefined,
): {
  detail: AnswerDetail | null;
  isLoading: boolean;
  error: string | null;
  reload: () => Promise<void>;
} {
  const [detail, setDetail] = useState<AnswerDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Referencia a los últimos parámetros solicitados para descartar respuestas obsoletas
  const paramsRef = useRef({ submissionId, questionId });

  const fetchDetail = useCallback(
    async (isBackgroundReload = false) => {
      if (!submissionId || !questionId) {
        setDetail(null);
        setError(null);
        setIsLoading(false);
        return;
      }

      const reqSubId = submissionId;
      const reqQId = questionId;
      paramsRef.current = { submissionId: reqSubId, questionId: reqQId };

      if (!isBackgroundReload) {
        setIsLoading(true);
        setDetail(null);
      }
      setError(null);

      try {
        const data = await getAnswerDetail(reqSubId, reqQId);
        if (
          paramsRef.current.submissionId === reqSubId &&
          paramsRef.current.questionId === reqQId
        ) {
          setDetail(data);
        }
      } catch (err) {
        if (
          paramsRef.current.submissionId === reqSubId &&
          paramsRef.current.questionId === reqQId
        ) {
          setError(getApiErrorMessage(err));
        }
      } finally {
        if (
          paramsRef.current.submissionId === reqSubId &&
          paramsRef.current.questionId === reqQId
        ) {
          setIsLoading(false);
        }
      }
    },
    [submissionId, questionId],
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDetail(false);
  }, [fetchDetail]);

  const reload = useCallback(async () => {
    await fetchDetail(true);
  }, [fetchDetail]);

  return { detail, isLoading, error, reload };
}
