import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
            <div className="bg-teal-700 text-white p-8 flex flex-col justify-between">
                <div className="m-20 space-y-10">
                    {/* placeholder de logo*/}
                    <div className="w-30 h-30 rounded-full border-5 border-white" />
                    <h1 className="text-[60px] font-black tracking-tight">
                        GRADE-M8
                    </h1>
                </div>
                <blockquote className="m-20 border-l-4 border-white/40 pl-6 text-[30px] font-semibold tracking-wider">
                    Precisión académica estricta, procesada y estructurada
                    para el alto rendimiento.
                </blockquote>
            </div>
            <div className="bg-background p-8 md:p-20 flex flex-col justify-center gap-12">
                <div className="space-y-1 max-w-md">
                    <h2 className="text-[40px] tracking-wide font-extrabold text-[var(--color-text-brand)]">
                        Bienvenido al Sistema
                    </h2>
                    <p className="tracking-wider text-h3 text-[var(--color-text-secondary)]">
                        La plataforma centralizada para la gestión de exámenes,
                        calificaciones y rendimiento académico.
                    </p>
                </div>
                <Button size="lg" className="w-106 h-15 gap-3 text-lg">
                    Ingresar a la Plataforma
                    <ArrowRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    )
}