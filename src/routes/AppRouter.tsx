import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "@/pages/LandingPage.tsx";
import SubjectsPage from "@/pages/Subjects/SubjectsPage.tsx";
import ProtectedRoutes from "@/routes/ProtectedRoutes.tsx";
import RedirectIfAuthenticated from "@/routes/RedirectIfAuthenticated.tsx";
import SubjectExamsPage from "@/pages/Subjects/SubjectExamsPage";
import ErrorPage from "@/pages/ErrorPage.tsx";
import { ExamGeneralInfoForm } from "@/components/forms/ExamGeneralInfoForm";
import { useState } from "react";
import type { ExamGeneralInfo } from "@/types/exam";

const EMPTY_INFO: ExamGeneralInfo = {
  title: "",
  subjectId: "",
  durationMinutes: 0,
  passingPercentage: 0,
};

function ExamInfoFormPreview() {
  const [values, setValues] = useState<ExamGeneralInfo>(EMPTY_INFO);
  const [isEditMode, setIsEditMode] = useState(false);
  return (
    <div className="p-6">
      <label className="mb-4 flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={isEditMode}
          onChange={(e) => setIsEditMode(e.target.checked)}
        />
        Modo edición
      </label>
      <ExamGeneralInfoForm
        values={values}
        onChange={(fields) => setValues((prev) => ({ ...prev, ...fields }))}
        isEditMode={isEditMode}
      />
      <pre className="mt-4 text-sm">{JSON.stringify(values, null, 2)}</pre>
    </div>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RedirectIfAuthenticated />}>
          <Route path="/" element={<LandingPage />} />
        </Route>

        <Route path="/403" element={<ErrorPage />} />

        <Route path="/exam-info-form-test" element={<ExamInfoFormPreview />} />

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
