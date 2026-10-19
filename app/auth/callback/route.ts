
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next");

  const destination =
    next && next.startsWith("/") && !next.startsWith("//")
      ? next
      : "/dashboard";

  if (!code) {
    return NextResponse.redirect(
      new URL("/login?error=link_invalido", requestUrl.origin)
    );
  }

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
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    }
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error(
      "Error al procesar el enlace de autenticación:",
      error.message
    );

    return NextResponse.redirect(
      new URL("/login?error=enlace_expirado", requestUrl.origin)
    );
  }

  return NextResponse.redirect(new URL(destination, requestUrl.origin));
}
