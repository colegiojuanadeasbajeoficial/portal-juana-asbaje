
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function EstablecerContrasenaPage() {
  const router = useRouter();
  const [contrasena, setContrasena] = useState("");
  const [confirmacion, setConfirmacion] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  async function guardarContrasena(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setMensaje("");

    if (contrasena.length < 8) {
      setMensaje("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (contrasena !== confirmacion) {
      setMensaje("Las contraseñas no coinciden.");
      return;
    }

    setCargando(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.updateUser({
        password: contrasena,
      });

      if (error) {
        setMensaje(
          "No se pudo establecer la contraseña. Abre nuevamente el enlace de invitación o solicita otra invitación a Dirección."
        );
        return;
      }

      setMensaje("Contraseña configurada correctamente. Redirigiendo al portal...");

      router.replace("/dashboard");
      router.refresh();
    } catch {
      setMensaje("Ocurrió un error. Inténtalo nuevamente.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
      <h1 className="mb-2 text-2xl font-bold">
        Establecer contraseña
      </h1>

      <p className="mb-6 text-sm text-gray-600">
        Crea una contraseña para acceder al Portal Escolar
        del Colegio Juana de Asbaje.
      </p>

      <form onSubmit={guardarContrasena} className="space-y-4">
        <div>
          <label htmlFor="contrasena" className="mb-1 block text-sm font-medium">
            Nueva contraseña
          </label>
          <input
            id="contrasena"
            type="password"
            autoComplete="new-password"
            minLength={8}
            maxLength={128}
            required
            value={contrasena}
            onChange={(event) => setContrasena(event.target.value)}
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="confirmacion" className="mb-1 block text-sm font-medium">
            Confirmar contraseña
          </label>
          <input
            id="confirmacion"
            type="password"
            autoComplete="new-password"
            minLength={8}
            maxLength={128}
            required
            value={confirmacion}
            onChange={(event) => setConfirmacion(event.target.value)}
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={cargando}
          className="w-full rounded-md bg-blue-700 px-4 py-2 font-semibold text-white disabled:opacity-60"
        >
          {cargando ? "Guardando..." : "Guardar contraseña"}
        </button>

        {mensaje && (
          <p role="status" className="text-sm">
            {mensaje}
          </p>
        )}
      </form>
    </main>
  );
}
