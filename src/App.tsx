import { BrowserRouter, Route, Routes } from "react-router-dom"
import LandingPage from "./pages/LandingPage.tsx"
import { PageHeader } from "./components/layout/PageHeader.tsx"

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/subjects"
            element={<PageHeader title="Mis Cursos" subtitle="Bienvenido, teacher" />}
          />
        </Routes>
      </BrowserRouter>
  )
}

export default App