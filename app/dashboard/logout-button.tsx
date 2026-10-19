
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  async function cerrarSesion() {
    setCargando(true);
    setError("");

    try {
      const supabase = createClient();

      const { error: errorLogout } = await supabase.auth.signOut();

      if (errorLogout) {
        setError("No se pudo cerrar la sesión. Inténtalo nuevamente.");
        return;
      }

      router.replace("/login");
      router.refresh();
    } catch {
      setError("Ocurrió un problema al cerrar la sesión.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={cerrarSesion}
        disabled={cargando}
        className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {cargando ? "Cerrando sesión..." : "Cerrar sesión"}
      </button>

      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
