import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "@/pages/LandingPage.tsx";
import SubjectsPage from "@/pages/Subjects/SubjectsPage.tsx";
import ProtectedRoutes from "@/routes/ProtectedRoutes.tsx";
import RedirectIfAuthenticated from "@/routes/RedirectIfAuthenticated.tsx";
import SubjectExamsPage from "@/pages/Subjects/SubjectExamsPage";
import ErrorPage from "@/pages/ErrorPage.tsx";
import { useState } from "react";
import { RubricCriteriaList } from "@/components/forms/RubricCriteriaList";
import type { RubricCriterion } from "@/types/exam";

const MOCK_CRITERIA: RubricCriterion[] = [
  {
    criterionId: "c-1",
    title: "Rigor Técnico y Precisión",
    weight: "high",
    weightPercentage: 40,
    guidance:
      "El alumno debe utilizar la nomenclatura correcta. Se penalizará severamente el uso de términos ambiguos.",
    order: 0,
  },
  {
    criterionId: "c-2",
    title: "Claridad y Estructura",
    weight: "medium",
    weightPercentage: 20,
    guidance: "La explicación debe fluir lógicamente.",
    order: 1,
  },
];

function RubricListPreview() {
  const [criteria, setCriteria] = useState(MOCK_CRITERIA);
  return (
    <div className="p-6">
      <RubricCriteriaList
        criteria={criteria}
        onAddCriterion={(criterion) =>
          setCriteria((prev) => [...prev, criterion])
        }
        onUpdateCriterion={(id, changes) =>
          setCriteria((prev) =>
            prev.map((c) => (c.criterionId === id ? { ...c, ...changes } : c)),
          )
        }
        onRemoveCriterion={(id) =>
          setCriteria((prev) => prev.filter((c) => c.criterionId !== id))
        }
      />
      <pre className="mt-4 text-sm">{JSON.stringify(criteria, null, 2)}</pre>
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
              <RubricListPreview />
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
