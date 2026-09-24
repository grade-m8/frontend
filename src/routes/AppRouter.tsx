import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "@/pages/LandingPage.tsx";
import SubjectsPage from "@/pages/Subjects/SubjectsPage.tsx";
import ProtectedRoutes from "@/routes/ProtectedRoutes.tsx";
import RedirectIfAuthenticated from "@/routes/RedirectIfAuthenticated.tsx";
import SubjectExamsPage from "@/pages/Subjects/SubjectExamsPage";
import ErrorPage from "@/pages/ErrorPage.tsx";
import { ExamConfigPage } from "@/pages/exams/ExamEditor";
import QuestionCard from "@/components/forms/QuestionCard.tsx";
import type { Question } from "@/types/exam.ts";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RedirectIfAuthenticated />}>
          <Route path="/" element={<LandingPage />} />
        </Route>
        <Route element={<ProtectedRoutes allowedRoles={["Professor"]} />}>
          <Route path="/teacher/exams/new" element={<ExamConfigPage />} />
          <Route
            path="/teacher/exams/:examId/config"
            element={<ExamConfigPage />}
          />
          <Route
            path="testingCardEdit"
            element={
              <QuestionCard
                question={fakeQuestionCardProps.question}
                index={fakeQuestionCardProps.index}
                isEditing={fakeQuestionCardProps.isEditing}
                onEdit={fakeQuestionCardProps.onEdit}
                onSave={fakeQuestionCardProps.onSave}
                onCancel={fakeQuestionCardProps.onCancel}
                onDelete={fakeQuestionCardProps.onDelete}
              />
            }
          />
          <Route
            path="testingCardRead"
            element={
              <QuestionCard
                question={fakeQuestionCardProps.question}
                index={fakeQuestionCardProps.index}
                isEditing={false}
                onEdit={fakeQuestionCardProps.onEdit}
                onSave={fakeQuestionCardProps.onSave}
                onCancel={fakeQuestionCardProps.onCancel}
                onDelete={fakeQuestionCardProps.onDelete}
              />
            }
          />
        </Route>

        <Route path="/403" element={<ErrorPage />} />

        <Route
          element={
            <ProtectedRoutes allowedRoles={["Student", "Admin", "Professor"]} />
          }
        >
          <Route path="/materias" element={<SubjectsPage />} />
          <Route
            path="/materias/:subjectId/examenes"
            element={<SubjectExamsPage />}
          />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

const fakeQuestion: Question = {
  questionId: "1",
  order: 2,
  title: "title",
  prompt: "This is a prompt",
  points: 4,
  idealAnswer: "This is an ideal answer",
};

const fakeQuestionCardProps = {
  question: fakeQuestion,
  index: 1,
  isEditing: true,
  onEdit: (questionId: string) =>
    console.log(`Clicked edit button! id: ${questionId}`),
  onDelete: (questionId: string) =>
    console.log(`Clicked delete button! id: ${questionId}`),
  onSave: (updateQuestion: Question) =>
    console.log(`Clicked save button! question: ${updateQuestion}`),
  onCancel: () => console.log("Clicked save button!"),
};
