import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "@/pages/LandingPage.tsx";
import SubjectsPage from "@/pages/Subjects/SubjectsPage.tsx";
import TestPage from "@/pages/testpages/TestPage.tsx";
import ProtectedRoutes from "@/routes/ProtectedRoutes.tsx";
import RedirectIfAuthenticated from "@/routes/RedirectIfAuthenticated.tsx";
import SubjectExamsPage from "@/pages/Subjects/SubjectExamsPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/materias/:subjectId/examenes"
          element={<SubjectExamsPage />}
        />
        <Route element={<RedirectIfAuthenticated />}>
          <Route path="/" element={<LandingPage />} />
        </Route>

        <Route
          element={
            <ProtectedRoutes allowedRoles={["Student", "Admin", "Professor"]} />
          }
        >
          <Route path="/materias" element={<SubjectsPage />} />

          {/*------------------------------- These are all examples for the Role guarded routes -------------------------------*/}
          <Route
            path={"/studentlevel"}
            element={<TestPage informativeText="all can see this" />}
          />

          <Route
            element={<ProtectedRoutes allowedRoles={["Admin", "Professor"]} />}
          >
            <Route
              path={"/professorlevel"}
              element={
                <TestPage informativeText="professors and admins can see this" />
              }
            />
          </Route>

          <Route element={<ProtectedRoutes allowedRoles={["Admin"]} />}>
            <Route
              path={"/adminlevel"}
              element={<TestPage informativeText="only admins can see this" />}
            />
          </Route>
          {/*------------------------------- These are all examples for the Role guarded routes -------------------------------*/}
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
