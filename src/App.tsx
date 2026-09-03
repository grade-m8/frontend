import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage.tsx";
import SubjectsPage from "./pages/Subjects/SubjectsPage.tsx";
import { Toaster } from "@/components/ui/toast.tsx";
import { ExamCard } from "./components/data-display/ExamCard.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/subjects" element={<SubjectsPage />} />
        <Route
          path="/exam-card-test"
          element={
            <div className="space-y-4 p-6">
              <ExamCard
                title="Primer Parcial"
                studentCount={45}
                date="24 Oct, 18:00"
                durationMinutes={90}
                status="CORREGIDO"
              />
              <ExamCard
                title="Primer Parcial"
                studentCount={45}
                date="24 Oct, 18:00"
                durationMinutes={90}
                status="PENDIENTE"
              />
              <ExamCard
                title="Primer Parcial"
                studentCount={45}
                date="24 Oct, 18:00"
                durationMinutes={90}
                status="REVISIÓN IA"
              />
            </div>
          }
        />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
