import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Plus, LayoutGrid, Search } from "lucide-react"
import { Input } from "./components/ui/input.tsx"
import LandingPage from "./pages/LandingPage.tsx"
import { PageHeader } from "./components/layout/PageHeader.tsx"
import { SectionHeader } from "./components/layout/SectionHeader.tsx"
import { Button } from "./components/ui/button.tsx"
import { SubjectCard } from "./components/data-display/SubjectCard.tsx"
import fx from "@/assets/fx.svg"

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/subjects"
            element={
                <div>
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
                    <div className="px-6">
                        <SectionHeader
                            title="Listado de Cátedras"
                            icon={LayoutGrid}
                            actions={
                                <div className="relative">
                                    <Search className="absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2 text-neutral-650" />
                                    <Input placeholder="Buscar materia..." className="w-59 pl-8" />
                                </div>
                            }
                        />
                      <div className="mt-4">
                        <SubjectCard
                          category="OBLIGATORIA"
                          title="Matemática Discreta"
                          subtitle="Prof. A. López - Aula 402"
                          examValue="15 Oct - Parcial 1"
                          status="Regular"
                          iconSrc={fx}
                          onCtaClick={() => console.log("click en Ver Mis Exámenes")}
                        />
                      </div>
                    </div>
                </div>
            }
          />
        </Routes>
      </BrowserRouter>
  )
}

export default App