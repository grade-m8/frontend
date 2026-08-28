import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Plus } from "lucide-react"
import LandingPage from "./pages/LandingPage.tsx"
import { PageHeader } from "./components/layout/PageHeader.tsx"
import { Button } from "./components/ui/button.tsx"

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/subjects"
            element={
                <PageHeader
                    title="Mis Cursos"
                    subtitle="Bienvenido, teacher"
                    actions={
                        <Button className="gap-2 h-12 w-50 font-bold">
                            <Plus className="h-4 w-4" />
                            Crear nueva materia
                        </Button>
                    }
                />
            }
          />
        </Routes>
      </BrowserRouter>
  )
}

export default App