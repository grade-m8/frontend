import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "@/pages/LandingPage.tsx";
import SubjectsPage from "@/pages/Subjects/SubjectsPage.tsx";
import ProtectedRoutes from "@/routes/ProtectedRoutes.tsx";
import RedirectIfAuthenticated from "@/routes/RedirectIfAuthenticated.tsx";
import SubjectExamsPage from "@/pages/Subjects/SubjectExamsPage";
import ErrorPage from "@/pages/ErrorPage.tsx";
import { useState } from "react";
import { RubricCriterionCard } from "@/components/forms/RubricCriterionCard";
import type { RubricCriterion } from "@/types/exam";

const MOCK_CRITERION: RubricCriterion = {
  criterionId: "c-1",
  title: "Rigor Técnico y Precisión",
  weight: "high",
  weightPercentage: 40,
  guidance:
    "El alumno debe utilizar la nomenclatura correcta. Se penalizará severamente el uso de términos ambiguos.",
  order: 0,
};

function RubricCardPreview() {
  const [criterion, setCriterion] = useState(MOCK_CRITERION);
  const [removedId, setRemovedId] = useState<string | null>(null);
  return (
    <div className="p-6">
      <RubricCriterionCard
        criterion={criterion}
        onUpdate={(_id, changes) =>
          setCriterion((prev) => ({ ...prev, ...changes }))
        }
        onRemove={(id) => setRemovedId(id)}
      />
      <pre className="mt-4 text-sm">
        {JSON.stringify({ criterion, removeCalledWith: removedId }, null, 2)}
      </pre>
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
        <Route
          path="/rubric-test"
          element={
            <div className="p-6">
              <RubricCardPreview />
            </div>
          }
        />

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
