import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "@/pages/LandingPage.tsx";
import SubjectsPage from "@/pages/Subjects/SubjectsPage.tsx";
import ProtectedRoutes from "@/routes/ProtectedRoutes.tsx";
import RedirectIfAuthenticated from "@/routes/RedirectIfAuthenticated.tsx";
import SubjectExamsPage from "@/pages/Subjects/SubjectExamsPage";
import ErrorPage from "@/pages/ErrorPage.tsx";
import { ExamConfigPage } from "@/pages/exams/ExamEditor";
import { ExamQuestionsEditor } from "@/pages/exams/ExamQuestionsEditor.tsx";

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
            path="/teacher/exams/:examId/questions"
            element={<ExamQuestionsEditor />}
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
