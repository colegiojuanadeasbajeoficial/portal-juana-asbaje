
"use client";

import Image from "next/image";
import emailjs from "@emailjs/browser";
import { useState, type FormEvent } from "react";

const niveles = ["Preescolar", "Primaria"];

const oferta = [
  {
    numero: "01",
    nombre: "Preescolar",
    edad: "Aprender jugando",
    icono: "🧩",
    descripcion:
      "Experiencias que favorecen la curiosidad, la creatividad, la comunicación y el desarrollo integral.",
  },
  {
    numero: "02",
    nombre: "Primaria",
    edad: "Aprendizajes para la vida",
    icono: "📚",
    descripcion:
      "Fortalecemos los conocimientos, el pensamiento crítico, la autonomía y las competencias digitales.",
  },
];

const actividades = [
  { icono: "💻", nombre: "Informática", detalle: "Competencias digitales" },
  { icono: "🇬🇧", nombre: "Inglés", detalle: "Comunicación y vocabulario" },
  { icono: "🇫🇷", nombre: "Francés", detalle: "En Educación Primaria" },
  { icono: "🥋", nombre: "Tae Kwon Do", detalle: "Disciplina y coordinación" },
  { icono: "💃", nombre: "Danza Folclórica", detalle: "Tradición y expresión" },
  { icono: "🎨", nombre: "Pintura y Música", detalle: "Creatividad y talento" },
];

const beneficios = [
  "Acompañamiento cercano durante el aprendizaje",
  "Aulas climatizadas",
  "Formación en idiomas y tecnología",
  "Actividades artísticas y deportivas",
  "Ambiente inclusivo y respeto entre compañeros",
];

