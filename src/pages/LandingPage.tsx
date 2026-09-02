import { useState } from "react";
import type { FormEvent } from "react";
import { ArrowRight, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import logo from "@/assets/logo.svg";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/handler/toastHandler.tsx";
import { auth } from "@/services/firebase.ts";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "@/hooks/useAuthUser.ts";

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { role } = useAuth();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => userCredential.user.getIdTokenResult())
      .then(() => toast.success("Log in successful!"))
      .then(() => navigate("/subjects"))
      .catch(function (error: Error) {
        toast.error(error.message);
      })
      .finally(() => console.log(role));
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="bg-teal-700 text-white p-8 flex flex-col justify-between">
        <div className="m-20 space-y-10">
          <div className="w-30 h-30 rounded-full bg-white flex items-center justify-center">
            <img src={logo} alt="Logo Grade-M8" className="w-full h-full" />
          </div>
          <h1 className="text-display-lg font-black tracking-tight">
            GRADE-M8
          </h1>
        </div>
        <blockquote className="m-20 border-l-4 border-white/40 pl-6 text-h3 leading-relaxed font-semibold tracking-wider">
          Precisión académica estricta, procesada y estructurada para el alto
          rendimiento.
        </blockquote>
      </div>
      <div className="bg-background p-8 md:p-20 flex flex-col items-center justify-center gap-12">
        {showLogin ? (
          <form onSubmit={handleSubmit} className="w-full max-w-150 space-y-8">
            <div className="space-y-3">
              <h2 className="text-display tracking-wide font-extrabold text-foreground">
                Acceso al Sistema
              </h2>
              <p className="tracking-wider text-h3 text-[var(--color-text-secondary)]">
                Ingrese sus credenciales institucionales para continuar.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">
                  <Mail className="w-4 h-4" />
                  Correo Electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  pattern=".+@.+\..+"
                  placeholder="usuario@institucion.edu.ar"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  <Lock className="w-4 h-4" />
                  Contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full h-16 gap-3 text-lg"
            >
              Ingresar
              <ArrowRight className="w-5 h-5" />
            </Button>
          </form>
        ) : (
          <>
            <div className="space-y-5 max-w-150">
              <h2 className="text-display tracking-wide font-extrabold text-[var(--color-text-brand)]">
                Bienvenido al Sistema
              </h2>
              <p className="tracking-wider text-h3 text-[var(--color-text-secondary)]">
                La plataforma centralizada para la gestión de exámenes,
                calificaciones y rendimiento académico.
              </p>
            </div>
            <Button
              size="lg"
              className="w-130 h-16 gap-3 text-lg"
              onClick={() => setShowLogin(true)}
            >
              Ingresar a la Plataforma
              <ArrowRight className="w-5 h-5" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
