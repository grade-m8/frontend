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
        <Route path="/exam-card-test" element={<ExamCard />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
