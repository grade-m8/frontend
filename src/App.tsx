import { BrowserRouter, Route, Routes } from "react-router-dom"
import LandingPage from "./pages/LandingPage.tsx"
import SubjectsPage from "./pages/Subjects/SubjectsPage.tsx"

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/subjects" element={<SubjectsPage />} />
        </Routes>
      </BrowserRouter>
  )
}

export default App