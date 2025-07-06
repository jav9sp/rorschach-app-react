import { useState } from "react";

import { buildMasterSummary } from "../utils/buildMasterSummary";
import { parseExcel } from "../utils/parseExcel";
import { obtenerTablaPorEstilo } from "../utils/normativeData/moduleCargarTablaNormativa";
import { compararConNormativa } from "../utils/normativeData/normativeComparison";

import FileUpload from "./FileUpload";
import StructuralSummary from "./StructuralSumary";
import ComparissonTable from "./ComparisonTable";

import type { Respuesta } from "../utils/buildMasterSummary";
import type { StructuralSummaryData } from "../types/StructuralSummaryData";
import type { Comparacion } from "../types/NormativeData";
import Resume from "./Resume";

export default function Landing() {
  const [summary, setSummary] = useState<StructuralSummaryData | null>(null);
  const [comparaciones, setComparaciones] = useState<Comparacion[] | null>(
    null
  );

  const handleFile = async (file: File) => {
    const data: Respuesta[] = await parseExcel(file);
    console.log(data);
    const summaryData = buildMasterSummary(data);
    setSummary(summaryData);

    const estilo = summaryData["Tipo Vivencial"] || "Indefinido";
    const edad = summaryData["Edad"] || 18;

    try {
      const tabla = await obtenerTablaPorEstilo(estilo, edad);
      const comparacion = compararConNormativa(summaryData, tabla);
      setComparaciones(comparacion);
    } catch (error) {
      console.error("Error al obtener tabla:", error);
      setComparaciones(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 pt-12">
      <div className="max-w-3xl w-full">
        <h1 className="text-4xl md:text-5xl font-bold mb-12 text-gray-700 text-center">
          Generador de Informes Rorschach - Sistema Exner
        </h1>

        {!summary && (
          <>
            <p className="text-lg md:text-xl text-gray-600 mb-8 text-center">
              Carga tus codificaciones en Excel, genera el sumario estructural y
              obtén un informe preliminar del test de Rorschach en segundos.
            </p>

            <a
              href="/plantilla.xlsx"
              download="ejemplo_protocolo_rorschach.xlsx"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition mx-auto block w-fit">
              Descargar plantilla de prueba
            </a>

            <FileUpload onFileSelected={handleFile} />

            <div className="mt-12 text-left">
              <h2 className="text-2xl font-semibold mb-4 text-gray-700">
                ¿Qué puedes hacer con esta herramienta?
              </h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Subir tu archivo de codificaciones (.xlsx)</li>
                <li>Calcular automáticamente el sumario estructural</li>
                <li>Obtener constelaciones interpretativas</li>
                <li>
                  Pronto - Visualizar indicadores clave del Sistema
                  Comprehensivo
                </li>
                <li>Pronto - Descargar un informe preliminar</li>
              </ul>
            </div>
          </>
        )}

        {summary && (
          <>
            <Resume summary={summary} />

            <StructuralSummary data={summary} />

            {comparaciones && (
              <ComparissonTable
                comparaciones={comparaciones}
                tipoVivencial={summary["Tipo Vivencial"]}
              />
            )}

            <button
              onClick={() => {
                setSummary(null);
                setComparaciones(null);
              }}
              className="px-6 py-3 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700 transition mx-auto block w-fit my-12">
              Calcular Otro
            </button>
          </>
        )}

        <section className="my-20">
          <h2 className="text-3xl font-semibold text-center text-gray-700">
            ¡Quiero colaborar!
          </h2>
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

        <footer className="mt-12 text-sm text-gray-500 text-center mb-6">
          <span>© {new Date().getFullYear()}</span>{" "}
          <a href="https://manchasdetinta.net" target="blank">
            manchasdetinta.net
          </a>
        </footer>
      </div>
    </div>
  );
}
