import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "@/pages/LandingPage.tsx";
import SubjectsPage from "@/pages/Subjects/SubjectsPage.tsx";
import ProtectedRoutes from "@/routes/ProtectedRoutes.tsx";
import RedirectIfAuthenticated from "@/routes/RedirectIfAuthenticated.tsx";
import SubjectExamsPage from "@/pages/Subjects/SubjectExamsPage";
import ErrorPage from "@/pages/ErrorPage.tsx";
import { ExamGeneralInfoForm } from "@/components/forms/ExamGeneralInfoForm";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RedirectIfAuthenticated />}>
          <Route path="/" element={<LandingPage />} />
        </Route>

        <Route path="/403" element={<ErrorPage />} />

        <Route
          path="/exam-info-form-test"
          element={
            <div className="p-6">
              <ExamGeneralInfoForm />
            </div>
          }
        />

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
