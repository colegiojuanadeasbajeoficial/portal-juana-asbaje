
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "./logout-button";
import UsuariosForm from "./usuarios-form";

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
      <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
        <section className="max-w-lg rounded-2xl bg-white p-8 shadow-sm">
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
        </section>
      </main>
    );
  }

  const nombre = perfil.full_name?.trim() || "Usuario del portal";
  const rol = nombresRoles[perfil.role] || "Usuario";

  const enlaces =
    perfil.role === "direccion"
      ? [
          { href: "#resumen", label: "Panel de control", icon: "▦" },
          { href: "#usuarios", label: "Usuarios", icon: "♙" },
          { href: "#docentes", label: "Docentes", icon: "▤" },
          { href: "#alumnos", label: "Alumnos", icon: "♧" },
          { href: "#familias", label: "Familias", icon: "♧" },
        ]
      : perfil.role === "docente"
        ? [
            { href: "#resumen", label: "Panel de control", icon: "▦" },
            { href: "#area-personal", label: "Mi área", icon: "▤" },
          ]
        : [
            { href: "#resumen", label: "Panel de control", icon: "▦" },
            { href: "#area-familias", label: "Área de familias", icon: "♧" },
          ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 md:flex">
      <aside className="flex w-full flex-col bg-slate-950 text-white md:min-h-screen md:w-64 md:shrink-0">
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl">
            <Image
              src="/images/logo-juana-asbaje.png"
              alt="Logotipo del Colegio Juana de Asbaje"
              width={80}
              height={80}
              priority
              className="h-full w-full object-contain"
            />
          </div>
          <div>
            <p className="text-sm font-bold leading-tight">
              Colegio Juana de Asbaje
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Portal Escolar
            </p>
          </div>
        </div>

        <div className="px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Menú principal
          </p>

          <nav className="mt-4 space-y-1">
            {enlaces.map((enlace, indice) => (
              <Link
                key={enlace.href}
                href={enlace.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                  indice === 0
                    ? "bg-amber-400 font-semibold text-slate-950"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="w-5 text-center text-lg" aria-hidden="true">
                  {enlace.icon}
                </span>
                {enlace.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-auto hidden border-t border-white/10 p-5 md:block">
          <p className="text-xs leading-relaxed text-slate-400">
            Sistema de gestión escolar
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Ciclo escolar 2026-2027
          </p>
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4 md:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Colegio Juana de Asbaje
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Plataforma de gestión escolar
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold">{nombre}</p>
              <p className="text-xs text-slate-500">{rol}</p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 font-bold text-amber-300">
              {nombre.charAt(0).toUpperCase()}
            </div>

            <LogoutButton />
          </div>
        </header>

        <div className="mx-auto max-w-7xl space-y-7 p-5 md:p-8">
          <section
            id="resumen"
            className="relative overflow-hidden rounded-2xl bg-slate-900 p-6 text-white shadow-sm md:p-9"
          >
            <div className="absolute -right-12 -top-16 h-56 w-56 rounded-full border-[30px] border-white/5" />
            <div className="absolute -bottom-24 right-32 h-48 w-48 rounded-full bg-amber-400/10" />

            <div className="relative">
              <p className="text-sm font-semibold text-amber-300">
                PORTAL ESCOLAR · {rol.toUpperCase()}
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                ¡Bienvenido, {nombre}!
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base">
                Administra y consulta la información de tu comunidad escolar
                desde un solo lugar.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-xs font-medium text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Sesión iniciada correctamente
              </div>
            </div>
          </section>

          {perfil.role === "direccion" && (
            <section>
              <div className="mb-4">
                <h2 className="text-xl font-bold">Administración escolar</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Accesos para organizar la información del Colegio.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <article
                  id="usuarios"
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-700">
                    ♙
                  </div>

                  <h3 className="mt-4 font-bold">Usuarios y permisos</h3>

                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    Registra cuentas y asigna permisos de acceso al portal
                    escolar.
                  </p>

                  <UsuariosForm />
                </article>

                <article
                  id="docentes"
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-xl text-violet-700">
                    ▤
                  </div>
                  <h3 className="mt-4 font-bold">Personal docente</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    Espacio para organizar perfiles e información del personal.
                  </p>
                  <p className="mt-4 text-xs font-semibold text-amber-700">
                    MÓDULO EN PREPARACIÓN
                  </p>
                </article>

                <article
                  id="alumnos"
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-xl text-emerald-700">
                    ♧
                  </div>
                  <h3 className="mt-4 font-bold">Alumnos</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    Espacio para los expedientes y datos escolares del alumnado.
                  </p>
                  <p className="mt-4 text-xs font-semibold text-amber-700">
                    MÓDULO EN PREPARACIÓN
                  </p>
                </article>

                <article
                  id="familias"
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-xl text-orange-700">
                    ♧
                  </div>
                  <h3 className="mt-4 font-bold">Padres de familia</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    Espacio para vincular familias con sus hijos y sus cuentas.
                  </p>
                  <p className="mt-4 text-xs font-semibold text-amber-700">
                    MÓDULO EN PREPARACIÓN
                  </p>
                </article>

                <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-xl text-amber-700">
                    ⚙
                  </div>
                  <h3 className="mt-4 font-bold">Configuración</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    Espacio para futuras opciones generales del portal.
                  </p>
                  <p className="mt-4 text-xs font-semibold text-amber-700">
                    MÓDULO EN PREPARACIÓN
                  </p>
                </article>
              </div>
            </section>
          )}

          {perfil.role === "docente" && (
            <section
              id="area-personal"
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-xl font-bold">Área docente</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                Aquí se incorporarán las herramientas y la información
                correspondientes al personal docente.
              </p>
            </section>
          )}

          {perfil.role === "padre" && (
            <section
              id="area-familias"
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-xl font-bold">Área de familias</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                Aquí se mostrará la información escolar autorizada
                correspondiente a tus hijos.
              </p>
            </section>
          )}

          <section className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-bold">Mi cuenta</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Información de tu sesión actual.
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {rol}
              </span>
            </div>

            <div className="mt-5 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Nombre de usuario
                </p>
                <p className="mt-1 font-semibold">{nombre}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Tipo de cuenta
                </p>
                <p className="mt-1 font-semibold">{rol}</p>
              </div>
            </div>
          </section>

          <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5 text-xs text-slate-500">
            <p>© Colegio Juana de Asbaje · Portal Escolar</p>
            <p>Ciclo escolar 2026-2027</p>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
          <div className="rounded-2xl bg-white p-8 shadow-sm">
            <p className="text-slate-600">Verificando tu sesión...</p>
          </div>
        </main>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
