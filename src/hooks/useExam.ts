import { useCallback, useEffect, useState } from "react";
import type { Exam, Question, RubricCriterion } from "@/types/exam.ts";
import type { ExamDetail } from "@/types/examDto.ts";
import { getExam } from "@/services/examService.ts";

export function useExam(examId: string | undefined) {
  const [exam, setExam] = useState<Exam>();
  const [criteria, setCriteria] = useState<RubricCriterion[]>();
  const [questions, setQuestions] = useState<Question[]>();

  const loadExam = useCallback(async () => {
    if (examId == undefined) {
      return;
    }
    const examData: ExamDetail = await getExam(examId);
    setExam(examData.exam);
    setCriteria(examData.criteria);
    setQuestions(examData.questions);
  }, [examId]);

  useEffect(() => {
    const callLoadExam = () => loadExam;
    callLoadExam();
  }, [examId, loadExam]);

  return { exam, criteria, questions };
}
