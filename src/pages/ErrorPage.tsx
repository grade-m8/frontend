import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import logo from "@/assets/logo.svg";

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex flex-col items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-white shadow-hard-sm flex items-center justify-center">
          <img src={logo} alt="Logo Grade-M8" className="w-full h-full" />
        </div>
        <div className="space-y-3">
          <p className="label-micro text-[var(--color-text-tertiary)]">Error</p>
          <h1 className="text-display-x1 font-black tracking-tight text-[var(--color-text-brand)]">
            403
          </h1>
          <h2 className="text-h1 font-bold text-[var(--color-text-primary)]">
            Acceso Denegado
          </h2>
          <p className="max-w-md text-body text-[var(--color-text-secondary)]">
            No tenés permiso para acceder a esta página. Si creés que esto es un
            error, contactate con el administrador.
          </p>
        </div>
        <Button size="lg" onClick={() => navigate("/subjects")}>
          Volver a Materias
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
