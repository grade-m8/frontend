import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage.tsx";
import SubjectsPage from "./pages/Subjects/SubjectsPage.tsx";
import { Toaster } from "@/components/ui/toast.tsx";
import { AuthProvider } from "@/context/AuthProvider.tsx";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/subjects" element={<SubjectsPage />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
