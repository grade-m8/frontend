import { BrowserRouter, Route, Routes } from "react-router-dom";
import ErrorPage from "@/pages/ErrorPage.tsx";
import LandingPage from "@/pages/LandingPage.tsx";
import SubjectsPage from "@/pages/Subjects/SubjectsPage.tsx";
import ProtectedRoutes from "@/routes/ProtectedRoutes.tsx";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/403" element={<ErrorPage />} />

        <Route
          element={
            <ProtectedRoutes allowedRoles={["Student", "Admin", "Professor"]} />
          }
        >
          <Route path="/subjects" element={<SubjectsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
