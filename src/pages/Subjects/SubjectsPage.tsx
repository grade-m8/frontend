import { PageHeader } from "@/components/layout/PageHeader"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LayoutGrid, Search } from "lucide-react"
import { SectionHeader } from "@/components/layout/SectionHeader"
import { Input } from "@/components/ui/input"
import { SubjectCard } from "@/components/data-display/SubjectCard"
import fx from "@/assets/fx.svg"
import { useState } from "react"

const TEACHER_NAME = "A. López"

const subjects = [
    { id: 1, name: "Matemática Discreta", teacherName: "A. López", room: "Aula 402" },
    { id: 2, name: "Algoritmos y Estructuras", teacherName: "A. López", room: "Aula 301" },
]

export default function SubjectsPage() {
    const [query, setQuery] = useState("")

    const filteredSubjects = subjects.filter(
        (s) => s.name.toLowerCase().includes(query.toLowerCase())
    )
            return (
            <>
                <PageHeader
                    title="Mis Cursos"
                    subtitle={`Bienvenido, ${TEACHER_NAME}`}
                    actions={
                        <Button className="gap-2 h-12 font-bold">
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
                                <Input
                                    placeholder="Buscar materia..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="w-59 pl-8"
                                />
                            </div>
                        }
                    />
                    <div className="mt-4 grid grid-cols-1 gap-4 pb-12 md:grid-cols-2 lg:grid-cols-3">
                        {filteredSubjects.map((s) => (
                            <SubjectCard
                                key={s.id}
                                title={s.name}
                                subtitle={`Prof. ${s.teacherName} - ${s.room}`}
                                examValue="15 Oct - Parcial 1"
                                status="Regular"
                                iconSrc={fx}
                                onCtaClick={() => console.log("Ver exámenes de", s.name)}
                            />
                        ))}
                    </div>
                </div>
            </>
    )
}