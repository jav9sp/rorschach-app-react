import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-12">
      <div className="max-w-3xl w-full">
        <h1 className="text-4xl md:text-5xl font-bold mb-12">
          App Manchas de Tinta
        </h1>

        <p className="text-lg md:text-xl text-gray-600 mb-8 text-center">
          Carga tus codificaciones en Excel, genera el sumario estructural y
          obtén la tabla de estadísticos descriptivos según Tipo Vivencial.
        </p>

        <div className="mt-12 text-left">
          <h2 className="text-2xl font-semibold mb-4">
            ¿Qué puedes hacer con esta herramienta?
          </h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Subir tu archivo de codificaciones (.xlsx)</li>
            <li>Calcular automáticamente el sumario estructural</li>
            <li>Obtener constelaciones interpretativas</li>
            <li>
              <span className="border border-gray-400 rounded text-white font-medium px-2 bg-gradient-to-tr from-amber-500 to-cyan-500 ">
                Pronto
              </span>{" "}
              - Visualizar indicadores clave del Sistema Comprehensivo
            </li>
            <li>
              <span className="border border-gray-400 rounded text-white font-medium px-2 bg-gradient-to-tr from-amber-500 to-cyan-500">
                Pronto
              </span>{" "}
              - Descargar un informe preliminar
            </li>
          </ul>

          <Link
            to="/calcular"
            className="px-6 py-3 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700 transition mx-auto block w-fit my-10">
            Probar la App
          </Link>
        </div>

        <section className="my-20">
          <h2 className="text-3xl font-semibold">¡Quiero colaborar!</h2>
          <p className="text-lg text-gray-600 my-6">
            Tus observaciones y sugerencias serán de mucha ayuda para poder
            continuar desarrollando esta aplicación.
          </p>
          <p className="text-lg text-gray-600 my-6">
            Puedes ayudarme respondiendo el cuestionario a continuación, así
            podré incorporar nuevas funcionalidades más adelante.
          </p>
          <a
            href="https://forms.gle/GAzi5XmUg5EdhJVW7"
            target="blank"
            className="px-6 py-3 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700 transition mx-auto block w-fit">
            Responder Formulario
          </a>
        </section>
      </div>
    </div>
  );
}
