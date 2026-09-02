import { BrowserRouter, Route, Routes } from "react-router-dom";
import ErrorPage from "@/pages/ErrorPage.tsx";
import LandingPage from "@/pages/LandingPage.tsx";
import SubjectsPage from "@/pages/Subjects/SubjectsPage.tsx";
import TestPage from "@/pages/testpages/TestPage.tsx";
import ProtectedRoutes from "@/routes/ProtectedRoutes.tsx";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/403" element={<ErrorPage />} />

        <Route
          element={
            <ProtectedRoutes allowedRoles={["Alumno", "Admin", "Profesor"]} />
          }
        >
          <Route path="/subjects" element={<SubjectsPage />} />

          {/*------------------------------- These are all examples for the Role guarded routes -------------------------------*/}
          <Route
            path={"/studentlevel"}
            element={<TestPage informativeText="all can see this" />}
          />

          <Route
            element={<ProtectedRoutes allowedRoles={["Admin", "Profesor"]} />}
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
      </Routes>
    </BrowserRouter>
  );
}
