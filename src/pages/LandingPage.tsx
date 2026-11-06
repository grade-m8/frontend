import { useState } from "react";
import type { FormEvent } from "react";
import { ArrowRight, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import logo from "@/assets/logo.svg";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/handler/toastHandler.tsx";
import { useAuth } from "@/hooks/useAuth.ts";
import { mapAuthErrorMessage } from "@/services/error.ts";
import firebase from "firebase/compat/app";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState({ email: false, password: false });
  const [submitted, setSubmitted] = useState(false);

  const emailError = !email.trim()
    ? "El correo electrónico es obligatorio"
    : !EMAIL_REGEX.test(email.trim())
      ? "Ingresa un correo electrónico válido"
      : "";
  const passwordError = !password ? "La contraseña es obligatoria" : "";
  const showEmailError = (touched.email || submitted) && emailError;
  const showPasswordError = (touched.password || submitted) && passwordError;

  const navigate = useNavigate();
  const { login } = useAuth();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);

    if (emailError || passwordError) return;

    login(email.trim(), password)
      .then(() => {
        toast.success("¡Inicio de sesión exitoso!");
        navigate("/materias");
      })
      .catch(function (error: firebase.FirebaseError) {
        const message = mapAuthErrorMessage(error.code);
        toast.error(message);
      });
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
          <form
            onSubmit={handleSubmit}
            noValidate
            className="w-full max-w-150 space-y-8"
          >
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
                  placeholder="usuario@institucion.edu.ar"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  aria-invalid={!!showEmailError}
                  aria-describedby={showEmailError ? "email-error" : undefined}
                  className="h-12"
                />
                {showEmailError && (
                  <p id="email-error" className="text-sm text-destructive">
                    {emailError}
                  </p>
                )}
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
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                  aria-invalid={!!showPasswordError}
                  aria-describedby={
                    showPasswordError ? "password-error" : undefined
                  }
                  className="h-12"
                />
                {showPasswordError && (
                  <p id="password-error" className="text-sm text-destructive">
                    {passwordError}
                  </p>
                )}
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
