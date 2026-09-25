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
            path="/teacher/test"
            element={
              <QuestionCard
                question={fakeQuestion()}
                index={1}
                isEditing={true}
                onEdit={() => console.log("edited")}
                onDelete={() => console.log("delete")}
                onSave={() => console.log("save")}
                onCancel={() => console.log("cancel")}
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

function fakeQuestion(): Question {
  return {
    questionId: "1",
    order: 1,
    title: "This is the title",
    prompt: "this is the prompt",
    points: 10,
    idealAnswer: "This is an ideal answer",
  };
}
