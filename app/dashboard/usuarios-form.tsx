
"use client";

import { useState } from "react";

type RolUsuario = "docente" | "padre";

export default function UsuariosForm() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [rol, setRol] = useState<RolUsuario>("docente");
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState(false);

  async function crearUsuario(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMensaje("");
    setError(false);
    setCargando(true);

    try {
      const respuesta = await fetch("/api/admin/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: nombre.trim(),
          email: correo.trim().toLowerCase(),
          role: rol,
        }),
      });

      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        setError(true);
        setMensaje(
          typeof resultado.error === "string"
            ? resultado.error
            : "No se pudo enviar la invitación."
        );
        return;
      }

      setMensaje(
        typeof resultado.message === "string"
          ? resultado.message
          : "Invitación enviada. El usuario debe revisar su correo."
      );

      setNombre("");
      setCorreo("");
      setRol("docente");
    } catch {
      setError(true);
      setMensaje(
        "No se pudo conectar con el servidor. Comprueba que el portal esté funcionando."
      );
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="mt-5 border-t border-slate-100 pt-5">
      <h4 className="font-semibold text-slate-800">
        Registrar nuevo usuario
      </h4>

      <p className="mt-1 text-sm leading-relaxed text-slate-500">
        Envía una invitación al personal docente o a un padre de familia
        para que configure su propia contraseña.
      </p>

      <form onSubmit={crearUsuario} className="mt-5 space-y-4">
        <div>
          <label
            htmlFor="usuario-nombre"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Nombre completo
          </label>
          <input
            id="usuario-nombre"
            type="text"
            value={nombre}
            onChange={(event) => setNombre(event.target.value)}
            autoComplete="name"
            minLength={2}
            maxLength={120}
            required
            disabled={cargando}
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
            placeholder="Nombre y apellidos"
          />
        </div>

        <div>
          <label
            htmlFor="usuario-correo"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Correo electrónico
          </label>
          <input
            id="usuario-correo"
            type="email"
            value={correo}
            onChange={(event) => setCorreo(event.target.value)}
            autoComplete="email"
            maxLength={254}
            required
            disabled={cargando}
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
            placeholder="usuario@correo.com"
          />
        </div>

        <div>
          <label
            htmlFor="usuario-rol"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Tipo de usuario
          </label>
          <select
            id="usuario-rol"
            value={rol}
            onChange={(event) =>
              setRol(event.target.value as RolUsuario)
            }
            disabled={cargando}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
          >
            <option value="docente">Personal docente</option>
            <option value="padre">Padre de familia</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={cargando}
          className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {cargando ? "Enviando invitación..." : "Enviar invitación"}
        </button>

        {mensaje && (
          <p
            role="status"
            aria-live="polite"
            className={`rounded-xl border p-3 text-sm ${
              error
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-800"
            }`}
          >
            {mensaje}
          </p>
        )}
      </form>
    </div>
  );
}
