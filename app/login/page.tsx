import type { Metadata } from "next";
import LoginForm from "./login-form";

export const metadata: Metadata = {
  title: "Iniciar sesión | Colegio Juana de Asbaje",
  description:
    "Acceso al Portal Escolar del Colegio Juana de Asbaje.",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-800">
            Colegio Juana de Asbaje
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Portal Escolar
          </p>

          <p className="mt-6 text-lg font-semibold text-slate-700">
            Iniciar sesión
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Ingresa con tu cuenta institucional.
          </p>
        </div>

        <LoginForm />

        <p className="mt-8 text-center text-xs text-slate-400">
          Colegio Juana de Asbaje · Portal Escolar
        </p>
      </section>
    </main>
  );
}