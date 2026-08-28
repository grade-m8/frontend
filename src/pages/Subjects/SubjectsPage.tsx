import { PageHeader } from "@/components/layout/PageHeader"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

const TEACHER_NAME = "A. López"

const subjects = [
    { id: 1, name: "Matemática Discreta", teacherName: "A. López", room: "Aula 402" },
    { id: 2, name: "Algoritmos y Estructuras", teacherName: "A. López", room: "Aula 301" },
]

export default function SubjectsPage() {
            return (
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
    )
}