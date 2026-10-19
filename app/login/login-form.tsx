
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();

  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [cargando, setCargando] = useState(false);
  const [recuperando, setRecuperando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  async function iniciarSesion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setMensaje("");
    setCargando(true);

    try {
      const supabase = createClient();

      const { error: errorLogin } =
        await supabase.auth.signInWithPassword({
          email: correo.trim(),
          password: contrasena,
        });

      if (errorLogin) {
        setError(
          "No fue posible iniciar sesión. Verifica tu correo y contraseña."
        );
        return;
      }

      setCorreo("");
      setContrasena("");

      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError(
        "No se pudo conectar con el servicio de acceso. Inténtalo nuevamente."
      );
    } finally {
      setCargando(false);
    }
  }

  async function recuperarContrasena() {
    setError("");
    setMensaje("");

    if (!correo.trim()) {
      setError(
        "Escribe tu correo electrónico en el campo de arriba para recuperar tu contraseña."
      );
      return;
    }

    setRecuperando(true);

    try {
      const supabase = createClient();

      const { error: errorRecuperacion } =
        await supabase.auth.resetPasswordForEmail(correo.trim(), {
          redirectTo:
            `${window.location.origin}/auth/callback?next=/establecer-contrasena`,
        });

      if (errorRecuperacion) {
        setError(
          "No se pudo solicitar la recuperación. Revisa la configuración de Supabase e inténtalo nuevamente."
        );
        return;
      }

      setMensaje(
        "Si el correo puede recibir una recuperación, recibirás instrucciones para establecer una nueva contraseña. Revisa también la carpeta de correo no deseado."
      );
    } catch {
      setError(
        "No se pudo conectar con el servicio de recuperación. Inténtalo nuevamente."
      );
    } finally {
      setRecuperando(false);
    }
  }

  return (
    <form
      onSubmit={iniciarSesion}
      autoComplete="off"
      className="space-y-5"
    >
      <div>
        <label
          htmlFor="correo"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Correo electrónico
        </label>

        <input
          id="correo"
          name="portal-correo"
          type="email"
          autoComplete="email"
          value={correo}
          onChange={(event) => setCorreo(event.target.value)}
          placeholder="usuario@ejemplo.com"
          required
          disabled={cargando || recuperando}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
        />
      </div>

      <div>
        <label
          htmlFor="contrasena"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Contraseña
        </label>

        <input
          id="contrasena"
          name="portal-contrasena"
          type="password"
          autoComplete="current-password"
          value={contrasena}
          onChange={(event) => setContrasena(event.target.value)}
          placeholder="Escribe tu contraseña"
          required
          disabled={cargando || recuperando}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
        />
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {mensaje && (
        <div
          role="status"
          className="rounded-lg bg-green-50 p-3 text-sm text-green-800"
        >
          {mensaje}
        </div>
      )}

      <button
        type="submit"
        disabled={cargando || recuperando}
        className="w-full rounded-lg bg-blue-700 px-4 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {cargando ? "Verificando acceso..." : "Iniciar sesión"}
      </button>

      <div className="text-center">
        <button
          type="button"
          onClick={recuperarContrasena}
          disabled={cargando || recuperando}
          className="text-sm font-medium text-blue-700 hover:text-blue-900 hover:underline disabled:opacity-60"
        >
          {recuperando
            ? "Solicitando recuperación..."
            : "¿Olvidaste tu contraseña?"}
        </button>
      </div>
    </form>
  );
}
