
import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "./logout-button";

const nombresRoles: Record<string, string> = {
  direccion: "Dirección",
  docente: "Docente",
  padre: "Padre de familia",
};

async function DashboardContent() {
  await connection();

  const supabase = await createClient();

  const { data: sesion, error: errorSesion } =
    await supabase.auth.getClaims();

  if (errorSesion || !sesion?.claims) {
    redirect("/login");
  }

  const usuarioId = sesion.claims.sub;

  if (typeof usuarioId !== "string") {
    redirect("/login");
  }

  const { data: perfil, error: errorPerfil } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", usuarioId)
    .maybeSingle();

  if (errorPerfil || !perfil) {
    return (
      <div className="rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-800">
          No se pudo cargar tu perfil
        </h1>
        <p className="mt-3 text-slate-600">
          Tu sesión está activa, pero no fue posible consultar tu perfil.
          Contacta a Dirección para revisar la configuración de tu cuenta.
        </p>
        <div className="mt-6">
          <LogoutButton />
        </div>
      </div>
    );
  }

  const nombre =
    perfil.full_name?.trim() || "Usuario del portal";

  const rol =
    nombresRoles[perfil.role] || "Usuario";

  return (
    <div className="mx-auto max-w-5xl rounded-2xl bg-white p-8 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Panel de control
          </h1>
          <p className="mt-2 text-slate-600">
            Bienvenido al Portal Escolar del Colegio Juana de Asbaje.
          </p>
        </div>

        <LogoutButton />
      </div>

      <div className="mt-8 rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-800">
          Mi cuenta
        </h2>

        <p className="mt-4 text-slate-600">
          <strong>Nombre:</strong> {nombre}
        </p>

        <p className="mt-2 text-slate-600">
          <strong>Tipo de usuario:</strong> {rol}
        </p>

        <p className="mt-4 text-sm text-green-700">
          Tu sesión ha sido validada correctamente.
        </p>
      </div>

      {perfil.role === "direccion" && (
        <section className="mt-8">
          <h2 className="text-xl font-bold text-slate-800">
            Administración del portal
          </h2>
          <p className="mt-2 text-slate-600">
            Desde esta sección se incorporarán las herramientas para
            administrar cuentas, docentes, alumnos y familias.
          </p>
        </section>
      )}

      {perfil.role === "docente" && (
        <section className="mt-8">
          <h2 className="text-xl font-bold text-slate-800">
            Área docente
          </h2>
          <p className="mt-2 text-slate-600">
            Aquí se incorporarán las herramientas y la información
            correspondientes al personal docente.
          </p>
        </section>
      )}

      {perfil.role === "padre" && (
        <section className="mt-8">
          <h2 className="text-xl font-bold text-slate-800">
            Área de familias
          </h2>
          <p className="mt-2 text-slate-600">
            Aquí se mostrará la información escolar autorizada
            correspondiente a tus hijos.
          </p>
        </section>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <Suspense
        fallback={
          <div className="mx-auto max-w-5xl rounded-2xl bg-white p-8 shadow-sm">
            <p className="text-slate-600">
              Verificando tu sesión...
            </p>
          </div>
        }
      >
        <DashboardContent />
      </Suspense>
    </main>
  );
}