export default function Home() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState("");

  const [formulario, setFormulario] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    nivel: "",
    mensaje: "",
  });

  function actualizarCampo(
    campo: keyof typeof formulario,
    valor: string
  ) {
    setFormulario((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));

    setGuardado(false);
    setErrorEnvio("");
  }

  async function enviarSolicitud(
    evento: FormEvent<HTMLFormElement>
  ) {
    evento.preventDefault();

    if (enviando) return;

    setEnviando(true);
    setGuardado(false);
    setErrorEnvio("");

    try {
      await emailjs.send(
        "service_6dtrehg",
        "template_6ap3ug8",
        {
          nombre: formulario.nombre.trim(),
          correo: formulario.correo.trim(),
          telefono:
            formulario.telefono.trim() || "No proporcionado",
          nivel: formulario.nivel,
          mensaje:
            formulario.mensaje.trim() || "Sin mensaje adicional",
        },
        {
          publicKey: "ptppZl_X41n3f2jFC",
          limitRate: {
            id: "portal-juana-asbaje-contacto",
            throttle: 10000,
          },
        }
      );

      setGuardado(true);

      setFormulario({
        nombre: "",
        correo: "",
        telefono: "",
        nivel: "",
        mensaje: "",
      });
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);

      setErrorEnvio(
        "No fue posible enviar tu solicitud. Verifica la configuración de EmailJS e intenta nuevamente. También puedes comunicarte con el colegio por teléfono o WhatsApp."
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="min-h-screen bg-white text-slate-800">
      {/* ENCABEZADO */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <a href="#inicio" className="flex items-center gap-3">
            <Image
              src="/images/logo-juana-asbaje.png"
              alt="Logotipo oficial del Colegio Juana de Asbaje"
              width={160}
              height={100}
              priority
              className="h-14 w-auto object-contain"
            />

            <span>
              <strong className="block text-sm font-extrabold text-blue-950 sm:text-base">
                Colegio Juana de Asbaje
              </strong>

              <span className="text-xs text-slate-500">
                Aprender · Crecer · Compartir
              </span>
            </span>
          </a>

          <button
            type="button"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:hidden"
            onClick={() => setMenuAbierto(!menuAbierto)}
            aria-expanded={menuAbierto}
            aria-label="Abrir o cerrar menú"
          >
            {menuAbierto ? "Cerrar ✕" : "Menú ☰"}
          </button>

          <nav className="hidden items-center gap-6 text-sm font-semibold md:flex">
            <a className="hover:text-teal-700" href="#nosotros">
              Nosotros
            </a>

            <a className="hover:text-teal-700" href="#oferta">
              Oferta educativa
            </a>

            <a className="hover:text-teal-700" href="#actividades">
              Actividades
            </a>

            <a className="hover:text-teal-700" href="#avisos">
              Avisos
            </a>

            <a
              className="rounded-xl bg-blue-950 px-4 py-3 text-white hover:bg-teal-700"
              href="#contacto"
            >
              Solicitar informes
            </a>

            <a
              className="rounded-xl border border-blue-950 px-4 py-3 text-blue-950 hover:bg-blue-950 hover:text-white"
              href="/login"
            >
              Acceso al portal
            </a>
          </nav>
        </div>

        {menuAbierto && (
          <nav className="grid gap-1 border-t border-slate-200 px-5 py-3 md:hidden">
            {[
              ["Nosotros", "#nosotros"],
              ["Oferta educativa", "#oferta"],
              ["Actividades", "#actividades"],
              ["Avisos", "#avisos"],
              ["Contacto", "#contacto"],
              ["Acceso al portal", "/login"],
            ].map(([texto, enlace]) => (
              <a
                key={enlace}
                href={enlace}
                onClick={() => setMenuAbierto(false)}
                className="rounded-lg px-3 py-3 font-semibold hover:bg-slate-100"
              >
                {texto}
              </a>
            ))}
          </nav>
        )}
      </header>

      {/* PORTADA */}
      <section
        id="inicio"
        className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-teal-800 text-white"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-20 md:grid-cols-2 md:py-28">
          <div>
            <span className="inline-block rounded-full border border-white/30 px-4 py-2 text-xs font-bold uppercase tracking-widest text-teal-100">
              Preescolar · Primaria
            </span>

            <h1 className="mt-6 max-w-2xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              Educamos con valores, construimos futuros.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-blue-100 sm:text-lg">
              Una comunidad educativa que impulsa el aprendizaje, la
              creatividad, la tecnología y el desarrollo integral de cada
              estudiante.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#oferta"
                className="rounded-xl bg-amber-400 px-6 py-4 font-extrabold text-blue-950 transition hover:bg-amber-300"
              >
                Conoce nuestro colegio
              </a>

              <a
                href="#contacto"
                className="rounded-xl border border-white/40 px-6 py-4 font-bold text-white hover:bg-white/10"
              >
                Solicitar informes
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute inset-5 rounded-full bg-teal-300/20 blur-3xl" />

            <div className="relative rounded-[2rem] border border-white/20 bg-white/10 p-8 text-center shadow-2xl backdrop-blur">
              <div className="mx-auto flex justify-center">
                <Image
                  src="/images/juanito.png"
                  alt="Juanito, el búho escolar del Colegio Juana de Asbaje"
                  width={320}
                  height={320}
                  priority
                  className="h-auto max-h-72 w-full max-w-xs object-contain"
                />
              </div>

              <h2 className="mt-4 text-2xl font-black">
                ¡Bienvenidos!
              </h2>

              <p className="mt-3 leading-7 text-blue-100">
                Un espacio para descubrir talentos, desarrollar habilidades
                y aprender juntos.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3 text-center text-xs font-bold">
                <div className="rounded-xl bg-white/10 p-3">
                  🧩
                  <br />
                  Preescolar
                </div>

                <div className="rounded-xl bg-white/10 p-3">
                  📚
                  <br />
                  Primaria
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRESENTACIÓN */}
      <section id="nosotros" className="scroll-mt-24 px-5 py-20">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2 md:items-center">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-teal-700">
              Conoce nuestra comunidad
            </span>

            <h2 className="mt-3 text-3xl font-black text-blue-950 sm:text-4xl">
              Aprendizaje que va más allá del aula
            </h2>

            <p className="mt-5 leading-8 text-slate-600">
              En el Colegio Juana de Asbaje buscamos que cada estudiante
              desarrolle sus conocimientos, habilidades y valores en un
              ambiente de respeto, colaboración y confianza.
            </p>

            <p className="mt-4 leading-8 text-slate-600">
              Nuestra propuesta combina formación académica, idiomas,
              tecnología y actividades complementarias para acompañar
              diferentes formas de aprender y expresarse.
            </p>

            <a
              href="#contacto"
              className="mt-6 inline-flex rounded-xl bg-teal-700 px-5 py-3 font-bold text-white hover:bg-teal-800"
            >
              Conoce nuestra propuesta →
            </a>
          </div>

          <div className="rounded-3xl bg-slate-50 p-7 sm:p-9">
            <h3 className="text-xl font-extrabold text-blue-950">
              Lo que nos distingue
            </h3>

            <ul className="mt-6 space-y-4">
              {beneficios.map((beneficio) => (
                <li key={beneficio} className="flex gap-3 leading-6">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-teal-100 font-black text-teal-800">
                    ✓
                  </span>

                  <span>{beneficio}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* OFERTA EDUCATIVA */}
      <section id="oferta" className="scroll-mt-24 bg-slate-50 px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-extrabold uppercase tracking-widest text-teal-700">
              Nuestra oferta educativa
            </span>

            <h2 className="mt-3 text-3xl font-black text-blue-950 sm:text-4xl">
              Cada etapa importa
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              Acompañamos el crecimiento y los aprendizajes de niñas y niños
              en distintas etapas de su formación.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {oferta.map((nivel) => (
              <article
                key={nivel.numero}
                className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-amber-100 text-3xl">
                    {nivel.icono}
                  </span>

                  <span className="text-3xl font-black text-slate-200">
                    {nivel.numero}
                  </span>
                </div>

                <p className="mt-6 text-xs font-bold uppercase tracking-wider text-teal-700">
                  {nivel.edad}
                </p>

                <h3 className="mt-2 text-xl font-extrabold text-blue-950">
                  {nivel.nombre}
                </h3>

                <p className="mt-4 leading-7 text-slate-600">
                  {nivel.descripcion}
                </p>

                <a
                  href="#contacto"
                  className="mt-6 inline-block font-bold text-teal-700 hover:text-blue-950"
                >
                  Solicitar información →
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ACTIVIDADES */}
      <section id="actividades" className="scroll-mt-24 px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <span className="text-xs font-extrabold uppercase tracking-widest text-teal-700">
              Formación integral
            </span>

            <h2 className="mt-3 text-3xl font-black text-blue-950 sm:text-4xl">
              Talentos que merecen crecer
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              Actividades complementarias para descubrir intereses,
              fortalecer habilidades y enriquecer la experiencia escolar.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {actividades.map((actividad) => (
              <article
                key={actividad.nombre}
                className="flex items-center gap-4 rounded-2xl border border-slate-200 p-5 transition hover:border-teal-500 hover:bg-teal-50/50"
              >
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-slate-100 text-3xl">
                  {actividad.icono}
                </span>

                <div>
                  <h3 className="font-extrabold text-blue-950">
                    {actividad.nombre}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {actividad.detalle}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* AVISOS */}
      <section
        id="avisos"
        className="scroll-mt-24 bg-blue-950 px-5 py-16 text-white"
      >
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-teal-200">
              Comunicación escolar
            </span>

            <h2 className="mt-3 text-3xl font-black">
              Avisos y fechas importantes
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-blue-100">
              Consulta aquí los próximos comunicados, actividades y fechas
              relevantes de nuestra comunidad escolar.
            </p>

            <p className="mt-3 text-sm text-blue-200">
              Próximamente: calendario escolar actualizado por la Dirección.
            </p>
          </div>

          <a
            href="#contacto"
            className="inline-flex justify-center rounded-xl bg-amber-400 px-6 py-4 font-extrabold text-blue-950 hover:bg-amber-300"
          >
            Consultar con el colegio →
          </a>
        </div>
      </section>

      {/* CONTACTO Y FORMULARIO */}
      <section id="contacto" className="scroll-mt-24 bg-slate-50 px-5 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-teal-700">
              Estamos para atenderte
            </span>

            <h2 className="mt-3 text-3xl font-black text-blue-950 sm:text-4xl">
              Solicita información
            </h2>

            <p className="mt-5 leading-8 text-slate-600">
              Déjanos tus datos de contacto y señala el nivel educativo
              de tu interés. Enviaremos tu solicitud a la Dirección del
              Colegio Juana de Asbaje para que pueda atenderte.
            </p>

            <div className="mt-8 space-y-5">
              <div className="flex gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-teal-100 text-xl">
                  📍
                </span>

                <div>
                  <h3 className="font-extrabold text-blue-950">
                    Dirección
                  </h3>

                  <p className="mt-1 text-slate-600">
                    Galeana #35, Col. Centro, Tuxpan, Veracruz.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-teal-100 text-xl">
                  🕒
                </span>

                <div>
                  <h3 className="font-extrabold text-blue-950">
                    Horario de atención
                  </h3>

                  <p className="mt-1 text-slate-600">
                    De 7:00 a 15:00 h. Confirma con el colegio la atención
                    administrativa vigente.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-teal-100 text-xl">
                  ☎️
                </span>

                <div>
                  <h3 className="font-extrabold text-blue-950">
                    Teléfono de oficina
                  </h3>

                  <a
                    href="tel:+527838342140"
                    className="mt-1 inline-block font-semibold text-teal-700 hover:text-blue-950 hover:underline"
                  >
                    783 834 2140
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-green-100 text-xl">
                  💬
                </span>

                <div>
                  <h3 className="font-extrabold text-blue-950">
                    WhatsApp
                  </h3>

                  <a
                    href="https://wa.me/527831466939"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block font-semibold text-green-700 hover:text-green-900 hover:underline"
                  >
                    783 146 6939 · Enviar mensaje
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h3 className="text-xl font-extrabold text-blue-950">
              Formulario de contacto
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Completa los campos marcados como obligatorios.
            </p>

            <form onSubmit={enviarSolicitud} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="nombre"
                  className="mb-2 block text-sm font-bold"
                >
                  Nombre del padre, madre o tutor *
                </label>

                <input
                  id="nombre"
                  name="nombre"
                  required
                  maxLength={100}
                  value={formulario.nombre}
                  onChange={(e) =>
                    actualizarCampo("nombre", e.target.value)
                  }
                  placeholder="Escribe tu nombre"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="correo"
                    className="mb-2 block text-sm font-bold"
                  >
                    Correo electrónico *
                  </label>

                  <input
                    id="correo"
                    name="correo"
                    type="email"
                    required
                    maxLength={150}
                    value={formulario.correo}
                    onChange={(e) =>
                      actualizarCampo("correo", e.target.value)
                    }
                    placeholder="correo@ejemplo.com"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="telefono"
                    className="mb-2 block text-sm font-bold"
                  >
                    Teléfono
                  </label>

                  <input
                    id="telefono"
                    name="telefono"
                    type="tel"
                    maxLength={20}
                    value={formulario.telefono}
                    onChange={(e) =>
                      actualizarCampo("telefono", e.target.value)
                    }
                    placeholder="Número de contacto"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="nivel"
                  className="mb-2 block text-sm font-bold"
                >
                  Nivel educativo de interés *
                </label>

                <select
                  id="nivel"
                  name="nivel"
                  required
                  value={formulario.nivel}
                  onChange={(e) =>
                    actualizarCampo("nivel", e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                >
                  <option value="">Selecciona un nivel</option>

                  {niveles.map((nivel) => (
                    <option key={nivel} value={nivel}>
                      {nivel}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="mensaje"
                  className="mb-2 block text-sm font-bold"
                >
                  ¿Qué información necesitas?
                </label>

                <textarea
                  id="mensaje"
                  name="mensaje"
                  rows={4}
                  maxLength={1000}
                  value={formulario.mensaje}
                  onChange={(e) =>
                    actualizarCampo("mensaje", e.target.value)
                  }
                  placeholder="Escribe aquí tus dudas o comentarios..."
                  className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                />
              </div>

              <p className="text-xs leading-5 text-slate-500">
                Tus datos se utilizarán para atender tu solicitud de
                informes educativos. Al enviar el formulario, se enviará
                un correo a la Dirección del colegio.
              </p>

              <button
                type="submit"
                disabled={enviando}
                className="w-full rounded-xl bg-teal-700 px-5 py-4 font-extrabold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {enviando
                  ? "Enviando solicitud..."
                  : "Enviar solicitud de informes"}
              </button>

              {guardado && (
                <div
                  role="status"
                  className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-800"
                >
                  ¡Tu solicitud se envió correctamente! La Dirección
                  del colegio podrá recibir tu mensaje por correo
                  electrónico.
                </div>
              )}

              {errorEnvio && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800"
                >
                  {errorEnvio}
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* PIE DE PÁGINA */}
      <footer className="bg-slate-950 px-5 py-10 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/images/juanito.png"
              alt="Juanito, mascota escolar"
              width={64}
              height={64}
              className="h-12 w-12 object-contain"
            />

            <div>
              <strong className="block">
                Colegio Juana de Asbaje
              </strong>

              <span className="mt-1 block text-sm text-slate-400">
                Aprender · Crecer · Compartir
              </span>
            </div>
          </div>

          <div className="text-sm leading-7 text-slate-400 sm:text-right">
            <p>Galeana #35, Col. Centro, Tuxpan, Veracruz.</p>

            <p>
              Oficina:{" "}
              <a
                href="tel:+527838342140"
                className="hover:text-white hover:underline"
              >
                783 834 2140
              </a>
            </p>

            <p>
              WhatsApp:{" "}
              <a
                href="https://wa.me/527831466939"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white hover:underline"
              >
                783 146 6939
              </a>
            </p>

            <p>© 2026 Colegio Juana de Asbaje.</p>
            <p>Portal institucional en desarrollo.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
