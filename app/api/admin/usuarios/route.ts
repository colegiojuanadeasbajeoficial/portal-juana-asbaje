
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

type Rol = "direccion" | "docente" | "padre";

type Perfil = {
  id: string;
  full_name: string | null;
  role: Rol;
  created_at: string;
};

type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Perfil;
        Insert: {
          id: string;
          full_name?: string | null;
          role?: Rol;
          created_at?: string;
        };
        Update: {
          full_name?: string | null;
          role?: Rol;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options);
              });
            } catch {
              // Las cookies pueden ser de solo lectura.
            }
          },
        },
      }
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Debes iniciar sesión." },
        { status: 401 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const adminKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !adminKey) {
      console.error(
        "Falta la configuración administrativa de Supabase."
      );

      return NextResponse.json(
        { error: "Configuración del servidor incompleta." },
        { status: 500 }
      );
    }

    const admin = createClient<Database>(
      supabaseUrl,
      adminKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Solo Dirección puede crear cuentas.
    const { data: perfilDireccion, error: errorDireccion } =
      await admin
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

    if (errorDireccion) {
      console.error(
        "Error al verificar el rol:",
        errorDireccion.message
      );

      return NextResponse.json(
        { error: "No se pudo verificar el rol." },
        { status: 500 }
      );
    }

    if (perfilDireccion?.role !== "direccion") {
      return NextResponse.json(
        { error: "No tienes autorización para esta operación." },
        { status: 403 }
      );
    }

    let body: {
      full_name?: unknown;
      email?: unknown;
      role?: unknown;
    };

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Los datos enviados no son válidos." },
        { status: 400 }
      );
    }

    const fullName =
      typeof body.full_name === "string"
        ? body.full_name.trim()
        : "";

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const role = body.role;

    if (
      fullName.length < 2 ||
      fullName.length > 120 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      email.length > 254 ||
      (role !== "docente" && role !== "padre")
    ) {
      return NextResponse.json(
        {
          error:
            "Verifica el nombre, correo y tipo de usuario.",
        },
        { status: 400 }
      );
    }

    // Dirección crea la cuenta mediante invitación por correo.
    // El usuario seguirá el enlace para establecer su acceso.
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3000";

    const { data: invitacion, error: errorInvitacion } =
      await admin.auth.admin.inviteUserByEmail(email, {
        data: {
          full_name: fullName,
        },
        redirectTo: `${siteUrl}/auth/callback?next=/establecer-contrasena`,
      });

    if (errorInvitacion || !invitacion.user) {
      console.error(
        "Error al enviar la invitación:",
        errorInvitacion?.message
      );

      return NextResponse.json(
        {
          error:
            "No se pudo enviar la invitación. Comprueba si el correo ya tiene una cuenta y revisa la configuración de correo de Supabase.",
        },
        { status: 400 }
      );
    }

    const nuevoUsuarioId = invitacion.user.id;

    // El trigger de Supabase crea el perfil inicial.
    // Guardar el nombre y el rol seleccionados por Dirección.
    const { data: perfilActualizado, error: errorActualizacion } =
      await admin
        .from("profiles")
        .update({
          full_name: fullName,
          role: role as Rol,
        })
        .eq("id", nuevoUsuarioId)
        .select("id, full_name, role")
        .maybeSingle();

    if (errorActualizacion || !perfilActualizado) {
      console.error(
        "La invitación se creó, pero hubo un problema con el perfil:",
        errorActualizacion?.message ?? "Perfil no encontrado",
        "Usuario:",
        nuevoUsuarioId
      );

      return NextResponse.json(
        {
          error:
            "La invitación se generó, pero no se pudo confirmar el perfil. No vuelvas a registrar el mismo correo; revisa Supabase y la terminal del servidor.",
        },
        { status: 500 }
      );
    }

    if (perfilActualizado.role !== role) {
      console.error("El rol guardado no coincide.", {
        solicitado: role,
        guardado: perfilActualizado.role,
      });

      return NextResponse.json(
        {
          error:
            "La invitación se generó, pero el rol guardado no coincide. Revisa el perfil en Supabase.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message:
          "Invitación enviada. El usuario debe revisar su correo para configurar su acceso.",
        user: {
          id: invitacion.user.id,
          full_name: perfilActualizado.full_name,
          email,
          role: perfilActualizado.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Error interno en la API de usuarios:",
      error instanceof Error
        ? error.message
        : "Error desconocido"
    );

    return NextResponse.json(
      { error: "Ocurrió un error interno del servidor." },
      { status: 500 }
    );
  }
}
